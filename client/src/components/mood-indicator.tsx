import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  Heart, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Brain,
  Target,
  Smile,
  Meh,
  Frown
} from "lucide-react";

interface MoodData {
  overall: number;
  confidence: number;
  focus: number;
  energy: number;
  stress: number;
  motivation: number;
  timestamp: string;
}

interface MoodHistory {
  id: string;
  mood: number;
  factors: {
    confidence: number;
    focus: number;
    energy: number;
    stress: number;
    motivation: number;
  };
  context: string;
  timestamp: string;
}

export function MoodIndicator() {
  const { user } = useAuth();
  const [currentMood, setCurrentMood] = useState<MoodData>({
    overall: 75,
    confidence: 70,
    focus: 80,
    energy: 65,
    stress: 35,
    motivation: 85,
    timestamp: new Date().toISOString()
  });

  const [moodHistory, setMoodHistory] = useState<MoodHistory[]>([
    {
      id: "1",
      mood: 82,
      factors: { confidence: 85, focus: 90, energy: 75, stress: 25, motivation: 88 },
      context: "After successful practice session",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "2", 
      mood: 65,
      factors: { confidence: 60, focus: 70, energy: 55, stress: 45, motivation: 70 },
      context: "Before tournament round",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ]);

  // Simulate real-time mood updates based on user activity
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMood(prev => {
        const timeOfDay = new Date().getHours();
        const isEveningTime = timeOfDay > 18 || timeOfDay < 6;
        
        // Natural fluctuations throughout the day
        const baseVariation = (Math.random() - 0.5) * 4;
        const timeAdjustment = isEveningTime ? -3 : 2;
        
        const newOverall = Math.max(0, Math.min(100, prev.overall + baseVariation + timeAdjustment));
        
        return {
          ...prev,
          overall: newOverall,
          confidence: Math.max(0, Math.min(100, prev.confidence + (Math.random() - 0.5) * 3)),
          focus: Math.max(0, Math.min(100, prev.focus + (Math.random() - 0.5) * 2)),
          energy: Math.max(0, Math.min(100, prev.energy + (Math.random() - 0.5) * 4)),
          stress: Math.max(0, Math.min(100, prev.stress + (Math.random() - 0.5) * 3)),
          motivation: Math.max(0, Math.min(100, prev.motivation + (Math.random() - 0.5) * 2)),
          timestamp: new Date().toISOString()
        };
      });
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const getMoodColor = (value: number) => {
    if (value >= 80) return "rgb(34, 197, 94)"; // Green
    if (value >= 70) return "rgb(132, 204, 22)"; // Light green
    if (value >= 60) return "rgb(234, 179, 8)"; // Yellow
    if (value >= 50) return "rgb(147, 51, 234)"; // Purple
    if (value >= 40) return "rgb(239, 68, 68)"; // Red
    return "rgb(185, 28, 28)"; // Dark red
  };

  const getMoodGradient = (value: number) => {
    const color1 = getMoodColor(value);
    const color2 = getMoodColor(Math.min(100, value + 10));
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  };

  const getMoodLabel = (value: number) => {
    if (value >= 85) return "Excellent";
    if (value >= 75) return "Great";
    if (value >= 65) return "Good";
    if (value >= 55) return "Fair";
    if (value >= 45) return "Challenging";
    return "Needs Attention";
  };

  const getMoodIcon = (value: number) => {
    if (value >= 70) return <Smile className="w-5 h-5" />;
    if (value >= 50) return <Meh className="w-5 h-5" />;
    return <Frown className="w-5 h-5" />;
  };

  const getFactorIcon = (factor: string) => {
    switch (factor) {
      case "confidence": return <Target className="w-4 h-4" />;
      case "focus": return <Brain className="w-4 h-4" />;
      case "energy": return <Zap className="w-4 h-4" />;
      case "stress": return <Activity className="w-4 h-4" />;
      case "motivation": return <Heart className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const addMoodEntry = (context: string) => {
    const newEntry: MoodHistory = {
      id: Date.now().toString(),
      mood: currentMood.overall,
      factors: {
        confidence: currentMood.confidence,
        focus: currentMood.focus,
        energy: currentMood.energy,
        stress: currentMood.stress,
        motivation: currentMood.motivation
      },
      context,
      timestamp: new Date().toISOString()
    };

    setMoodHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

  return (
    <div className="space-y-6">
      {/* Main Mood Display */}
      <Card className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ background: getMoodGradient(currentMood.overall) }}
        />
        <CardHeader className="relative">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: getMoodColor(currentMood.overall) }}
              >
                {getMoodIcon(currentMood.overall)}
              </div>
              Performance Mood
            </div>
            <Badge 
              className="text-white border-none"
              style={{ background: getMoodColor(currentMood.overall) }}
            >
              {getMoodLabel(currentMood.overall)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-center mb-6">
            <div 
              className="text-6xl font-bold mb-2"
              style={{ color: getMoodColor(currentMood.overall) }}
            >
              {Math.round(currentMood.overall)}
            </div>
            <div className="text-gray-600">Current Mood Score</div>
            <div className="text-sm text-gray-500">
              Updated {formatTime(currentMood.timestamp)}
            </div>
          </div>

          {/* Mood Factors */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(currentMood).filter(([key]) => 
              ['confidence', 'focus', 'energy', 'stress', 'motivation'].includes(key)
            ).map(([factor, value]) => (
              <div key={factor} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white mb-1"
                    style={{ background: getMoodColor(value as number) }}
                  >
                    {getFactorIcon(factor)}
                  </div>
                </div>
                <div 
                  className="text-lg font-semibold"
                  style={{ color: getMoodColor(value as number) }}
                >
                  {Math.round(value as number)}
                </div>
                <div className="text-xs text-gray-600 capitalize">
                  {factor}
                </div>
                <Progress 
                  value={value as number} 
                  className="h-1 mt-1"
                />
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => addMoodEntry("After practice session")}
            >
              Log Practice
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => addMoodEntry("Pre-round preparation")}
            >
              Pre-Round
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => addMoodEntry("Post-round reflection")}
            >
              Post-Round
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => addMoodEntry("General check-in")}
            >
              Check-In
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mood Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Recent Mood History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {moodHistory.map((entry, index) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ background: getMoodColor(entry.mood) }}
                  >
                    {Math.round(entry.mood)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{entry.context}</div>
                    <div className="text-sm text-gray-600">
                      {formatTime(entry.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {index > 0 && (
                    <div className="flex items-center gap-1">
                      {entry.mood > moodHistory[index - 1]?.mood ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : entry.mood < moodHistory[index - 1]?.mood ? (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </div>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {getMoodLabel(entry.mood)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mood Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Mood Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Strongest Factor</h4>
              <div className="flex items-center gap-2">
                {getFactorIcon("motivation")}
                <span className="text-blue-800">Motivation (85%)</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Your motivation levels are consistently high
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Area to Focus</h4>
              <div className="flex items-center gap-2">
                {getFactorIcon("stress")}
                <span className="text-orange-800">Stress Management (35%)</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                Consider breathing techniques to reduce stress
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}