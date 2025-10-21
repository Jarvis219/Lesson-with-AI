import { isRequireTeacher } from "@/lib/auth";
import connectDB from "@/lib/db";
import TeacherSchedule from "@/models/TeacherSchedule";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { teacherId, isTeacher } = isRequireTeacher(req);

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

    // Get teaching schedule
    const schedule = await TeacherSchedule.findOne({
      teacherId,
      isActive: true,
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Teaching schedule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      schedule: schedule.schedule,
      timezone: schedule.timezone,
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const { teacherId, isTeacher } = isRequireTeacher(req);

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

    // Get request body
    const body = await req.json();
    const { schedule, timezone } = body;

    // Validate input
    if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
      return NextResponse.json(
        { error: "Schedule is required and must be a non-empty array" },
        { status: 400 }
      );
    }

    // Validate each schedule slot
    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    for (const slot of schedule) {
      if (!slot.day || !validDays.includes(slot.day)) {
        return NextResponse.json(
          { error: `Invalid day: ${slot.day}` },
          { status: 400 }
        );
      }

      if (!slot.startTime || !slot.endTime) {
        return NextResponse.json(
          { error: "Start time and end time are required for each slot" },
          { status: 400 }
        );
      }

      // Validate time format (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
        return NextResponse.json(
          { error: "Invalid time format. Use HH:MM format" },
          { status: 400 }
        );
      }

      // Validate that end time is after start time
      const [startHour, startMinute] = slot.startTime.split(":").map(Number);
      const [endHour, endMinute] = slot.endTime.split(":").map(Number);

      if (
        endHour < startHour ||
        (endHour === startHour && endMinute <= startMinute)
      ) {
        return NextResponse.json(
          { error: `End time must be after start time for ${slot.day}` },
          { status: 400 }
        );
      }
    }

    // Update or create teaching schedule
    const teacherSchedule = await TeacherSchedule.findOneAndUpdate(
      { teacherId, isActive: true },
      {
        $set: {
          schedule,
          timezone: timezone || "Asia/Ho_Chi_Minh",
          isActive: true,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      message: "Teaching schedule updated successfully",
      schedule: teacherSchedule.schedule,
      timezone: teacherSchedule.timezone,
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { teacherId, isTeacher } = isRequireTeacher(req);

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

    // Soft delete teaching schedule
    await TeacherSchedule.findOneAndUpdate(
      { teacherId, isActive: true },
      { $set: { isActive: false } }
    );

    return NextResponse.json({
      message: "Teaching schedule deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
