import { isRequireAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// POST - Enroll in a course
export async function POST(
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

    const { id } = await params;

    // Get course
    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if course is published
    if (!course.isPublished) {
      return NextResponse.json(
        { error: "Course is not available for enrollment" },
        { status: 403 }
      );
    }

    // Check if student is already enrolled
    const isEnrolled = course.enrolledStudents.some(
      (studentId: string) => studentId === userId
    );

    if (isEnrolled) {
      return NextResponse.json(
        { error: "You are already enrolled in this course" },
        { status: 400 }
      );
    }

    // Enroll student
    course.enrolledStudents.push(userId);
    await course.save();

    // Update user's enrolled courses
    const user = await User.findById(userId);
    if (user) {
      user.enrolledCourses = user.enrolledCourses || [];
      user.enrolledCourses.push(course._id);
      await user.save();
    }

    return NextResponse.json(
      {
        message: "Successfully enrolled in course",
        course,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Enroll in course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
