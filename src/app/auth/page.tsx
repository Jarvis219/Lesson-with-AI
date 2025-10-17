"use client";

import LoginForm from "@/components/forms/login-form";
import RegisterForm from "@/components/forms/register-form";
import TeacherRegisterForm from "@/components/forms/teacher-register-form";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthPage: React.FC = () => {
  const { user, login, register, isLoading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isTeacherRegistration, setIsTeacherRegistration] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user?.role === "teacher" && !user?.isTeacherApproved) {
      router.push("/teacher/dashboard");
      return;
    }

    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Login successful, will redirect via useEffect
    } catch (error) {
      // Error is handled by axios interceptor and auth context
      // Toast notification will be shown automatically
    }
  };

  const handleRegister = async (data: any) => {
    try {
      const registerData = {
        ...data,
        role: isTeacherRegistration ? "teacher" : "student",
      };
      await register(registerData);

      if (isTeacherRegistration) {
        // Redirect to a waiting page for teacher approval
        router.push("/teacher/pending-approval");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      // Error is handled by axios interceptor and auth context
      // Toast notification will be shown automatically
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
              onSwitchToRegister={() => {
                setIsLogin(false);
                setIsTeacherRegistration(false);
              }}
              isLoading={isLoading}
            />
          ) : isTeacherRegistration ? (
            <TeacherRegisterForm
              onRegister={handleRegister}
              onSwitchToLogin={() => {
                setIsLogin(true);
                setIsTeacherRegistration(false);
              }}
              isLoading={isLoading}
            />
          ) : (
            <RegisterForm
              onRegister={handleRegister}
              onSwitchToLogin={() => {
                setIsLogin(true);
                setIsTeacherRegistration(false);
              }}
              isLoading={isLoading}
            />
          )}

          {!isLogin && !isTeacherRegistration && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Want to teach?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsTeacherRegistration(true);
                    setIsLogin(false);
                  }}
                  className="text-primary hover:underline font-medium">
                  Register as a teacher
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthPage;
