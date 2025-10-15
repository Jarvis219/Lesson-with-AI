import { AILessonPlanRequest, generateLessonPlan } from "@/lib/ai";
import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Lesson from "@/models/Lesson";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("AI Lesson Plan Generation - Starting...");
  try {
    await connectDB();

    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { prompt, level, duration, focus, numberOfQuestions } =
      await request.json();

    // Validation
    if (!prompt || !level || !duration) {
      return NextResponse.json(
        { error: "Prompt, level, and duration are required" },
        { status: 400 }
      );
    }

    if (!["beginner", "intermediate", "advanced"].includes(level)) {
      return NextResponse.json(
        { error: "Level must be beginner, intermediate, or advanced" },
        { status: 400 }
      );
    }

    if (duration < 5 || duration > 120) {
      return NextResponse.json(
        { error: "Duration must be between 5 and 120 minutes" },
        { status: 400 }
      );
    }

    console.log("AI Lesson Plan Generation - Generating lesson...");

    // Generate lesson plan using AI
    const aiRequest: AILessonPlanRequest = {
      prompt,
      level,
      duration,
      focus,
    };

    const result = await generateLessonPlan(aiRequest, numberOfQuestions);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to generate lesson plan" },
        { status: 500 }
      );
    }

    // Map AI output to Lesson model format
    const type = result.type;

    // Map questions to exercises format
    const exercises = result.questions.map((question) => ({
      type: question.type,
      question: question.question,
      options: question.options || [],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
      difficulty: result.difficulty,
      points: question.points,
    }));

    console.log("AI Lesson Plan Generation - Creating lesson in database...");

    // Create lesson directly in database
    const lesson = new Lesson({
      title: result.title,
      description: result.description,
      type,
      level: result.difficulty,
      difficulty: result.difficulty,
      content: {
        text: result.content,
        exercises: exercises,
      },
      estimatedTime: result.estimatedTime,
      tags: focus || [],
      createdByAI: true,
      isPublished: true,
    });

    await lesson.save();
    console.log(
      "AI Lesson Plan Generation - Lesson saved successfully:",
      lesson._id
    );

    return NextResponse.json({
      message: "Lesson plan generated successfully",
      lesson: result,
    });
  } catch (error) {
    console.error("Lesson plan generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate lesson plan" },
      { status: 500 }
    );
  }
}
