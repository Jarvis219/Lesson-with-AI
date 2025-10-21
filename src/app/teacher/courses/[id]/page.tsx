"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PAGINATION_DEFAULT } from "@/constant/pagination.constant";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { TeacherService } from "@/lib/teacher-service";
import { Lesson } from "@/types";
import type { IPagination } from "@/types/pagination";
import type { Course } from "@/types/teacher";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Edit,
  Eye,
  Globe,
  Lock,
  Plus,
  Trash2,
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState<IPagination>(PAGINATION_DEFAULT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Edit course dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    level: "",
    category: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchCourse();
    }
  }, [params.id, user?.id]);

  const fetchCourse = async (page: number = PAGINATION_DEFAULT.page) => {
    if (!user?.id) return;

    try {
      setLoading(page === PAGINATION_DEFAULT.page);
      const { course: courseData, pagination: paginationData } =
        await TeacherService.getCourseById(
          params.id,
          page,
          PAGINATION_DEFAULT.limit
        );

      if (page === PAGINATION_DEFAULT.page) {
        setCourse(courseData);
      } else {
        setCourse((prev) => {
          if (!prev) return courseData;
          return {
            ...prev,
            lessons: [...prev.lessons, ...courseData.lessons],
          };
        });
      }
      setPagination(paginationData);
    } catch (error) {
      console.error("Error fetching course:", error);
      if (page === PAGINATION_DEFAULT.page) {
        router.push("/teacher/courses");
      }
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
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenEditDialog = () => {
    if (!course) return;
    setEditFormData({
      title: course.title,
      description: course.description,
      level: course.level,
      category: course.category,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateCourse = async () => {
    if (!course) return;

    // Validate form data
    const errors = TeacherService.validateCourseForm(editFormData);
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: Object.values(errors)[0],
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdatingCourse(true);
      await TeacherService.updateCourse(params.id, editFormData);
      setCourse((prev) => (prev ? { ...prev, ...editFormData } : null));
      setEditDialogOpen(false);
      toast({
        title: "Success!",
        description: "Course updated successfully",
      });
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingCourse(false);
    }
  };

  const handleDeleteLesson = (lesson: Lesson) => {
    setLessonToDelete(lesson);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteLesson = async () => {
    if (!lessonToDelete || !course || !user?.id) return;

    try {
      setIsDeleting(true);
      await TeacherService.deleteLesson(params.id, lessonToDelete._id);

      // Remove lesson from local state
      setCourse((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          lessons: prev.lessons.filter(
            (lesson) => lesson._id !== lessonToDelete._id
          ),
        };
      });

      toast({
        title: "Success!",
        description: "Lesson deleted successfully",
      });

      setDeleteDialogOpen(false);
      setLessonToDelete(null);
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast({
        title: "Error",
        description: "Failed to delete lesson",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !pagination.hasNextPage) return;

    try {
      setIsLoadingMore(true);
      await fetchCourse(pagination.page + 1);
    } catch (error) {
      console.error("Error loading more lessons:", error);
      toast({
        title: "Error",
        description: "Failed to load more lessons",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMore(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push("/teacher/courses")}
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
                  onClick={handleOpenEditDialog}
                  variant="outline"
                  size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={handleTogglePublish}
                  disabled={isUpdating || course.lessons.length === 0}
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
              <InfiniteScroll
                onLoadMore={handleLoadMore}
                hasMore={pagination.hasNextPage}
                isLoading={isLoadingMore}
                endMessage={
                  <div className="text-center text-gray-500 py-4">
                    <p>You've reached the end of the lessons list</p>
                  </div>
                }>
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
                          <span className="capitalize">
                            {lesson.difficulty}
                          </span>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLesson(lesson)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Lesson</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{lessonToDelete?.title}"? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setLessonToDelete(null);
                }}
                disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteLesson}
                disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Lesson"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Course Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Course Information</DialogTitle>
              <DialogDescription>
                Update the basic information for this course
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  placeholder="Enter course title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter course description (minimum 50 characters)"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Level</label>
                  <Select
                    value={editFormData.level}
                    onValueChange={(value) =>
                      setEditFormData({ ...editFormData, level: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={editFormData.category}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        category: e.target.value,
                      })
                    }
                    placeholder="Enter category"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={isUpdatingCourse}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCourse} disabled={isUpdatingCourse}>
                {isUpdatingCourse ? "Updating..." : "Update Course"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
