"use client";

import { Button } from "@/components/ui/button";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { PAGINATION_DEFAULT } from "@/constant/pagination.constant";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { TeacherService } from "@/lib/teacher-service";
import type { IPagination } from "@/types/pagination";
import type { Course } from "@/types/teacher";
import {
  BookOpen,
  CheckCircle,
  Filter,
  Plus,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeacherDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<IPagination>(PAGINATION_DEFAULT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!isLoading && user) {
      // Check if user is a teacher
      if (user.role !== "teacher") {
        router.push("/dashboard");
        return;
      }

      // Check if teacher is approved
      if (!user.isTeacherApproved) {
        router.push("/teacher/pending-approval");
        return;
      }

      fetchCourses();
    }
  }, [user, isLoading, router]);

  const fetchCourses = async (page: number = PAGINATION_DEFAULT.page) => {
    try {
      setLoading(page === PAGINATION_DEFAULT.page);
      const { courses: coursesData, pagination: paginationData } =
        await TeacherService.getCourses(page, PAGINATION_DEFAULT.limit, {
          search: debouncedSearchTerm || undefined,
          status: statusFilter,
          level: levelFilter,
        });

      if (page === PAGINATION_DEFAULT.page) {
        setCourses(coursesData);
      } else {
        setCourses((prev) => [...prev, ...coursesData]);
      }
      setPagination(paginationData);
    } catch (error) {
      console.error("Error fetching courses:", error);
      if (page === PAGINATION_DEFAULT.page) {
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtering handled by API – keep local state as-is

  const handleLoadMore = async () => {
    if (isLoadingMore || !pagination.hasNextPage) return;

    try {
      setIsLoadingMore(true);
      await fetchCourses(pagination.page + 1);
    } catch (error) {
      console.error("Error loading more courses:", error);
      toast({
        title: "Error",
        description: "Failed to load more courses",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    // Refetch when filters change (debounced for search)
    if (!isLoading && user) {
      fetchCourses(PAGINATION_DEFAULT.page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, statusFilter, levelFilter]);

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

  const stats = TeacherService.calculateCourseStats(courses);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Teacher Dashboard
              </h1>
              <p className="mt-2 text-blue-100">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => router.push("/teacher/courses/new")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-blue-700 font-medium shadow hover:shadow-md hover:bg-blue-50 transition">
              <Plus className="h-4 w-4" />
              Create New Course
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-5">
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-50" />
                  <div className="animate-pulse flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-200" />
                    <div>
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="mt-2 h-6 w-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Total Courses</div>
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.totalCourses}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-green-50" />
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Published</div>
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.publishedCourses}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-purple-50" />
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Total Lessons</div>
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.totalLessons}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-50" />
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        Total Students
                      </div>
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.totalStudents}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Courses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Your Courses
              </h3>
              <p className="text-sm text-gray-500">
                Manage your courses and lessons
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search courses..."
                  className="pl-8 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-transparent focus:outline-none">
                    <option value="all">All</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <span className="text-gray-300">|</span>
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="bg-transparent focus:outline-none">
                    <option value="all">All levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => router.push("/teacher/courses/new")}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                <Plus className="h-4 w-4" /> New
              </button>
            </div>
          </div>

          {loading ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <li key={idx}>
                  <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="animate-pulse space-y-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-200" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded" />
                      <div className="h-3 w-full bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-base font-medium text-gray-900">
                No courses yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first course
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/teacher/courses/new")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow">
                  <Plus className="h-4 w-4" /> Create Your First Course
                </button>
              </div>
            </div>
          ) : (
            <InfiniteScroll
              onLoadMore={handleLoadMore}
              hasMore={pagination.hasNextPage}
              isLoading={isLoadingMore}
              endMessage={
                <div className="text-center text-gray-500 py-4">
                  You've reached the end
                </div>
              }>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map((course) => (
                  <li key={course._id}>
                    <div
                      onClick={() =>
                        router.push(`/teacher/courses/${course._id}`)
                      }
                      className="group relative h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <BookOpen className="h-4 w-4" />
                            </span>
                            <h3 className="text-base font-semibold text-gray-900 truncate">
                              {course.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {course.description}
                          </p>
                          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                            <span className="inline-flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />{" "}
                              {course.lessons.length} lessons
                            </span>
                            <span className="inline-flex items-center">
                              <Users className="h-4 w-4 mr-1" />{" "}
                              {course.enrolledStudents.length} students
                            </span>
                            <span className="inline-flex items-center capitalize">
                              {course.level}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.isPublished
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                            {course.isPublished ? "Published" : "Draft"}
                          </span>
                          <Link
                            href={`/teacher/courses/${course._id}`}
                            className="opacity-0 group-hover:opacity-100 transition">
                            <Button variant="outline" className="h-8 px-3">
                              Manage
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
}
