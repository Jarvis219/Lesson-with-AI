import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { userId, approved } = await request.json();

    if (!userId || typeof approved !== "boolean") {
      return NextResponse.json(
        { error: "User ID and approval status are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "teacher") {
      return NextResponse.json(
        { error: "User is not a teacher" },
        { status: 400 }
      );
    }

    user.isTeacherApproved = approved;
    await user.save();

    return NextResponse.json(
      {
        message: approved
          ? "Teacher approved successfully"
          : "Teacher approval revoked",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isTeacherApproved: user.isTeacherApproved,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Teacher approval error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
