import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import LessonResult from "@/models/LessonResult";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await connectDB();

    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const lessonId = id;

    // Find lesson result for this user and lesson
    const result = await LessonResult.findOne({
      userId: userPayload.userId,
      lessonId: lessonId,
    }).populate("lessonId");

    if (!result) {
      return NextResponse.json(
        { error: "Lesson result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      result: {
        _id: result._id,
        userId: result.userId,
        lessonId: result.lessonId,
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        timeSpent: result.timeSpent,
        completedAt: result.completedAt,
        questionResults: result.questionResults,
        feedback: result.feedback,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get lesson result error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
