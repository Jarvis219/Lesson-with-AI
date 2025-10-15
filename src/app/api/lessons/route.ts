import { requireAdmin } from "@/lib/auth";
import connectDB from "@/lib/db";
import Lesson from "@/models/Lesson";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("GET------------------------");
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");
    const skill = searchParams.get("skill");
    const level = searchParams.get("level");
    const difficulty = searchParams.get("difficulty");
    const tags = searchParams.get("tags");
    const search = searchParams.get("search");

    // Build filter object
    const filter: any = { isPublished: true };

    if (type) filter.type = type;
    if (skill) filter.type = skill; // skill maps to type field
    if (level) filter.level = level;
    if (difficulty) filter.difficulty = difficulty;
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagArray };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get lessons with pagination
    const lessons = await Lesson.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Lesson.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      lessons,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Get lessons error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(async (request: NextRequest) => {
  console.log("test----------");

  try {
    await connectDB();

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

    // Map AI output to Lesson model format
    // Convert skill to type (they are the same in our case)
    const type = skill;

    // Map difficulty from AI output to model format
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
    }));

    // Create new lesson
    const lesson = new Lesson({
      title,
      description,
      type,
      level:
        levelMapping[difficulty as keyof typeof levelMapping] || "beginner",
      difficulty,
      content: {
        text: content,
        exercises: exercises,
      },
      estimatedTime,
      tags,
      createdByAI: false, // Mark as AI generated
      isPublished: true,
    });

    await lesson.save();

    return NextResponse.json(
      {
        message: "Lesson created successfully",
        lesson,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create lesson error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
