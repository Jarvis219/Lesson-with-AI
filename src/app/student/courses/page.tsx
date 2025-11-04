"use client";

import { CourseFilters, CourseGrid } from "@/components/courses";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  enrollInCourse,
  fetchAvailableCourses,
  fetchEnrolledCourses,
} from "@/lib/student-courses-service";
import { IPagination } from "@/types/pagination";
import { Course } from "@/types/teacher";
import { BookOpen, GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentCoursesPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"available" | "enrolled">(
    "available"
  );

  // Filter states
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("all");
  const [level, setLevel] = useState("all");

  // Data states
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  // Pagination states
  const [availablePagination, setAvailablePagination] = useState<IPagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPage: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [enrolledPagination, setEnrolledPagination] = useState<IPagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPage: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchCourses();
    }
  }, [isAuthenticated, activeTab, search, skill, level]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      if (activeTab === "available") {
        const { courses, pagination } = await fetchAvailableCourses({
          page: availablePagination.page,
          limit: 12,
          search,
          category: skill,
          level,
        });
        setAvailableCourses(courses);
        setAvailablePagination(pagination);
      } else {
        const { courses, pagination } = await fetchEnrolledCourses({
          page: enrolledPagination.page,
          limit: 12,
          search,
          category: skill,
          level,
        });
        setEnrolledCourses(courses);
        setEnrolledPagination(pagination);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrolling(courseId);
      await enrollInCourse(courseId);

      toast({
        title: "Success",
        description: "Successfully enrolled in course!",
      });

      // Refresh courses
      router.push(`/student/courses/${courseId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "Failed to enroll in course",
        variant: "destructive",
      });
    } finally {
      setEnrolling(null);
    }
  };

  const handleViewCourse = (courseId: string) => {
    // Navigate to course detail page
    // window.location.href = `/student/courses/${courseId}`;
    router.push(`/student/courses/${courseId}`);
  };

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600 animate-pulse" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      {/* Animated Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto">
        {/* Modern Header Section */}
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-4 sm:mb-6 border border-blue-200/50">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-blue-700">
              Explore Limitless Learning
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
            Course Library
          </h1>

          <div className="flex flex-wrap items-start sm:items-center gap-3 sm:gap-4 text-base sm:text-lg text-gray-700">
            <p className="font-medium">
              Discover personalized courses tailored to your goals
            </p>
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold text-sm sm:text-base">
                {availableCourses.length + enrolledCourses.length} courses
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="p-4 sm:p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {availableCourses.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Enrolled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {enrolledCourses.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {enrolledCourses.length > 0
                      ? Math.round(
                          (enrolledCourses.length /
                            (enrolledCourses.length +
                              availableCourses.length)) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "available" | "enrolled")
          }
          className="mb-6 sm:mb-8">
          <TabsList className="grid w-full max-w-lg grid-cols-2 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-1.5 sm:p-2 border border-gray-200/50">
            <TabsTrigger
              value="available"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white font-semibold rounded-xl transition-all duration-300 py-2 sm:py-3 text-sm sm:text-base">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              Available
            </TabsTrigger>
            <TabsTrigger
              value="enrolled"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white font-semibold rounded-xl transition-all duration-300 py-2 sm:py-3 text-sm sm:text-base">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              My Courses
            </TabsTrigger>
          </TabsList>

          {/* Available Courses Tab */}
          <TabsContent
            value="available"
            className="mt-6 sm:mt-10 animate-fade-in">
            <CourseFilters
              search={search}
              skill={skill}
              level={level}
              onSearchChange={setSearch}
              onSkillChange={setSkill}
              onLevelChange={setLevel}
            />

            <CourseGrid
              courses={availableCourses}
              loading={loading}
              isEnrolled={false}
              onEnroll={handleEnroll}
              onView={handleViewCourse}
            />
          </TabsContent>

          {/* Enrolled Courses Tab */}
          <TabsContent
            value="enrolled"
            className="mt-6 sm:mt-10 animate-fade-in">
            <CourseFilters
              search={search}
              skill={skill}
              level={level}
              onSearchChange={setSearch}
              onSkillChange={setSkill}
              onLevelChange={setLevel}
            />

            <CourseGrid
              courses={enrolledCourses}
              loading={loading}
              isEnrolled={true}
              onEnroll={handleEnroll}
              onView={handleViewCourse}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
