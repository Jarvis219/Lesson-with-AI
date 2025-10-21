import { isRequireAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import { NextRequest, NextResponse } from "next/server";

// GET - Get all published courses (available courses)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { userId } = isRequireAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const level = searchParams.get("level") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build query
    const query: any = { isPublished: true };

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add category filter
    if (category && category !== "all") {
      query.category = category;
    }

    // Add level filter
    if (level && level !== "all") {
      query.level = level;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get courses with pagination
    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate("teacher", "name email")
        .populate("lessons", "_id title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(query),
    ]);

    // Add isEnrolled field to each course
    const coursesWithEnrollmentStatus = courses.map((course) => ({
      ...course,
      isEnrolled: course.enrolledStudents.some(
        (studentId: string) => studentId.toString() === userId
      ),
    }));

    // Calculate pagination
    const totalPage = Math.ceil(total / limit);
    const hasNextPage = page < totalPage;
    const hasPreviousPage = page > 1;

    return NextResponse.json(
      {
        courses: coursesWithEnrollmentStatus,
        pagination: {
          page,
          limit,
          total,
          totalPage,
          hasNextPage,
          hasPreviousPage,
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
