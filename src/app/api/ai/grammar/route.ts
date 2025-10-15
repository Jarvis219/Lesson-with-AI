import { AIGrammarRequest, correctGrammar } from "@/lib/ai";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { text, level = "intermediate" } = await request.json();

    // Validation
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { error: "Text is too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    // Correct grammar using AI
    const aiRequest: AIGrammarRequest = {
      text,
      level: level as "beginner" | "intermediate" | "advanced",
    };

    const result = await correctGrammar(aiRequest);

    return NextResponse.json({
      message: "Grammar correction completed",
      result,
    });
  } catch (error) {
    console.error("Grammar correction error:", error);
    return NextResponse.json(
      { error: "Failed to correct grammar" },
      { status: 500 }
    );
  }
}
