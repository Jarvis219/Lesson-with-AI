import { isRequireTeacher } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const { teacherId, isTeacher } = isRequireTeacher(req);

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

    // Get request body
    const body = await req.json();
    const { name, teacherBio } = body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: "Name cannot be more than 50 characters" },
        { status: 400 }
      );
    }

    if (teacherBio && teacherBio.length > 500) {
      return NextResponse.json(
        { error: "Bio cannot be more than 500 characters" },
        { status: 400 }
      );
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      teacherId,
      {
        name: name.trim(),
        teacherBio: teacherBio?.trim() || "",
      },
      { new: true, select: "-passwordHash" }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      teacherBio: user.teacherBio,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
