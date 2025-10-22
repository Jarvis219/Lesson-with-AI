"use client";

import LessonHistory from "@/components/lessons/lesson-history";
import { useRequireAuth } from "@/hooks/useAuth";
import { BookOpen, History } from "lucide-react";
import { useState } from "react";

export default function LessonHistoryPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [activeTab, setActiveTab] = useState<"all" | "completed">("all");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading lesson history...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <History className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lesson History
              </h1>
              <p className="text-gray-600">
                Track your learning progress and review past lessons
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                All Lessons
              </div>
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                activeTab === "completed"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}>
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Completed Only
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "all" && <LessonHistory limit={20} />}

          {activeTab === "completed" && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Completed Lessons
                </h3>
                <p className="text-green-700 text-sm">
                  Showing only lessons you've successfully completed (score ≥
                  70%)
                </p>
              </div>
              <LessonHistory limit={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
