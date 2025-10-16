import { getUserFromRequest, requireAdmin } from "@/lib/auth";
import connectDB from "@/lib/db";
import Lesson, { IExercise } from "@/models/Lesson";
import Progress, {
  ILessonProgress,
  ILessonProgressStats,
} from "@/models/Progress";
import { NextRequest, NextResponse } from "next/server";

interface UserProgressData {
  lessonProgress: ILessonProgress[];
  lessonsCompleted: string[];
}

interface LessonProgressInfo {
  score: number;
  timeSpent: number;
  completed: boolean;
  completedAt?: Date;
  attempts: number;
  stats: ILessonProgressStats;
}

interface LessonFilter {
  isPublished: boolean;
  type?: string;
  level?: string;
  difficulty?: string;
  tags?: { $in: string[] };
  $or?: Array<{
    [key: string]: { $regex: string; $options: string } | string;
  }>;
}

interface LessonWithProgress {
  _id: string;
  title: string;
  description: string;
  type: string;
  level: string;
  difficulty: string;
  content: {
    vocabulary?: any[];
    exercises?: IExercise[];
    text?: string;
    audioUrl?: string;
    images?: string[];
  };
  createdByAI: boolean;
  estimatedTime: number;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  progress: LessonProgressInfo;
  isCompleted: boolean;
}

interface CreateLessonRequest {
  title: string;
  description: string;
  content: string;
  difficulty: string;
  skill: string;
  estimatedTime: number;
  questions?: IExercise[];
  tags?: string[];
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");
    const skill = searchParams.get("skill");
    const level = searchParams.get("level");
    const difficulty = searchParams.get("difficulty");
    const tags = searchParams.get("tags");
    const search = searchParams.get("search");

    // Get current user if authenticated
    const user = getUserFromRequest(request);

    // Build filter object
    const filter: LessonFilter = { isPublished: true };

    if (type) filter.type = type;
    if (skill) filter.type = skill; // skill maps to type field
    if (level) filter.level = level;
    if (difficulty) filter.difficulty = difficulty;
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagArray };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get lessons with pagination
    const lessons = await Lesson.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get user progress if authenticated
    let userProgress: UserProgressData | null = null;
    if (user) {
      const progressData = (await Progress.findOne({ userId: user.userId })
        .select("lessonProgress lessonsCompleted")
        .lean()) as any;

      if (progressData) {
        userProgress = {
          lessonProgress: progressData.lessonProgress || [],
          lessonsCompleted: (progressData.lessonsCompleted || []).map(
            (id: any) => id.toString()
          ),
        };
      }
    }

    // Default progress values
    const defaultProgress: LessonProgressInfo = {
      score: 0,
      timeSpent: 0,
      completed: false,
      attempts: 0,
      stats: {
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
      },
    };

    // Map lessons with progress information
    const lessonsWithProgress: LessonWithProgress[] = (lessons as any[]).map(
      (lesson) => {
        // Find progress for this lesson
        const lessonProgress = userProgress?.lessonProgress?.find(
          (progress) => progress.lessonId.toString() === lesson._id.toString()
        );

        // Check if lesson is completed
        const isCompleted =
          userProgress?.lessonsCompleted?.includes(lesson._id.toString()) ||
          false;

        // Return lesson with progress or default values
        return {
          ...lesson,
          progress: lessonProgress
            ? {
                score: lessonProgress.score,
                timeSpent: lessonProgress.timeSpent,
                completed: lessonProgress.completed,
                completedAt: lessonProgress.completedAt,
                attempts: lessonProgress.attempts,
                stats: lessonProgress.stats,
              }
            : defaultProgress,
          isCompleted,
        };
      }
    );

    // Get total count for pagination
    const total = await Lesson.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      lessons: lessonsWithProgress,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Get lessons error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(async (request: NextRequest) => {
  console.log("test----------");

  try {
    await connectDB();

    const {
      title,
      description,
      content,
      difficulty,
      skill,
      estimatedTime,
      questions = [],
      tags = [],
    }: CreateLessonRequest = await request.json();

    // Validation
    if (
      !title ||
      !description ||
      !content ||
      !difficulty ||
      !skill ||
      !estimatedTime
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Map AI output to Lesson model format
    // Convert skill to type (they are the same in our case)
    const type = skill;

    // Map difficulty from AI output to model format
    const levelMapping = {
      beginner: "beginner",
      intermediate: "intermediate",
      advanced: "advanced",
    };

    // Map questions to exercises format
    const exercises = questions.map((question) => ({
      type: question.type,
      question: question.question,
      options: question.options || [],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
      difficulty,
      points: question.points || 1,
    }));

    // Create new lesson
    const lesson = new Lesson({
      title,
      description,
      type,
      level:
        levelMapping[difficulty as keyof typeof levelMapping] || "beginner",
      difficulty,
      content: {
        text: content,
        exercises: exercises,
      },
      estimatedTime,
      tags,
      createdByAI: false, // Mark as AI generated
      isPublished: true,
    });

    await lesson.save();

    return NextResponse.json(
      {
        message: "Lesson created successfully",
        lesson,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create lesson error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
