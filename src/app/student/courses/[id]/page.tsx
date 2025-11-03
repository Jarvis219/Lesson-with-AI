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
  Sparkles,
  TrendingUp,
  Trophy,
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading course...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-12 max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <BookOpen className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Course not found
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            The course you're looking for doesn't exist or is not available.
          </p>
          <Button
            onClick={() => router.push("/student/courses")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const totalEstimatedTime = course.lessons.reduce(
    (total, lesson) => total + (lesson.estimatedTime || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
      {/* Animated Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/student/courses")}
          className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 mb-4 sm:mb-8 transition-colors group">
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Courses
        </button>

        {/* Course Header */}
        <Card className="mb-6 sm:mb-8 bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl overflow-hidden">
          {/* Gradient Top Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>

          <CardHeader className="pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8">
              <div className="flex-1 animate-fade-in">
                {/* Badge Collection */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <Badge className="capitalize bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-md px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
                    <Trophy className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 sm:mr-1.5" />
                    {course.level}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
                    {course.category}
                  </Badge>
                  {course.isEnrolled && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-md px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
                      <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 sm:mr-1.5" />
                      Enrolled
                    </Badge>
                  )}
                  {course.enrolledStudents.length > 100 && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
                      <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 sm:mr-1.5" />
                      Popular
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                  {course.title}
                </CardTitle>

                <CardDescription className="text-sm sm:text-base lg:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed line-clamp-2">
                  {course.description}
                </CardDescription>

                {/* Course Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        Lessons
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {course.lessons.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        Duration
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {totalEstimatedTime} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm">
                      <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        Students
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {course.enrolledStudents.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Info Card */}
              <Card className="w-full lg:w-96 bg-gradient-to-br from-white to-gray-50/80 border-gray-200/50 shadow-lg animate-fade-in hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl flex items-center text-gray-900">
                    <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-600" />
                    Instructor
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-100">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md">
                        {course.teacher.name?.charAt(0) || "T"}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate text-base">
                        {course.teacher.name}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {course.teacher.email}
                      </p>
                    </div>
                  </div>

                  {course.teacher.teacherBio && (
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 mb-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {course.teacher.teacherBio}
                      </p>
                    </div>
                  )}

                  {course.teacher.teacherQualification && (
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {course.teacher.teacherQualification}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardHeader>
        </Card>

        {/* Action Button Section */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          {course.isEnrolled ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl border border-green-200">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                onClick={() =>
                  course.lessons.length > 0 &&
                  handleStartLesson(course.lessons[0]._id)
                }
                disabled={course.lessons.length === 0}>
                <Play className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                Start Learning
              </Button>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  You're enrolled! Start with the first lesson
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Make progress and unlock new content
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200">
              <Button
                size="lg"
                onClick={handleEnroll}
                disabled={enrolling}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn">
                {enrolling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Enrolling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                    Enroll Now
                  </>
                )}
              </Button>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  Join {course.enrolledStudents.length} other students
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Unlock all lessons and start your learning journey
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Lessons Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
          {/* Gradient Top Bar */}
          <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>

          <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center text-gray-900">
              <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-purple-600" />
              Course Lessons
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600 mt-2">
              {course.isEnrolled
                ? "Click on any lesson to start learning and track your progress"
                : "Enroll now to access all lessons and start learning"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 px-4 sm:px-6">
            {course.lessons.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mb-4 sm:mb-6">
                  <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  No lessons available yet
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto px-4">
                  The instructor is still working on adding lessons to this
                  course. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className={`group h-full flex flex-col md:flex-row items-center justify-between p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 ${
                      course.isEnrolled
                        ? "border-gray-200 hover:border-purple-300 bg-white hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 cursor-pointer hover:shadow-lg"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    onClick={() =>
                      course.isEnrolled && handleStartLesson(lesson._id)
                    }>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row items-start gap-4 mb-3">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-xl text-base font-bold shadow-sm flex-shrink-0 transition-all duration-300 ${
                            course.isEnrolled
                              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white group-hover:scale-110"
                              : "bg-gray-200 text-gray-500"
                          }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3
                              className={`font-bold text-gray-900 group-hover:text-purple-600 transition-colors ${
                                course.isEnrolled ? "text-lg" : "text-base"
                              }`}>
                              {lesson.title}
                            </h3>
                            {!course.isEnrolled && (
                              <div className="flex items-center justify-center w-5 h-5 bg-gray-300 rounded-full p-1">
                                <Lock className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p
                            className={`text-gray-600 mb-3 leading-relaxed ${
                              course.isEnrolled ? "text-sm" : "text-sm"
                            }`}>
                            {lesson.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium capitalize">
                              {lesson.type}
                            </span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium capitalize">
                              {lesson.difficulty}
                            </span>
                            <span className="flex items-center text-gray-600 font-medium">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {lesson.estimatedTime} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-fit ml-4 flex-shrink-0">
                      {course.isEnrolled ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="group/btn w-full md:w-fit border-purple-200 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:border-purple-600 hover:text-white transition-all duration-300">
                          <Play className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                          Start
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center w-full md:w-fit h-10 bg-gray-200 rounded-lg">
                          <Lock className="h-5 w-5 text-gray-500" />
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
