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
  lessons: any[];
  enrolledStudents: any[];
  isPublished: boolean;
  createdAt: string;
}

export interface CourseListResponse {
  courses: Course[];
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
  teacherId: string;
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
  content: any; // Can be any LessonContent type (Vocabulary, Grammar, Listening, Speaking, Reading, Writing)
  teacherId: string;
}

export interface CreateLessonResponse {
  message: string;
  lesson: Lesson;
}

export interface CourseDetailResponse {
  course: Course;
}
