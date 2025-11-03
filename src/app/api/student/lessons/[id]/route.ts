import { isRequireAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Lesson from "@/models/Lesson";
import { NextRequest, NextResponse } from "next/server";

// GET - Get lesson detail for student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { userId } = isRequireAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: lessonId } = await params;

    // Get lesson with populated course data
    const lesson = (await Lesson.findById(lessonId)
      .populate("course", "title teacher enrolledStudents")
      .populate("teacher", "name email")
      .lean()) as any;

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if lesson is published
    if (!lesson.isPublished) {
      return NextResponse.json(
        { error: "Lesson is not available" },
        { status: 403 }
      );
    }

    // Check if student is enrolled in the course (if lesson belongs to a course)
    if (lesson.course) {
      const isEnrolled = lesson.course.enrolledStudents.some(
        (studentId: any) => studentId.toString() === userId
      );

      if (!isEnrolled) {
        return NextResponse.json(
          { error: "You must be enrolled in the course to access this lesson" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        lesson,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get lesson detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
