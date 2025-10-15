"use client";

import { AuthProvider } from "@/hooks/useAuth";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
