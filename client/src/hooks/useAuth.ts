import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "../../../shared/schema";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<User>;
}

export function useAuth(): AuthState {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          return null;
        }
        throw new Error('Failed to fetch user');
      }
      const userData = await response.json();
      setIsAuthenticated(true);
      return userData;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const login = async (email: string, password: string): Promise<User> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const userData = await response.json();
    setIsAuthenticated(true);
    refetch(); // Refresh user data
    return userData;
  };

  const logout = async (): Promise<void> => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    setIsAuthenticated(false);
    refetch(); // This will return null and update the UI
  };

  const register = async (userData: any): Promise<User> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const newUser = await response.json();
    setIsAuthenticated(true);
    refetch(); // Refresh user data
    return newUser;
  };

  return {
    user: user || null,
    isLoading,
    login,
    logout,
    register
  };
}