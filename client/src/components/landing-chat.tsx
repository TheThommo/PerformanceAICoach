import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, MessageCircle, Crown, Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatResponse {
  message: string;
  suggestions: string[];
  urgencyLevel: string;
}

export function LandingChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Thommo, your Red2Blue mental performance coach. Ask me about handling pressure, improving focus, or any mental game challenge you're facing on the course.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [freeMessageUsed, setFreeMessageUsed] = useState(false);

  // Check authentication status only when chat is opened
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    enabled: isExpanded, // Only query when chat is opened
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isAuthenticated = !!user;
  const isSubscribed = user?.isSubscribed;
  const subscriptionTier = user?.subscriptionTier;

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!isAuthenticated) {
        throw new Error("Please sign in to chat with Thommo");
      }

      const response = await apiRequest("POST", "/api/chat", {
        message,
        userId: user.id,
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response.message,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setFreeMessageUsed(true);
    },
    onError: (error) => {
      if (error.message.includes("sign in")) {
        const errorMessage: Message = {
          role: 'assistant',
          content: "Please sign in to start chatting with me. I'm here to help with your mental game!",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: "I'm temporarily unavailable. Try asking about box breathing, pre-shot routines, or managing first-tee nerves.",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  });

  const handleSend = () => {
    if (!input.trim()) return;

    // Check if user needs to sign in
    if (!isAuthenticated) {
      const userMessage: Message = {
        role: 'user',
        content: input,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);
      
      const signInMessage: Message = {
        role: 'assistant',
        content: "Please sign in to chat with me. I'm here to help with your mental game!",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, signInMessage]);
      setInput("");
      return;
    }

    // Check free tier limitations (1 message/response for non-subscribers)
    if (!isSubscribed && freeMessageUsed) {
      const userMessage: Message = {
        role: 'user',
        content: input,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);
      
      const upgradeMessage: Message = {
        role: 'assistant',
        content: "You've used your free chat message! Upgrade to Premium ($690) or Ultimate ($1590) for unlimited AI coaching sessions.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, upgradeMessage]);
      setInput("");
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          data-chat-button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 shadow-lg"
        >
          <MessageCircle size={24} />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] z-50 shadow-2xl border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain size={20} />
            <div>
              <CardTitle className="text-lg">Thommo AI Coach</CardTitle>
              <p className="text-xs opacity-90">Red2Blue Mental Performance</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="text-white hover:bg-white/20"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 border'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg border">
                  <p className="text-sm">Thommo is thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          {/* Show upgrade prompt if free tier limit reached */}
          {!isAuthenticated && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">Sign in to chat with Thommo</p>
              <div className="flex space-x-2">
                <Link href="/signin">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" variant="outline">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
          {isAuthenticated && !isSubscribed && freeMessageUsed && (
            <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-red-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-800 mb-2">Upgrade for unlimited AI coaching</p>
              <div className="flex space-x-2">
                <Link href="/premium">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Premium $490
                  </Button>
                </Link>
                <Link href="/ultimate">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white">
                    <Crown size={14} className="mr-1" />
                    Ultimate $2190
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                !isAuthenticated 
                  ? "Sign in to chat..." 
                  : (!isSubscribed && freeMessageUsed)
                    ? "Upgrade to continue chatting..."
                    : "Ask about mental game challenges..."
              }
              className="flex-1"
              disabled={chatMutation.isPending || (!isAuthenticated) || (!isSubscribed && freeMessageUsed)}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending || (!isAuthenticated) || (!isSubscribed && freeMessageUsed)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send size={16} />
            </Button>
          </div>
          
          {isAuthenticated && isSubscribed && (
            <p className="text-xs text-gray-500 mt-2">
              Try: "I get nervous on the first tee" or "How do I handle pressure?"
            </p>
          )}
          
          {!isAuthenticated && (
            <p className="text-xs text-gray-500 mt-2">
              Sign in for personalized Red2Blue coaching
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}