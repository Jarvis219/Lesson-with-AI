"use client";

import AdminLessonsFilters from "@/components/admin/lessons/filters";
import AdminLessonsTable from "@/components/admin/lessons/lessons-table";
import AdminLessonsModals from "@/components/admin/lessons/modals";
import AdminLessonsStatsCards from "@/components/admin/lessons/stats-cards";
import { AdminLessonsProvider } from "@/context/admin-lessons-context";
import { useRequireAuth } from "@/hooks/useAuth";

export default function AdminLessonsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
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
    <AdminLessonsProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Lesson Management
              </h1>
              <p className="text-gray-600">Create and manage English lessons</p>
            </div>
            <AdminLessonsModals />
          </div>

          <AdminLessonsStatsCards />
          <AdminLessonsFilters />
          <AdminLessonsTable />
        </div>
      </div>
    </AdminLessonsProvider>
  );
}
