import { generateLessonContent } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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
}
