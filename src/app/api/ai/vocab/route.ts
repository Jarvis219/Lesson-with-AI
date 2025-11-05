import { AIVocabRequest, AIVocabResponse, getVocabularyInfo } from "@/lib/ai";
import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import VocabList from "@/models/VocabList";
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

    const { categoryId, numberOfWords } = await request.json();

    if (!numberOfWords) {
      return NextResponse.json(
        { error: "Number of words is required" },
        { status: 400 }
      );
    }

    if (numberOfWords > 100) {
      return NextResponse.json(
        { error: "Number of words must be less than 100" },
        { status: 400 }
      );
    }

    const category = await VocabList.findById(categoryId).select("name");

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const categoryVocabulary = await Vocabulary.find({
      category: category.name,
    }).select("word");

    // Get vocabulary info from AI
    const aiRequest: AIVocabRequest = {
      category: category.name,
      numberOfWords,
      excludeWords: categoryVocabulary.map((word) => word.word),
    };

    let oldWords = aiRequest.excludeWords || [];

    let aiResults: AIVocabResponse = {
      words: [],
    };

    // polling for 10 times
    for (let i = 0; i < Math.ceil(numberOfWords / 10); i++) {
      const tempResults = await getVocabularyInfo({
        ...aiRequest,
        numberOfWords: 10,
      });

      oldWords.push(...tempResults.words.map((word) => word.word));
      aiResults.words.push(...tempResults.words);
      if (aiResults.words.length === numberOfWords) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const res = await Vocabulary.bulkWrite(
      aiResults.words.map((wordData) => ({
        updateOne: {
          filter: { word: wordData.word },
          update: {
            $setOnInsert: {
              definition: wordData.definition,
              translation: wordData.translation,
              example: wordData.example,
              synonyms: wordData.synonyms,
              pronunciation: wordData.pronunciation,
              phonetic: wordData.phonetic,
              partOfSpeech: wordData.partOfSpeech,
              level: wordData.level,
              category: wordData.category,
              antonyms: wordData.antonyms,
            },
          },
          upsert: true,
        },
      }))
    );

    return NextResponse.json({
      message: "Vocabulary information retrieved",
      result: res,
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
