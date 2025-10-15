import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Progress from "@/models/Progress";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { lessonId, score, timeSpent, skill } = await request.json();

    // Validation
    if (!lessonId || score === undefined || !timeSpent) {
      return NextResponse.json(
        { error: "Lesson ID, score, and time spent are required" },
        { status: 400 }
      );
    }

    // Find user's progress
    let progress = await Progress.findOne({ userId: userPayload.userId });

    if (!progress) {
      // Create new progress record if doesn't exist
      progress = new Progress({
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
    }

    // Add lesson progress
    await progress.addLessonProgress(lessonId, score, timeSpent);

    // Update skill score if provided
    if (skill) {
      await progress.updateScore(skill, score);
    }

    // Update total time spent
    progress.totalTimeSpent += timeSpent;

    // Check for achievements
    const newAchievements = checkAchievements(progress);
    if (newAchievements.length > 0) {
      progress.achievements.push(...newAchievements);
    }

    await progress.save();

    // Update user streak
    const user = await User.findById(userPayload.userId);
    if (user) {
      user.streak = progress.streak;
      await user.save();
    }

    return NextResponse.json({
      message: "Progress updated successfully",
      progress: {
        totalLessonsCompleted: progress.lessonsCompleted.length,
        streak: progress.streak,
        totalTimeSpent: progress.totalTimeSpent,
        scores: progress.scores,
        newAchievements,
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

function checkAchievements(progress: any): string[] {
  const achievements: string[] = [];
  const currentAchievements = progress.achievements || [];

  // First lesson
  if (
    progress.lessonsCompleted.length === 1 &&
    !currentAchievements.includes("first_lesson")
  ) {
    achievements.push("first_lesson");
  }

  // Week streak
  if (progress.streak >= 7 && !currentAchievements.includes("week_streak")) {
    achievements.push("week_streak");
  }

  // Month streak
  if (progress.streak >= 30 && !currentAchievements.includes("month_streak")) {
    achievements.push("month_streak");
  }

  // Perfect score
  const recentLessons = progress.lessonProgress.slice(-5);
  const hasPerfectScore = recentLessons.some(
    (lesson: any) => lesson.score === 100
  );
  if (hasPerfectScore && !currentAchievements.includes("perfect_score")) {
    achievements.push("perfect_score");
  }

  // Skill-specific achievements
  progress.scores.forEach((score: any) => {
    if (score.score >= 90) {
      const achievementKey = `${score.skill}_master`;
      if (!currentAchievements.includes(achievementKey)) {
        achievements.push(achievementKey);
      }
    }
  });

  return achievements;
}
