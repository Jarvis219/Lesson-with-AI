import { generateLessonFeedback } from "@/lib/ai";
import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import LessonResult from "@/models/LessonResult";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const {
      lessonType,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      userLevel,
      questions,
      lessonId,
    } = await request.json();

    // Validation
    if (
      !lessonType ||
      score === undefined ||
      totalQuestions === undefined ||
      correctAnswers === undefined ||
      timeSpent === undefined ||
      userLevel === undefined ||
      questions === undefined
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Generate AI feedback
    const feedback = await generateLessonFeedback({
      lessonType,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      userLevel,
      questions,
    });

    // Save feedback to database if lessonId is provided
    if (lessonId) {
      const existingResult = await LessonResult.findOne({
        userId: userPayload.userId,
        lessonId: lessonId,
      });

      if (existingResult) {
        existingResult.feedback = feedback;
        await existingResult.save();
      }
    }

    return NextResponse.json({
      feedback,
    });
  } catch (error) {
    console.error("Generate feedback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
