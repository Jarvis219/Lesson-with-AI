"use client";

import AdminLessonsFilters from "@/components/admin/lessons/filters";
import AdminLessonsTable from "@/components/admin/lessons/lessons-table";
import AdminLessonsModals from "@/components/admin/lessons/modals";
import AdminLessonsPagination from "@/components/admin/lessons/pagination";
import AdminLessonsStatsCards from "@/components/admin/lessons/stats-cards";
import { AdminLessonsProvider } from "@/context/admin-lessons-context";
import { useRequireAuth } from "@/hooks/useAuth";

export default function AdminLessonsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 lg:p-6">
        <div className="">
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
      <div className="p-6">
        <div className="">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Lesson Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Create and manage English lessons
              </p>
            </div>
            <div className="flex-shrink-0">
              <AdminLessonsModals />
            </div>
          </div>

          <AdminLessonsStatsCards />
          <AdminLessonsFilters />
          <AdminLessonsTable />
          <AdminLessonsPagination />
        </div>
      </div>
    </AdminLessonsProvider>
  );
}
