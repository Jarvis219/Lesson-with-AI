import { PAGINATION_DEFAULT } from "@/constant/pagination.constant";
import { apiService } from "@/lib/axios";
import type { IPagination } from "@/types/pagination";
import type {
  ApproveTeacherResponse,
  Course,
  CourseDetailResponse,
  CourseListResponse,
  CourseStats,
  CreateCourseData,
  CreateCourseResponse,
  CreateLessonData,
  CreateLessonResponse,
  Lesson,
  Teacher,
  TeacherListResponse,
} from "@/types/teacher";

export class TeacherService {
  /**
   * Fetch all teachers with optional status filter
   * @param status - Filter by status: 'all', 'pending', or 'approved'
   */
  static async getTeachers(
    status: "all" | "pending" | "approved" = "all"
  ): Promise<Teacher[]> {
    const response = await apiService.get<TeacherListResponse>(
      `/api/admin/teachers?status=${status}`
    );
    return response.data.teachers || [];
  }

  /**
   * Approve or revoke teacher approval
   * @param userId - The ID of the teacher
   * @param approved - true to approve, false to revoke
   */
  static async approveTeacher(
    userId: string,
    approved: boolean
  ): Promise<ApproveTeacherResponse> {
    const response = await apiService.post<ApproveTeacherResponse>(
      "/api/admin/teachers/approve",
      {
        userId,
        approved,
      }
    );
    return response.data;
  }

  /**
   * Fetch all courses for the logged-in teacher with pagination
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   */
  static async getCourses(
    page: number = PAGINATION_DEFAULT.page,
    limit: number = PAGINATION_DEFAULT.limit,
    opts?: {
      search?: string;
      status?: "all" | "published" | "draft";
      level?: string;
    }
  ): Promise<{ courses: Course[]; pagination: IPagination }> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (opts?.search) params.set("search", opts.search);
    if (opts?.status && opts.status !== "all")
      params.set("status", opts.status);
    if (opts?.level && opts.level !== "all") params.set("level", opts.level);
    const response = await apiService.get<CourseListResponse>(
      `/api/teacher/courses?${params.toString()}`
    );
    return {
      courses: response.data.courses || [],
      pagination: response.data.pagination || PAGINATION_DEFAULT,
    };
  }

  /**
   * Calculate stats from courses array
   * @param courses - Array of courses
   */
  static calculateCourseStats(courses: Course[]): CourseStats {
    return {
      totalCourses: courses.length,
      publishedCourses: courses.filter((c) => c.isPublished).length,
      totalLessons: courses.reduce(
        (sum, course) => sum + course.lessons.length,
        0
      ),
      totalStudents: courses.reduce(
        (sum, course) => sum + course.enrolledStudents.length,
        0
      ),
    };
  }

  /**
   * Get a specific course by ID with pagination
   * @param courseId - The ID of the course
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   */
  static async getCourseById(
    courseId: string,
    page: number = PAGINATION_DEFAULT.page,
    limit: number = PAGINATION_DEFAULT.limit
  ): Promise<{ course: Course; pagination: IPagination }> {
    const response = await apiService.get<CourseDetailResponse>(
      `/api/teacher/courses/${courseId}?page=${page}&limit=${limit}`
    );
    return {
      course: response.data.course,
      pagination: response.data.pagination || PAGINATION_DEFAULT,
    };
  }

  /**
   * Create a new course
   * @param courseData - The course data
   */
  static async createCourse(courseData: CreateCourseData): Promise<Course> {
    const response = await apiService.post<CreateCourseResponse>(
      "/api/teacher/courses",
      courseData
    );
    return response.data.course;
  }

  /**
   * Update an existing course
   * @param courseId - The ID of the course
   * @param courseData - The updated course data
   */
  static async updateCourse(
    courseId: string,
    courseData: CreateCourseData
  ): Promise<Course> {
    const response = await apiService.put<CreateCourseResponse>(
      `/api/teacher/courses/${courseId}`,
      courseData
    );
    return response.data.course;
  }

  /**
   * Create a new lesson for a course
   * @param courseId - The ID of the course
   * @param lessonData - The lesson data
   */
  static async createLesson(
    courseId: string,
    lessonData: CreateLessonData
  ): Promise<Lesson> {
    const response = await apiService.post<CreateLessonResponse>(
      `/api/teacher/courses/${courseId}/lessons`,
      lessonData
    );
    return response.data.lesson;
  }

  /**
   * Update course publish status
   * @param courseId - The ID of the course
   * @param isPublished - true to publish, false to unpublish
   */
  static async updateCourseStatus(
    courseId: string,
    isPublished: boolean
  ): Promise<Course> {
    const response = await apiService.patch<{ course: Course }>(
      `/api/teacher/courses/${courseId}/publish`,
      { isPublished }
    );
    return response.data.course;
  }

  /**
   * Get a specific lesson by ID
   * @param courseId - The ID of the course
   * @param lessonId - The ID of the lesson
   */
  static async getLessonById(
    courseId: string,
    lessonId: string
  ): Promise<Lesson> {
    const response = await apiService.get<{ lesson: Lesson }>(
      `/api/teacher/courses/${courseId}/lessons/${lessonId}`
    );
    return response.data.lesson;
  }

  /**
   * Update an existing lesson
   * @param courseId - The ID of the course
   * @param lessonId - The ID of the lesson
   * @param lessonData - The updated lesson data
   */
  static async updateLesson(
    courseId: string,
    lessonId: string,
    lessonData: CreateLessonData
  ): Promise<Lesson> {
    const response = await apiService.put<CreateLessonResponse>(
      `/api/teacher/courses/${courseId}/lessons/${lessonId}`,
      lessonData
    );
    return response.data.lesson;
  }

  /**
   * Delete a lesson
   * @param courseId - The ID of the course
   * @param lessonId - The ID of the lesson
   */
  static async deleteLesson(courseId: string, lessonId: string): Promise<void> {
    await apiService.delete(
      `/api/teacher/courses/${courseId}/lessons/${lessonId}`
    );
  }

  /**
   * Validate course form data
   * @param formData - The form data to validate
   */
  static validateCourseForm(formData: {
    title: string;
    description: string;
    category: string;
  }): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length < 50) {
      errors.description = "Description must be at least 50 characters";
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required";
    }

    return errors;
  }

  /**
   * Validate lesson form data
   * @param formData - The form data to validate
   */
  static validateLessonForm(formData: {
    title: string;
    description: string;
    estimatedTime: number;
  }): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.estimatedTime || formData.estimatedTime < 1) {
      errors.estimatedTime = "Estimated time must be at least 1 minute";
    }

    return errors;
  }
}
