import { useQuery } from "@tanstack/react-query";
import { Brain, Users, TrendingUp, Target, Flame, Crosshair, Eye, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AIChat } from "@/components/ai-chat";
import { AssessmentCard } from "@/components/assessment-card";
import { TechniqueCard } from "@/components/technique-card";
import { ProgressChart } from "@/components/progress-chart";
import { Link } from "wouter";

const mockUserId = 1; // In a real app, this would come from authentication

export default function Dashboard() {
  const { data: latestAssessment } = useQuery({
    queryKey: [`/api/assessments/latest/${mockUserId}`],
  });

  const { data: techniques } = useQuery({
    queryKey: ["/api/techniques"],
  });

  const { data: scenarios } = useQuery({
    queryKey: ["/api/scenarios"],
  });

  const { data: progress } = useQuery({
    queryKey: [`/api/progress/${mockUserId}?days=7`],
  });

  const totalScore = latestAssessment?.totalScore || 0;
  const maxScore = 400;
  const scorePercentage = (totalScore / maxScore) * 100;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "gradient-blue-deep";
    if (score >= 60) return "gradient-coral-blue";
    return "gradient-red-coral";
  };

  const getOverallState = () => {
    if (scorePercentage >= 80) return { state: "Blue Head", color: "bg-blue-primary", text: "text-white" };
    if (scorePercentage >= 60) return { state: "Transitional", color: "bg-coral", text: "text-white" };
    return { state: "Red Head", color: "bg-red-primary", text: "text-white" };
  };

  const overallState = getOverallState();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-light to-white rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 mb-6 lg:mb-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-primary rounded-full flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Meet Thommo</h2>
                <p className="text-blue-primary font-medium">Your Red2Blue AI Coach</p>
              </div>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              I'm here to help you shift from "Red Head" stressed states to "Blue Head" calm performance. 
              Let's transform pressure into peak performance with simple, immediate techniques.
            </p>
            <Link href="/assessment">
              <Button className="bg-blue-primary hover:bg-blue-deep text-white px-8 py-3 shadow-lg">
                Start Your Assessment
              </Button>
            </Link>
          </div>
          <div className="flex-shrink-0">
            <div className="w-64 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-6xl text-blue-primary opacity-50" size={96} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Assessment Dashboard */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-900">Mental Skills Assessment</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm text-gray-600">Ready</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {latestAssessment ? (
                <>
                  <AssessmentCard
                    title="Intensity Management"
                    score={latestAssessment.intensityScore}
                    description="Managing pressure and stress during performance"
                    icon={<Flame className="text-red-primary" size={20} />}
                    scoreColor={getScoreColor(latestAssessment.intensityScore)}
                  />
                  
                  <AssessmentCard
                    title="Decision Making"
                    score={latestAssessment.decisionMakingScore}
                    description="Clear thinking and choice-making under pressure"
                    icon={<Crosshair className="text-blue-primary" size={20} />}
                    scoreColor={getScoreColor(latestAssessment.decisionMakingScore)}
                  />
                  
                  <AssessmentCard
                    title="Focus & Diversions"
                    score={latestAssessment.diversionsScore}
                    description="Maintaining attention and managing distractions"
                    icon={<Eye className="text-red-primary" size={20} />}
                    scoreColor={getScoreColor(latestAssessment.diversionsScore)}
                  />
                  
                  <AssessmentCard
                    title="Execution"
                    score={latestAssessment.executionScore}
                    description="Converting intention into consistent performance"
                    icon={<Target className="text-blue-primary" size={20} />}
                    scoreColor={getScoreColor(latestAssessment.executionScore)}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <Brain className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessment Yet</h3>
                  <p className="text-gray-600 mb-4">Complete your first Red2Blue assessment to see your mental skills breakdown</p>
                  <Link href="/assessment">
                    <Button>Take Assessment</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Total Score Card */}
          <Card className={`${overallState.color} ${overallState.text} shadow-lg`}>
            <CardContent className="text-center p-6">
              <h3 className="text-lg font-semibold mb-2">Overall Mental Skills</h3>
              <div className="text-4xl font-bold mb-2">{totalScore}</div>
              <div className="text-current opacity-80 text-sm mb-4">out of {maxScore} points</div>
              <Progress 
                value={scorePercentage} 
                className="w-full h-2 mb-2"
              />
              <p className="text-current opacity-80 text-sm">{overallState.state} Tendencies</p>
            </CardContent>
          </Card>

          {/* Quick Techniques */}
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle className="font-semibold text-gray-900">Quick Techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {techniques?.slice(0, 3).map((technique: any) => (
                <Button
                  key={technique.id}
                  variant="ghost"
                  className="w-full justify-between bg-blue-light hover:bg-blue-100 text-left h-auto p-3"
                >
                  <div className="flex items-center space-x-3">
                    <Brain className="text-blue-primary" size={16} />
                    <span className="font-medium">{technique.name}</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Red Head Alert */}
          {latestAssessment && latestAssessment.diversionsScore < 70 && (
            <Card className="bg-red-light border-red-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertTriangle className="text-red-primary" size={20} />
                  <h4 className="font-semibold text-red-primary">Red Head Alert</h4>
                </div>
                <p className="text-sm text-red-600 mb-3">Focus & Diversions need attention</p>
                <Button className="bg-red-primary hover:bg-red-600 text-white text-sm">
                  Get Immediate Help
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* AI Coaching and Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* AI Chat */}
        <AIChat userId={mockUserId} />

        {/* Pressure Scenarios */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Pressure Scenarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scenarios?.slice(0, 3).map((scenario: any) => (
              <div
                key={scenario.id}
                className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{scenario.title}</h4>
                  <Badge 
                    variant={scenario.pressureLevel === 'high' ? 'destructive' : 'secondary'}
                    className={
                      scenario.pressureLevel === 'high' 
                        ? 'bg-red-light text-red-primary' 
                        : 'bg-coral text-white'
                    }
                  >
                    {scenario.pressureLevel} Pressure
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-primary">Practice Red2Blue Technique</span>
                  <span className="text-gray-400">→</span>
                </div>
              </div>
            ))}
            
            <Link href="/scenarios">
              <Button variant="outline" className="w-full bg-blue-light text-blue-primary border-blue-200 hover:bg-blue-100">
                View All Scenarios
              </Button>
            </Link>
          </CardContent>
        </Card>

      </div>

      {/* Quick Access Toolkit */}
      <Card className="shadow-sm border-gray-100 mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold text-gray-900">Blue Head Techniques</CardTitle>
            <Badge variant="outline" className="bg-blue-light text-blue-primary border-blue-200">
              Available Offline
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techniques?.slice(0, 4).map((technique: any, index: number) => (
              <TechniqueCard
                key={technique.id}
                technique={technique}
                colorIndex={index}
              />
            ))}
          </div>

          {/* Emergency Button */}
          <div className="mt-8 p-6 bg-gradient-to-r from-red-light to-orange-50 rounded-xl border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-red-primary mb-1">Feeling Red Head Stress?</h4>
                <p className="text-sm text-red-600">Get immediate relief with our fastest technique</p>
              </div>
              <Button className="bg-red-primary hover:bg-red-600 text-white shadow-lg">
                ⚡ Quick Relief
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weekly Progress Chart */}
        <ProgressChart data={progress} />

        {/* Performance Insights */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-light rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="text-blue-primary" size={16} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Best Performance Time</h4>
                <p className="text-sm text-gray-600">
                  You perform best in morning rounds (8-10 AM) with 23% higher Blue Head scores
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="text-green-600" size={16} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Strongest Skill</h4>
                <p className="text-sm text-gray-600">
                  Execution is your superpower - you consistently convert intention to action under pressure
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Eye className="text-orange-600" size={16} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Focus Opportunity</h4>
                <p className="text-sm text-gray-600">
                  Practice the 3-2-1 Reset more - it could boost your Diversions score by 20 points
                </p>
              </div>
            </div>

            <Button className="w-full gradient-blue-deep text-white hover:shadow-lg transition-all">
              Generate Custom Plan
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
