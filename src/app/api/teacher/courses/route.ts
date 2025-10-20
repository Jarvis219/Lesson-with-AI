import { isRequireTeacher } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// GET - Get all courses for the authenticated teacher
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const [courses, total] = await Promise.all([
      Course.find({ teacher: teacherId })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("enrolledStudents", "name email")
        .sort({ createdAt: -1 })
        .lean(),
      Course.countDocuments({ teacher: teacherId }).lean(),
    ]);

    return NextResponse.json(
      {
        courses,
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

    const { title, description, level, category, thumbnail } =
      await request.json();

    // Validation
    if (!title || !description || !level || !category) {
      return NextResponse.json(
        {
          error: "Title, description, level, category are required",
        },
        { status: 400 }
      );
    }

    // Verify teacher exists and is approved
    const teacher = await User.findById(teacherId);

    if (!teacher.isTeacherApproved) {
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
