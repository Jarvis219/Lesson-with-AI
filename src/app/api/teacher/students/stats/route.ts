import { isRequireTeacher } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Progress from "@/models/Progress";
import type {
  SkillName,
  TeacherStudentsStatsResponse,
} from "@/types/teacher-students";
import { NextRequest, NextResponse } from "next/server";

// GET - Stats overview for teacher's students
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { teacherId, isTeacher } = isRequireTeacher(request);

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

    const teacherCourses = await Course.find({ teacher: teacherId })
      .select("_id enrolledStudents")
      .lean();

    const studentsSet = new Set<string>();
    for (const c of teacherCourses) {
      (c.enrolledStudents || []).forEach((id: any) =>
        studentsSet.add(String(id))
      );
    }
    const studentIds = Array.from(studentsSet);

    if (studentIds.length === 0) {
      return NextResponse.json(
        {
          totalStudents: 0,
          averageScore: 0,
          completionRate: 0,
          weakSkills: [],
        },
        { status: 200 }
      );
    }

    // Fetch necessary data
    const [progresses] = await Promise.all([
      Progress.find({ userId: { $in: studentIds } })
        .select("scores lessonProgress")
        .lean(),
    ]);

    // Average score from Progress.scores across skills
    let scoreSum = 0;
    let scoreCount = 0;
    const skillCounters: Record<SkillName, { sum: number; count: number }> =
      {} as Record<SkillName, { sum: number; count: number }>;

    let lessonsCompleted = 0;
    let lessonsTotal = 0;

    for (const p of progresses) {
      if (Array.isArray(p.scores)) {
        for (const s of p.scores as Array<{
          skill: SkillName;
          score: number;
        }>) {
          scoreSum += s.score;
          scoreCount += 1;
          const key = s.skill;
          if (!skillCounters[key]) skillCounters[key] = { sum: 0, count: 0 };
          skillCounters[key].sum += s.score;
          skillCounters[key].count += 1;
        }
      }
      if (Array.isArray(p.lessonProgress)) {
        lessonsCompleted += p.lessonProgress.filter(
          (lp: any) => lp.completed
        ).length;
        lessonsTotal += p.lessonProgress.length;
      }
    }

    const averageScore = scoreCount > 0 ? Math.round(scoreSum / scoreCount) : 0;
    const completionRate =
      lessonsTotal > 0
        ? Math.round((lessonsCompleted / lessonsTotal) * 100)
        : 0;

    // Determine weak skills: lowest average among skills present
    const skillAverages = (
      Object.entries(skillCounters) as Array<
        [SkillName, { sum: number; count: number }]
      >
    ).map(([skill, v]) => ({
      skill,
      avg: Math.round(v.sum / Math.max(1, v.count)),
    }));
    skillAverages.sort((a, b) => a.avg - b.avg);
    const weakSkills = skillAverages.slice(0, 2).map((s) => s.skill);

    const payload: TeacherStudentsStatsResponse = {
      totalStudents: studentIds.length,
      averageScore,
      completionRate,
      weakSkills,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("Get students stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
