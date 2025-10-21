"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();

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

  const stats = [
    {
      name: "Total Lessons",
      value: "156",
      change: "+12%",
      changeType: "increase",
      icon: BookOpen,
    },
    {
      name: "Active Users",
      value: "2,847",
      change: "+8%",
      changeType: "increase",
      icon: Users,
    },
    {
      name: "Completion Rate",
      value: "78.2%",
      change: "+2.1%",
      changeType: "increase",
      icon: CheckCircle,
    },
    {
      name: "Avg. Study Time",
      value: "24 min",
      change: "-5%",
      changeType: "decrease",
      icon: Clock,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "lesson_created",
      message: "New lesson 'Advanced Grammar' was created",
      time: "2 hours ago",
      icon: BookOpen,
    },
    {
      id: 2,
      type: "user_registered",
      message: "5 new users registered today",
      time: "4 hours ago",
      icon: Users,
    },
    {
      id: 3,
      type: "system_alert",
      message: "High server load detected",
      time: "6 hours ago",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="p-6">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to the admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-gray-400" />
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
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === "increase"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href="/admin/lessons"
                  className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">
                      Manage Lessons
                    </span>
                  </div>
                </a>
                <a
                  href="/admin/users"
                  className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">
                      View Users
                    </span>
                  </div>
                </a>
                <a
                  href="/admin/stats"
                  className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-purple-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">
                      View Analytics
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <activity.icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
