import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Users, Shield, Check, Star } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { OptimizedFloChat as LandingChat } from "@/components/optimized-flo-chat";
import { Footer } from "@/components/footer";
import { StableSignUpForm } from "@/components/stable-signup-form";
import Checkout from "./checkout";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('free');
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  // Smart visibility logic for floating chat
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show floating chat when main widget is not visible
        setShowFloatingChat(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const mainWidget = document.getElementById('main-chat-widget');
    if (mainWidget) {
      observer.observe(mainWidget);
    }

    return () => observer.disconnect();
  }, []);

  if (showCheckout) {
    return <Checkout tier={selectedTier} onBack={() => setShowCheckout(false)} />;
  }

  if (showSignUp) {
    return <StableSignUpForm onBack={() => setShowSignUp(false)} selectedTier={selectedTier} />;
  }

  if (showSignIn) {
    return <SignInForm onBack={() => setShowSignIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-red-blue rounded-full flex items-center justify-center">
                <Brain className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Red2Blue</h1>
                <p className="text-xs text-gray-500">AI Mental Coach</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setShowSignIn(true)} className="text-gray-600">
                Sign In
              </Button>
              <Button onClick={() => {
                // Scroll to pricing section instead of direct signup
                const pricingSection = document.getElementById('pricing-section');
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: 'smooth' });
                }
              }} className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* AI Chat Hero Section */}
      <section className="pt-12 pb-16 bg-gradient-to-br from-blue-50 via-white to-red-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              AI-Powered Mental Performance
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Flo - Your
              <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                {" "}AI Mental Coach
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get instant Red2Blue coaching. Ask about handling pressure, improving focus, or any mental game challenge.
            </p>
          </div>

          {/* AI Chat Widget */}
          <div className="max-w-4xl mx-auto mb-12" id="main-chat-widget">
            <LandingChat isInlineWidget={true} />
          </div>
          
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-8">
              <strong>Start chatting instantly</strong> or sign up for full access to personalized coaching
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => {
                  const pricingSection = document.getElementById('pricing-section');
                  if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat Component */}
      <LandingChat />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Mental Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and methodologies designed for elite performers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Target className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>R2B Methodology</CardTitle>
                <CardDescription>
                  Proven Red Head to Blue Head transformation techniques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Mental Skills X-Check</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Control Circles</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Pre-Performance Routines</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Brain className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>AI-Powered Coaching</CardTitle>
                <CardDescription>
                  Personalized guidance from Flo, your AI mental coach
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Real-time analysis</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Custom recommendations</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Deep insights into your mental performance patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Assessment tracking</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Trend analysis</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Goal setting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Training Level
            </h2>
            <p className="text-lg text-gray-600">
              Professional mental performance coaching for every level
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Free Tier */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Free Access</CardTitle>
                <CardDescription>Get started with basic mental training</CardDescription>
                <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-gray-500">/month</span></div>
                <p className="text-sm text-gray-500">Billed annually</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Basic assessment</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Limited chat with Flo</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Master Your Moment PDF</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Ability to Focus PDF</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Mental Toughness PDF</li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => {
                  window.scrollTo(0, 0);
                  setSelectedTier('free');
                  setShowSignUp(true);
                }}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card className="border-2 border-blue-500 relative transform scale-105">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  Premium Access
                  <Star className="w-5 h-5 text-yellow-500 ml-2" />
                </CardTitle>
                <CardDescription>Complete mental performance transformation</CardDescription>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">$590</span>
                  <span className="text-lg font-normal text-gray-500">one-time</span>
                </div>
                <p className="text-sm text-blue-600 font-medium">Lifetime access - No recurring fees</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Complete R2B methodology</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Unlimited AI coaching</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Advanced analytics</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Personalized training plans</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />All assessment tools</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Priority support</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => {
                  setLocation('/checkout?tier=premium');
                }}>
                  Get Premium Access
                </Button>
                <p className="text-xs text-center text-gray-500">One-time payment, lifetime access</p>
              </CardContent>
            </Card>

            {/* Ultimate Tier */}
            <Card className="border-2 border-purple-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600">Human Coaching</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  Ultimate Access
                  <Users className="w-5 h-5 text-purple-500 ml-2" />
                </CardTitle>
                <CardDescription>Premium AI + personal human coaching</CardDescription>
                <div className="text-3xl font-bold">$2290<span className="text-lg font-normal text-gray-500"> one-time</span></div>
                <p className="text-sm text-purple-600 font-medium">Lifetime access - No recurring fees</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-3 rounded-lg mb-4">
                  <p className="text-sm font-medium text-purple-800">Everything in Premium plus:</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />All Premium features</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />1-on-1 private sessions</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Advanced coach matching</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Custom training programs</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />VIP support channel</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => {
                  setLocation('/checkout?tier=ultimate');
                }}>
                  Get Ultimate Access
                </Button>
                <p className="text-xs text-center text-gray-500">One-time payment, lifetime access</p>
              </CardContent>
            </Card>
          </div>

          {/* Value Proposition */}
          <div className="mt-16 text-center">
            <p className="text-lg text-gray-600 mb-4">
              Join thousands of elite performers who've transformed their mental game
            </p>
            <div className="flex justify-center items-center space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>No contracts</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>30-day guarantee*</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Privacy is Protected</h2>
          <p className="text-lg text-gray-600 mb-8">
            We use enterprise-grade security and never share your personal performance data. 
            All assessments and coaching sessions are completely confidential and encrypted.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold">Encrypted Storage</h4>
              <p className="text-sm text-gray-600">Bank-level encryption</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">No Data Sharing</h4>
              <p className="text-sm text-gray-600">Your data stays private</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold">GDPR Compliant</h4>
              <p className="text-sm text-gray-600">Full privacy rights</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Floating Chat - only shows when main widget is not visible */}
      {showFloatingChat && <LandingChat />}
    </div>
  );
}

