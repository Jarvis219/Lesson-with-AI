import { isRequireAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import { NextRequest, NextResponse } from "next/server";

// GET - Get course detail for student
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const courseId = params.id;

    // Get course with populated data
    const course = (await Course.findById(courseId)
      .populate("teacher", "name email teacherBio teacherQualification")
      .populate(
        "lessons",
        "_id title description type difficulty estimatedTime"
      )
      .lean()) as any;

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if course is published
    if (!course.isPublished) {
      return NextResponse.json(
        { error: "Course is not available" },
        { status: 403 }
      );
    }

    // Add isEnrolled field
    const courseWithEnrollmentStatus = {
      ...course,
      isEnrolled: course.enrolledStudents.some(
        (studentId: any) => studentId.toString() === userId
      ),
    };

    return NextResponse.json(
      {
        course: courseWithEnrollmentStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get course detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
