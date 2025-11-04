import { isRequireAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Lesson from "@/models/Lesson";
import Progress from "@/models/Progress";
import { NextRequest, NextResponse } from "next/server";

// GET - Get lesson history for the authenticated student
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { userId } = isRequireAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const lessonId = searchParams.get("lessonId") || undefined;
    const isCompletedParam = searchParams.get("isCompleted");
    const isCompleted =
      isCompletedParam !== null ? isCompletedParam === "true" : undefined;

    // Get user's progress
    const progress = await Progress.findOne({ userId });

    if (
      !progress ||
      !progress.lessonProgress ||
      progress.lessonProgress.length === 0
    ) {
      return NextResponse.json({
        lessonHistory: [],
        totalCount: 0,
        hasMore: false,
      });
    }

    // Filter lesson progress
    let filteredProgress = progress.lessonProgress.filter((lp: any) => {
      // Only include completed lessons with a completedAt date
      if (!lp.completedAt) return false;

      // Filter by isCompleted if provided
      if (isCompleted !== undefined) {
        if (isCompleted === true && !lp.completed) {
          return false;
        }
        if (isCompleted === false && lp.completed) {
          return false;
        }
      }

      // Filter by lessonId if provided
      if (lessonId) {
        return lp.lessonId.toString() === lessonId;
      }

      return true;
    });

    // Sort by completedAt descending (most recent first)
    filteredProgress.sort((a: any, b: any) => {
      const dateA = new Date(a.completedAt || 0).getTime();
      const dateB = new Date(b.completedAt || 0).getTime();
      return dateB - dateA;
    });

    const totalCount = filteredProgress.length;

    // Apply pagination
    const paginatedProgress = filteredProgress.slice(offset, offset + limit);
    const hasMore = offset + limit < totalCount;

    // Get all unique lesson IDs
    const lessonIds = paginatedProgress.map((lp: any) =>
      lp.lessonId.toString()
    );

    // Populate lesson details
    const lessons = await Lesson.find({ _id: { $in: lessonIds } })
      .select("_id title description type difficulty estimatedTime")
      .lean();

    // Create a map for quick lookup
    const lessonMap = new Map(
      lessons.map((lesson: any) => [lesson._id.toString(), lesson])
    );

    // Format the response to match LessonHistoryItem interface
    const lessonHistory = paginatedProgress.map((lp: any) => {
      const lesson = lessonMap.get(lp.lessonId.toString());

      return {
        lessonId: lp.lessonId.toString(),
        lesson: lesson
          ? {
              _id: lesson._id.toString(),
              title: lesson.title || "Unknown Lesson",
              description: lesson.description || "",
              type: lesson.type || "unknown",
              difficulty: lesson.difficulty || "beginner",
              estimatedTime: lesson.estimatedTime || 0,
            }
          : {
              _id: lp.lessonId.toString(),
              title: "Unknown Lesson",
              description: "",
              type: "unknown",
              difficulty: "beginner",
              estimatedTime: 0,
            },
        score: lp.score || 0,
        timeSpent: lp.timeSpent || 0, // Already in minutes from Progress model
        completed: lp.completed || false,
        completedAt: lp.completedAt
          ? new Date(lp.completedAt).toISOString()
          : new Date().toISOString(),
        attempts: lp.attempts || 1,
        stats: {
          totalQuestionsAnswered: lp.stats?.totalQuestionsAnswered || 0,
          totalCorrectAnswers: lp.stats?.totalCorrectAnswers || 0,
          totalIncorrectAnswers: lp.stats?.totalIncorrectAnswers || 0,
          questionAnswers:
            lp.stats?.questionAnswers?.map((qa: any) => ({
              question: qa.question || "",
              userAnswer: qa.userAnswer,
              correctAnswer: qa.correctAnswer,
              isCorrect: qa.isCorrect || false,
              explanation: qa.explanation,
            })) || [],
        },
      };
    });

    return NextResponse.json({
      lessonHistory,
      totalCount,
      hasMore,
    });
  } catch (error) {
    console.error("Get lesson history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
