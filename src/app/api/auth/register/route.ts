import { generateToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import { validateEmail, validatePassword } from "@/lib/utils";
import Progress from "@/models/Progress";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const {
      name,
      email,
      password,
      level = "beginner",
      goals,
    } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: "Password validation failed",
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name,
      email,
      passwordHash,
      level,
      goals: goals || "Improve my English skills",
      streak: 0,
      lastLogin: new Date(),
    });

    await user.save();

    // Create progress record
    const progress = new Progress({
      userId: user._id,
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

    await progress.save();

    // Update user with progress reference
    user.progress = progress._id;
    await user.save();

    // Generate token
    const token = generateToken(user);

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      level: user.level,
      goals: user.goals,
      streak: user.streak,
      preferences: user.preferences,
      token,
    };

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
