interface Options {
  value: string;
  translate: string;
}

export const EXERCISE_QUESTION_TYPES: string[] = [
  "multiple-choice",
  "fill-in-the-blank",
  "true-false",
  "translation",
];

interface Exercise {
  correctAnswer: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  explanation: string;
  options: Options[];
  question: {
    text: string;
    translate: string;
  };
  type: (typeof EXERCISE_QUESTION_TYPES)[number];
  _id: string;
}

// Lessons related types
export interface Lesson {
  _id: string;
  title: string;
  description: string;
  content: {
    exercises: Exercise[];
    text?: string;
  };
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "vocab" | "grammar" | "listening" | "speaking" | "reading" | "writing";
  estimatedTime: number;
  questions: Question[];
  createdByAI?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  type: (typeof EXERCISE_QUESTION_TYPES)[number];
  question: {
    text: string;
    translate: string;
  };
  options?: Options[];
  correctAnswer: string[];
  explanation?: string;
  points: number;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  timeSpent: number;
  completedAt?: string;
  attempts: number;
}

export interface CreateLessonRequest {
  title: string;
  description: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  skill: "vocab" | "grammar" | "listening" | "speaking" | "reading" | "writing";
  estimatedTime: number;
  questions: Question[];
}

// Pagination and filtering types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LessonsResponse {
  lessons: Lesson[];
  pagination: PaginationInfo;
}

export interface LessonsFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  skill?: string;
  difficulty?: string;
  status?: string;
  tags?: string;
}
