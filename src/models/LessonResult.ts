import mongoose, { Document, Schema } from "mongoose";

export interface IQuestionResult {
  questionId: string;
  question: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  questionType: string;
  explanation?: string;
}

export interface ILessonFeedback {
  strengths: string[];
  improvements: string[];
  nextLessonSuggestions: string[];
  motivationalMessage: string;
  detailedAnalysis?: {
    weakAreas: string[];
    strongAreas: string[];
    specificMistakes: Array<{
      question: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
    }>;
  };
}

export interface ILessonResult extends Document {
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  questionResults: IQuestionResult[];
  feedback?: ILessonFeedback;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionResultSchema = new Schema<IQuestionResult>({
  questionId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  userAnswer: {
    type: Schema.Types.Mixed,
    required: true,
  },
  correctAnswer: {
    type: Schema.Types.Mixed,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
  },
});

const LessonFeedbackSchema = new Schema<ILessonFeedback>({
  strengths: [String],
  improvements: [String],
  nextLessonSuggestions: [String],
  motivationalMessage: String,
  detailedAnalysis: {
    weakAreas: [String],
    strongAreas: [String],
    specificMistakes: [
      {
        question: String,
        userAnswer: String,
        correctAnswer: String,
        explanation: String,
      },
    ],
  },
});

const LessonResultSchema = new Schema<ILessonResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 0,
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0,
    },
    timeSpent: {
      type: Number,
      required: true,
      min: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    questionResults: [QuestionResultSchema],
    feedback: LessonFeedbackSchema,
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
LessonResultSchema.index({ userId: 1, lessonId: 1 });
LessonResultSchema.index({ userId: 1, completedAt: -1 });

export default mongoose.models.LessonResult ||
  mongoose.model<ILessonResult>("LessonResult", LessonResultSchema);
