import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { FloatingChat } from "@/components/floating-chat";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary, NavigationErrorFallback } from "@/components/error-boundary";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Assessment from "@/pages/assessment";
import Techniques from "@/pages/techniques";
import Tools from "@/pages/tools";
import Community from "@/pages/community";
import CoachDashboard from "@/pages/coach-dashboard";
import Profile from "@/pages/profile-new";
import RecommendationsPage from "@/pages/recommendations";
import Goals from "@/pages/goals";
import Scenarios from "@/pages/scenarios";
import CoachingTools from "@/pages/coaching-tools";
import HumanCoaching from "@/pages/human-coaching";
import Help from "@/pages/help";
import Features from "@/pages/features";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import RefundPolicy from "@/pages/refund-policy";
import NotFound from "@/pages/not-found";
import FreeDashboard from "@/pages/free-dashboard";
import { canAccessDashboard } from "@/lib/permissions";

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
    return (
      <ErrorBoundary>
        <Landing />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ErrorBoundary fallback={NavigationErrorFallback}>
          <Navigation />
        </ErrorBoundary>
        <main className="flex-1">
          <ErrorBoundary fallback={NavigationErrorFallback}>
            <Switch>
              {/* Home route - redirect based on tier */}
              <Route path="/">
                {() => canAccessDashboard(user) ? <Home /> : <FreeDashboard />}
              </Route>
              
              {/* Dashboard route - tier-dependent */}
              <Route path="/dashboard">
                {() => canAccessDashboard(user) ? <Dashboard /> : <FreeDashboard />}
              </Route>
              
              {/* Assessment - available to all tiers but limited for free */}
              <Route path="/assessment" component={Assessment} />
              
              {/* Premium/Ultimate only routes */}
              {canAccessDashboard(user) && (
                <>
                  <Route path="/techniques" component={Techniques} />
                  <Route path="/tools" component={Tools} />
                  <Route path="/recommendations" component={RecommendationsPage} />
                  <Route path="/goals" component={Goals} />
                  <Route path="/scenarios" component={Scenarios} />
                  <Route path="/coaching-tools" component={CoachingTools} />
                  <Route path="/community">
                    {() => <Community userId={user?.id || 1} />}
                  </Route>
                </>
              )}
              
              {/* Ultimate only routes */}
              {user?.subscriptionTier === 'ultimate' && (
                <Route path="/human-coaching" component={HumanCoaching} />
              )}
              
              {/* Available to all authenticated users */}
              <Route path="/profile" component={Profile} />
              <Route path="/help" component={Help} />
              <Route path="/features" component={Features} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/terms-of-service" component={TermsOfService} />
              <Route path="/refund-policy" component={RefundPolicy} />
              
              {/* Admin/Coach only routes */}
              {(user?.role === 'admin' || user?.role === 'coach') && (
                <Route path="/coach" component={CoachDashboard} />
              )}
              
              <Route component={NotFound} />
            </Switch>
          </ErrorBoundary>
        </main>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
        <ErrorBoundary>
          <FloatingChat />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
