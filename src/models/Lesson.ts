import {
  ACCENTS,
  AUDIO_SPEEDS,
  DIFFICULTY_LEVELS,
  EXERCISE_TYPES,
  LESSON_TYPES,
  PARTS_OF_SPEECH,
  READING_GENRES,
  WRITING_TYPES,
} from "@/types/lesson-enums";
import mongoose, { Document, Schema } from "mongoose";

// ==================== VOCABULARY ====================

export interface IVocabularyWord {
  word: string;
  definition: string;
  example: string;
  pronunciation?: string;
  partOfSpeech: (typeof PARTS_OF_SPEECH)[number];
  synonyms?: string[];
  antonyms?: string[];
  imageUrl?: string;
  audioUrl?: string;
  collocations?: string[];
  difficulty: (typeof DIFFICULTY_LEVELS)[number];
}

// ==================== EXERCISES ====================

export interface IBaseExercise {
  type: (typeof EXERCISE_TYPES)[number];
  question: string;
  translation?: string;
  points: number;
  difficulty: (typeof DIFFICULTY_LEVELS)[number];
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface IMultipleChoiceExercise extends IBaseExercise {
  type: "multiple-choice";
  options: {
    value: string;
    translate?: string;
  }[];
  correctAnswer: string;
}

export interface ISingleChoiceExercise extends IBaseExercise {
  type: "single-choice";
  options: {
    value: string;
    translate?: string;
  }[];
  correctAnswer: string;
}

export interface IFillInBlankExercise extends IBaseExercise {
  type: "fill-in-the-blank";
  sentence: string;
  blanks: {
    position: number;
    correctAnswer: string;
    alternatives?: string[];
  }[];
  hint?: string;
}

export interface ITrueFalseExercise extends IBaseExercise {
  type: "true-false";
  correctAnswer: boolean;
}

export interface ITranslationExercise extends IBaseExercise {
  type: "translation";
  sentence: string;
  correctAnswers: string[];
  hints?: string[];
}

export type IExercise =
  | IMultipleChoiceExercise
  | ISingleChoiceExercise
  | IFillInBlankExercise
  | ITrueFalseExercise
  | ITranslationExercise;

// ==================== GRAMMAR ====================

export interface IGrammarExample {
  sentence: string;
  translation: string;
  highlight?: string;
  explanation?: string;
}

export interface IGrammarRule {
  title: string;
  explanation: string;
  structure: string;
  usage: string[];
  examples: IGrammarExample[];
  notes?: string[];
  commonMistakes?: string[];
  relatedTopics?: string[];
}

// ==================== LISTENING ====================

export interface IAudioTimestamp {
  time: number;
  text: string;
}

export interface IAudioContent {
  text: string;
  timestamps?: IAudioTimestamp[];
  speed: (typeof AUDIO_SPEEDS)[number];
  accent?: (typeof ACCENTS)[number];
}

export interface IPreListeningContent {
  vocabulary?: IVocabularyWord[];
  context: string;
  predictionQuestions?: string[];
}

export interface IPostListeningContent {
  comprehensionQuestions: IExercise[];
  discussionQuestions?: string[];
  summaryTask?: string;
}

// ==================== SPEAKING ====================

export interface IPhonemeSound {
  phoneme: string;
  description: string;
  examples: string[];
  audioUrl?: string;
  videoUrl?: string;
}

export interface IIntonationPattern {
  pattern: string;
  description: string;
  examples: string[];
  audioUrl?: string;
}

export interface IDialogueTurn {
  speaker: string;
  text: string;
  audioUrl?: string;
  translation?: string;
}

export interface IConversationScenario {
  scenario: string;
  dialogues: IDialogueTurn[];
  usefulPhrases?: string[];
  culturalNotes?: string[];
}

// ==================== READING ====================

export interface IReadingAnnotation {
  paragraph: number;
  note: string;
  highlightedText?: string;
}

export interface IReadingPassage {
  title: string;
  text: string;
  wordCount: number;
  readingTime: number;
  genre: (typeof READING_GENRES)[number];
  images?: string[];
  vocabulary?: IVocabularyWord[];
  source?: string;
  author?: string;
}

// ==================== WRITING ====================

export interface IWritingInstruction {
  prompt: string;
  requirements: string[];
  audience?: string;
  purpose?: string;
  tone?: string;
}

export interface IModelText {
  title: string;
  text: string;
  analysis?: string;
  highlights?: {
    text: string;
    explanation: string;
  }[];
}

export interface IUsefulPhrase {
  category: string;
  phrases: string[];
  examples?: string[];
}

export interface IWritingFramework {
  structure: string[];
  usefulPhrases?: IUsefulPhrase[];
  grammarPoints?: string[];
  vocabularyBank?: string[];
}

export interface IWritingRubricCriterion {
  name: string;
  description: string;
  maxPoints: number;
}

// ==================== LESSON CONTENT ====================

export interface ILessonContent {
  // Vocabulary lesson
  vocabulary?: IVocabularyWord[];
  thematicGroup?: string;

