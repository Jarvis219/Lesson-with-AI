import type { LessonContent } from "./lesson-content";
import type { IPagination } from "./pagination";

export interface Teacher {
  _id: string;
  name: string;
  email: string;
  role: string;
  isTeacherApproved: boolean;
  teacherBio?: string;
  teacherQualification?: string;
  createdAt: string;
}

export interface TeacherListResponse {
  teachers: Teacher[];
}

export interface ApproveTeacherRequest {
  userId: string;
  approved: boolean;
}

export interface ApproveTeacherResponse {
  message: string;
  teacher: Teacher;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  thumbnail?: string;
  teacher: {
    _id: string;
    name: string;
    email: string;
  };
  lessons: any[];
  enrolledStudents: any[];
  isPublished: boolean;
  isEnrolled?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CourseListResponse {
  courses: Course[];
  pagination: IPagination;
}

export interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  totalLessons: number;
  totalStudents: number;
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedTime: number;
  tags?: string[];
  content?: {
    vocabulary?: any[];
    exercises?: any[];
  };
  createdAt?: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  level: string;
  category: string;
  thumbnail?: string;
}

export interface CreateCourseResponse {
  message: string;
  course: Course;
}

export interface CreateLessonData {
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedTime: number;
  tags: string[];
  content: LessonContent;
}

export interface CreateLessonResponse {
  message: string;
  lesson: Lesson;
}

export interface CourseDetailResponse {
  course: Course;
  pagination: IPagination;
}
