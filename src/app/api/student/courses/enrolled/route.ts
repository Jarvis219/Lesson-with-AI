import { isRequireAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import { NextRequest, NextResponse } from "next/server";

// GET - Get enrolled courses for the current student
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
    const query: any = {
      isPublished: true,
      enrolledStudents: userId,
    };

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

    // Get enrolled courses with pagination
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

    // Calculate pagination
    const totalPage = Math.ceil(total / limit);
    const hasNextPage = page < totalPage;
    const hasPreviousPage = page > 1;

    return NextResponse.json(
      {
        courses,
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
    console.error("Get enrolled courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
