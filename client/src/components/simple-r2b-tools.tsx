import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Target, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SimpleR2BToolsProps {
  userId: number;
}

export function SimpleR2BTools({ userId }: SimpleR2BToolsProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const mentalSkillsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/mental-skills-xcheck', {
        userId: userId,
        intensityScores: [75, 80, 85],
        decisionMakingScores: [70, 75, 80],
        diversionsScores: [65, 70, 75],
        executionScores: [80, 85, 90],
        context: "Practice session",
        whatDidWell: "Good focus and tempo",
        whatCouldDoBetter: "Better pre-shot routine",
        actionPlan: "Practice visualization daily"
      });
    },
    onSuccess: () => {
      toast({
        title: "X-Check Complete!",
        description: "Your Mental Skills assessment has been saved successfully.",
      });
      setIsProcessing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save Mental Skills X-Check",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  });

  const controlCirclesMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/control-circles', {
        userId: userId,
        context: "Practice session",
        reflections: "Good exercise for mental clarity",
        cantControl: ["Weather", "Other players", "Course conditions"],
        canInfluence: ["Course strategy", "Club selection", "Shot selection"],
        canControl: ["Pre-shot routine", "Breathing", "Focus"]
      });
    },
    onSuccess: () => {
      toast({
        title: "Exercise Complete!",
        description: "Your Control Circles exercise has been saved successfully.",
      });
      setIsProcessing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save Control Circles exercise",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  });

  const handleMentalSkillsClick = () => {
    setIsProcessing(true);
    mentalSkillsMutation.mutate();
  };

  const handleControlCirclesClick = () => {
    setIsProcessing(true);
    controlCirclesMutation.mutate();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Mental Skills X-Check */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <CardTitle>Mental Skills X-Check</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Quick assessment of your mental skills performance across key areas:
              Intensity Management, Decision Making, Diversions, and Execution.
            </p>
            <Button 
              onClick={handleMentalSkillsClick}
              disabled={isProcessing || mentalSkillsMutation.isPending}
              className="w-full"
            >
              {mentalSkillsMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Complete X-Check
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Control Circles */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <CardTitle>Control Circles</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Identify what you can control, influence, and cannot control.
              This exercise helps build mental resilience and focus.
            </p>
            <Button 
              onClick={handleControlCirclesClick}
              disabled={isProcessing || controlCirclesMutation.isPending}
              className="w-full"
            >
              {controlCirclesMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Complete Exercise
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}