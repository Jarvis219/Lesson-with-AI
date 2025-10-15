import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token from storage. However, we can provide
    // a server endpoint for additional cleanup if needed.

    // Here you could:
    // 1. Add token to a blacklist (if using token blacklisting)
    // 2. Update last logout time in database
    // 3. Clear any server-side sessions

    return NextResponse.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
