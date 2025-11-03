/**
 * Centralized Enum Types for Lessons
 * Single source of truth for all lesson-related enums
 */

// ==================== LESSON TYPES ====================

export const LESSON_TYPES = [
  "vocab",
  "grammar",
  "listening",
  "speaking",
  "reading",
  "writing",
] as const;

export type LessonType = (typeof LESSON_TYPES)[number];

// ==================== DIFFICULTY LEVELS ====================

export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

// ==================== EXERCISE TYPES ====================

// Must sync with EXERCISE_QUESTION_TYPES from @/types/lessons.ts
export const EXERCISE_TYPES = [
  "multiple-choice",
  "single-choice",
  "fill-in-the-blank",
  "true-false",
  "translation",
] as const;

export type ExerciseType = (typeof EXERCISE_TYPES)[number];

// ==================== VOCABULARY ====================

export const PARTS_OF_SPEECH = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "conjunction",
  "pronoun",
  "interjection",
] as const;

export type PartOfSpeech = (typeof PARTS_OF_SPEECH)[number];

// ==================== LISTENING ====================

export const AUDIO_SPEEDS = ["slow", "normal", "fast"] as const;

export type AudioSpeed = (typeof AUDIO_SPEEDS)[number];

export const ACCENTS = ["american", "british", "australian", "other"] as const;

export type Accent = (typeof ACCENTS)[number];

// ==================== READING ====================

export const READING_GENRES = [
  "article",
  "story",
  "essay",
  "news",
  "blog",
  "academic",
] as const;

export type ReadingGenre = (typeof READING_GENRES)[number];

// ==================== WRITING ====================

export const WRITING_TYPES = [
  "email",
  "essay",
  "letter",
  "report",
  "story",
  "review",
  "article",
  "summary",
] as const;

export type WritingType = (typeof WRITING_TYPES)[number];