function SignUpForm({ onBack }: { onBack: () => void }) {
  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 gradient-red-blue rounded-full flex items-center justify-center">
                  <Brain className="text-white" size={32} />
                </div>
              </div>
              <CardTitle className="text-3xl">Create Your Account</CardTitle>
              <CardDescription className="text-lg">
                Join the Red2Blue mental performance community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SignUpFormFields onBack={onBack} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SignUpForm error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-red-600">Something went wrong</CardTitle>
              <CardDescription className="text-lg">
                Please refresh the page and try again
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                Refresh Page
              </Button>
              <Button variant="outline" onClick={onBack}>
                Back to Landing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

function SignUpFormFields({ onBack }: { onBack: () => void }) {
  const { toast } = useToast();
  const [showSignIn, setShowSignIn] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    dexterity: '',
    gender: '',
    golfHandicap: '',
    golfExperience: '',
    goals: '',
    bio: ''
  });

  // Add error boundary for this component
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-600">Registration form encountered an error</p>
        <Button onClick={() => {
          setHasError(false);
          window.location.reload();
        }} className="bg-blue-600 hover:bg-blue-700">
          Try Again
        </Button>
        <Button variant="outline" onClick={onBack}>
          Back to Landing
        </Button>
      </div>
    );
  }

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      try {
        console.log('Starting registration request with data:', data);
        const requestData = {
          ...data,
          username: `${data.firstName.toLowerCase()}${data.lastName.toLowerCase()}`
        };
        const response = await apiRequest("POST", "/api/auth/register", requestData);
        const result = await response.json();
        console.log('Registration response:', result);
        return result;
      } catch (error) {
        console.error('Registration mutation error:', error);
        setHasError(true);
        throw error;
      }
    },
    onSuccess: (user) => {
      try {
        console.log('Registration successful for user:', user);
        // Invalidate auth queries to refresh user state
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        // Show success message
        toast({
          title: "Account Created Successfully!",
          description: `Welcome to Red2Blue, ${user?.username || 'User'}! Your AI profile is being generated.`,
        });
        // Redirect will happen automatically via useAuth hook
      } catch (error) {
        console.error('Registration success handler error:', error);
        setHasError(true);
      }
    },
    onError: (error: any) => {
      try {
        console.error('Registration error:', error);
        toast({
          title: "Registration Failed",
          description: error?.message || "An error occurred during registration",
          variant: "destructive",
        });
      } catch (toastError) {
        console.error('Toast error:', toastError);
        setHasError(true);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      console.log('Form submission started');
      
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      console.log('Registration data:', formData);
      registerMutation.mutate(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setHasError(true);
    }
  };

  if (showSignIn) {
    return <SignInFormContent onBack={() => setShowSignIn(false)} onBackToLanding={onBack} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="First name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Create a strong password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Confirm your password"
          />
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dexterity</label>
          <select
            value={formData.dexterity}
            onChange={(e) => setFormData({ ...formData, dexterity: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select</option>
            <option value="right">Right-handed</option>
            <option value="left">Left-handed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Golf Handicap (optional)
          </label>
          <input
            type="number"
            min="0"
            max="54"
            value={formData.golfHandicap}
            onChange={(e) => setFormData({ ...formData, golfHandicap: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your golf handicap"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Golf Experience</label>
          <select
            value={formData.golfExperience}
            onChange={(e) => setFormData({ ...formData, golfExperience: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select experience level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
            <option value="professional">Professional</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Goals</label>
        <input
          type="text"
          value={formData.goals}
          onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What do you want to achieve? (e.g., improve putting, manage pressure, build confidence)"
        />
      </div>

      {/* Bio Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tell us about yourself
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Share your background, goals, and why you're here. Our AI will create a personalized profile to enhance your coaching experience.
        </p>
        <textarea
          rows={6}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about your athletic background, mental performance goals, challenges you face, and what you hope to achieve with Red2Blue coaching..."
        />
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Privacy Protected</p>
            <p className="text-blue-700">
              Your personal information is encrypted and secure. We never share your data with third parties. 
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back to Landing
        </Button>
        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {registerMutation.isPending ? "Creating Account..." : "Create Account & Generate AI Profile"}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button 
            type="button" 
            onClick={() => setShowSignIn(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </form>
  );
}

function SignInFormContent({ onBack, onBackToLanding }: { onBack: () => void; onBackToLanding: () => void }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return await apiRequest("POST", "/api/auth/login", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your password"
        />
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back to Sign Up
        </Button>
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {loginMutation.isPending ? "Signing In..." : "Sign In"}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button 
            type="button" 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create one here
          </button>
        </p>
      </div>
    </form>
  );
}

function SignInForm({ onBack }: { onBack: () => void }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return await apiRequest("POST", "/api/auth/login", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 gradient-red-blue rounded-full flex items-center justify-center">
              <Brain className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Red2Blue</h1>
              <p className="text-sm text-gray-500">AI Mental Coach</p>
            </div>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to continue your mental performance journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>



            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </div>

            {/* Demo Credentials */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700 text-center mb-2 font-medium">Demo Accounts for Testing:</p>
              <div className="text-xs text-blue-600 space-y-1">
                <p><strong>Premium:</strong> demo-premium@red2blue.com / Premium2024!</p>
                <p><strong>Ultimate:</strong> demo-ultimate@red2blue.com / Ultimate2024!</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button type="button" onClick={onBack} className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up here
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}