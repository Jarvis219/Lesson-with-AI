import { AIVocabRequest, getVocabularyInfo } from "@/lib/ai";
import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Vocabulary from "@/models/Vocabulary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { word, context } = await request.json();

    // Validation
    if (!word || typeof word !== "string") {
      return NextResponse.json(
        { error: "Word is required and must be a string" },
        { status: 400 }
      );
    }

    // Check if word already exists in database
    let vocabulary = await Vocabulary.findOne({
      word: word.toLowerCase().trim(),
    });

    if (vocabulary) {
      // Return existing vocabulary data
      return NextResponse.json({
        message: "Vocabulary found in database",
        result: {
          word: vocabulary.word,
          definition: vocabulary.definition,
          translation: vocabulary.translation,
          examples: [
            {
              sentence: vocabulary.example,
              translation: vocabulary.exampleTranslation,
            },
          ],
          synonyms: vocabulary.synonyms,
          pronunciation: vocabulary.pronunciation,
          level: vocabulary.level,
        },
        fromDatabase: true,
      });
    }

    // Get vocabulary info from AI
    const aiRequest: AIVocabRequest = {
      word: word.toLowerCase().trim(),
      context,
    };

    const aiResult = await getVocabularyInfo(aiRequest);

    // Save to database for future use
    const newVocabulary = new Vocabulary({
      word: aiResult.word,
      definition: aiResult.definition,
      translation: aiResult.translation,
      example: aiResult.examples[0]?.sentence || "",
      exampleTranslation: aiResult.examples[0]?.translation || "",
      pronunciation: aiResult.pronunciation,
      phonetic: aiResult.pronunciation,
      partOfSpeech: "noun", // Default, could be enhanced
      level: aiResult.level,
      category: "General",
      synonyms: aiResult.synonyms,
      antonyms: [],
      frequency: 1,
    });

    try {
      await newVocabulary.save();
    } catch (saveError) {
      // Continue even if save fails
      console.warn("Failed to save vocabulary to database:", saveError);
    }

    return NextResponse.json({
      message: "Vocabulary information retrieved",
      result: aiResult,
      fromDatabase: false,
    });
  } catch (error) {
    console.error("Vocabulary lookup error:", error);
    return NextResponse.json(
      { error: "Failed to get vocabulary information" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build filter
    const filter: any = { isActive: true };
    if (category) filter.category = category;
    if (level) filter.level = level;

    // Get vocabulary with pagination
    const vocabulary = await Vocabulary.find(filter)
      .sort({ frequency: -1, word: 1 })
      .limit(limit);

    return NextResponse.json({
      vocabulary,
      count: vocabulary.length,
    });
  } catch (error) {
    console.error("Get vocabulary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
