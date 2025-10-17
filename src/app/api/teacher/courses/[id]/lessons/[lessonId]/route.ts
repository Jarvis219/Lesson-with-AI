import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// GET - Get single lesson details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    await connectDB();

    const { id, lessonId } = await params;

    // Find lesson and verify it belongs to the course
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Verify lesson belongs to this course
    if (lesson.course?.toString() !== id) {
      return NextResponse.json(
        { error: "Lesson does not belong to this course" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        lesson,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get lesson error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    await connectDB();

    const { id, lessonId } = await params;
    const {
      title,
      description,
      type,
      difficulty,
      content,
      estimatedTime,
      tags,
      teacherId,
    } = await request.json();

    // Validation
    if (
      !title ||
      !description ||
      !type ||
      !difficulty ||
      !content ||
      !estimatedTime ||
      !teacherId
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Verify teacher exists and is approved
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher" || !teacher.isTeacherApproved) {
      return NextResponse.json(
        { error: "Teacher not found or not approved" },
        { status: 403 }
      );
    }

    // Find lesson and verify ownership
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Verify lesson belongs to this course
    if (lesson.course?.toString() !== id) {
      return NextResponse.json(
        { error: "Lesson does not belong to this course" },
        { status: 403 }
      );
    }

    // Verify lesson belongs to this teacher
    if (lesson.teacher?.toString() !== teacherId) {
      return NextResponse.json(
        { error: "You don't have permission to update this lesson" },
        { status: 403 }
      );
    }

    // Update lesson
    lesson.title = title;
    lesson.description = description;
    lesson.type = type;
    lesson.difficulty = difficulty;
    lesson.content = content;
    lesson.estimatedTime = estimatedTime;
    lesson.tags = tags || [];

    await lesson.save();

    return NextResponse.json(
      {
        message: "Lesson updated successfully",
        lesson,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update lesson error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    await connectDB();

    const { id, lessonId } = await params;
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }

    // Find lesson and verify ownership
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Verify lesson belongs to this course
    if (lesson.course?.toString() !== id) {
      return NextResponse.json(
        { error: "Lesson does not belong to this course" },
        { status: 403 }
      );
    }

    // Verify lesson belongs to this teacher
    if (lesson.teacher?.toString() !== teacherId) {
      return NextResponse.json(
        { error: "You don't have permission to delete this lesson" },
        { status: 403 }
      );
    }

    // Remove lesson from course
    const course = await Course.findById(id);
    if (course) {
      course.lessons = course.lessons.filter(
        (l: mongoose.Types.ObjectId) => l.toString() !== lessonId
      );
      await course.save();
    }

    // Delete lesson
    await lesson.deleteOne();

    return NextResponse.json(
      {
        message: "Lesson deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete lesson error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
