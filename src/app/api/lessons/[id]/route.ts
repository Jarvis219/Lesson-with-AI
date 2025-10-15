import { getUserFromRequest, requireAdmin } from "@/lib/auth";
import connectDB from "@/lib/db";
import Lesson from "@/models/Lesson";
import Progress from "@/models/Progress";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const userPayload = getUserFromRequest(request);

    // Find lesson
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (!lesson.isPublished) {
      return NextResponse.json(
        { error: "Lesson not available" },
        { status: 404 }
      );
    }

    // Get user's progress for this lesson if authenticated
    let userProgress = null;
    if (userPayload) {
      const userProgressData = await Progress.findOne({
        userId: userPayload.userId,
      });
      if (userProgressData) {
        userProgress = userProgressData.lessonProgress.find(
          (progress: any) => progress.lessonId.toString() === id
        );
      }
    }

    return NextResponse.json({
      lesson: {
        ...lesson.toObject(),
        userProgress,
      },
    });
  } catch (error) {
    console.error("Get lesson error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const PUT = requireAdmin(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      await connectDB();

      const { id } = await params;
      const {
        title,
        description,
        content,
        difficulty,
        skill,
        estimatedTime,
        questions = [],
        tags = [],
      } = await request.json();

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

      // Find lesson
      const lesson = await Lesson.findById(id);
      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson not found" },
          { status: 404 }
        );
      }

      // Map skill to type (they are the same in our case)
      const type = skill;

      // Map difficulty from request to model format
      const levelMapping = {
        beginner: "beginner",
        intermediate: "intermediate",
        advanced: "advanced",
      };

      // Map questions to exercises format
      const exercises = questions.map((question: any) => ({
        type: question.type,
        question: question.question,
        options: question.options || [],
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || "",
        difficulty,
        points: question.points || 1,
      }));

      // Update lesson fields
      lesson.title = title;
      lesson.description = description;
      lesson.type = type;
      lesson.level =
        levelMapping[difficulty as keyof typeof levelMapping] || "beginner";
      lesson.difficulty = difficulty;
      lesson.content = {
        text: content,
        exercises: exercises,
      };
      lesson.estimatedTime = estimatedTime;
      lesson.tags = tags;

      await lesson.save();

      return NextResponse.json({
        message: "Lesson updated successfully",
        lesson,
      });
    } catch (error) {
      console.error("Update lesson error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);

export const DELETE = requireAdmin(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      await connectDB();

      const { id } = await params;

      // Find and delete lesson
      const lesson = await Lesson.findById(id);
      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson not found" },
          { status: 404 }
        );
      }

      await Lesson.findByIdAndDelete(id);

      return NextResponse.json({
        message: "Lesson deleted successfully",
      });
    } catch (error) {
      console.error("Delete lesson error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);
