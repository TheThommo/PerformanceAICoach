import { useState } from "react";
import { MessageCircle, X, Minimize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIChat } from "@/components/ai-chat";
import { useAuth } from "@/hooks/useAuth";

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            data-chat-button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="text-white" size={24} />
          </Button>
          
          {/* Notification Badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-blue-600 opacity-30 animate-ping"></div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
          <Card className="w-full h-full shadow-2xl border-blue-200 bg-white">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-white">
                      Thommo - AI Coach
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-white/80">Online</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    <Minimize2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    <X size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {!isMinimized && (
              <CardContent className="p-0 h-[430px] flex flex-col">
                {/* Welcome Message */}
                <div className="p-4 bg-blue-50 border-b border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="text-white" size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-blue-800 leading-relaxed">
                        <strong>Thommo:</strong> Ready to transform pressure into peak performance? 
                        Ask me about mental techniques, pressure situations, or any golf psychology challenges!
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Chat Interface */}
                <div className="flex-1 overflow-hidden">
                  <AIChat userId={user.id} />
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  );
}