"use client";

import { Button } from "@/components/ui/button";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { PAGINATION_DEFAULT } from "@/constant/pagination.constant";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { TeacherService } from "@/lib/teacher-service";
import type { IPagination } from "@/types/pagination";
import type { Course } from "@/types/teacher";
import { BookOpen, CheckCircle, Plus, Users } from "lucide-react";
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
        await TeacherService.getCourses(page, PAGINATION_DEFAULT.limit);

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

  if (isLoading || loading) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className=" px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Teacher Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.name}
              </p>
            </div>
            <button
              onClick={() => router.push("/teacher/courses/new")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </button>
          </div>
        </div>
      </div>

      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Courses
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.totalCourses}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Published
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.publishedCourses}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Lessons
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.totalLessons}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-orange-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Students
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.totalStudents}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Your Courses
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your courses and lessons
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No courses yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first course
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/teacher/courses/new")}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
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
                  <p>You've reached the end of your courses</p>
                </div>
              }>
              <ul className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <li key={course._id}>
                    <div
                      onClick={() =>
                        router.push(`/teacher/courses/${course._id}`)
                      }
                      className="px-4 py-6 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {course.title}
                            </h3>
                            {course.isPublished ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Draft
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="inline-flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {course.lessons.length} lessons
                            </span>
                            <span className="inline-flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {course.enrolledStudents.length} students
                            </span>
                            <span className="capitalize">{course.level}</span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <Link href={`/teacher/courses/${course._id}`}>
                            <Button variant="outline">Manage</Button>
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
