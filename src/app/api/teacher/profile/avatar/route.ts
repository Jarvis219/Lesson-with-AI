import { isRequireTeacher } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(req: NextRequest) {
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

    // Get form data
    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Get user to check for existing avatar
    const user = await User.findById(teacherId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete old avatar if exists
    if (user.avatar) {
      const oldAvatarPath = join(process.cwd(), "public", user.avatar);
      try {
        await unlink(oldAvatarPath);
      } catch (error) {
        console.error("Error deleting old avatar:", error);
      }
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filename = `avatars/teacher-${teacherId}-${timestamp}.${extension}`;
    const filepath = join(process.cwd(), "public", filename);

    // Create avatars directory if it doesn't exist
    const avatarsDir = join(process.cwd(), "public", "avatars");
    try {
      // Check if directory exists, if not create it
      if (!existsSync(avatarsDir)) {
        await mkdir(avatarsDir, { recursive: true });
      }

      // Write the file
      await writeFile(filepath, buffer);
    } catch (error) {
      console.error("Error writing file:", error);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Update user with new avatar
    user.avatar = `/${filename}`;
    await user.save();

    return NextResponse.json({
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    // Get user
    const user = await User.findById(teacherId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete avatar file if exists
    if (user.avatar) {
      const oldAvatarPath = join(process.cwd(), "public", user.avatar);
      try {
        await unlink(oldAvatarPath);
      } catch (error) {
        console.error("Error deleting avatar:", error);
      }
    }

    // Remove avatar from user
    user.avatar = undefined;
    await user.save();

    return NextResponse.json({
      message: "Avatar removed successfully",
    });
  } catch (error) {
    console.error("Error removing avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
