"use client";

import { Course } from "@/types/teacher";
import { BookOpen, Loader2 } from "lucide-react";
import CourseCard from "./course-card";

interface CourseGridProps {
  courses: Course[];
  loading: boolean;
  isEnrolled?: boolean;
  onEnroll?: (courseId: string) => void;
  onView?: (courseId: string) => void;
}

export default function CourseGrid({
  courses,
  loading,
  isEnrolled = false,
  onEnroll,
  onView,
}: CourseGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <BookOpen className="h-16 w-16 text-gray-300" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {isEnrolled ? "No enrolled courses yet" : "No courses found"}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {isEnrolled
            ? "Explore available courses and enroll now to start your learning journey!"
            : "Try adjusting your filters or search terms to find what you're looking for."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 place-items-stretch">
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          isEnrolled={course.isEnrolled || isEnrolled}
          onEnroll={onEnroll}
          onView={onView}
        />
      ))}
    </div>
  );
}
