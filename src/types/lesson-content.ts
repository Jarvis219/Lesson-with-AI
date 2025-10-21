/**
 * Lesson Content Types
 * Detailed type definitions for all 6 lesson types:
 * - Vocabulary
 * - Grammar
 * - Listening
 * - Speaking
 * - Reading
 * - Writing
 */

// Import centralized enums
import type {
  Accent,
  AudioSpeed,
  DifficultyLevel,
  ExerciseType,
  LessonType,
  PartOfSpeech,
  ReadingGenre,
  SpeakingExerciseType,
  WritingType,
} from "./lesson-enums";

// Re-export for convenience
export type {
  Accent,
  AudioSpeed,
  DifficultyLevel,
  ExerciseType,
  LessonType,
  PartOfSpeech,
  ReadingGenre,
  SpeakingExerciseType,
  WritingType,
};

// ==================== VOCABULARY LESSON ====================

export interface VocabularyWord {
  word: string;
  definition: string;
  example: string;
  pronunciation?: string; // IPA notation
  partOfSpeech: PartOfSpeech;
  synonyms?: string[];
  antonyms?: string[];
  imageUrl?: string;
  audioUrl?: string;
  difficulty: DifficultyLevel;
  collocations?: string[]; // Common word combinations
}

export interface VocabularyLessonContent {
  vocabulary: VocabularyWord[];
  exercises: BaseExercise[];
  thematicGroup?: string; // Topic/theme of vocabulary (e.g., "Food", "Travel")
}

// ==================== GRAMMAR LESSON ====================

export interface GrammarExample {
  sentence: string;
  translation: string;
  highlight?: string; // Part to highlight in the sentence
  explanation?: string;
}

export interface GrammarRule {
  title: string; // e.g., "Present Simple Tense"
  explanation: string; // Main explanation
  structure: string; // Formula: S + V(s/es) + O
  usage: string[]; // List of usage cases
  examples: GrammarExample[];
  notes?: string[]; // Special notes
  commonMistakes?: string[]; // Common errors to avoid
  relatedTopics?: string[]; // Related grammar topics
}

export interface GrammarLessonContent {
  grammarRule: GrammarRule;
  exercises: BaseExercise[];
  visualAids?: string[]; // URLs to diagrams, timelines, etc.
}

// ==================== LISTENING LESSON ====================

export interface AudioTimestamp {
  time: number; // in seconds
  text: string;
}

export interface AudioContent {
  url: string;
  duration: number; // in seconds
  transcript: string;
  timestamps?: AudioTimestamp[];
  speed: AudioSpeed;
  accent?: Accent;
}

export interface PreListeningContent {
  vocabulary?: VocabularyWord[];
  context: string; // Background information
  predictionQuestions?: string[];
}

export interface PostListeningContent {
  comprehensionQuestions: BaseExercise[];
  discussionQuestions?: string[];
  summaryTask?: string;
}

export interface ListeningLessonContent {
  audio: AudioContent;
  preListening: PreListeningContent;
  whileListening: {
    exercises: BaseExercise[];
  };
  postListening: PostListeningContent;
}

// ==================== SPEAKING LESSON ====================

export interface PhonemeSound {
  phoneme: string; // /θ/, /ð/, etc.
  description: string;
  examples: string[];
  audioUrl?: string;
  videoUrl?: string; // Demonstration video
}

export interface IntonationPattern {
  pattern: string;
  description: string;
  examples: string[];
  audioUrl?: string;
}

export interface DialogueTurn {
  speaker: string;
  text: string;
  audioUrl?: string;
  translation?: string;
}

export interface ConversationScenario {
  scenario: string; // e.g., "At a restaurant"
  dialogues: DialogueTurn[];
  usefulPhrases?: string[];
  culturalNotes?: string[];
}

export interface SpeakingLessonContent {
  pronunciation?: {
    sounds?: PhonemeSound[];
    intonation?: IntonationPattern;
  };
  conversation?: ConversationScenario;
  practiceExercises: SpeakingExercise[];
  topics?: string[]; // Discussion topics
}

export interface SpeakingExercise {
  type: SpeakingExerciseType;
  prompt: string;
  sampleAnswer?: string;
  sampleAudioUrl?: string;
  timeLimit?: number; // in seconds
  tips?: string[];
}

// ==================== READING LESSON ====================

export interface ReadingPassage {
  title: string;
  text: string;
  wordCount: number;
  readingTime: number; // estimated minutes
  genre: ReadingGenre;
  images?: string[];
  vocabulary?: VocabularyWord[];
  source?: string;
  author?: string;
}

export interface ReadingAnnotation {
  paragraph: number;
  note: string;
  highlightedText?: string;
}

export interface ReadingLessonContent {
  passage: ReadingPassage;
  preReading: {
    predictions?: string[];
    vocabulary?: VocabularyWord[];
    context: string;
  };
  whileReading: {
    annotations?: ReadingAnnotation[];
    questions?: BaseExercise[];
  };
  postReading: {
    comprehensionQuestions: BaseExercise[];
    vocabularyExercises?: BaseExercise[];
    discussionQuestions?: string[];
    summaryTask?: string;
  };
}

