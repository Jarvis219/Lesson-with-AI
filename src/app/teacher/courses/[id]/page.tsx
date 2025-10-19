"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { TeacherService } from "@/lib/teacher-service";
import { Lesson } from "@/types";
import type { Course } from "@/types/teacher";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Eye,
  Globe,
  Lock,
  Plus,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchCourse();
    }
  }, [params.id, user?.id]);

  const fetchCourse = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const courseData = await TeacherService.getCourseById(params.id, user.id);
      setCourse(courseData);
    } catch (error) {
      console.error("Error fetching course:", error);
      alert("Failed to load course");
      router.push("/teacher/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = () => {
    router.push(`/teacher/courses/${params.id}/lessons/new`);
  };

  const handleTogglePublish = async () => {
    if (!course) return;

    try {
      setIsUpdating(true);
      const newStatus = !course.isPublished;
      await TeacherService.updateCourseStatus(params.id, newStatus);
      setCourse((prev) => (prev ? { ...prev, isPublished: newStatus } : null));
      toast({
        title: "Success!",
        description: newStatus
          ? "Course published successfully"
          : "Course unpublished successfully",
      });
    } catch (error) {
      console.error("Error updating course status:", error);
      toast({
        title: "Error",
        description: "Failed to update course status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  console.log(course);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push("/teacher/dashboard")}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        {/* Course Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-2">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-base mb-4">
                  {course.description}
                </CardDescription>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="capitalize font-medium">{course.level}</span>
                  <span className="text-gray-400">•</span>
                  <span>{course.category}</span>
                  <span className="text-gray-400">•</span>
                  <span className="inline-flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.lessons.length} lessons
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="inline-flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.enrolledStudents.length} students
                  </span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-3">
                {course.isPublished ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <Globe className="h-3 w-3 mr-1" />
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <Lock className="h-3 w-3 mr-1" />
                    Draft
                  </span>
                )}
                <Button
                  onClick={handleTogglePublish}
                  disabled={isUpdating}
                  variant={course.isPublished ? "outline" : "default"}
                  size="sm">
                  {isUpdating
                    ? "Updating..."
                    : course.isPublished
                    ? "Unpublish"
                    : "Publish Course"}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Lessons Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Lessons</CardTitle>
                <CardDescription>
                  Manage the lessons in this course
                </CardDescription>
              </div>
              <Button onClick={handleAddLesson}>
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {course.lessons.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No lessons yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add your first lesson to get started
                </p>
                <div className="mt-6">
                  <Button onClick={handleAddLesson}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Lesson
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {course.lessons.map((lesson: Lesson, index: number) => (
                  <div
                    key={lesson._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-medium text-gray-500">
                          Lesson {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {lesson.title}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="capitalize">{lesson.type}</span>
                        <span className="text-gray-400">•</span>
                        <span className="capitalize">{lesson.difficulty}</span>
                        <span className="text-gray-400">•</span>
                        <span className="inline-flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {lesson.estimatedTime} min
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/teacher/courses/${params.id}/lessons/${lesson._id}/preview`
                          )
                        }>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/teacher/courses/${params.id}/lessons/${lesson._id}/edit`
                          )
                        }>
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
