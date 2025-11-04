import { generateLessonContent } from "@/lib/ai";
import { requireTeacher } from "@/lib/auth";
import connectDB from "@/lib/db";
import Billing from "@/models/Billing";
import { NextRequest, NextResponse } from "next/server";

export const POST = requireTeacher(async (request: NextRequest, ctx: any) => {
  try {
    await connectDB();
    const teacherId = ctx.user.userId;

    // Check credits or pro
    const billing = await Billing.findOne({ userId: teacherId });
    if (!billing || (!billing.isPro && (billing.remainingCredits ?? 0) <= 0)) {
      return NextResponse.json(
        { error: "Insufficient credits or pro subscription required" },
        { status: 402 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      difficulty,
      estimatedTime,
      topic,
      focusAreas,
      numberOfExercises,
    } = body;

    console.log(
      "--------------------------------------------------->>>>>>>>>>>>>",
      title,
      description,
      type,
      difficulty,
      estimatedTime,
      topic,
      focusAreas,
      numberOfExercises
    );

    // Validation
    if (!type || !difficulty || !estimatedTime) {
      return NextResponse.json(
        { error: "Missing required fields: type, difficulty, estimatedTime" },
        { status: 400 }
      );
    }

    // Generate lesson using AI
    const lessonData = await generateLessonContent({
      title,
      description,
      type,
      difficulty,
      estimatedTime,
      topic,
      focusAreas,
      numberOfExercises,
    });

    // Consume 1 credit if not pro
    if (!billing.isPro) {
      await Billing.updateOne(
        { userId: teacherId },
        { $inc: { remainingCredits: -1 } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        lesson: lessonData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("AI lesson generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate lesson content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});