  // Grammar lesson
  grammarRule?: IGrammarRule;
  visualAids?: string[];

  // Listening lesson
  audio?: IAudioContent;
  preListening?: IPreListeningContent;
  postListening?: IPostListeningContent;

  // Speaking lesson
  pronunciation?: {
    sounds?: IPhonemeSound[];
    intonation?: IIntonationPattern;
  };
  conversation?: IConversationScenario;
  topics?: string[];

  // Reading lesson
  passage?: IReadingPassage;
  preReading?: {
    predictions?: string[];
    vocabulary?: IVocabularyWord[];
    context: string;
  };
  postReading?: {
    discussionQuestions?: string[];
    summaryTask?: string;
  };

  // Writing lesson
  writingType?: (typeof WRITING_TYPES)[number];
  instruction?: IWritingInstruction;
  modelText?: IModelText;
  writingFramework?: IWritingFramework;
  rubric?: {
    criteria: IWritingRubricCriterion[];
    totalPoints: number;
  };
  checklist?: string[];

  // Common
  exercises?: IExercise[];
}

// ==================== LESSON DOCUMENT ====================

export interface ILesson extends Document {
  title: string;
  description: string;
  type: (typeof LESSON_TYPES)[number];
  difficulty: (typeof DIFFICULTY_LEVELS)[number];
  content: ILessonContent;
  createdByAI: boolean;
  estimatedTime: number;
  tags: string[];
  isPublished: boolean;
  course?: mongoose.Types.ObjectId;
  teacher?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== SCHEMAS ====================

const VocabularyWordSchema = new Schema<IVocabularyWord>(
  {
    word: { type: String, required: true },
    definition: { type: String, required: true },
    example: { type: String, required: true },
    pronunciation: String,
    partOfSpeech: {
      type: String,
      enum: PARTS_OF_SPEECH,
      required: true,
    },
    synonyms: [String],
    antonyms: [String],
    imageUrl: String,
    audioUrl: String,
    collocations: [String],
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      default: "beginner",
    },
  },
  { _id: false }
);

// Exercise option schema
const ExerciseOptionSchema = new Schema(
  {
    value: { type: String, required: true },
    translate: String,
  },
  { _id: false }
);

// Fill-in-blank schema
const BlankSchema = new Schema(
  {
    position: { type: Number, required: true },
    correctAnswer: { type: String, required: true },
    alternatives: [String],
  },
  { _id: false }
);

// Exercise schema with discriminator
const ExerciseSchema = new Schema(
  {
    type: {
      type: String,
      enum: EXERCISE_TYPES,
      required: true,
    },
    question: { type: String, required: true },
    translation: String,
    points: { type: Number, default: 1 },
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      default: "beginner",
    },
    explanation: String,
    audioUrl: String,
    imageUrl: String,
    // Multiple choice / Single choice specific
    options: [ExerciseOptionSchema],
    correctAnswer: Schema.Types.Mixed, // string for mc/sc, boolean for t/f
    // Fill-in-blank specific
    sentence: String,
    blanks: [BlankSchema],
    hint: String,
    // Translation specific
    correctAnswers: [String],
    hints: [String],
  },
  { _id: false, discriminatorKey: "type" }
);

// Grammar schemas
const GrammarExampleSchema = new Schema(
  {
    sentence: { type: String, required: true },
    translation: { type: String, required: true },
    highlight: String,
    explanation: String,
  },
  { _id: false }
);

const GrammarRuleSchema = new Schema(
  {
    title: { type: String, required: true },
    explanation: { type: String, required: true },
    structure: { type: String, required: true },
    usage: [String],
    examples: [GrammarExampleSchema],
    notes: [String],
    commonMistakes: [String],
    relatedTopics: [String],
  },
  { _id: false }
);

