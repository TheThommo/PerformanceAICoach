import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText, MessageCircle, Star, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LandingChatStableV2 } from "@/components/landing-chat-stable-v2";

export default function FreeDashboard() {
  const { user } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 gradient-red-blue rounded-full flex items-center justify-center">
              <Brain className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Red2Blue, {user?.username}!
          </h1>
          <div className="text-lg text-gray-600 mb-4">
            You're on the <Badge variant="outline">Free Plan</Badge>
          </div>
          <p className="text-gray-600">
            Get started with your mental performance journey using our basic tools
          </p>
        </div>

        {/* Available Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Basic Assessment */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Brain className="w-8 h-8 text-green-600" />
                <Badge className="bg-green-600">Available</Badge>
              </div>
              <CardTitle className="text-lg">Basic Assessment</CardTitle>
              <CardDescription>
                Take your first mental skills evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Discover your current mental performance baseline with our core assessment tool.
              </p>
              <Link href="/assessment">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Take Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Limited Chat with Flo */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <MessageCircle className="w-8 h-8 text-blue-600" />
                <Badge className="bg-blue-600">5 Messages/Day</Badge>
              </div>
              <CardTitle className="text-lg">Chat with Flo</CardTitle>
              <CardDescription>
                Limited AI coaching conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Get basic mental performance advice from Flo, your AI coach.
              </p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={() => setShowChat(true)}
              >
                Start Chatting
              </Button>
            </CardContent>
          </Card>

          {/* PDF Resources */}
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <FileText className="w-8 h-8 text-purple-600" />
                <Badge className="bg-purple-600">3 PDFs</Badge>
              </div>
              <CardTitle className="text-lg">PDF Resources</CardTitle>
              <CardDescription>
                Essential mental performance guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <FileText className="w-4 h-4 text-purple-600 mr-2" />
                  Master Your Moment
                </div>
                <div className="flex items-center text-sm">
                  <FileText className="w-4 h-4 text-purple-600 mr-2" />
                  Ability to Focus
                </div>
                <div className="flex items-center text-sm">
                  <FileText className="w-4 h-4 text-purple-600 mr-2" />
                  Mental Toughness
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Download PDFs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Prompt */}
        <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-yellow-600" />
              <div>
                <CardTitle className="text-xl">Unlock Your Full Potential</CardTitle>
                <CardDescription className="text-base">
                  Upgrade for complete access to the Red2Blue methodology
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Premium Features */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Premium Features You're Missing:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Lock className="w-4 h-4 text-gray-400 mr-2" />
                    Unlimited AI coaching conversations
                  </li>
                  <li className="flex items-center">
                    <Lock className="w-4 h-4 text-gray-400 mr-2" />
                    Advanced assessment tools
                  </li>
                  <li className="flex items-center">
                    <Lock className="w-4 h-4 text-gray-400 mr-2" />
                    Personalized training techniques
                  </li>
                  <li className="flex items-center">
                    <Lock className="w-4 h-4 text-gray-400 mr-2" />
                    Progress tracking & analytics
                  </li>
                  <li className="flex items-center">
                    <Lock className="w-4 h-4 text-gray-400 mr-2" />
                    Goal setting & achievement system
                  </li>
                  <li className="flex items-center">
                    <Lock className="w-4 h-4 text-gray-400 mr-2" />
                    Community challenges & leaderboard
                  </li>
                </ul>
              </div>

              {/* Premium Pricing */}
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-blue-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Premium Access</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">$490</div>
                  <p className="text-sm text-gray-500 mb-4">One-time payment • Lifetime access</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-3">
                    Upgrade to Premium
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-gray-500">
                    30-day money-back guarantee
                  </p>
                </div>
              </div>

              {/* Ultimate Pricing */}
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-purple-300 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600">Human Coaching</Badge>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 mt-2">Ultimate Access</h4>
                  <div className="text-3xl font-bold text-purple-600 mb-2">$2190</div>
                  <p className="text-sm text-gray-500 mb-3">One-time payment • Lifetime access</p>
                  <div className="bg-purple-50 p-3 rounded-lg mb-4">
                    <p className="text-xs font-medium text-purple-800 mb-2">Everything in Premium plus:</p>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• 1-on-1 private coaching sessions</li>
                      <li>• Personal human coach matching</li>
                      <li>• Custom training programs</li>
                      <li>• VIP priority support</li>
                    </ul>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 mb-3">
                    Upgrade to Ultimate
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-gray-500">
                    30-day money-back guarantee
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Ready to start your mental performance journey?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Take Your First Assessment
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setShowChat(true)}
            >
              Chat with Flo
            </Button>
          </div>
        </div>
      </div>

      {/* Chat with Flo - Shows when user clicks Start Chatting */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Chat with Flo</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <div className="h-[500px]">
              <LandingChatStableV2 isInlineWidget={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}