"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart,
  BookOpen,
  Calendar,
  CreditCard,
  MessageSquare,
  Settings,
  Target,
  TrendingDown,
  Users,
} from "lucide-react";

export default function TeacherDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.name}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Students
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
                <p className="text-xs text-gray-500">
                  Active students in your courses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Score
                </CardTitle>
                <Target className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-gray-500">Across all courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <BarChart className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-gray-500">
                  Average lesson completion
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Class
                </CardTitle>
                <Calendar className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2:30 PM</div>
                <p className="text-xs text-gray-500">Today</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Students
                    </CardTitle>
                    <Users className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">25</div>
                    <p className="text-xs text-gray-500">Currently enrolled</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Progress
                    </CardTitle>
                    <Target className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">65%</div>
                    <p className="text-xs text-gray-500">Course completion</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Weak Areas
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Speaking</div>
                    <p className="text-xs text-gray-500">Most common</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      New Students
                    </CardTitle>
                    <Users className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-gray-500">This week</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Progress & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Weekly Progress Chart Placeholder */}
                <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                  Weekly Progress Chart
                </div>

                {/* Skill Distribution Chart Placeholder */}
                <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                  Skill Distribution Chart
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Communication Center</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Messages Section */}
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-medium mb-2">Recent Messages</h3>
                  <p className="text-sm text-gray-500">No new messages</p>
                </div>

                {/* Comments Section */}
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-medium mb-2">Recent Comments</h3>
                  <p className="text-sm text-gray-500">No new comments</p>
                </div>

                {/* Forum Section */}
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-medium mb-2">Class Forum</h3>
                  <p className="text-sm text-gray-500">
                    No recent forum activity
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings & Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Profile Section */}
                <div className="space-y-4">
                  <h3 className="font-medium">Profile Information</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p>{user?.name}</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="space-y-4">
                  <h3 className="font-medium">Teaching Schedule</h3>
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-500">No upcoming classes</p>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-4">
                  <h3 className="font-medium">Payment Information</h3>
                  <div className="p-4 bg-gray-100 rounded-lg flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-500">
                      No payment method added
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
