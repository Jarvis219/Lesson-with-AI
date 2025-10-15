import { AILessonPlanRequest, generateLessonPlan } from "@/lib/ai";
import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Lesson from "@/models/Lesson";
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

    const { level, focus, duration, topics, prompt } = await request.json();

    // Validation
    if (!level || !focus || !duration) {
      return NextResponse.json(
        { error: "Level, focus, and duration are required" },
        { status: 400 }
      );
    }

    // Generate lesson plan using AI
    const aiRequest: AILessonPlanRequest = {
      level,
      focus,
      duration,
      prompt,
      // topics,
    };

    const aiResponse = await generateLessonPlan(aiRequest, 10);

    if (!aiResponse) {
      return NextResponse.json(
        { error: "Failed to generate lesson plan" },
        { status: 500 }
      );
    }

    // Create lesson from AI response
    const lesson = new Lesson({
      title: aiResponse.title,
      description: aiResponse.description,
      type: focus.includes("vocabulary")
        ? "vocab"
        : focus.includes("grammar")
        ? "grammar"
        : focus.includes("speaking")
        ? "speaking"
        : focus.includes("listening")
        ? "listening"
        : focus.includes("reading")
        ? "reading"
        : focus.includes("writing")
        ? "writing"
        : "vocab",
      level,
      difficulty:
        level === "beginner"
          ? "easy"
          : level === "intermediate"
          ? "medium"
          : "hard",
      content: {
        vocabulary: aiResponse.content.text,
        exercises: aiResponse.content.exercises,
      },
      estimatedTime: aiResponse.estimatedTime,
      tags: topics || [focus],
      createdByAI: true,
      isPublished: true,
    });

    await lesson.save();

    return NextResponse.json(
      {
        message: "AI lesson created successfully",
        lesson,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create AI lesson error:", error);
    return NextResponse.json(
      { error: "Failed to create AI lesson" },
      { status: 500 }
    );
  }
}
