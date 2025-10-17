import connectDB from "@/lib/db";
import Course from "@/models/Course";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");

    const course = await Course.findById(id)
      .populate("lessons")
      .populate("enrolledStudents", "name email");

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Verify teacher owns this course
    if (teacherId && course.teacher.toString() !== teacherId) {
      return NextResponse.json(
        { error: "You don't have permission to access this course" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        course,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
