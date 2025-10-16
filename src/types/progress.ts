import { ILessonProgressStats } from "@/models/Progress";
import { LessonFeedbackResponse } from "./feedback";
import { QuestionResult } from "./lesson-result";

// Progress related types
export interface ProgressStats {
  totalLessonsCompleted: number;
  streak: number;
  totalTimeSpent: number;
  scores: Array<{
    skill: string;
    score: number;
    lastUpdated: string;
  }>;
  achievements: string[];
  weeklyGoal: number;
  weeklyProgress: number;
  lessonProgress: Array<{
    lessonId: string;
    completed: boolean;
    score: number;
    timeSpent: number;
    completedAt?: string;
    attempts: number;
  }>;
}

export interface UpdateWeeklyGoalRequest {
  weeklyGoal: number;
}

export interface LessonProgressRequest {
  lessonId: string;
  score: number;
  timeSpent: number;
  skill?: string;
  stats: ILessonProgressStats;
  questionResults?: QuestionResult[];
  feedback?: LessonFeedbackResponse;
}
