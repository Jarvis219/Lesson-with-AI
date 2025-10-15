import { testGoogleAI } from "@/lib/test-ai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_AI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const result = await testGoogleAI(apiKey);

    if (result.success) {
      return NextResponse.json({
        message: "Google AI integration working correctly",
        response: result.response,
      });
    } else {
      return NextResponse.json(
        { error: "Google AI test failed", details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Test AI error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
