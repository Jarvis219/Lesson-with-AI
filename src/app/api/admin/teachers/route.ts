import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // 'pending', 'approved', 'all'

    let query: any = { role: "teacher" };

    if (status === "pending") {
      query.isTeacherApproved = false;
    } else if (status === "approved") {
      query.isTeacherApproved = true;
    }

    const teachers = await User.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        teachers,
        total: teachers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get teachers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
