import { isRequireTeacher } from "@/lib/auth";
import connectDB from "@/lib/db";
import Lesson from "@/models/Lesson";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // First get the course info
    const Course = (await import("@/models/Course")).default;
    const courseInfo = await Course.findById(id);

    if (!courseInfo) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get paginated lessons
    const lessons = await Lesson.find({ course: id })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Lesson.countDocuments({ course: id });

    return NextResponse.json(
      {
        course: {
          ...courseInfo.toObject(),
          lessons,
        },
        pagination: {
          page,
          limit,
          totalPage: Math.ceil(total / limit),
          total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        },
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
