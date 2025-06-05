import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, Send, Loader2 } from "lucide-react";

interface AIChatProps {
  userId: number;
}

export function AIChat({ userId }: AIChatProps) {
  const [message, setMessage] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions } = useQuery({
    queryKey: [`/api/chat/sessions/${userId}`],
  });

  const currentSession = sessions?.[0];

  const mutation = useMutation({
    mutationFn: async (data: { message: string; sessionId?: number }) => {
      const response = await apiRequest("POST", "/api/chat", {
        userId,
        message: data.message,
        sessionId: data.sessionId || currentSessionId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentSessionId(data.session.id);
      queryClient.invalidateQueries({ queryKey: [`/api/chat/sessions/${userId}`] });
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Chat Error",
        description: "Failed to send message. " + (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    mutation.mutate({
      message: message.trim(),
      sessionId: currentSessionId,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const messages = currentSession?.messages || [];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-light text-red-primary";
      case "medium": return "bg-coral text-white";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="shadow-sm border-gray-100 h-96 flex flex-col">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-primary rounded-full flex items-center justify-center">
            <Users className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <CardTitle className="font-semibold text-gray-900">Chat with Flo</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-gray-500">Online</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {/* Messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-blue-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="text-blue-primary" size={24} />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Welcome to Red2Blue Coaching</h3>
                <p className="text-sm text-gray-600">
                  Hi! I'm Flo, your AI mental performance coach. How can I help you shift from Red Head to Blue Head today?
                </p>
              </div>
            ) : (
              messages.map((msg: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    msg.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 bg-blue-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">T</span>
                    </div>
                  )}
                  
                  <div
                    className={`rounded-2xl p-4 max-w-xs ${
                      msg.role === "user"
                        ? "bg-gray-100 rounded-tr-md"
                        : "bg-blue-light rounded-tl-md"
                    }`}
                  >
                    <p className="text-sm text-gray-700">{msg.content}</p>
                    
                    {/* Show coaching metadata */}
                    {msg.metadata && (
                      <div className="mt-3 space-y-2">
                        {msg.metadata.urgencyLevel && msg.metadata.urgencyLevel !== "low" && (
                          <Badge className={getUrgencyColor(msg.metadata.urgencyLevel)}>
                            {msg.metadata.urgencyLevel} priority
                          </Badge>
                        )}
                        
                        {msg.metadata.blueHeadTechniques && msg.metadata.blueHeadTechniques.length > 0 && (
                          <div className="text-xs text-blue-primary">
                            💡 Suggested: {msg.metadata.blueHeadTechniques.join(", ")}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <span className="text-xs text-gray-500 mt-2 block">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">Y</span>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {/* Loading indicator */}
            {mutation.isPending && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <div className="bg-blue-light rounded-2xl rounded-tl-md p-4 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm text-gray-600">Thommo is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex space-x-3">
          <Input
            placeholder="Ask Flo anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={mutation.isPending}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || mutation.isPending}
            className="bg-blue-primary hover:bg-blue-deep"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
