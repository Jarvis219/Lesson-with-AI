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
      fetchCourses();
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Authenticating...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Courses</h1>
          <p className="text-lg text-gray-600">
            Discover and enroll in courses that fit your needs
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "available" | "enrolled")
          }
          className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white shadow-sm">
            <TabsTrigger
              value="available"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white font-semibold">
              Available Courses
            </TabsTrigger>
            <TabsTrigger
              value="enrolled"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white font-semibold">
              My Courses
            </TabsTrigger>
          </TabsList>

          {/* Available Courses Tab */}
          <TabsContent value="available" className="mt-8">
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
          <TabsContent value="enrolled" className="mt-8">
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
