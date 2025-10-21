"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import { BookOpen, Clock, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

export default function AdminStatsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  if (authLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Mock data - replace with actual API calls
  const overviewStats = [
    {
      name: "Total Users",
      value: "2,847",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "blue",
    },
    {
      name: "Active Users",
      value: "1,923",
      change: "+8%",
      changeType: "increase",
      icon: Users,
      color: "green",
    },
    {
      name: "Lessons Completed",
      value: "15,642",
      change: "+24%",
      changeType: "increase",
      icon: BookOpen,
      color: "purple",
    },
    {
      name: "Avg. Study Time",
      value: "24 min",
      change: "-5%",
      changeType: "decrease",
      icon: Clock,
      color: "orange",
    },
  ];

  const topLessons = [
    { id: 1, title: "Basic Grammar", completions: 1245, rating: 4.8 },
    { id: 2, title: "Vocabulary Builder", completions: 1123, rating: 4.7 },
    { id: 3, title: "Speaking Practice", completions: 987, rating: 4.6 },
    { id: 4, title: "Writing Skills", completions: 856, rating: 4.5 },
    { id: 5, title: "Listening Comprehension", completions: 743, rating: 4.4 },
  ];

  const userGrowthData = [
    { period: "Week 1", users: 120 },
    { period: "Week 2", users: 180 },
    { period: "Week 3", users: 240 },
    { period: "Week 4", users: 320 },
  ];

  return (
    <div className="p-6">
      <div className="">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Statistics & Analytics
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Track platform performance and user engagement
            </p>
          </div>
          <div className="flex-shrink-0">
            <select
              className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {overviewStats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold">
                          {stat.changeType === "increase" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={
                              stat.changeType === "increase"
                                ? "text-green-600"
                                : "text-red-600"
                            }>
                            {stat.change}
                          </span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                User Growth
              </h3>
              <div className="space-y-3">
                {userGrowthData.map((data, index) => (
                  <div key={data.period} className="flex items-center">
                    <div className="flex-shrink-0 w-16 text-sm text-gray-500">
                      {data.period}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(data.users / 400) * 100}%`,
                          }}></div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-12 text-sm text-gray-900 text-right">
                      {data.users}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Lessons */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Top Performing Lessons
              </h3>
              <div className="space-y-3">
                {topLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {lesson.title}
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(lesson.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-xs text-gray-500">
                            {lesson.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {lesson.completions.toLocaleString()} completions
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Engagement Metrics */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Engagement Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Daily Active Users
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    1,234
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Session Duration
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    18 min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                  <span className="text-sm font-medium text-gray-900">23%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Return Rate</span>
                  <span className="text-sm font-medium text-gray-900">67%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Learning Progress
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium text-gray-900">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Avg. Lessons/User
                  </span>
                  <span className="text-sm font-medium text-gray-900">5.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Drop-off Rate</span>
                  <span className="text-sm font-medium text-gray-900">22%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Repeat Rate</span>
                  <span className="text-sm font-medium text-gray-900">45%</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                System Health
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="text-sm font-medium text-green-600">
                    99.9%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium text-gray-900">
                    120ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Error Rate</span>
                  <span className="text-sm font-medium text-gray-900">
                    0.1%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">CPU Usage</span>
                  <span className="text-sm font-medium text-gray-900">45%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
