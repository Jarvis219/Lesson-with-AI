"use client";

import { ProgressChart, SkillRadarChart } from "@/components/charts";
import {
  AchievementBadges,
  AISuggestions,
  WeeklyGoalUpdater,
} from "@/components/student";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { AISuggestion, DashboardStats } from "@/types";
import {
  Award,
  BookOpen,
  Brain,
  Calendar,
  Clock,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats and suggestions in parallel
      const [stats, suggestions] = await Promise.all([
        apiClient.getStudentStats(),
        apiClient.getAISuggestions(),
      ]);

      setStats(stats);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 font-medium text-lg">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-12 max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
            <Target className="h-10 w-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Cannot load dashboard data
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Something went wrong while loading your dashboard.
          </p>
          <Button
            onClick={fetchDashboardData}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥🔥🔥";
    if (streak >= 14) return "🔥🔥";
    if (streak >= 7) return "🔥";
    if (streak >= 3) return "⚡";
    return "💪";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
      {/* Animated Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-4 sm:mb-6 border border-blue-200/50">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-blue-700">
              Your Learning Journey
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
            Dashboard
          </h1>

          <p className="text-base sm:text-lg text-gray-700 font-medium">
            Track your progress and achievements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalLessonsCompleted}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Study Time</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatTime(stats.totalTimeSpent)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Avg Score</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.averageScore}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-5 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Streak</p>
                <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
                  {stats.streak}
                  <span className="text-lg">
                    {getStreakEmoji(stats.streak)}
                  </span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Goal Progress */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 shadow-xl mb-6 sm:mb-8 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400 to-blue-400 rounded-full blur-2xl opacity-20"></div>

          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Weekly Goal
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Track your learning progress
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 px-4 py-1.5 font-bold text-sm">
                  {stats.weeklyProgress}/{stats.weeklyGoal}
                </Badge>
                <WeeklyGoalUpdater
                  currentGoal={stats.weeklyGoal}
                  onGoalUpdate={(newGoal) => {
                    if (stats) {
                      setStats({ ...stats, weeklyGoal: newGoal });
                    }
                  }}
                />
              </div>
            </div>
            <div className="w-full bg-white/60 backdrop-blur-sm rounded-full h-4 mb-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-4 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{
                  width: `${Math.min(
                    (stats.weeklyProgress / stats.weeklyGoal) * 100,
                    100
                  )}%`,
                }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                {stats.weeklyProgress >= stats.weeklyGoal ? (
                  <span className="flex items-center gap-2 text-green-600">
                    <span className="text-xl">🎉</span>
                    Goal Completed!
                  </span>
                ) : (
                  <span className="text-orange-600">
                    {stats.weeklyGoal - stats.weeklyProgress} lessons remaining
                  </span>
                )}
              </p>
              <span className="text-xs text-gray-500 font-medium">
                {Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%
                Complete
              </span>
            </div>
          </div>
        </Card>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Progress Over Time
                </h3>
                <p className="text-xs text-gray-500">Your learning journey</p>
              </div>
            </div>
            <ProgressChart data={stats.recentActivity} />
          </Card>

          <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Skill Scores
                </h3>
                <p className="text-xs text-gray-500">Performance breakdown</p>
              </div>
            </div>
            <SkillRadarChart data={stats.skillScores} />
          </Card>
        </div>

        {/* AI Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    AI Suggestions
                  </h3>
                  <p className="text-xs text-gray-600">
                    Personalized recommendations
                  </p>
                </div>
              </div>
              <AISuggestions suggestions={aiSuggestions} />
            </Card>
          </div>

          <div>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 border border-orange-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Achievements
                  </h3>
                  <p className="text-xs text-gray-600">Your badges</p>
                </div>
              </div>
              <AchievementBadges achievements={stats.achievements} />
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Recent Activity
              </h3>
              <p className="text-xs text-gray-500">Your learning timeline</p>
            </div>
          </div>
          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 hover:from-blue-100/50 hover:to-purple-100/50 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {activity.skill}
                        </span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {activity.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {formatTime(activity.timeSpent)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.completedAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-base font-bold text-gray-700 mb-1">
                  No activity yet
                </p>
                <p className="text-sm text-gray-500">
                  Start learning to see your progress!
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
