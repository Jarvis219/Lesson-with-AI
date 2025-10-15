import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Lesson from "@/models/Lesson";
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
        lessonId: lesson.lessonId,
        score: lesson.score,
        timeSpent: lesson.timeSpent,
        completedAt: lesson.completedAt,
        attempts: lesson.attempts,
      }));

    // Calculate weekly completion rate
    const weeklyCompletionRate =
      progress.weeklyGoal > 0
        ? Math.round((progress.weeklyProgress / progress.weeklyGoal) * 100)
        : 0;

    // Get lesson type distribution
    const lessonTypeStats = await getLessonTypeStats(progress.lessonsCompleted);

    return NextResponse.json({
      stats: {
        totalLessonsCompleted: progress.lessonsCompleted.length,
        totalTimeSpent: progress.totalTimeSpent,
        averageScore,
        streak: progress.streak,
        weeklyProgress: progress.weeklyProgress,
        weeklyGoal: progress.weeklyGoal,
        weeklyCompletionRate,
        skillScores,
        recentActivity,
        achievements: progress.achievements,
        lessonTypeStats,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getLessonTypeStats(completedLessonIds: string[]) {
  try {
    const lessons = await Lesson.find({
      _id: { $in: completedLessonIds },
    });

    const typeStats: Record<string, number> = {};

    lessons.forEach((lesson) => {
      typeStats[lesson.type] = (typeStats[lesson.type] || 0) + 1;
    });

    return typeStats;
  } catch (error) {
    console.error("Error getting lesson type stats:", error);
    return {};
  }
}
