"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, Clock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PendingApprovalPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // If user is approved, redirect to teacher dashboard
      if (user.isTeacherApproved) {
        router.push("/teacher/courses");
      }
      // If user is not a teacher, redirect to regular dashboard
      if (user.role !== "teacher") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh relative overflow-hidden bg-gradient-to-b from-white via-blue-50 to-purple-50">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_400px_at_50%_-10%,rgba(59,130,246,0.12),transparent_70%),radial-gradient(800px_300px_at_10%_10%,rgba(168,85,247,0.12),transparent_60%)]" />
      <div className="relative flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md sm:max-w-3xl border border-slate-200/70 shadow-xl shadow-slate-800/5 bg-white/70 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-2xl bg-gradient-to-tr from-yellow-100 to-amber-50 p-4 ring-1 ring-yellow-200">
                <Clock className="h-12 w-12 text-yellow-600" />
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-50 text-yellow-800 text-xs font-medium px-3 py-1 ring-1 ring-yellow-200">
              <ShieldCheck className="h-3.5 w-3.5" /> Under Review
            </div>
            <CardTitle className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Application Under Review
            </CardTitle>
            <CardDescription className="mt-2 text-sm sm:text-lg text-slate-600">
              Thank you for applying to become a teacher. We’re verifying your
              information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 sm:space-y-8">
            <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-blue-50/70 to-blue-50/30 p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-lg text-slate-900">
                  Review Progress
                </h3>
                <span className="text-xs text-slate-500">
                  Estimated 1-3 business days
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 motion-safe:animate-pulse" />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                We’re currently validating your documents and profile details.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white/60 p-5 sm:p-6">
              <h3 className="font-semibold text-lg mb-4 text-slate-900">
                What happens next?
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Review Process</p>
                    <p className="text-sm text-slate-600">
                      Our admin team reviews your application and
                      qualifications.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Notification</p>
                    <p className="text-sm text-slate-600">
                      You’ll receive an email once your application is approved
                      or rejected.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Start Teaching</p>
                    <p className="text-sm text-slate-600">
                      When approved, you can create and manage your courses.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white/60 p-5 sm:p-6">
              <h3 className="font-semibold text-lg mb-4 text-slate-900">
                Your application
              </h3>
              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                <div className="space-y-1">
                  <p className="text-slate-500">Name</p>
                  <p className="font-medium text-slate-900">{user?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500">Email</p>
                  <p className="font-medium text-slate-900 break-words">
                    {user?.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500">Status</p>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200">
                    <Clock className="h-3.5 w-3.5" /> Pending Approval
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
              <Button
                onClick={() => router.refresh()}
                className="flex-1 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                Refresh Status
              </Button>
            </div>

            <div className="text-center text-sm text-slate-600">
              <p>
                Questions? Contact us at{" "}
                <a
                  href="mailto:support@leanenglish.com"
                  className="text-blue-600 hover:underline">
                  support@leanenglish.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
