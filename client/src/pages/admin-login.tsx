import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User, Lock } from "lucide-react";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: "mark@cero-international.com", // Pre-filled for convenience
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      
      if (response.ok) {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel",
        });
        // Redirect to admin panel
        window.location.href = "/admin";
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdminAccount = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/create-admin", {
        email: credentials.email,
        password: credentials.password,
        username: "admin",
        firstName: "Admin",
        lastName: "User"
      });
      
      if (response.ok) {
        toast({
          title: "Admin Account Created",
          description: "You can now log in with your credentials",
        });
      } else {
        throw new Error("Failed to create admin account");
      }
    } catch (error: any) {
      toast({
        title: "Account Creation Failed",
        description: error.message || "Could not create admin account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/admin-demo-login", {});
      
      if (response.ok) {
        toast({
          title: "Demo Login Successful",
          description: "Welcome to the admin panel",
        });
        // Redirect to admin panel
        window.location.href = "/admin";
      } else {
        throw new Error("Demo login failed");
      }
    } catch (error: any) {
      toast({
        title: "Demo Login Failed",
        description: error.message || "Could not access admin demo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-red-500 to-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the Red2Blue admin panel
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Administrator Login</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the platform management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    className="pl-10"
                    placeholder="admin@example.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    required
                    className="pl-10"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading || !credentials.email || !credentials.password}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">For testing access:</div>
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full mb-2"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    Demo Admin Login
                  </Button>
                  
                  <div className="text-sm text-gray-500 mb-2">Don't have an admin account?</div>
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleCreateAdminAccount}
                    disabled={isLoading || !credentials.email || !credentials.password}
                  >
                    Create Admin Account
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Access:</h4>
              <p className="text-xs text-blue-700">
                The system has a pre-configured admin account with email: mark@cero-international.com
              </p>
              <p className="text-xs text-blue-700 mt-1">
                You can create a new password or use the "Create Admin Account" button above.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" onClick={() => window.location.href = "/"}>
            ← Back to Platform
          </Button>
        </div>
      </div>
    </div>
  );
}