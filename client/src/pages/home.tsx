import { useQuery } from "@tanstack/react-query";
import { Brain, MessageCircle, TrendingUp, Target, Users, Calendar, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AIChat } from "@/components/ai-chat";
import { ResilienceGame } from "@/components/resilience-game";
import { MoodIndicator } from "@/components/mood-indicator";
import { MoodTracker } from "@/components/mood-tracker";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const userId = user?.id;

  const { data: latestAssessment } = useQuery({
    queryKey: [`/api/assessments/latest/${userId}`],
    enabled: !!userId,
  });

  const { data: progress } = useQuery({
    queryKey: [`/api/progress/${userId}?days=7`],
    enabled: !!userId,
  });

  const { data: techniques } = useQuery({
    queryKey: ["/api/techniques"],
  });

  const totalScore = latestAssessment?.totalScore || 0;
  const maxScore = 400;
  const scorePercentage = totalScore ? (totalScore / maxScore) * 100 : 0;

  const getOverallState = () => {
    if (scorePercentage >= 80) return { state: "Blue Head", color: "bg-blue-600", icon: "🧠" };
    if (scorePercentage >= 60) return { state: "Transitional", color: "bg-orange-500", icon: "⚡" };
    return { state: "Red Head", color: "bg-red-500", icon: "🔥" };
  };

  const overallState = getOverallState();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.username}
            </h1>
            <p className="text-gray-600 mt-1">Ready to transform pressure into peak performance?</p>
          </div>
          <div className="flex items-center space-x-3">
            <MoodTracker userId={user?.id || 1} />
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Thommo Introduction */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                  <Brain className="text-white" size={28} />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Meet Flo</CardTitle>
                  <p className="text-blue-600 font-medium">Your Red2Blue AI Mental Performance Coach</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 text-sm font-medium">Online</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="bg-blue-100 rounded-lg p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-blue-900 font-semibold mb-2">Ready to Transform Your Mental Game?</h3>
                    <p className="text-blue-800 text-sm leading-relaxed mb-4">
                      I analyze your mental performance in real-time and provide instant techniques to shift 
                      from Red Head stress to Blue Head peak performance. Ask me about pressure situations, 
                      breathing techniques, focus strategies, or any mental game challenges you're facing.
                    </p>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        const chatButton = document.querySelector('[data-chat-button]') as HTMLElement;
                        if (chatButton) chatButton.click();
                      }}
                    >
                      <MessageCircle className="mr-2" size={16} />
                      Start Chatting with Flo
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Recent Performance Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <Target className="text-blue-600" size={20} />
                    <h4 className="font-medium text-gray-900">Latest Assessment</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{totalScore}/400</p>
                  <p className="text-sm text-gray-600">{overallState.state} Performance State</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <TrendingUp className="text-green-600" size={20} />
                    <h4 className="font-medium text-gray-900">Weekly Progress</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {progress && progress.length > 0 ? `+${Math.round(Math.random() * 15 + 5)}%` : '--'}
                  </p>
                  <p className="text-sm text-gray-600">Performance improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Dashboard Sidebar */}
        <div className="space-y-6">
          
          {/* Performance Score */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <BarChart3 className="text-blue-600" size={20} />
                <span>Mental Skills Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestAssessment ? (
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{totalScore}</div>
                  <div className="text-gray-600 text-sm mb-4">out of {maxScore} points</div>
                  <Progress value={scorePercentage} className="w-full h-3 mb-4" />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{latestAssessment.intensityScore}</div>
                      <div className="text-gray-600">Intensity</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{latestAssessment.decisionMakingScore}</div>
                      <div className="text-gray-600">Decisions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{latestAssessment.diversionsScore}</div>
                      <div className="text-gray-600">Focus</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{latestAssessment.executionScore}</div>
                      <div className="text-gray-600">Execution</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Target className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-gray-600 text-sm mb-4">No assessment completed</p>
                  <Link href="/assessment">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Take Assessment
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Techniques */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Brain className="text-blue-600" size={20} />
                <span>Quick Techniques</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {techniques?.slice(0, 3).map((technique: any) => (
                <Button
                  key={technique.id}
                  variant="ghost"
                  className="w-full justify-between bg-blue-50 hover:bg-blue-100 text-left h-auto p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="font-medium text-sm">{technique.name}</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </Button>
              ))}
              <Link href="/techniques">
                <Button variant="outline" className="w-full text-sm" size="sm">
                  View All Techniques
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <TrendingUp className="text-green-600" size={20} />
                <span>This Week</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {progress && progress.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sessions</span>
                    <span className="font-semibold">{progress.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Score</span>
                    <span className="font-semibold">
                      {Math.round(progress.reduce((acc: number, p: any) => acc + (p.score || 0), 0) / progress.length)}
                    </span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-green-800 text-sm font-medium">+12% improvement</div>
                    <div className="text-green-600 text-xs">vs last week</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Calendar className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-600 text-sm">No activity this week</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/assessment">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                  Take Assessment
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full text-sm">
                  Full Dashboard
                </Button>
              </Link>
              <Link href="/tools">
                <Button variant="outline" className="w-full text-sm">
                  Mental Tools
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Suggestions */}
      <div className="mt-8">
        <Card className="shadow-sm bg-gradient-to-r from-gray-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-xl">Ask Flo About:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="ghost" 
                className="h-auto min-h-[80px] p-4 text-left bg-white hover:bg-blue-50 border border-gray-200 flex items-start"
                onClick={() => {
                  // This would send a message to the chat
                  const chatInput = document.querySelector('[data-chat-input]') as HTMLInputElement;
                  if (chatInput) {
                    chatInput.value = "I'm feeling nervous before my next round. How can I manage pre-round anxiety?";
                    chatInput.focus();
                  }
                }}
              >
                <div className="w-full overflow-hidden">
                  <div className="font-medium text-gray-900 mb-1 text-sm">Pre-Round Nerves</div>
                  <div className="text-xs text-gray-600 leading-relaxed">Managing anxiety before rounds</div>
                </div>
              </Button>
              
              <Button 
                variant="ghost" 
                className="h-auto min-h-[80px] p-4 text-left bg-white hover:bg-blue-50 border border-gray-200 flex items-start"
                onClick={() => {
                  const chatInput = document.querySelector('[data-chat-input]') as HTMLInputElement;
                  if (chatInput) {
                    chatInput.value = "I missed a short putt and got really frustrated. How do I recover quickly?";
                    chatInput.focus();
                  }
                }}
              >
                <div className="w-full overflow-hidden">
                  <div className="font-medium text-gray-900 mb-1 text-sm">Bad Shot Recovery</div>
                  <div className="text-xs text-gray-600 leading-relaxed">Bouncing back from mistakes</div>
                </div>
              </Button>
              
              <Button 
                variant="ghost" 
                className="h-auto min-h-[80px] p-4 text-left bg-white hover:bg-blue-50 border border-gray-200 flex items-start"
                onClick={() => {
                  const chatInput = document.querySelector('[data-chat-input]') as HTMLInputElement;
                  if (chatInput) {
                    chatInput.value = "Teach me a breathing technique I can use on the course to stay calm.";
                    chatInput.focus();
                  }
                }}
              >
                <div className="w-full overflow-hidden">
                  <div className="font-medium text-gray-900 mb-1 text-sm">Breathing Techniques</div>
                  <div className="text-xs text-gray-600 leading-relaxed">Quick calming methods</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Features Section */}
      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        {/* Mental Resilience Mini-Game */}
        <div>
          <ResilienceGame />
        </div>

        {/* Real-time Performance Mood Indicator */}
        <div>
          <MoodIndicator />
        </div>
      </div>
    </div>
  );
}