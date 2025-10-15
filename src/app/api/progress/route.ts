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

    // Get user's progress
    const progress = await Progress.findOne({ userId: userPayload.userId });

    if (!progress) {
      // Create new progress record if doesn't exist
      const newProgress = new Progress({
        userId: userPayload.userId,
        lessonsCompleted: [],
        streak: 0,
        totalTimeSpent: 0,
        scores: [
          { skill: "vocab", score: 0, lastUpdated: new Date() },
          { skill: "grammar", score: 0, lastUpdated: new Date() },
          { skill: "listening", score: 0, lastUpdated: new Date() },
          { skill: "speaking", score: 0, lastUpdated: new Date() },
          { skill: "reading", score: 0, lastUpdated: new Date() },
          { skill: "writing", score: 0, lastUpdated: new Date() },
        ],
        lessonProgress: [],
        achievements: [],
        weeklyGoal: 5,
        weeklyProgress: 0,
      });

      await newProgress.save();

      return NextResponse.json({
        progress: {
          totalLessonsCompleted: 0,
          streak: 0,
          totalTimeSpent: 0,
          scores: newProgress.scores,
          achievements: [],
          weeklyGoal: 5,
          weeklyProgress: 0,
          lessonProgress: [],
        },
      });
    }

    // Calculate weekly progress (reset if new week)
    const now = new Date();
    const lastLogin = new Date(progress.lastLogin);
    const daysDiff = Math.floor(
      (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff >= 7) {
      progress.weeklyProgress = 0;
      await progress.save();
    }

    return NextResponse.json({
      progress: {
        totalLessonsCompleted: progress.lessonsCompleted.length,
        streak: progress.streak,
        totalTimeSpent: progress.totalTimeSpent,
        scores: progress.scores,
        achievements: progress.achievements,
        weeklyGoal: progress.weeklyGoal,
        weeklyProgress: progress.weeklyProgress,
        lessonProgress: progress.lessonProgress,
      },
    });
  } catch (error) {
    console.error("Get progress error:", error);
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

    const { weeklyGoal, preferences } = await request.json();

    // Find user's progress
    let progress = await Progress.findOne({ userId: userPayload.userId });

    if (!progress) {
      return NextResponse.json(
        { error: "Progress not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (weeklyGoal !== undefined) {
      if (weeklyGoal < 1 || weeklyGoal > 20) {
        return NextResponse.json(
          { error: "Weekly goal must be between 1 and 20" },
          { status: 400 }
        );
      }
      progress.weeklyGoal = weeklyGoal;
    }

    await progress.save();

    // Update user preferences if provided
    if (preferences) {
      const user = await User.findById(userPayload.userId);
      if (user) {
        user.preferences = { ...user.preferences, ...preferences };
        await user.save();
      }
    }

    return NextResponse.json({
      message: "Progress updated successfully",
      progress: {
        weeklyGoal: progress.weeklyGoal,
      },
    });
  } catch (error) {
    console.error("Update progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
