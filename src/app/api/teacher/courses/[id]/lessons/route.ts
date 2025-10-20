import { isRequireTeacher } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// POST - Create a new lesson for a course
export async function POST(
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
    const {
      title,
      description,
      type,
      difficulty,
      content,
      estimatedTime,
      tags,
    } = await request.json();

    // Validation
    if (
      !title ||
      !description ||
      !type ||
      !difficulty ||
      !content ||
      !estimatedTime
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

    // Verify course exists and belongs to teacher
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.teacher.toString() !== teacherId) {
      return NextResponse.json(
        { error: "You don't have permission to add lessons to this course" },
        { status: 403 }
      );
    }

    // Create lesson
    const lesson = new Lesson({
      title,
      description,
      type,
      level: course.level,
      difficulty,
      content,
      estimatedTime,
      tags: tags || [],
      createdByAI: false,
      isPublished: false,
      course: id,
      teacher: teacherId,
    });

    await lesson.save();

    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.save();

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
}

// GET - Get all lessons for a course
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
    const searchParams = await request.nextUrl.searchParams;
    const pageNumber = parseInt(searchParams.get("page") || "1");
    const limitNumber = parseInt(searchParams.get("limit") || "10");

    const [course, lessons, total] = await Promise.all([
      Course.findById(id).populate("enrolledStudents", "name email"),
      Lesson.find({ course: id })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .sort({ createdAt: -1 }),
      Lesson.countDocuments({ course: id }).lean(),
    ]);

    return NextResponse.json(
      {
        course: Object.assign(course, { lessons }),
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          totalPage: Math.ceil(total / limitNumber),
          total,
          hasNextPage: pageNumber < Math.ceil(total / limitNumber),
          hasPreviousPage: pageNumber > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get lessons error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
