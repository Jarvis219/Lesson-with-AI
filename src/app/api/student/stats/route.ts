import { isRequireAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Lesson from "@/models/Lesson";
import Progress from "@/models/Progress";
import { DashboardStats } from "@/types/dashboard";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { userId } = isRequireAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const progress = await Progress.findOne({ userId });

    if (!progress) {
      const defaultStats: DashboardStats = {
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
        weeklyData: [0, 0, 0, 0, 0, 0, 0],
        monthlyProgress: 0,
        levelProgress: 0,
      };

      return NextResponse.json({ stats: defaultStats });
    }

    // Calculate average score from completed lessons
    const completedLessonsWithScore = progress.lessonProgress.filter(
      (lp: any) => lp.completed && lp.score > 0
    );
    const averageScore =
      completedLessonsWithScore.length > 0
        ? Math.round(
            completedLessonsWithScore.reduce(
              (sum: number, lp: any) => sum + lp.score,
              0
            ) / completedLessonsWithScore.length
          )
        : 0;

    // Get skill scores - calculate dynamically from completed lessons
    const skillScores = {
      vocab: 0,
      grammar: 0,
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0,
    };

    // Calculate skill scores from completed lessons
    const completedLessonIds = progress.lessonsCompleted.map((id: any) =>
      id.toString()
    );

    if (completedLessonIds.length > 0) {
      const completedLessons = await Lesson.find({
        _id: { $in: completedLessonIds },
      })
        .select("type")
        .lean();

      // Calculate average score per skill
      const skillGroups: Record<string, number[]> = {};
      completedLessons.forEach((lesson: any) => {
        if (!skillGroups[lesson.type]) {
          skillGroups[lesson.type] = [];
        }
      });

      // Get scores for each skill
      progress.lessonProgress.forEach((lp: any) => {
        if (
          lp.completed &&
          completedLessonIds.includes(lp.lessonId.toString())
        ) {
          const lesson = completedLessons.find(
            (l: any) => l._id.toString() === lp.lessonId.toString()
          );
          if (lesson && skillGroups[lesson.type]) {
            skillGroups[lesson.type].push(lp.score);
          }
        }
      });

      // Calculate averages
      Object.keys(skillGroups).forEach((skill) => {
        if (
          skillScores.hasOwnProperty(skill) &&
          skillGroups[skill].length > 0
        ) {
          skillScores[skill as keyof typeof skillScores] = Math.round(
            skillGroups[skill].reduce((sum, score) => sum + score, 0) /
              skillGroups[skill].length
          );
        }
      });
    }

    // Get recent activity (last 10 lessons) with full lesson details
    const sortedProgress = progress.lessonProgress
      .sort(
        (a: any, b: any) =>
          new Date(b.completedAt || 0).getTime() -
          new Date(a.completedAt || 0).getTime()
      )
      .slice(0, 10);

    // Fetch lesson details for recent activity
    const lessonIds = sortedProgress.map((lp: any) => lp.lessonId);
    const lessons = await Lesson.find({ _id: { $in: lessonIds } })
      .select("title type")
      .lean();

    // Create a map for quick lookup
    const lessonMap = new Map(
      lessons.map((lesson: any) => [lesson._id.toString(), lesson])
    );

    const recentActivity = sortedProgress.map((lesson: any) => {
      const lessonDetails = lessonMap.get(lesson.lessonId.toString());
      return {
        id: lesson.lessonId,
        title: lessonDetails?.title || `Lesson ${lesson.lessonId}`,
        score: lesson.score,
        timeSpent: lesson.timeSpent,
        completedAt: lesson.completedAt,
        skill: lessonDetails?.type || lesson.skill || "general",
      };
    });

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

    const stats: DashboardStats = {
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
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Student stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
