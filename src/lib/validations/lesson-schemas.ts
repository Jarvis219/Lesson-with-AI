import {
  ACCENTS,
  AUDIO_SPEEDS,
  DIFFICULTY_LEVELS,
  EXERCISE_TYPES,
  LESSON_TYPES,
  PARTS_OF_SPEECH,
  READING_GENRES,
  SPEAKING_EXERCISE_TYPES,
  WRITING_TYPES,
} from "@/types/lesson-enums";
import { z } from "zod";

// ==================== Common Schemas ====================

// Base Exercise Schema
const baseExerciseSchema = z.object({
  id: z.string().nullable().optional(),
  type: z.enum(EXERCISE_TYPES as unknown as [string, ...string[]]),
  question: z.string().min(1, "Question is required"),
  translation: z.string().nullable().optional(),
  points: z.number().min(0, "Points must be at least 0"),
  difficulty: z.enum(DIFFICULTY_LEVELS as unknown as [string, ...string[]]),
  explanation: z.string().nullable().optional(),
  audioUrl: z.string().url().nullable().optional().or(z.literal("")),
  imageUrl: z.string().url().nullable().optional().or(z.literal("")),
});

// Multiple Choice Exercise
const multipleChoiceExerciseSchema = baseExerciseSchema.extend({
  type: z.literal("multiple-choice"),
  options: z
    .array(
      z.object({
        value: z.string().min(1, "Option value is required"),
        translate: z.string().nullable().optional(),
      })
    )
    .min(2, "At least 2 options are required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
});

// Single Choice Exercise
const singleChoiceExerciseSchema = baseExerciseSchema.extend({
  type: z.literal("single-choice"),
  options: z
    .array(
      z.object({
        value: z.string().min(1, "Option value is required"),
        translate: z.string().nullable().optional(),
      })
    )
    .min(2, "At least 2 options are required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
});

// Fill in Blank Exercise
const fillInBlankExerciseSchema = baseExerciseSchema.extend({
  type: z.literal("fill-in-the-blank"),
  sentence: z.string().min(1, "Sentence is required"),
  translation: z.string().nullable().optional(),
  blanks: z
    .array(
      z.object({
        position: z.number().min(0),
        correctAnswer: z.string().min(1, "Correct answer is required"),
        alternatives: z.array(z.string()).nullable().optional(),
      })
    )
    .min(1, "At least one blank is required"),
  hint: z.string().nullable().optional(),
});

// True/False Exercise
const trueFalseExerciseSchema = baseExerciseSchema.extend({
  type: z.literal("true-false"),
  correctAnswer: z.boolean(),
});

// Translation Exercise
const translationExerciseSchema = baseExerciseSchema.extend({
  type: z.literal("translation"),
  sentence: z.string().min(1, "Sentence is required"),
  correctAnswers: z
    .array(z.string().min(1))
    .min(1, "At least one correct answer is required"),
  hints: z.array(z.string()).nullable().optional(),
});

// Union of all exercise types
export const exerciseSchema = z.discriminatedUnion("type", [
  multipleChoiceExerciseSchema,
  singleChoiceExerciseSchema,
  fillInBlankExerciseSchema,
  trueFalseExerciseSchema,
  translationExerciseSchema,
]);

// ==================== Basic Info Schema ====================

export const lessonBasicInfoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(LESSON_TYPES as unknown as [string, ...string[]]),
  difficulty: z.enum(DIFFICULTY_LEVELS as unknown as [string, ...string[]]),
  estimatedTime: z.number().min(1, "Estimated time must be at least 1 minute"),
  tags: z.string().nullable().optional(),
});

export type LessonBasicInfo = z.infer<typeof lessonBasicInfoSchema>;

// ==================== Vocabulary Lesson Schema ====================

export const vocabularyWordSchema = z.object({
  word: z.string().min(1, "Word is required"),
  definition: z.string().min(1, "Definition is required"),
  example: z.string().min(1, "Example is required"),
  pronunciation: z.string().nullable().optional(),
  partOfSpeech: z.enum(PARTS_OF_SPEECH as unknown as [string, ...string[]]),
  synonyms: z.array(z.string()).nullable().optional(),
  antonyms: z.array(z.string()).nullable().optional(),
  imageUrl: z.string().url().nullable().optional().or(z.literal("")),
  audioUrl: z.string().url().nullable().optional().or(z.literal("")),
  difficulty: z.enum(DIFFICULTY_LEVELS as unknown as [string, ...string[]]),
  collocations: z.array(z.string()).nullable().optional(),
});

export const vocabularyLessonSchema = z.object({
  vocabulary: z
    .array(vocabularyWordSchema)
    .min(1, "At least one word is required"),
  exercises: z
    .array(exerciseSchema)
    .min(1, "At least one exercise is required"),
  thematicGroup: z.string().nullable().optional(),
});

export type VocabularyLessonFormData = z.infer<typeof vocabularyLessonSchema>;

// ==================== Grammar Lesson Schema ====================

export const grammarExampleSchema = z.object({
  sentence: z.string().min(1, "Example sentence is required"),
  translation: z.string().min(1, "Translation is required"),
  highlight: z.string().nullable().optional(),
  explanation: z.string().nullable().optional(),
});

