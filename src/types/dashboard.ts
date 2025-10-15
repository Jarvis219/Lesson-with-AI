// Dashboard related types
export interface DashboardStats {
  totalLessonsCompleted: number;
  totalTimeSpent: number;
  averageScore: number;
  streak: number;
  weeklyProgress: number;
  weeklyGoal: number;
  skillScores: {
    vocab: number;
    grammar: number;
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
  recentActivity: Array<{
    id: string;
    title: string;
    score: number;
    timeSpent: number;
    completedAt: string;
    skill: string;
  }>;
  achievements: string[];
  weeklyData: number[];
  monthlyProgress: number;
  levelProgress: number;
}

export interface AISuggestion {
  type: "lesson" | "review" | "practice";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimatedTime: number;
  skill?: string;
  reason?: string;
}

export interface AchievementCategory {
  streak: { earned: number; total: number; percentage: number };
  lessons: { earned: number; total: number; percentage: number };
  score: { earned: number; total: number; percentage: number };
  time: { earned: number; total: number; percentage: number };
  special: { earned: number; total: number; percentage: number };
}

export interface AchievementsResponse {
  achievements: string[];
  totalEarned: number;
  totalAvailable: number;
  categories: AchievementCategory;
  newAchievements: string[];
}
