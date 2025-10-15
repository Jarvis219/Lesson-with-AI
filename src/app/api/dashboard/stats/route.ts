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
        stats: {
          totalLessonsCompleted: 0,
          totalTimeSpent: 0,
          averageScore: 0,
          streak: 0,
          weeklyProgress: 0,
          weeklyGoal: 5,
          skillScores: {
            vocab: 0,
            grammar: 0,
            listening: 0,
            speaking: 0,
            reading: 0,
            writing: 0,
          },
          recentActivity: [],
          achievements: [],
          weeklyData: [0, 0, 0, 0, 0, 0, 0], // Last 7 days
          monthlyProgress: 0,
          levelProgress: 0,
        },
      });
    }

    // Calculate average score
    const scores = progress.scores.map((score: any) => score.score);
    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((sum: number, score: number) => sum + score, 0) /
              scores.length
          )
        : 0;

    // Get skill scores
    const skillScores = {
      vocab: 0,
      grammar: 0,
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0,
    };

    progress.scores.forEach((score: any) => {
      if (skillScores.hasOwnProperty(score.skill)) {
        skillScores[score.skill as keyof typeof skillScores] = score.score;
      }
    });

    // Get recent activity (last 10 lessons)
    const recentActivity = progress.lessonProgress
      .sort(
        (a: any, b: any) =>
          new Date(b.completedAt || 0).getTime() -
          new Date(a.completedAt || 0).getTime()
      )
      .slice(0, 10)
      .map((lesson: any) => ({
        id: lesson.lessonId,
        title: `Lesson ${lesson.lessonId}`,
        score: lesson.score,
        timeSpent: lesson.timeSpent,
        completedAt: lesson.completedAt,
        skill: lesson.skill || "general",
      }));

    // Calculate weekly data (last 7 days)
    const weeklyData = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();

    progress.lessonProgress.forEach((lesson: any) => {
      if (lesson.completedAt) {
        const lessonDate = new Date(lesson.completedAt);
        const daysDiff = Math.floor(
          (today.getTime() - lessonDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff >= 0 && daysDiff < 7) {
          weeklyData[6 - daysDiff] += 1;
        }
      }
    });

    // Calculate monthly progress
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyLessons = progress.lessonProgress.filter(
      (lesson: any) =>
        lesson.completedAt && new Date(lesson.completedAt) >= thisMonth
    ).length;

    // Calculate level progress (based on total lessons and average score)
    const totalLessons = progress.lessonProgress.filter(
      (lesson: any) => lesson.completed
    ).length;
    let levelProgress = 0;

    if (averageScore >= 90) {
      levelProgress = Math.min(100, (totalLessons / 100) * 100); // Advanced level
    } else if (averageScore >= 70) {
      levelProgress = Math.min(100, (totalLessons / 50) * 100); // Intermediate level
    } else {
      levelProgress = Math.min(100, (totalLessons / 20) * 100); // Beginner level
    }

    return NextResponse.json({
      stats: {
        totalLessonsCompleted: progress.lessonsCompleted.length,
        totalTimeSpent: progress.totalTimeSpent,
        averageScore,
        streak: progress.streak,
        weeklyProgress: progress.weeklyProgress,
        weeklyGoal: progress.weeklyGoal,
        skillScores,
        recentActivity,
        achievements: progress.achievements || [],
        weeklyData,
        monthlyProgress: monthlyLessons,
        levelProgress: Math.round(levelProgress),
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
