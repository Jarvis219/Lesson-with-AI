import { EXERCISE_QUESTION_TYPES } from "@/types";
import mongoose, { Document, Schema } from "mongoose";

export interface IVocabulary {
  word: string;
  definition: string;
  example: string;
  pronunciation?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface IExercise {
  type: "multiple-choice" | "fill-in-the-blank" | "translation" | "true-false";
  points: number;
  question: {
    text: string;
    translate: string;
  };
  options?: {
    value: string;
    translate: string;
  }[];
  correctAnswer: string | string[];
  explanation?: string;
  audioUrl?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface ILesson extends Document {
  title: string;
  description: string;
  type: "vocab" | "grammar" | "listening" | "speaking" | "reading" | "writing";
  level: "beginner" | "intermediate" | "advanced";
  difficulty: "beginner" | "intermediate" | "advanced";
  content: {
    vocabulary?: IVocabulary[];
    exercises?: IExercise[];
    text?: string;
    audioUrl?: string;
    images?: string[];
  };
  createdByAI: boolean;
  estimatedTime: number; // in minutes
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VocabularySchema = new Schema<IVocabulary>({
  word: { type: String, required: true },
  definition: { type: String, required: true },
  example: { type: String, required: true },
  pronunciation: String,
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
});

// Define the option sub-schema
const OptionSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
      description: "Question value",
    },
    translate: {
      type: String,
      required: true,
      description: "Translate to Vietnamese",
    },
  },
  { _id: false }
);

// Define the question sub-schema explicitly to avoid casting issues
const QuestionSchema = new Schema(
  {
    text: { type: String, required: true },
    translate: { type: String, required: true },
  },
  { _id: false }
);

const ExerciseSchema = new Schema<IExercise>({
  type: {
    type: String,
    enum: EXERCISE_QUESTION_TYPES,
    required: true,
  },
  question: { type: QuestionSchema, required: true },
  options: {
    type: [OptionSchema],
    default: undefined,
  },
  correctAnswer: Schema.Types.Mixed,
  explanation: String,
  audioUrl: String,
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  points: {
    type: Number,
    default: 1,
  },
});

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
      enum: ["vocab", "grammar", "listening", "speaking", "reading", "writing"],
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    content: {
      vocabulary: [VocabularySchema],
      exercises: [ExerciseSchema],
      text: String,
      audioUrl: String,
      images: [String],
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
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
LessonSchema.index({ type: 1, level: 1, difficulty: 1 });
LessonSchema.index({ tags: 1 });
LessonSchema.index({ isPublished: 1 });

export default mongoose.models.Lesson ||
  mongoose.model<ILesson>("Lesson", LessonSchema);
