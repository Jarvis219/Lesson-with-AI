import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Progress from "@/models/Progress";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const lessonId = searchParams.get("lessonId");

    const userProgress = await Progress.findOne({ userId: userPayload.userId })
      .populate({
        path: "lessonProgress.lessonId",
        model: "Lesson",
        select: "title description type difficulty estimatedTime",
      })
      .lean();

    if (!userProgress) {
      return NextResponse.json({
        lessonHistory: [],
        totalCount: 0,
      });
    }

    let lessonHistory = userProgress.lessonProgress;

    // Filter by specific lesson if lessonId is provided
    if (lessonId) {
      lessonHistory = lessonHistory.filter(
        (progress: any) => progress.lessonId.toString() === lessonId
      );
    }

    // Sort by completedAt (most recent first)
    lessonHistory = lessonHistory.sort((a: any, b: any) => {
      const dateA = a.completedAt || a.createdAt || new Date(0);
      const dateB = b.completedAt || b.createdAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    const totalCount = lessonHistory.length;

    // Apply pagination
    const paginatedHistory = lessonHistory.slice(offset, offset + limit);

    // Format the response
    const formattedHistory = paginatedHistory.map((progress: any) => ({
      lessonId: progress.lessonId._id || progress.lessonId,
      lesson: progress.lessonId,
      score: progress.score,
      timeSpent: progress.timeSpent,
      completed: progress.completed,
      completedAt: progress.completedAt,
      attempts: progress.attempts,
      stats: {
        totalQuestionsAnswered: progress.stats.totalQuestionsAnswered,
        totalCorrectAnswers: progress.stats.totalCorrectAnswers,
        totalIncorrectAnswers: progress.stats.totalIncorrectAnswers,
        questionAnswers: progress.stats.questionAnswers || [],
      },
    }));

    return NextResponse.json({
      lessonHistory: formattedHistory,
      totalCount,
      hasMore: offset + limit < totalCount,
    });
  } catch (error) {
    console.error("Get lesson history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
