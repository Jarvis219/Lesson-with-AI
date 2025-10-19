import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { isPublished } = await request.json();

    // Update course status
    await Course.findOneAndUpdate(
      {
        _id: id,
        teacher: userPayload.userId,
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
