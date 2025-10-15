import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Progress from "@/models/Progress";
import { NextRequest, NextResponse } from "next/server";

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

    const { weeklyGoal } = await request.json();

    if (!weeklyGoal || weeklyGoal < 1 || weeklyGoal > 20) {
      return NextResponse.json(
        { error: "Weekly goal must be between 1 and 20" },
        { status: 400 }
      );
    }

    // Find user's progress
    let progress = await Progress.findOne({ userId: userPayload.userId });

    if (!progress) {
      return NextResponse.json(
        { error: "Progress not found" },
        { status: 404 }
      );
    }

    // Update weekly goal
    progress.weeklyGoal = weeklyGoal;
    await progress.save();

    return NextResponse.json({
      message: "Weekly goal updated successfully",
      weeklyGoal: progress.weeklyGoal,
    });
  } catch (error) {
    console.error("Update weekly goal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
