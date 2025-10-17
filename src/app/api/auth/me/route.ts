import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Progress from "@/models/Progress";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Find user with progress data
    const user = await User.findById(userPayload.userId).populate("progress");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get progress data
    let progressData = null;
    if (user.progress) {
      progressData = await Progress.findById(user.progress);
    }

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      level: user.level,
      goals: user.goals,
      streak: user.streak,
      preferences: user.preferences,
      isTeacherApproved: user.isTeacherApproved,
      teacherBio: user.teacherBio,
      teacherQualification: user.teacherQualification,
      coursesCreated: user.coursesCreated,
      progress: progressData
        ? {
            totalLessonsCompleted: progressData.lessonsCompleted.length,
            streak: progressData.streak,
            totalTimeSpent: progressData.totalTimeSpent,
            scores: progressData.scores,
            achievements: progressData.achievements,
            weeklyGoal: progressData.weeklyGoal,
            weeklyProgress: progressData.weeklyProgress,
          }
        : null,
    };

    return NextResponse.json({
      user: userResponse,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { name, goals, level, preferences } = await request.json();

    // Find and update user
    const user = await User.findById(userPayload.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (goals !== undefined) user.goals = goals;
    if (level !== undefined) user.level = level;
    if (preferences !== undefined) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    // Return updated user data (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      level: user.level,
      goals: user.goals,
      streak: user.streak,
      preferences: user.preferences,
    };

    return NextResponse.json({
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
