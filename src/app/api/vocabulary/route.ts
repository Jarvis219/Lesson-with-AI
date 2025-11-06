import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import VocabList from "@/models/VocabList";
import Vocabulary from "@/models/Vocabulary";
import { IPagination } from "@/types/pagination";
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
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const partOfSpeech = searchParams.get("pos");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    // Parse pagination params
    const page = Math.max(1, Number(pageParam) || 1);
    const limit = Math.max(1, Math.min(100, Number(limitParam) || 20));
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { isActive: true };

    // Search query - search in word, definition, and translation
    if (q) {
      filter.$or = [
        { word: { $regex: q, $options: "i" } },
        { definition: { $regex: q, $options: "i" } },
        { translation: { $regex: q, $options: "i" } },
      ];
    }

    if (level) filter.level = level;
    if (partOfSpeech) filter.partOfSpeech = partOfSpeech;
    if (category) filter.category = category;

    // Get total count for pagination
    const total = await Vocabulary.countDocuments(filter);

    // Get paginated items
    const items = await Vocabulary.find(filter)
      .sort({ frequency: -1, word: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate pagination metadata
    const totalPage = Math.max(1, Math.ceil(total / limit));
    const hasNextPage = page < totalPage;
    const hasPreviousPage = page > 1;

    const pagination: IPagination = {
      page,
      limit,
      total,
      totalPage,
      hasNextPage,
      hasPreviousPage,
    };

    return NextResponse.json({
      vocabulary: items,
      pagination,
    });
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