// Listening schemas
const AudioTimestampSchema = new Schema(
  {
    time: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const AudioContentSchema = new Schema(
  {
    text: { type: String, required: true },
    timestamps: [AudioTimestampSchema],
    speed: {
      type: String,
      enum: AUDIO_SPEEDS,
      default: "normal",
    },
    accent: {
      type: String,
      enum: ACCENTS,
    },
  },
  { _id: false }
);

const PreListeningContentSchema = new Schema(
  {
    vocabulary: [VocabularyWordSchema],
    context: { type: String, required: true },
    predictionQuestions: [String],
  },
  { _id: false }
);

const PostListeningContentSchema = new Schema(
  {
    comprehensionQuestions: [ExerciseSchema],
    discussionQuestions: [String],
    summaryTask: String,
  },
  { _id: false }
);

const DialogueTurnSchema = new Schema(
  {
    speaker: { type: String, required: true },
    text: { type: String, required: true },
    audioUrl: String,
  },
  { _id: false }
);

const ConversationScenarioSchema = new Schema(
  {
    scenario: { type: String, required: true },
    dialogues: [DialogueTurnSchema],
    usefulPhrases: [String],
    culturalNotes: [String],
  },
  { _id: false }
);

// Reading schemas
const ReadingAnnotationSchema = new Schema(
  {
    paragraph: { type: Number, required: true },
    note: { type: String, required: true },
    highlightedText: String,
  },
  { _id: false }
);

const ReadingPassageSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    wordCount: { type: Number, required: true },
    readingTime: { type: Number, required: true },
    genre: {
      type: String,
      enum: READING_GENRES,
      required: true,
    },
    images: [String],
    vocabulary: [VocabularyWordSchema],
    source: String,
    author: String,
  },
  { _id: false }
);

// Writing schemas
const WritingInstructionSchema = new Schema(
  {
    prompt: { type: String, required: true },
    requirements: [String],
    audience: String,
    purpose: String,
    tone: String,
  },
  { _id: false }
);

const ModelTextSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    analysis: String,
    highlights: [
      {
        text: String,
        explanation: String,
      },
    ],
  },
  { _id: false }
);

const UsefulPhraseSchema = new Schema(
  {
    category: { type: String, required: true },
    phrases: [String],
    examples: [String],
  },
  { _id: false }
);

const WritingFrameworkSchema = new Schema(
  {
    structure: [String],
    usefulPhrases: [UsefulPhraseSchema],
    grammarPoints: [String],
    vocabularyBank: [String],
  },
  { _id: false }
);

const WritingRubricCriterionSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    maxPoints: { type: Number, required: true },
  },
  { _id: false }
);

// Main Lesson Content Schema
const LessonContentSchema = new Schema(
  {
    // Vocabulary lesson
    vocabulary: [VocabularyWordSchema],
    thematicGroup: String,

    // Grammar lesson
    grammarRule: GrammarRuleSchema,
    visualAids: [String],

    // Listening lesson
    audio: AudioContentSchema,
    preListening: PreListeningContentSchema,

    // Speaking lesson
    conversation: ConversationScenarioSchema,
    topics: [String],

    // Reading lesson
    passage: ReadingPassageSchema,
    preReading: {
      predictions: [String],
      vocabulary: [VocabularyWordSchema],
      context: String,
    },
    postReading: {
      discussionQuestions: [String],
      summaryTask: String,
    },

    // Writing lesson
    writingType: {
      type: String,
      enum: WRITING_TYPES,
    },
    instruction: WritingInstructionSchema,
    modelText: ModelTextSchema,
    writingFramework: WritingFrameworkSchema,
    rubric: {
      criteria: [WritingRubricCriterionSchema],
      totalPoints: Number,
    },
    checklist: [String],

    // Common
    exercises: [ExerciseSchema],
  },
  { _id: false }
);

// Main Lesson Schema
const LessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    type: {
      type: String,
      enum: LESSON_TYPES,
      required: true,
    },
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      required: true,
    },
    content: {
      type: LessonContentSchema,
      required: true,
    },
    createdByAI: {
      type: Boolean,
      default: false,
    },
    estimatedTime: {
      type: Number,
      required: true,
      min: [1, "Estimated time must be at least 1 minute"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
LessonSchema.index({ type: 1, difficulty: 1 });
LessonSchema.index({ tags: 1 });
LessonSchema.index({ isPublished: 1 });
LessonSchema.index({ course: 1 });
LessonSchema.index({ teacher: 1 });

export default mongoose.models.Lesson ||
  mongoose.model<ILesson>("Lesson", LessonSchema);
