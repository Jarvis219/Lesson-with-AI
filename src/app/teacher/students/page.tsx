"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart,
  Filter,
  Search,
  Target,
  TrendingDown,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function StudentsManagementPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Students Management
              </h1>
              <p className="mt-2 text-indigo-100">
                Monitor your students' progress and performance, {user?.name}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-200" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="pl-8 pr-3 py-2 rounded-lg bg-white/10 text-white placeholder:text-indigo-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 text-sm">
                <Filter className="h-4 w-4" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="bg-transparent focus:outline-none">
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-50" />
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Students</div>
                  <div className="text-2xl font-semibold text-gray-900">25</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Active students in your courses
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-50" />
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Average Score</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    85%
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Across all courses</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-purple-50" />
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <BarChart className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Completion Rate</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    78%
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Average lesson completion
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-rose-50" />
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Weak Skills</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    Speaking
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Most common weak area
              </p>
            </div>
          </div>
        </div>

        {/* Student List - Placeholder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Student List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Student {i}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        student{i}@example.com
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {60 + i * 5}%
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            i % 2
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                          {i % 2 ? "Active" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Skills Analysis - Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border p-4">
                <div className="text-sm text-gray-500 mb-2">Top Skills</div>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Reading</li>
                  <li>Listening</li>
                  <li>Vocabulary</li>
                </ul>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-sm text-gray-500 mb-2">Weak Skills</div>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Speaking</li>
                  <li>Grammar</li>
                </ul>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-sm text-gray-500 mb-2">Suggestions</div>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Increase speaking practice</li>
                  <li>Add more grammar drills</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
