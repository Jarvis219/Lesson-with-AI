"use client";

import LessonHistory from "@/components/lessons/lesson-history";
import { useRequireAuth } from "@/hooks/useAuth";
import { BookOpen, History, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function LessonHistoryPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [activeTab, setActiveTab] = useState<"all" | "completed">("all");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <History className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-1">
                  Loading lesson history...
                </p>
                <p className="text-sm text-gray-500">
                  Fetching your learning progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 p-4 md:p-6 pb-12">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          {/* Main Header */}
          <div className="relative mb-8">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>

            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50"></div>
                    <div className="relative p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
                      <History className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                      Lesson History
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Track your learning journey and review past achievements
                    </p>
                  </div>
                </div>

                {/* Stats or decorative element */}
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      Progress Tracker
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Tabs */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg p-2 inline-flex gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`relative px-6 py-3.5 text-sm font-semibold transition-all duration-300 rounded-xl ${
                  activeTab === "all"
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}>
                {activeTab === "all" && (
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg"></span>
                )}
                <span className="relative flex items-center gap-2.5">
                  <BookOpen className="h-5 w-5" />
                  All Lessons
                  {activeTab === "all" && (
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  )}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("completed")}
                className={`relative px-6 py-3.5 text-sm font-semibold transition-all duration-300 rounded-xl ${
                  activeTab === "completed"
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}>
                {activeTab === "completed" && (
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-xl shadow-lg"></span>
                )}
                <span className="relative flex items-center gap-2.5">
                  <History className="h-5 w-5" />
                  Completed Only
                  {activeTab === "completed" && (
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {activeTab === "all" && (
            <div className="transition-opacity duration-300">
              <LessonHistory limit={20} isCompleted={undefined} />
            </div>
          )}

          {activeTab === "completed" && (
            <div className="transition-opacity duration-300 space-y-6">
              {/* Info Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-2xl border-2 border-emerald-200/60 shadow-lg">
                {/* Decorative pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-green-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-200/20 to-emerald-200/20 rounded-full blur-2xl"></div>

                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl shadow-lg">
                      <History className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
                        Completed Lessons
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Score ≥ 70%
                        </span>
                      </h3>
                      <p className="text-emerald-800 leading-relaxed">
                        View all lessons you've successfully completed with a
                        score of 70% or higher. These represent your learning
                        achievements and milestones in your English journey!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <LessonHistory limit={20} isCompleted={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
