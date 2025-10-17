"use client";

import { ToastListener } from "@/components/toast-listener";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
      <ToastListener />
    </AuthProvider>
  );
}
