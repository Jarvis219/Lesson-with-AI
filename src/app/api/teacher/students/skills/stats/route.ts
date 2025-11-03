import { isRequireTeacher } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Progress from "@/models/Progress";
import type {
  SkillName,
  TeacherStudentsSkillsStatsResponse,
} from "@/types/teacher-students";
import { NextRequest, NextResponse } from "next/server";

// GET - Skill averages across teacher's students
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
      .select("enrolledStudents")
      .lean();

    const studentSet = new Set<string>();
    for (const c of teacherCourses) {
      (c.enrolledStudents || []).forEach((id: any) =>
        studentSet.add(String(id))
      );
    }
    const studentIds = Array.from(studentSet);

    if (studentIds.length === 0) {
      return NextResponse.json(
        {
          skills: [],
        },
        { status: 200 }
      );
    }

    const progresses = await Progress.find({ userId: { $in: studentIds } })
      .select("scores")
      .lean();

    const accumulator: Record<SkillName, { sum: number; count: number }> =
      {} as Record<SkillName, { sum: number; count: number }>;
    for (const p of progresses) {
      if (!Array.isArray(p.scores)) continue;
      for (const s of p.scores as Array<{ skill: SkillName; score: number }>) {
        const key = s.skill as SkillName;
        if (!accumulator[key]) accumulator[key] = { sum: 0, count: 0 };
        accumulator[key].sum += s.score;
        accumulator[key].count += 1;
      }
    }

    const skills = (
      Object.entries(accumulator) as Array<
        [SkillName, { sum: number; count: number }]
      >
    )
      .map(([skill, v]) => ({
        skill,
        average: Math.round(v.sum / Math.max(1, v.count)),
      }))
      .sort((a, b) => a.skill.localeCompare(b.skill));

    const payload: TeacherStudentsSkillsStatsResponse = { skills };
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("Get students skills stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
