import mongoose, { Document, Schema } from "mongoose";

export interface IScore {
  skill: "vocab" | "grammar" | "listening" | "speaking" | "reading" | "writing";
  score: number; // 0-100
  lastUpdated: Date;
}

export interface IQuestionAnswer {
  questionId?: string;
  question: string;
  questionType: string;
  userAnswer: string | string[] | boolean;
  correctAnswer: string | string[] | boolean;
  isCorrect: boolean;
  explanation?: string;
  points: number;
  difficulty: string;
  answeredAt: Date;
}

export interface ILessonProgressStats {
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  questionAnswers: IQuestionAnswer[];
}

export interface ILessonProgress {
  lessonId: mongoose.Types.ObjectId;
  completed: boolean;
  score: number;
  timeSpent: number; // in minutes
  completedAt?: Date;
  attempts: number;
  stats: ILessonProgressStats;
}

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  lessonsCompleted: mongoose.Types.ObjectId[];
  streak: number;
  totalTimeSpent: number; // in minutes
  scores: IScore[];
  lessonProgress: ILessonProgress[];
  achievements: string[];
  lastLogin: Date;
  weeklyGoal: number; // lessons per week
  weeklyProgress: number; // current week's lessons completed
  createdAt: Date;
  updatedAt: Date;
}

const QuestionAnswerSchema = new Schema<IQuestionAnswer>({
  questionId: String,
  question: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
  },
  userAnswer: Schema.Types.Mixed,
  correctAnswer: Schema.Types.Mixed,
  isCorrect: {
    type: Boolean,
    required: true,
  },
  explanation: String,
  points: {
    type: Number,
    default: 1,
  },
  difficulty: {
    type: String,
    required: true,
  },
  answeredAt: {
    type: Date,
    default: Date.now,
  },
});

const LessonProgressStatsSchema = new Schema<ILessonProgressStats>({
  totalQuestionsAnswered: {
    type: Number,
    default: 0,
  },
  totalCorrectAnswers: {
    type: Number,
    default: 0,
  },
  totalIncorrectAnswers: {
    type: Number,
    default: 0,
  },
  questionAnswers: [QuestionAnswerSchema],
});

const ScoreSchema = new Schema<IScore>({
  skill: {
    type: String,
    enum: ["vocab", "grammar", "listening", "speaking", "reading", "writing"],
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const LessonProgressSchema = new Schema<ILessonProgress>({
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  stats: LessonProgressStatsSchema,
  completed: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0,
  },
  completedAt: Date,
  attempts: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const ProgressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    lessonsCompleted: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTimeSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    scores: [ScoreSchema],
    lessonProgress: [LessonProgressSchema],
    achievements: [String],
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    weeklyGoal: {
      type: Number,
      default: 5,
      min: 1,
      max: 20,
    },
    weeklyProgress: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ProgressSchema.index({ userId: 1 });
ProgressSchema.index({ lastLogin: 1 });

// Virtual for total lessons completed
ProgressSchema.virtual("totalLessonsCompleted").get(function () {
  return this.lessonsCompleted.length;
});

// Method to update score for a skill
ProgressSchema.methods.updateScore = function (
  skill: string,
  newScore: number
) {
  const existingScore = this.scores.find(
    (score: IScore) => score.skill === skill
  );

  if (existingScore) {
    existingScore.score = newScore;
    existingScore.lastUpdated = new Date();
  } else {
    this.scores.push({
      skill: skill as any,
      score: newScore,
      lastUpdated: new Date(),
    });
  }

  return this.save();
};

// Method to add lesson progress
ProgressSchema.methods.addLessonProgress = function (
  lessonId: string,
  score: number,
  timeSpent: number,
  stats?: ILessonProgressStats
) {
  const existingProgress = this.lessonProgress.find(
    (progress: ILessonProgress) => progress.lessonId.toString() === lessonId
  );

  if (existingProgress) {
    existingProgress.score = Math.max(existingProgress.score, score);
    existingProgress.timeSpent += timeSpent;
    existingProgress.attempts += 1;
    if (score >= 70) {
      existingProgress.completed = true;
      existingProgress.completedAt = new Date();
    }
    if (stats) {
      // Merge question answers instead of replacing
      if (stats.questionAnswers && stats.questionAnswers.length > 0) {
        existingProgress.stats.questionAnswers = stats.questionAnswers;
      }
      existingProgress.stats.totalQuestionsAnswered =
        stats.totalQuestionsAnswered;
      existingProgress.stats.totalCorrectAnswers = stats.totalCorrectAnswers;
      existingProgress.stats.totalIncorrectAnswers =
        stats.totalIncorrectAnswers;
    }
  } else {
    this.lessonProgress.push({
      lessonId: new mongoose.Types.ObjectId(lessonId),
      score,
      timeSpent,
      completed: score >= 70,
      completedAt: score >= 70 ? new Date() : undefined,
      attempts: 1,
      stats: stats || {
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
        questionAnswers: [],
      },
    });
  }

  if (score >= 70 && !this.lessonsCompleted.includes(lessonId)) {
    this.lessonsCompleted.push(lessonId);
  }

  return this.save();
};

// Method to add lesson progress stats
ProgressSchema.methods.addLessonProgressStats = function (
  lessonId: string,
  stats: ILessonProgressStats
) {
  const existingProgress = this.lessonProgress.find(
    (progress: ILessonProgress) => progress.lessonId.toString() === lessonId
  );

  if (existingProgress) {
    existingProgress.stats = stats;
  } else {
    this.lessonProgress.push({
      lessonId: new mongoose.Types.ObjectId(lessonId),
      score: 0,
      timeSpent: 0,
      completed: false,
      attempts: 1,
      stats,
    });
  }

  return this.save();
};

// Method to add section progress
ProgressSchema.methods.addSectionProgress = function (
  lessonId: string,
  sectionId: string,
  score: number,
  timeSpent: number,
  stats: ILessonProgressStats
) {
  let existingProgress = this.lessonProgress.find(
    (progress: ILessonProgress) => progress.lessonId.toString() === lessonId
  );

  if (!existingProgress) {
    // Create new lesson progress if it doesn't exist
    existingProgress = {
      lessonId: new mongoose.Types.ObjectId(lessonId),
      score: 0,
      timeSpent: 0,
      completed: false,
      attempts: 1,
      stats: {
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
        questionAnswers: [],
      },
    };
    this.lessonProgress.push(existingProgress);
  }

  // Update overall lesson progress
  existingProgress.timeSpent += timeSpent;

  // Merge question answers
  if (stats.questionAnswers && stats.questionAnswers.length > 0) {
    existingProgress.stats.questionAnswers.push(...stats.questionAnswers);
    existingProgress.stats.totalQuestionsAnswered +=
      stats.totalQuestionsAnswered;
    existingProgress.stats.totalCorrectAnswers += stats.totalCorrectAnswers;
    existingProgress.stats.totalIncorrectAnswers += stats.totalIncorrectAnswers;
  }

  // Recalculate overall score for this lesson
  const totalQuestions = existingProgress.stats.totalQuestionsAnswered;
  const correctAnswers = existingProgress.stats.totalCorrectAnswers;
  existingProgress.score =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  // Mark as completed if score is good enough
  if (existingProgress.score >= 70) {
    existingProgress.completed = true;
    existingProgress.completedAt = new Date();
  }

  return this.save();
};

export default mongoose.models.Progress ||
  mongoose.model<IProgress>("Progress", ProgressSchema);
