"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  enrollInCourse,
  fetchCourseDetail,
} from "@/lib/student-courses-service";
import { Course } from "@/types/teacher";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  Lock,
  Play,
  User,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentCourseDetailPage() {
  const params = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchCourse();
    }
  }, [isAuthenticated, params.id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const { course: courseData } = await fetchCourseDetail(params.id);
      setCourse(courseData);
    } catch (error: any) {
      console.error("Error fetching course:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to load course",
        variant: "destructive",
      });
      router.push("/student/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;

    try {
      setEnrolling(true);
      await enrollInCourse(course._id);

      toast({
        title: "Success",
        description: "Successfully enrolled in course!",
      });

      // Refresh course data
      fetchCourse();
    } catch (error: any) {
      console.error("Error enrolling in course:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "Failed to enroll in course",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLesson = (lessonId: string) => {
    router.push(`/student/lessons/${lessonId}`);
  };

  // Show loading if auth is still loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course...</p>
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

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Course not found
            </h1>
            <p className="text-gray-600 mb-6">
              The course you're looking for doesn't exist or is not available.
            </p>
            <Button onClick={() => router.push("/student/courses")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalEstimatedTime = course.lessons.reduce(
    (total, lesson) => total + (lesson.estimatedTime || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/student/courses")}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </button>

        {/* Course Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="capitalize">
                    {course.level}
                  </Badge>
                  <Badge variant="secondary">{course.category}</Badge>
                  {course.isEnrolled && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enrolled
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-4xl font-bold mb-4 text-gray-900">
                  {course.title}
                </CardTitle>

                <CardDescription className="text-lg text-gray-600 mb-6">
                  {course.description}
                </CardDescription>

                {/* Course Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span className="font-medium">
                      {course.lessons.length} lessons
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="font-medium">
                      {totalEstimatedTime} minutes
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="font-medium">
                      {course.enrolledStudents.length} students
                    </span>
                  </div>
                </div>
              </div>

              {/* Teacher Info */}
              <Card className="w-full lg:w-80">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Instructor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {course.teacher.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {course.teacher.email}
                      </p>
                    </div>
                  </div>
                  {course.teacher.teacherBio && (
                    <p className="text-sm text-gray-600 mb-2">
                      {course.teacher.teacherBio}
                    </p>
                  )}
                  {course.teacher.teacherQualification && (
                    <p className="text-xs text-gray-500">
                      {course.teacher.teacherQualification}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardHeader>
        </Card>

        {/* Action Button */}
        <div className="mb-8">
          {course.isEnrolled ? (
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={() =>
                  course.lessons.length > 0 &&
                  handleStartLesson(course.lessons[0]._id)
                }
                disabled={course.lessons.length === 0}>
                <Play className="h-5 w-5 mr-2" />
                Start Learning
              </Button>
              <p className="text-sm text-gray-600">
                You're enrolled in this course. Start with the first lesson!
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={handleEnroll}
                disabled={enrolling}
                className="bg-blue-600 hover:bg-blue-700">
                {enrolling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enrolling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Enroll Now
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-600">
                Join {course.enrolledStudents.length} other students in this
                course
              </p>
            </div>
          )}
        </div>

        {/* Lessons Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <BookOpen className="h-6 w-6 mr-3" />
              Course Lessons
            </CardTitle>
            <CardDescription>
              {course.isEnrolled
                ? "Click on any lesson to start learning"
                : "Enroll to access all lessons"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {course.lessons.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No lessons available yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  The instructor is still working on adding lessons to this
                  course.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      course.isEnrolled
                        ? "border-gray-200 hover:bg-gray-50 cursor-pointer"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    onClick={() =>
                      course.isEnrolled && handleStartLesson(lesson._id)
                    }>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        <h3 className="font-medium text-gray-900">
                          {lesson.title}
                        </h3>
                        {!course.isEnrolled && (
                          <Lock className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 ml-11">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 ml-11">
                        <span className="capitalize">{lesson.type}</span>
                        <span className="text-gray-400">•</span>
                        <span className="capitalize">{lesson.difficulty}</span>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {lesson.estimatedTime} min
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {course.isEnrolled ? (
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      ) : (
                        <div className="text-gray-400">
                          <Lock className="h-4 w-4" />
                        </div>
                      )}
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