// ==================== WRITING LESSON ====================

export interface WritingInstruction {
  prompt: string;
  requirements: string[]; // e.g., "200-250 words", "Include introduction and conclusion"
  audience?: string; // Who they're writing for
  purpose?: string; // Inform, persuade, entertain, etc.
  tone?: string; // Formal, informal, friendly, professional
}

export interface ModelText {
  title: string;
  text: string;
  analysis?: string; // Why this is a good example
  highlights?: {
    text: string;
    explanation: string;
  }[];
}

export interface UsefulPhrase {
  category: string; // "Opening", "Giving opinion", "Concluding", etc.
  phrases: string[];
  examples?: string[];
}

export interface WritingFramework {
  structure: string[]; // ["Introduction", "Body Paragraph 1", "Body Paragraph 2", "Conclusion"]
  usefulPhrases?: UsefulPhrase[];
  grammarPoints?: string[];
  vocabularyBank?: string[];
}

export interface WritingRubricCriterion {
  name: string; // "Content", "Organization", "Language Use", "Grammar", "Vocabulary"
  description: string;
  maxPoints: number;
}

export interface WritingLessonContent {
  writingType: WritingType;
  instruction: WritingInstruction;
  modelText?: ModelText;
  writingFramework: WritingFramework;
  exercises?: BaseExercise[]; // Pre-writing exercises
  rubric?: {
    criteria: WritingRubricCriterion[];
    totalPoints: number;
  };
  checklist?: string[]; // Self-check list before submission
}

// ==================== BASE EXERCISE TYPES ====================

export interface BaseExercise {
  id?: string;
  type: ExerciseType;
  question: string;
  translation?: string;
  points: number;
  difficulty: DifficultyLevel;
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: "multiple-choice";
  options: {
    value: string;
    translate?: string;
  }[];
  correctAnswer: string;
}

export interface SingleChoiceExercise extends BaseExercise {
  type: "single-choice";
  options: {
    value: string;
    translate?: string;
  }[];
  correctAnswer: string;
}

export interface FillInBlankExercise extends BaseExercise {
  type: "fill-in-the-blank";
  sentence: string; // Sentence with blanks marked as ___
  translation?: string;
  blanks: {
    position: number;
    correctAnswer: string;
    alternatives?: string[];
  }[];
  hint?: string;
}

export interface TrueFalseExercise extends BaseExercise {
  type: "true-false";
  correctAnswer: boolean;
}

export interface TranslationExercise extends BaseExercise {
  type: "translation";
  sentence: string; // Sentence to translate
  correctAnswers: string[]; // Multiple acceptable translations
  hints?: string[];
}

export type Exercise =
  | MultipleChoiceExercise
  | SingleChoiceExercise
  | FillInBlankExercise
  | TrueFalseExercise
  | TranslationExercise;

// ==================== UNION TYPE FOR ALL LESSON CONTENT ====================

export type LessonContent =
  | VocabularyLessonContent
  | GrammarLessonContent
  | ListeningLessonContent
  | SpeakingLessonContent
  | ReadingLessonContent
  | WritingLessonContent;

// ==================== FORM DATA TYPES ====================

export interface BaseLessonFormData {
  title: string;
  description: string;
  type: LessonType;
  difficulty: DifficultyLevel;
  estimatedTime: number;
  tags: string[];
}

export interface VocabularyLessonFormData extends BaseLessonFormData {
  type: "vocab";
  content: VocabularyLessonContent;
}

export interface GrammarLessonFormData extends BaseLessonFormData {
  type: "grammar";
  content: GrammarLessonContent;
}

export interface ListeningLessonFormData extends BaseLessonFormData {
  type: "listening";
  content: ListeningLessonContent;
}

export interface SpeakingLessonFormData extends BaseLessonFormData {
  type: "speaking";
  content: SpeakingLessonContent;
}

export interface ReadingLessonFormData extends BaseLessonFormData {
  type: "reading";
  content: ReadingLessonContent;
}

export interface WritingLessonFormData extends BaseLessonFormData {
  type: "writing";
  content: WritingLessonContent;
}

// export type LessonFormData =
//   | VocabularyLessonFormData
//   | GrammarLessonFormData
//   | ListeningLessonFormData
//   | SpeakingLessonFormData
//   | ReadingLessonFormData
//   | WritingLessonFormData;

// export type VocabularyFormData = z.infer<typeof vocabularyLessonFormSchema>;
// export type GrammarFormData = z.infer<typeof grammarLessonFormSchema>;
// export type ListeningFormData = z.infer<typeof listeningLessonFormSchema>;
// export type SpeakingFormData = z.infer<typeof speakingLessonFormSchema>;
// export type ReadingFormData = z.infer<typeof readingLessonFormSchema>;
// export type WritingFormData = z.infer<typeof writingLessonFormSchema>;

// export type LessonFormData = CreateLessonFormData;

export interface Skill {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export interface Difficulty {
  value: string;
  label: string;
  icon: string;
  description: string;
}
