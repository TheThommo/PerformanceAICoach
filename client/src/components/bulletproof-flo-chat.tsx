import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, X, Minimize2, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface BulletproofFloChatProps {
  isInlineWidget?: boolean;
  className?: string;
}

export function BulletproofFloChat({ isInlineWidget = false, className = "" }: BulletproofFloChatProps) {
  // Separate state management to prevent conflicts
  const [messages, setMessages] = useState<Message[]>(() => [{
    id: 'welcome-msg',
    role: 'assistant',
    content: "Hi! I'm Flo, your Red2Blue mental performance coach. Ask me about handling pressure, improving focus, or any mental game challenge you're facing.",
    timestamp: Date.now()
  }]);
  
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(isInlineWidget);
  const [isProcessing, setIsProcessing] = useState(false);
  const [creditCount, setCreditCount] = useState(0);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Refs for DOM manipulation
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);
  const currentRequestRef = useRef<AbortController | null>(null);
  const messageIdCounterRef = useRef(0);

  // Scroll management with proper debouncing
  const scrollToLatest = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      // Use requestAnimationFrame for smooth scrolling
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, []);

  // Auto-scroll on new messages with proper timing
  useEffect(() => {
    if (messages.length > 1) { // Skip initial message
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(scrollToLatest, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, scrollToLatest]);

  // Input focus management
  useEffect(() => {
    if (isExpanded && inputElementRef.current && !isProcessing) {
      const timeoutId = setTimeout(() => {
        inputElementRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isExpanded, isProcessing]);

  // Clear connection errors when user starts typing
  useEffect(() => {
    if (connectionError && inputValue.length > 0) {
      setConnectionError(null);
    }
  }, [inputValue, connectionError]);

  // Safe message addition
  const addNewMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const messageId = `${role}-${Date.now()}-${++messageIdCounterRef.current}`;
    const newMessage: Message = {
      id: messageId,
      role,
      content,
      timestamp: Date.now()
    };
    
    setMessages(currentMessages => [...currentMessages, newMessage]);
    return messageId;
  }, []);

  // Optimized send handler with proper error recovery
  const sendMessage = useCallback(async () => {
    const messageText = inputValue.trim();
    
    // Validation checks
    if (!messageText || isProcessing) return;
    
    if (creditCount >= 5) {
      addNewMessage(
        "You've used your 5 free credits! Sign up to keep using Flo and unlock personalized coaching, assessments, and unlimited conversations.",
        'assistant'
      );
      return;
    }

    // Clear input immediately to prevent duplicate sends
    setInputValue("");
    setConnectionError(null);
    setIsProcessing(true);
    setCreditCount(prev => prev + 1);

    // Add user message immediately
    addNewMessage(messageText, 'user');

    // Cancel any existing request
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }

    // Create new request controller
    const requestController = new AbortController();
    currentRequestRef.current = requestController;

    try {
      const response = await fetch('/api/landing-chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
        signal: requestController.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      
      // Add assistant response
      addNewMessage(
        responseData.message || "I'm here to help with your mental game. What specific challenge are you facing?",
        'assistant'
      );

    } catch (error: any) {
      // Handle different error types
      if (error.name === 'AbortError') {
        console.log('Request cancelled by user');
        return;
      }
      
      console.error('Chat request failed:', error);
      setConnectionError('Unable to connect. Please try again.');
      
      // Provide fallback response
      addNewMessage(
        "I'm having trouble connecting right now. Please try your question again in a moment.",
        'assistant'
      );
    } finally {
      setIsProcessing(false);
      currentRequestRef.current = null;
    }
  }, [inputValue, isProcessing, creditCount, addNewMessage]);

  // Cancel current request
  const cancelCurrentRequest = useCallback(() => {
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
      setIsProcessing(false);
    }
  }, []);

  // Form submission handler
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  }, [sendMessage]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    if (e.key === 'Escape' && isProcessing) {
      e.preventDefault();
      cancelCurrentRequest();
    }
  }, [sendMessage, isProcessing, cancelCurrentRequest]);

  // Input change handler with proper state management
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // Suggestion prompt handler
  const handleSuggestionClick = useCallback((prompt: string) => {
    if (isProcessing || creditCount >= 5) return;
    setInputValue(prompt);
    // Focus input after setting value
    setTimeout(() => {
      inputElementRef.current?.focus();
    }, 10);
  }, [isProcessing, creditCount]);

  // Optimized message rendering
  const MessageItem = ({ message }: { message: Message }) => (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] p-3 rounded-lg ${
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-800 border border-gray-200'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );

  // Loading indicator
  const LoadingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="max-w-[85%] p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-200">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-sm">Flo is thinking...</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={cancelCurrentRequest}
            className="ml-2 p-1 h-6 text-xs hover:bg-gray-200"
            disabled={!isProcessing}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  // Main chat content
  const chatContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Connection error display */}
      {connectionError && (
        <div className="p-3 bg-red-50 border-b border-red-200 text-red-700 text-sm flex items-center justify-between">
          <span>{connectionError}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConnectionError(null)}
            className="p-1 h-6 text-red-600 hover:bg-red-100"
          >
            <X size={12} />
          </Button>
        </div>
      )}
      
      {/* Messages container with proper scrolling */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4"
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="space-y-2">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          {isProcessing && <LoadingIndicator />}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t p-4 bg-gray-50">
        {/* Credit warning */}
        {creditCount >= 4 && creditCount < 5 && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            {5 - creditCount} credit{5 - creditCount !== 1 ? 's' : ''} remaining
          </div>
        )}
        
        {/* Suggestion prompts - only show initially */}
        {messages.length === 1 && !isProcessing && (
          <div className="mb-3 space-y-2">
            <p className="text-xs text-gray-500 text-center">Try asking about:</p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleSuggestionClick("I get nervous before competing. My heart races and I overthink everything. How can I stay calm?")}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200 transition-colors disabled:opacity-50"
                disabled={creditCount >= 5 || isProcessing}
              >
                Pre-competition nerves
              </button>
              <button 
                onClick={() => handleSuggestionClick("I keep making mistakes under pressure. I get tense and second-guess myself. What can I do?")}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200 transition-colors disabled:opacity-50"
                disabled={creditCount >= 5 || isProcessing}
              >
                Pressure mistakes
              </button>
              <button 
                onClick={() => handleSuggestionClick("When the stakes are high, I start thinking about the outcome instead of the process. How do I stay present?")}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200 transition-colors disabled:opacity-50"
                disabled={creditCount >= 5 || isProcessing}
              >
                High-stakes focus
              </button>
            </div>
          </div>
        )}
        
        {/* Input form */}
        <form onSubmit={handleFormSubmit} className="flex space-x-2">
          <input
            ref={inputElementRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              creditCount >= 5 
                ? "Sign up to continue..."
                : isProcessing 
                ? "Flo is thinking... (Press Escape to cancel)"
                : "Ask about mental game challenges..."
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={creditCount >= 5 || isProcessing}
            autoComplete="off"
            maxLength={500}
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || creditCount >= 5 || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );

  // Inline widget version
  if (isInlineWidget) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm h-[500px] ${className}`}>
        {chatContent}
      </div>
    );
  }

  // Floating chat widget
  return (
    <>
      {/* Floating Chat Toggle Button */}
      {!isExpanded && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsExpanded(true)}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all hover:scale-105"
            aria-label="Open chat with Flo"
          >
            <MessageCircle size={24} />
          </Button>
        </div>
      )}

      {/* Floating Chat Window */}
      {isExpanded && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <span className="font-medium">Chat with Flo</span>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-white hover:bg-blue-700 p-1 h-8 w-8"
                aria-label="Minimize chat"
              >
                <Minimize2 size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-white hover:bg-blue-700 p-1 h-8 w-8"
                aria-label="Close chat"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
          
          {/* Chat Content */}
          <div className="h-[calc(100%-3rem)]">
            {chatContent}
          </div>
        </div>
      )}
    </>
  );
}

export default BulletproofFloChat;