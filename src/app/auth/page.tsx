"use client";

import LoginForm from "@/components/forms/login-form";
import RegisterForm from "@/components/forms/register-form";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthPage: React.FC = () => {
  const { user, login, register, isLoading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleRegister = async (data: any) => {
    try {
      await register(data);
      router.push("/dashboard");
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {isLogin ? (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToRegister={() => setIsLogin(false)}
              isLoading={isLoading}
            />
          ) : (
            <RegisterForm
              onRegister={handleRegister}
              onSwitchToLogin={() => setIsLogin(true)}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthPage;
