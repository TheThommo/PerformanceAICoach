import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { FloatingChat } from "@/components/floating-chat";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Assessment from "@/pages/assessment";
import Techniques from "@/pages/techniques";
import Tools from "@/pages/tools";
import Community from "@/pages/community";
import CoachDashboard from "@/pages/coach-dashboard";
import Profile from "@/pages/profile";
import RecommendationsPage from "@/pages/recommendations";
import Scenarios from "@/pages/scenarios";
import Help from "@/pages/help";
import Features from "@/pages/features";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 gradient-red-blue rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading Red2Blue...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/assessment" component={Assessment} />
        <Route path="/techniques" component={Techniques} />
        <Route path="/tools" component={Tools} />
        <Route path="/recommendations" component={RecommendationsPage} />
        <Route path="/scenarios" component={Scenarios} />
        <Route path="/community">
          {() => <Community userId={user?.id || 1} />}
        </Route>
        <Route path="/profile" component={Profile} />
        <Route path="/help" component={Help} />
        <Route path="/features" component={Features} />
        {/* Admin/Coach only routes */}
        {(user?.role === 'admin' || user?.role === 'coach') && (
          <Route path="/coach" component={CoachDashboard} />
        )}
        <Route component={NotFound} />
      </Switch>
      <FloatingChat />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