export const grammarRuleSchema = z.object({
  title: z.string().min(1, "Grammar rule title is required"),
  explanation: z.string().min(10, "Explanation must be at least 10 characters"),
  structure: z.string().min(1, "Structure is required"),
  usage: z.array(z.string()).min(1, "At least one usage case is required"),
  examples: z
    .array(grammarExampleSchema)
    .min(1, "At least one example is required"),
  notes: z.array(z.string()).nullable().optional(),
  commonMistakes: z.array(z.string()).nullable().optional(),
  relatedTopics: z.array(z.string()).nullable().optional(),
});

export const grammarLessonSchema = z.object({
  grammarRule: grammarRuleSchema,
  exercises: z
    .array(exerciseSchema)
    .min(1, "At least one exercise is required"),
  visualAids: z.array(z.string()).nullable().optional(),
});

export type GrammarLessonFormData = z.infer<typeof grammarLessonSchema>;

// ==================== Listening Lesson Schema ====================

export const audioTimestampSchema = z.object({
  time: z.number().min(0, "Time must be at least 0"),
  text: z.string().min(1, "Text is required"),
});

export const audioContentSchema = z.object({
  url: z.string().url("Please enter a valid audio URL"),
  duration: z.number().min(1, "Duration must be at least 1 second"),
  transcript: z.string().min(10, "Transcript must be at least 10 characters"),
  timestamps: z.array(audioTimestampSchema).nullable().optional(),
  speed: z.enum(AUDIO_SPEEDS as unknown as [string, ...string[]]),
  accent: z
    .enum(ACCENTS as unknown as [string, ...string[]])
    .nullable()
    .optional(),
});

export const preListeningContentSchema = z.object({
  vocabulary: z.array(vocabularyWordSchema).nullable().optional(),
  context: z.string().min(10, "Context must be at least 10 characters"),
  predictionQuestions: z.array(z.string()).nullable().optional(),
});

export const postListeningContentSchema = z.object({
  comprehensionQuestions: z
    .array(exerciseSchema)
    .min(1, "At least one comprehension question is required"),
  discussionQuestions: z.array(z.string()).nullable().optional(),
  summaryTask: z.string().nullable().optional(),
});

export const listeningLessonSchema = z.object({
  audio: audioContentSchema,
  preListening: preListeningContentSchema,
  whileListening: z.object({
    exercises: z.array(exerciseSchema),
  }),
  postListening: postListeningContentSchema,
});

export type ListeningLessonFormData = z.infer<typeof listeningLessonSchema>;

// ==================== Speaking Lesson Schema ====================

export const phonemeSoundSchema = z.object({
  phoneme: z.string().min(1, "Phoneme is required"),
  description: z.string().min(1, "Description is required"),
  examples: z.array(z.string()).min(1, "At least one example is required"),
  audioUrl: z.string().url().nullable().optional().or(z.literal("")),
  videoUrl: z.string().url().nullable().optional().or(z.literal("")),
});

export const intonationPatternSchema = z.object({
  pattern: z.string().min(1, "Pattern is required"),
  description: z.string().min(1, "Description is required"),
  examples: z.array(z.string()).min(1, "At least one example is required"),
  audioUrl: z.string().url().nullable().optional().or(z.literal("")),
});

export const dialogueTurnSchema = z.object({
  speaker: z.string().min(1, "Speaker is required"),
  text: z.string().min(1, "Text is required"),
  audioUrl: z.string().url().nullable().optional().or(z.literal("")),
  translation: z.string().nullable().optional(),
});

export const conversationScenarioSchema = z.object({
  scenario: z.string().min(1, "Scenario is required"),
  dialogues: z
    .array(dialogueTurnSchema)
    .min(2, "At least two dialogue turns are required"),
  usefulPhrases: z.array(z.string()).nullable().optional(),
  culturalNotes: z.array(z.string()).nullable().optional(),
});

export const speakingExerciseSchema = z.object({
  type: z.enum(SPEAKING_EXERCISE_TYPES as unknown as [string, ...string[]]),
  prompt: z.string().min(1, "Prompt is required"),
  sampleAnswer: z.string().nullable().optional(),
  sampleAudioUrl: z.string().url().nullable().optional().or(z.literal("")),
  timeLimit: z.number().min(0).nullable().optional(),
  tips: z.array(z.string()).nullable().optional(),
});

export const speakingLessonSchema = z.object({
  pronunciation: z
    .object({
      sounds: z.array(phonemeSoundSchema).nullable().optional(),
      intonation: intonationPatternSchema.nullable().optional(),
    })
    .nullable()
    .optional(),
  conversation: conversationScenarioSchema.nullable().optional(),
  practiceExercises: z
    .array(speakingExerciseSchema)
    .min(1, "At least one practice exercise is required"),
  topics: z.array(z.string()).nullable().optional(),
});

export type SpeakingLessonFormData = z.infer<typeof speakingLessonSchema>;

// ==================== Reading Lesson Schema ====================

