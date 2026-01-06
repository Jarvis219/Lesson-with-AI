"use client";

import { authService } from "@/lib/auth-service";
import { User } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToast } from "./use-toast";

// Auth context interface
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    level?: "beginner" | "intermediate" | "advanced";
    goals?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: {
    name?: string;
    level?: "beginner" | "intermediate" | "advanced";
    goals?: string;
    preferences?: {
      language?: string;
      notifications?: boolean;
      difficulty?: "easy" | "medium" | "hard";
    };
  }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        setError(error as string);
        console.error("Error initializing auth:", error);
        // Clear invalid token
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthenticated && pathname !== "/") {
      router.push("/auth");
      return;
    }

    initializeAuth();
  }, [isAuthenticated, pathname]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data ||
        error?.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    level?: "beginner" | "intermediate" | "advanced";
    goals?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.register(userData);
      setUser(response.user);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data ||
        error?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updates: {
    name?: string;
    level?: "beginner" | "intermediate" | "advanced";
    goals?: string;
    preferences?: {
      language?: string;
      notifications?: boolean;
      difficulty?: "easy" | "medium" | "hard";
    };
  }) => {
    try {
      const updatedUser = await authService.updateProfile(updates);
      setUser(updatedUser);
      toast({
        title: "Success!",
        description: "Your settings have been saved successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      if (isAuthenticated) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Custom hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (
      !isLoading &&
      !isAuthenticated &&
      !pathname.startsWith("/auth") &&
      pathname !== "/"
    ) {
      // Redirect to login page
      window.location.href = "/auth";
    }
  }, [isAuthenticated, isLoading, pathname]);

  return { isAuthenticated, isLoading };
}

// Custom hook for admin-protected routes
export function useRequireAdmin() {
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Not logged in -> go to login
    if (!isAuthenticated) {
      window.location.href = "/auth";
      return;
    }

    // Logged in but not admin -> go home
    if (user && user.role !== "admin") {
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoading, user]);

  const isAdmin = Boolean(user && user.role === "admin");

  return { isAdmin, isLoading };
}
