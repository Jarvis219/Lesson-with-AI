import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import VocabList from "@/models/VocabList";
import Vocabulary from "@/models/Vocabulary";
import { NextRequest, NextResponse } from "next/server";

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
    const q = searchParams.get("q");
    const listId = searchParams.get("listId");
    const level = searchParams.get("level");
    const partOfSpeech = searchParams.get("pos");
    const limit = parseInt(searchParams.get("limit") || "20");

    const filter: any = { isActive: true };
    if (q) filter.word = { $regex: q, $options: "i" };
    if (level) filter.level = level;
    if (partOfSpeech) filter.partOfSpeech = partOfSpeech;
    if (listId) filter.lists = listId;

    const items = await Vocabulary.find(filter)
      .sort({ frequency: -1, word: 1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ vocabulary: items, count: items.length });
  } catch (error) {
    console.error("Get vocabulary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const {
      word,
      phonetic,
      part_of_speech,
      definition,
      example,
      translation,
      synonyms,
      antonyms,
      level,
      category,
      lists,
    } = body;

    if (!word || !definition || !translation) {
      return NextResponse.json(
        { error: "word, definition, translation are required" },
        { status: 400 }
      );
    }

    const payload: any = {
      word: String(word).toLowerCase().trim(),
      phonetic: phonetic?.trim(),
      partOfSpeech: part_of_speech,
      definition: definition?.trim(),
      example: example?.trim() || "",
      translation: translation?.trim(),
      synonyms: Array.isArray(synonyms)
        ? synonyms
        : typeof synonyms === "string"
        ? synonyms
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      antonyms: Array.isArray(antonyms)
        ? antonyms
        : typeof antonyms === "string"
        ? antonyms
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      level,
      category: category || "General",
      frequency: 0,
      isActive: true,
    };

    // Validate list ids if provided
    let listIds: string[] = [];
    if (Array.isArray(lists)) listIds = lists;
    if (typeof lists === "string")
      listIds = lists.split(",").map((s: string) => s.trim());

    if (listIds.length > 0) {
      const validLists = await VocabList.find({ _id: { $in: listIds } }).select(
        "_id"
      );
      payload.lists = validLists.map((l) => l._id);
    }

    const created = await Vocabulary.create(payload);

    // increment counters for lists
    if (payload.lists?.length) {
      await VocabList.updateMany(
        { _id: { $in: payload.lists } },
        { $inc: { vocabularyCount: 1 } }
      );
    }

    return NextResponse.json({ vocabulary: created }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: "Word already exists" },
        { status: 409 }
      );
    }
    console.error("Create vocabulary error:", error);
    return NextResponse.json(
      { error: "Failed to create vocabulary" },
      { status: 500 }
    );
  }
}
