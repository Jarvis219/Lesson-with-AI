import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Progress from "@/models/Progress";
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

    const progress = await Progress.findOne({ userId: userPayload.userId });

    if (!progress) {
      return NextResponse.json({
        achievements: [],
        totalEarned: 0,
        totalAvailable: 10,
        categories: {
          streak: { earned: 0, total: 3, percentage: 0 },
          lessons: { earned: 0, total: 2, percentage: 0 },
          score: { earned: 0, total: 2, percentage: 0 },
          time: { earned: 0, total: 1, percentage: 0 },
          special: { earned: 0, total: 2, percentage: 0 },
        },
      });
    }

    // Check for new achievements
    const newAchievements = await checkAchievements(progress);

    if (newAchievements.length > 0) {
      progress.achievements.push(...newAchievements);
      await progress.save();
    }

    // Calculate category progress
    const categories = {
      streak: { earned: 0, total: 3, percentage: 0 },
      lessons: { earned: 0, total: 2, percentage: 0 },
      score: { earned: 0, total: 2, percentage: 0 },
      time: { earned: 0, total: 1, percentage: 0 },
      special: { earned: 0, total: 2, percentage: 0 },
    };

    // Count achievements by category
    progress.achievements.forEach((achievement: string) => {
      if (achievement.includes("streak")) categories.streak.earned++;
      else if (achievement.includes("lesson")) categories.lessons.earned++;
      else if (achievement.includes("score") || achievement.includes("perfect"))
        categories.score.earned++;
      else if (achievement.includes("time")) categories.time.earned++;
      else if (achievement.includes("weekly") || achievement.includes("skill"))
        categories.special.earned++;
    });

    // Calculate percentages
    Object.keys(categories).forEach((key) => {
      const category = categories[key as keyof typeof categories];
      category.percentage = Math.round(
        (category.earned / category.total) * 100
      );
    });

    return NextResponse.json({
      achievements: progress.achievements,
      totalEarned: progress.achievements.length,
      totalAvailable: 10,
      categories,
      newAchievements,
    });
  } catch (error) {
    console.error("Achievements error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function checkAchievements(progress: any): Promise<string[]> {
  const newAchievements: string[] = [];
  const currentAchievements = progress.achievements || [];

  // Streak achievements
  if (progress.streak >= 3 && !currentAchievements.includes("streak_3")) {
    newAchievements.push("streak_3");
  }
  if (progress.streak >= 7 && !currentAchievements.includes("streak_7")) {
    newAchievements.push("streak_7");
  }
  if (progress.streak >= 30 && !currentAchievements.includes("streak_30")) {
    newAchievements.push("streak_30");
  }

  // Lesson achievements
  const totalLessons = progress.lessonsCompleted.length;
  if (totalLessons >= 1 && !currentAchievements.includes("first_lesson")) {
    newAchievements.push("first_lesson");
  }
  if (totalLessons >= 10 && !currentAchievements.includes("lessons_10")) {
    newAchievements.push("lessons_10");
  }
  if (totalLessons >= 50 && !currentAchievements.includes("lessons_50")) {
    newAchievements.push("lessons_50");
  }

  // Score achievements
  const scores = progress.scores.map((score: any) => score.score);
  const maxScore = Math.max(...scores, 0);
  if (maxScore >= 100 && !currentAchievements.includes("perfect_score")) {
    newAchievements.push("perfect_score");
  }

  // Time achievements
  if (
    progress.totalTimeSpent >= 6000 &&
    !currentAchievements.includes("time_master")
  ) {
    // 100 hours
    newAchievements.push("time_master");
  }

  // Special achievements
  if (
    progress.weeklyProgress >= progress.weeklyGoal &&
    !currentAchievements.includes("weekly_champion")
  ) {
    newAchievements.push("weekly_champion");
  }

  // Skill master achievement
  const allSkillsGood = progress.scores.every(
    (score: any) => score.score >= 80
  );
  if (
    allSkillsGood &&
    progress.scores.length >= 6 &&
    !currentAchievements.includes("skill_master")
  ) {
    newAchievements.push("skill_master");
  }

  return newAchievements;
}
