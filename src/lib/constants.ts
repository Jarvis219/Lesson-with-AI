export const APP_CONFIG = {
  name: "Lean English AI",
  description: "Learn English with AI-powered personalized lessons",
  version: "1.0.0",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
};

export const LESSON_TYPES = {
  VOCAB: "vocab",
  GRAMMAR: "grammar",
  LISTENING: "listening",
  SPEAKING: "speaking",
  READING: "reading",
  WRITING: "writing",
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

export const USER_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export const SKILLS = {
  VOCAB: "vocab",
  GRAMMAR: "grammar",
  LISTENING: "listening",
  SPEAKING: "speaking",
  READING: "reading",
  WRITING: "writing",
} as const;

export const EXERCISE_TYPES = {
  MULTIPLE_CHOICE: "multiple-choice",
  FILL_IN_BLANK: "fill-in-blank",
  TRANSLATION: "translation",
  LISTENING: "listening",
  SPEAKING: "speaking",
} as const;

export const ACHIEVEMENTS = [
  "first_lesson",
  "week_streak",
  "month_streak",
  "perfect_score",
  "vocabulary_master",
  "grammar_guru",
  "speaking_champion",
  "listening_expert",
  "writing_wizard",
  "reading_ace",
] as const;

export const VOCABULARY_CATEGORIES = [
  "Daily Life",
  "Business",
  "Travel",
  "Food & Cooking",
  "Health & Medicine",
  "Technology",
  "Education",
  "Sports & Fitness",
  "Entertainment",
  "Nature & Environment",
  "Emotions & Feelings",
  "Family & Relationships",
] as const;

export const PART_OF_SPEECH = {
  NOUN: "noun",
  VERB: "verb",
  ADJECTIVE: "adjective",
  ADVERB: "adverb",
  PREPOSITION: "preposition",
  CONJUNCTION: "conjunction",
  INTERJECTION: "interjection",
} as const;

export const WEEKLY_GOALS = [
  { value: 3, label: "3 lessons/week" },
  { value: 5, label: "5 lessons/week" },
  { value: 7, label: "7 lessons/week" },
  { value: 10, label: "10 lessons/week" },
  { value: 15, label: "15 lessons/week" },
] as const;

export const COLORS = {
  primary: "#3b82f6",
  secondary: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    ME: "/api/auth/me",
    LOGOUT: "/api/auth/logout",
  },
  LESSONS: {
    LIST: "/api/lessons",
    DETAIL: "/api/lessons/[id]",
    CREATE_AI: "/api/lessons/ai",
    PROGRESS: "/api/lessons/progress",
  },
  AI: {
    GRAMMAR: "/api/ai/grammar",
    VOCAB: "/api/ai/vocab",
    SPEAKING: "/api/ai/speaking",
    LESSON_PLAN: "/api/ai/lesson-plan",
  },
  PROGRESS: {
    GET: "/api/progress",
    UPDATE: "/api/progress",
    STATS: "/api/progress/stats",
  },
} as const;

export const LOCAL_STORAGE_KEYS = {
  USER_PREFERENCES: "user_preferences",
  LESSON_PROGRESS: "lesson_progress",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

export const DEFAULT_USER_PREFERENCES = {
  language: "vi",
  notifications: true,
  difficulty: "easy",
  weeklyGoal: 5,
} as const;
