import { AISpeakingRequest, analyzeSpeaking } from "@/lib/ai";
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

    const { text, userAudio } = await request.json();

    // Validation
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: "Text is too long (max 500 characters)" },
        { status: 400 }
      );
    }

    // Analyze speaking using AI
    const aiRequest: AISpeakingRequest = {
      text,
      userAudio,
    };

    const result = await analyzeSpeaking(aiRequest);

    return NextResponse.json({
      message: "Speaking analysis completed",
      result,
    });
  } catch (error) {
    console.error("Speaking analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze speaking" },
      { status: 500 }
    );
  }
}

// Endpoint for text-to-speech
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");
    const voice = searchParams.get("voice") || "en-US-Standard-A";

    if (!text) {
      return NextResponse.json(
        { error: "Text parameter is required" },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: "Text is too long (max 500 characters)" },
        { status: 400 }
      );
    }

    // For now, return a placeholder response
    // In a real implementation, you would use Google Text-to-Speech API
    // or another TTS service to generate audio

    return NextResponse.json({
      message: "Text-to-speech request received",
      text,
      voice,
      audioUrl: null, // Would contain the generated audio URL
      note: "TTS integration needed - this is a placeholder response",
    });
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
