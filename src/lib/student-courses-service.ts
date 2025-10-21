import { apiService } from "@/lib/axios";
import { IPagination } from "@/types/pagination";
import { Course } from "@/types/teacher";

export interface CoursesQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string; // skill/category filter
  level?: string;
}

export interface CoursesResponse {
  courses: Course[];
  pagination: IPagination;
}

function buildQueryString(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== "all") {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

export async function fetchAvailableCourses(
  query: CoursesQuery
): Promise<CoursesResponse> {
  const { page = 1, limit = 12, search, category, level } = query;
  const qs = buildQueryString({ page, limit, search, category, level });
  const endpoint = `/api/student/courses?${qs}`;
  const response = await apiService.get<CoursesResponse>(endpoint);
  return response.data;
}

export async function fetchEnrolledCourses(
  query: CoursesQuery
): Promise<CoursesResponse> {
  const { page = 1, limit = 12, search, category, level } = query;
  const qs = buildQueryString({ page, limit, search, category, level });
  const endpoint = `/api/student/courses/enrolled?${qs}`;
  const response = await apiService.get<CoursesResponse>(endpoint);
  return response.data;
}

export async function enrollInCourse(courseId: string): Promise<void> {
  await apiService.post(`/api/student/courses/${courseId}/enroll`);
}

export async function fetchCourseDetail(
  courseId: string
): Promise<{ course: Course }> {
  const response = await apiService.get<{ course: Course }>(
    `/api/student/courses/${courseId}`
  );
  return response.data;
}

export async function fetchLessonDetail(
  lessonId: string
): Promise<{ lesson: any }> {
  const response = await apiService.get<{ lesson: any }>(
    `/api/student/lessons/${lessonId}`
  );
  return response.data;
}
