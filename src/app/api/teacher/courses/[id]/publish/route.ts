import { isRequireTeacher } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    const { teacherId, isTeacher } = isRequireTeacher(request);

    if (!isTeacher) {
      return NextResponse.json(
        { error: "You are not authorized to access this resource" },
        { status: 403 }
      );
    }

    if (!teacherId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { isPublished } = await request.json();

    const countLessons = await Lesson.countDocuments({
      course: id,
    });

    if (countLessons === 0) {
      return NextResponse.json(
        { error: "Course must have at least one lesson" },
        { status: 400 }
      );
    }

    // Update course status
    await Course.findOneAndUpdate(
      {
        _id: id,
        teacher: teacherId,
      },
      {
        isPublished,
      },
      { new: true }
    );

    return NextResponse.json({
      message: isPublished
        ? "Course published successfully"
        : "Course unpublished successfully",
    });
  } catch (error) {
    console.error("Error updating course status:", error);
    return NextResponse.json(
      { message: "Failed to update course status" },
      { status: 500 }
    );
  }
}
