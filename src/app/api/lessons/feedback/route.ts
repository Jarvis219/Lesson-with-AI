import { generateLessonFeedback } from "@/lib/ai";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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