export const readingAnnotationSchema = z.object({
  paragraph: z.number().min(0, "Paragraph must be at least 0"),
  note: z.string().min(1, "Note is required"),
  highlightedText: z.string().nullable().optional(),
});

export const readingPassageSchema = z.object({
  title: z.string().min(1, "Passage title is required"),
  text: z.string().min(50, "Passage must be at least 50 characters"),
  wordCount: z.number().min(1, "Word count must be at least 1"),
  readingTime: z.number().min(1, "Reading time must be at least 1 minute"),
  genre: z.enum(READING_GENRES as unknown as [string, ...string[]]),
  images: z.array(z.string().url()).nullable().optional(),
  vocabulary: z.array(vocabularyWordSchema).nullable().optional(),
  source: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
});

export const readingLessonSchema = z.object({
  passage: readingPassageSchema,
  preReading: z.object({
    predictions: z.array(z.string()).nullable().optional(),
    vocabulary: z.array(vocabularyWordSchema).nullable().optional(),
    context: z.string().min(10, "Context must be at least 10 characters"),
  }),
  whileReading: z.object({
    annotations: z.array(readingAnnotationSchema).nullable().optional(),
    questions: z.array(exerciseSchema).nullable().optional(),
  }),
  postReading: z.object({
    comprehensionQuestions: z
      .array(exerciseSchema)
      .min(1, "At least one comprehension question is required"),
    vocabularyExercises: z.array(exerciseSchema).nullable().optional(),
    discussionQuestions: z.array(z.string()).nullable().optional(),
    summaryTask: z.string().nullable().optional(),
  }),
});

export type ReadingLessonFormData = z.infer<typeof readingLessonSchema>;

// ==================== Writing Lesson Schema ====================

export const writingInstructionSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  requirements: z
    .array(z.string().min(1, "Requirement cannot be empty"))
    .min(1, "At least one requirement is required"),
  audience: z.string().nullable().optional(),
  purpose: z.string().nullable().optional(),
  tone: z.string().nullable().optional(),
});

export const modelTextSchema = z.object({
  title: z.string().min(1, "Title is required"),
  text: z.string().min(50, "Model text must be at least 50 characters"),
  analysis: z.string().nullable().optional(),
  highlights: z
    .array(
      z.object({
        text: z.string().min(1, "Text is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .nullable()
    .optional(),
});

export const usefulPhraseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  phrases: z.array(z.string()).min(1, "At least one phrase is required"),
  examples: z.array(z.string()).nullable().optional(),
});

export const writingFrameworkSchema = z.object({
  structure: z
    .array(z.string().min(1, "Structure item cannot be empty"))
    .min(1, "At least one structure item is required"),
  usefulPhrases: z.array(usefulPhraseSchema).nullable().optional(),
  grammarPoints: z.array(z.string()).nullable().optional(),
  vocabularyBank: z.array(z.string()).nullable().optional(),
});

export const writingRubricCriterionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  maxPoints: z.number().min(1, "Max points must be at least 1"),
});

export const writingLessonSchema = z.object({
  writingType: z.enum(WRITING_TYPES as unknown as [string, ...string[]]),
  instruction: writingInstructionSchema,
  modelText: modelTextSchema.nullable().optional(),
  writingFramework: writingFrameworkSchema,
  exercises: z.array(exerciseSchema).nullable().optional(),
  rubric: z
    .object({
      criteria: z
        .array(writingRubricCriterionSchema)
        .min(1, "At least one rubric criterion is required"),
      totalPoints: z.number().min(1, "Total points must be at least 1"),
    })
    .nullable()
    .optional(),
  checklist: z.array(z.string()).nullable().optional(),
});

export type WritingLessonFormData = z.infer<typeof writingLessonSchema>;

// ==================== Combined Schema for API ====================

// Complete form schemas for each lesson type (without transform for discriminated union)
export const vocabularyLessonFormSchema = lessonBasicInfoSchema.extend({
  type: z.literal("vocab"),
  content: vocabularyLessonSchema,
});

export const grammarLessonFormSchema = lessonBasicInfoSchema.extend({
  type: z.literal("grammar"),
  content: grammarLessonSchema,
});

export const listeningLessonFormSchema = lessonBasicInfoSchema.extend({
  type: z.literal("listening"),
  content: listeningLessonSchema,
});

export const speakingLessonFormSchema = lessonBasicInfoSchema.extend({
  type: z.literal("speaking"),
  content: speakingLessonSchema,
});

export const readingLessonFormSchema = lessonBasicInfoSchema.extend({
  type: z.literal("reading"),
  content: readingLessonSchema,
});

export const writingLessonFormSchema = lessonBasicInfoSchema.extend({
  type: z.literal("writing"),
  content: writingLessonSchema,
});

// Discriminated union for all lesson types
export const createLessonSchema = z.discriminatedUnion("type", [
  vocabularyLessonFormSchema,
  grammarLessonFormSchema,
  listeningLessonFormSchema,
  speakingLessonFormSchema,
  readingLessonFormSchema,
  writingLessonFormSchema,
]);

export type LessonFormData = z.infer<typeof createLessonSchema>;
