import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechniqueCard } from "@/components/technique-card";
import { 
  Zap, 
  Compass, 
  Target, 
  Anchor, 
  Clock,
  Play,
  BookOpen
} from "lucide-react";

export default function Techniques() {
  const { data: techniques, isLoading } = useQuery({
    queryKey: ["/api/techniques"],
  });

  const categories = [
    { 
      id: "breathing", 
      name: "Breathing", 
      icon: <Zap className="text-blue-primary" size={20} />,
      description: "Calm your nervous system instantly"
    },
    { 
      id: "focus", 
      name: "Focus", 
      icon: <Compass className="text-indigo-600" size={20} />,
      description: "Regain concentration after distractions"
    },
    { 
      id: "pressure", 
      name: "Pressure", 
      icon: <Target className="text-teal-600" size={20} />,
      description: "Turn pressure into performance"
    },
    { 
      id: "anchor", 
      name: "Anchoring", 
      icon: <Anchor className="text-purple-600" size={20} />,
      description: "Access your best mental state on demand"
    },
  ];

  const getTechniquesByCategory = (categoryId: string) => {
    return techniques?.filter((technique: any) => technique.category === categoryId) || [];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "Instant";
    if (seconds < 60) return `${seconds}s`;
    return `${Math.round(seconds / 60)}m`;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blue Head Techniques</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Quick, effective techniques to shift from Red Head stress to Blue Head calm performance. 
          All techniques are designed for immediate implementation on the golf course.
        </p>
        <Badge variant="outline" className="mt-4 bg-blue-light text-blue-primary border-blue-200">
          Available Offline
        </Badge>
      </div>

      {/* Emergency Quick Relief */}
      <Card className="mb-8 bg-gradient-to-r from-red-light to-orange-50 border-red-200">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-red-primary mb-2">
                Feeling Red Head Stress Right Now?
              </h2>
              <p className="text-red-600">
                Use our fastest technique for immediate relief in high-pressure moments
              </p>
            </div>
            <Button 
              size="lg" 
              className="bg-red-primary hover:bg-red-600 text-white shadow-lg"
            >
              <Zap className="mr-2" size={20} />
              Emergency Relief (30s)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Technique Categories */}
      <Tabs defaultValue="breathing" className="space-y-8">
        
        {/* Category Tabs */}
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex items-center space-x-2"
            >
              {category.icon}
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Category Content */}
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            
            {/* Category Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                {category.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name} Techniques</h2>
              <p className="text-gray-600">{category.description}</p>
            </div>

            {/* Techniques Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTechniquesByCategory(category.id).map((technique: any, index: number) => (
                <Card key={technique.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold">{technique.name}</CardTitle>
                      <Badge className={getDifficultyColor(technique.difficulty)}>
                        {technique.difficulty}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{technique.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      
                      {/* Duration */}
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>{formatDuration(technique.duration)}</span>
                      </div>

                      {/* Instructions */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <BookOpen size={16} className="mr-2" />
                          Instructions
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {technique.instructions}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1 bg-blue-primary hover:bg-blue-deep"
                          size="sm"
                        >
                          <Play size={16} className="mr-2" />
                          Practice Now
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add New Technique Placeholder */}
            <Card className="border-dashed border-2 border-gray-300 hover:border-blue-primary transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gray-400">+</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Suggest a Technique</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Have a technique that works for you? Share it with Thommo.
                </p>
                <Button variant="outline" size="sm">
                  Submit Idea
                </Button>
              </CardContent>
            </Card>

          </TabsContent>
        ))}
      </Tabs>

      {/* Popular Techniques Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Most Effective Techniques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techniques?.slice(0, 4).map((technique: any, index: number) => (
            <TechniqueCard
              key={technique.id}
              technique={technique}
              colorIndex={index}
            />
          ))}
        </div>
      </div>

      {/* Technique Usage Tips */}
      <Card className="mt-8 bg-gradient-to-r from-blue-light to-white">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Maximizing Technique Effectiveness</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Before the Round</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Practice 2-3 techniques during warm-up</li>
                <li>• Choose your "go-to" technique for pressure moments</li>
                <li>• Set a mental cue to remind yourself to use techniques</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">During the Round</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use between shots, not during your routine</li>
                <li>• Start with easier techniques, progress to advanced</li>
                <li>• Notice when you're shifting from Red to Blue Head</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
