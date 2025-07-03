import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, MessageCircle, Crown, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface LandingChatProps {
  isInlineWidget?: boolean;
}

export function LandingChat({ isInlineWidget = false }: LandingChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Flo, your Red2Blue mental performance coach. Ask me about handling pressure, improving focus, or any mental game challenge you're facing on the course.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(isInlineWidget);
  const [freeMessagesCount, setFreeMessagesCount] = useState(0);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    // Check if user has reached free message limit
    if (freeMessagesCount >= 5) {
      const userMessage: Message = {
        role: 'user',
        content: input,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);
      
      const limitMessage: Message = {
        role: 'assistant',
        content: "You've used your 5 free credits! Sign up to keep using Flo and unlock personalized coaching, assessments, and unlimited conversations.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, limitMessage]);
      setInput("");
      setShowSignUpPrompt(true);
      return;
    }

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Generate simple demo response
    const responses = [
      "Thanks for trying me out! I help golfers manage pressure and improve focus. Try box breathing: breathe in for 4, hold for 4, out for 4, hold for 4. This calms your nervous system instantly.",
      "Great question! Focus on your pre-shot routine. Pick 3 specific steps and do them the same way every time. This gives your mind something productive to focus on instead of worry.",
      "I understand that frustration. Try the 'next shot' technique: acknowledge the mistake, take a deep breath, and immediately focus on what you want for the next shot. Don't carry the past into your future.",
      "Pressure moments are opportunities! Use the 'blue head' mindset: see the target clearly, trust your preparation, and commit fully to your shot. You've practiced for this moment.",
      "Mental toughness is built through small wins. Set tiny, achievable goals each round and celebrate them. This builds confidence and momentum for bigger challenges."
    ];
    
    const assistantMessage: Message = {
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString()
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, assistantMessage]);
      setFreeMessagesCount(prev => prev + 1);
    }, 1000);
    
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isExpanded && !isInlineWidget) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white shadow-lg rounded-full w-16 h-16"
        >
          <MessageCircle size={24} />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={isInlineWidget ? "" : "fixed bottom-6 right-6 z-50"}>
        <Card className={isInlineWidget ? "w-full h-[500px] shadow-lg border-2 border-gray-200" : "w-96 h-[500px] shadow-2xl border-2 border-blue-200"}>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-red-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Brain size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg">Flo AI Coach</CardTitle>
                  <p className="text-sm text-blue-100">Try me out!</p>
                </div>
              </div>
              {!isInlineWidget && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:bg-white/20"
                >
                  ×
                </Button>
              )}
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
              </div>
            </ScrollArea>
            
            <div className="border-t p-4">
              {freeMessagesCount >= 4 && (
                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  {5 - freeMessagesCount} credit{5 - freeMessagesCount !== 1 ? 's' : ''} remaining
                </div>
              )}
              
              {/* Example prompts - only show for fresh conversations */}
              {messages.length === 1 && (
                <div className="mb-3 space-y-2">
                  <p className="text-xs text-gray-500 text-center">Try asking about:</p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setInput("I get nervous on the first tee. My heart races and I overthink every aspect of my swing. How can I stay calm?")}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200 transition-colors"
                      disabled={freeMessagesCount >= 5}
                    >
                      First tee nerves
                    </button>
                    <button 
                      onClick={() => setInput("I missed a short putt and got frustrated")}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200 transition-colors"
                      disabled={freeMessagesCount >= 5}
                    >
                      Missed putts
                    </button>
                    <button 
                      onClick={() => setInput("How do I handle pressure?")}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200 transition-colors"
                      disabled={freeMessagesCount >= 5}
                    >
                      Pressure situations
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    freeMessagesCount >= 5 
                      ? "Sign up to continue..."
                      : "Ask about mental game challenges..."
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={freeMessagesCount >= 5}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || freeMessagesCount >= 5}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send size={16} />
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                {freeMessagesCount}/5 credits used
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSignUpPrompt} onOpenChange={setShowSignUpPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign up to continue with Flo!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>You've experienced Flo's coaching! Sign up to unlock:</p>
            <ul className="space-y-2 text-sm">
              <li>• Unlimited AI coaching conversations</li>
              <li>• Personalized mental performance assessments</li>
              <li>• Progress tracking and analytics</li>
              <li>• Complete Red2Blue technique library</li>
            </ul>
            <div className="flex space-x-3">
              <Button 
                onClick={() => window.location.href = '/signup'} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Sign Up Free
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSignUpPrompt(false)}
                className="flex-1"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}