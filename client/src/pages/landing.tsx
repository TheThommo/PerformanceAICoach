import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Users, Shield, Check, Star } from "lucide-react";

export default function Landing() {
  const [showSignUp, setShowSignUp] = useState(false);

  if (showSignUp) {
    return <SignUpForm onBack={() => setShowSignUp(false)} />;
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
              <Button variant="ghost" className="text-gray-600">
                Sign In
              </Button>
              <Button onClick={() => setShowSignUp(true)} className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              AI-Powered Mental Performance
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your
              <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                {" "}Mental Game
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Elite mental performance coaching powered by AI. Master the Red2Blue methodology 
              with personalized assessments, real-time coaching, and proven techniques used by champions.
            </p>
            
            {/* Thommo Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <Brain className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">
              Meet <strong>Thommo</strong> - Your AI Mental Performance Coach
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowSignUp(true)}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

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
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Pre-Shot Routines</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Brain className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>AI-Powered Coaching</CardTitle>
                <CardDescription>
                  Personalized guidance from Thommo, your AI mental coach
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
      <section className="py-16 bg-gray-50">
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
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Limited chat with Thommo</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-3" />Limited document downloads</li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => setShowSignUp(true)}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card className="border-2 border-blue-500 relative transform scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600">Most Popular - 55% Savings</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  Premium Access
                  <Star className="w-5 h-5 text-yellow-500 ml-2" />
                </CardTitle>
                <CardDescription>Complete mental performance transformation</CardDescription>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">$69</span>
                  <span className="text-lg text-gray-500 line-through">$153</span>
                  <span className="text-lg font-normal text-gray-500">/month</span>
                </div>
                <p className="text-sm text-green-600 font-medium">Billed annually - Save 55%</p>
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
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setShowSignUp(true)}>
                  Start Premium Trial
                </Button>
                <p className="text-xs text-center text-gray-500">14-day free trial, then $828/year</p>
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
                <div className="text-3xl font-bold">$159<span className="text-lg font-normal text-gray-500">/month</span></div>
                <p className="text-sm text-gray-500">Billed annually</p>
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
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setShowSignUp(true)}>
                  Start Ultimate Trial
                </Button>
                <p className="text-xs text-center text-gray-500">14-day free trial, then $1,908/year</p>
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
                <span>30-day guarantee</span>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 gradient-red-blue rounded-full flex items-center justify-center">
                  <Brain className="text-white" size={16} />
                </div>
                <span className="text-xl font-bold">Red2Blue</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transform your mental game with AI-powered coaching and proven Red2Blue methodology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white">Data Protection</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Red2Blue AI Mental Coach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SignUpForm({ onBack }: { onBack: () => void }) {
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
}

function SignUpFormFields({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    dexterity: '',
    gender: '',
    golfHandicap: '',
    bio: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic with AI profile generation
    console.log('Registration data:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Choose a username"
          />
        </div>
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
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Create Account & Generate AI Profile
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in here
          </button>
        </p>
      </div>
    </form>
  );
}