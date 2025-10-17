import connectDB from "@/lib/db";
import Course from "@/models/Course";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// GET - Get all courses for the authenticated teacher
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // TODO: Get teacher ID from auth token
    // For now, we'll use a query parameter
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }

    const courses = await Course.find({ teacher: teacherId })
      .populate("lessons")
      .populate("enrolledStudents", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        courses,
        total: courses.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new course
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { title, description, level, category, thumbnail, teacherId } =
      await request.json();

    // Validation
    if (!title || !description || !level || !category || !teacherId) {
      return NextResponse.json(
        {
          error:
            "Title, description, level, category, and teacherId are required",
        },
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

    // Create course
    const course = new Course({
      title,
      description,
      level,
      category,
      thumbnail,
      teacher: teacherId,
      lessons: [],
      enrolledStudents: [],
      isPublished: false,
    });

    await course.save();

    // Update teacher's coursesCreated array
    teacher.coursesCreated = teacher.coursesCreated || [];
    teacher.coursesCreated.push(course._id);
    await teacher.save();

    return NextResponse.json(
      {
        message: "Course created successfully",
        course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
