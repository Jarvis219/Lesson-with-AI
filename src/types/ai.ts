// AI related types
import { Lesson } from "./lessons";
export interface AIGrammarRequest {
  text: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface AIGrammarResponse {
  original: string;
  corrected: string;
  errors: Array<{
    type: string;
    original: string;
    correction: string;
    explanation: string;
  }>;
  score: number;
  suggestions: string[];
}

export interface AIVocabRequest {
  word: string;
  context?: string;
}

export interface AIVocabResponse {
  word: string;
  definition: string;
  translation: string;
  examples: Array<{
    sentence: string;
    translation: string;
  }>;
  synonyms: string[];
  pronunciation: string;
  level: string;
}

export interface AISpeakingRequest {
  text: string;
  userAudio?: string; // base64 audio data
}

export interface AISpeakingResponse {
  feedback: {
    pronunciation: number;
    fluency: number;
    accuracy: number;
    overall: number;
  };
  suggestions: string[];
  correctPronunciation?: string;
}

export interface AILessonPlanRequest {
  prompt: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  focus?: string[];
}

export interface AIResponse {
  lesson: Lesson;
  suggestions?: string[];
  difficulty?: "easy" | "medium" | "hard";
}
