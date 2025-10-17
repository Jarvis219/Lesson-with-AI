import { generateToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import { validateEmail } from "@/lib/utils";
import Progress from "@/models/Progress";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return new Response("Email and password are required", { status: 400 });
    }

    if (!validateEmail(email)) {
      return new Response("Please provide a valid email address", {
        status: 400,
      });
    }

    // Find user
    const user = await User.findOne({ email }).populate("progress");
    if (!user) {
      return new Response("Invalid email or password", { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return new Response("Invalid email or password", { status: 401 });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Update progress last login
    if (user.progress) {
      const progress = await Progress.findById(user.progress);
      if (progress) {
        progress.lastLogin = new Date();
        await progress.save();
      }
    }

    // Generate token
    const token = generateToken(user);

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      level: user.level,
      goals: user.goals,
      streak: user.streak,
      preferences: user.preferences,
    };

    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: userResponse,
        token,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Invalid email or password", { status: 401 });
  }
}
