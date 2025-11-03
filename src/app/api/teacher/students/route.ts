import { isRequireTeacher } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Progress from "@/models/Progress";
import User from "@/models/User";
import type { IPagination } from "@/types/pagination";
import type { TeacherStudentListItem } from "@/types/teacher-students";
import { NextRequest, NextResponse } from "next/server";

// GET - Get all students of the authenticated teacher
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = (searchParams.get("search") || "").trim();
    const status = (searchParams.get("status") || "all").toLowerCase();

    // Find courses owned by this teacher
    const teacherCourseIds = await Course.find({ teacher: teacherId })
      .select("_id enrolledStudents")
      .lean();

    const enrolledStudentIdsSet = new Set<string>();
    for (const course of teacherCourseIds) {
      (course.enrolledStudents || []).forEach((id: unknown) => {
        enrolledStudentIdsSet.add(String(id));
      });
    }

    const enrolledStudentIds = Array.from(enrolledStudentIdsSet);

    if (enrolledStudentIds.length === 0) {
      return NextResponse.json(
        {
          students: [],
          pagination: {
            page,
            limit,
            totalPage: 0,
            total: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
        { status: 200 }
      );
    }

    const userQuery: Record<string, unknown> = {
      _id: { $in: enrolledStudentIds },
    };
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get base users with pagination
    const [users, total] = await Promise.all([
      User.find(userQuery)
        .select("name email avatar lastLogin level")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ lastLogin: -1 })
        .lean(),
      User.countDocuments(userQuery).lean(),
    ]);

    const userIds = (users as Array<{ _id: unknown }>).map((u) =>
      String(u._id)
    );

    // Load progress to compute status and progress info
    const progresses = await Progress.find({ userId: { $in: userIds } })
      .select("userId weeklyProgress scores lessonProgress lastLogin")
      .lean();
    type MinimalProgress = {
      userId: unknown;
      weeklyProgress?: number;
      lessonProgress?: Array<{ completed?: boolean }>;
    };
    const userIdToProgress: Record<string, MinimalProgress> = {};
    for (const p of progresses as unknown as MinimalProgress[]) {
      userIdToProgress[String(p.userId)] = p;
    }

    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    const resultStudents: TeacherStudentListItem[] = (
      users as unknown as Array<{
        _id: string;
        name: string;
        email: string;
        avatar?: string | null;
        level: string;
        lastLogin: string | Date;
      }>
    )
      .map((u) => {
        const p = userIdToProgress[String(u._id)];
        const isActive = p
          ? (p.weeklyProgress ?? 0) > 0 ||
            now - new Date(u.lastLogin).getTime() < thirtyDaysMs
          : now - new Date(u.lastLogin).getTime() < thirtyDaysMs;

        const progressPercent = (() => {
          if (!p || !p.lessonProgress || p.lessonProgress.length === 0)
            return 0;
          const completed = p.lessonProgress.filter(
            (lp) => lp.completed
          ).length;
          const total = p.lessonProgress.length;
          return total > 0 ? Math.round((completed / total) * 100) : 0;
        })();

        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          avatar: u.avatar,
          level: u.level,
          lastLogin: u.lastLogin,
          status: (isActive ? "active" : "inactive") as "active" | "inactive",
          progressPercent,
        };
      })
      .filter((s) => (status === "all" ? true : s.status === status));

    const pagination: IPagination = {
      page,
      limit,
      totalPage: Math.ceil(total / limit),
      total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };

    return NextResponse.json(
      { students: resultStudents, pagination },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get students error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
