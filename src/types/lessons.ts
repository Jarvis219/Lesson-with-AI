import { LessonFormData } from "@/lib/validations/lesson-schemas";
import { ILessonProgress, IQuestionAnswer } from "@/models/Progress";
import { DifficultyLevel, EXERCISE_TYPES, LessonType } from "./lesson-enums";
import { Course, Teacher } from "./teacher";

interface Options {
  value: string;
  translate: string;
}

// Sync with centralized EXERCISE_TYPES
export const EXERCISE_QUESTION_TYPES = EXERCISE_TYPES as unknown as string[];

// Lesson Progress Submit Response
export interface LessonProgressSubmitResponse {
  success: boolean;
  score: number;
  questionAnswers: IQuestionAnswer[];
  progress: {
    lessonId: string;
    score: number;
    timeSpent: number;
    completed: boolean;
    stats: {
      totalQuestionsAnswered: number;
      totalCorrectAnswers: number;
      totalIncorrectAnswers: number;
      questionAnswers: IQuestionAnswer[];
    };
    questionAnswers: IQuestionAnswer[];
    totalLessonsCompleted: number;
    weeklyProgress: number;
    weeklyGoal: number;
  };
}

// Re-export for convenience
export type { DifficultyLevel, LessonType };

export interface Exercise {
  correctAnswer: string[];
  difficulty: DifficultyLevel;
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
  difficulty: DifficultyLevel;
  type: LessonType;
  estimatedTime: number;
  questions: Question[];
  createdByAI?: boolean;
  createdAt: string;
  updatedAt: string;
  progress: ILessonProgress;
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
  difficulty: DifficultyLevel;
  skill: LessonType;
  estimatedTime: number;
  questions: Question[];
  tags?: string[];
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

// Student
export type LessonDetailResponse = LessonFormData & {
  _id: string;
  teacher: Teacher;
  course: Course;
};
