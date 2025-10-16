import { LessonFeedbackResponse } from "./feedback";

export interface QuestionResult {
  questionId: string;
  question: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  questionType: string;
  explanation?: string;
}

export interface LessonResultData {
  _id: string;
  userId: string;
  lessonId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
  questionResults: QuestionResult[];
  feedback?: LessonFeedbackResponse;
  createdAt: string;
  updatedAt: string;
}

export interface LessonResultResponse {
  result: LessonResultData;
}
