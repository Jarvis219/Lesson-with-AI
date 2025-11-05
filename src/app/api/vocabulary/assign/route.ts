import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import VocabList from "@/models/VocabList";
import Vocabulary from "@/models/Vocabulary";
import { NextRequest, NextResponse } from "next/server";

// POST: add or remove a vocabulary from a list
// Body: { vocabId: string, listId: string, action: 'add' | 'remove' }
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

    const { vocabId, listId, action } = await request.json();

    if (!vocabId || !listId || !["add", "remove"].includes(action)) {
      return NextResponse.json(
        { error: "vocabId, listId and valid action are required" },
        { status: 400 }
      );
    }

    const list = await VocabList.findById(listId);
    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    const vocab = await Vocabulary.findById(vocabId);
    if (!vocab) {
      return NextResponse.json(
        { error: "Vocabulary not found" },
        { status: 404 }
      );
    }

    const already = (vocab.lists || []).some(
      (id: unknown) => String(id) === String(listId)
    );

    if (action === "add" && !already) {
      await Vocabulary.updateOne(
        { _id: vocabId },
        { $addToSet: { lists: listId } }
      );
      await VocabList.updateOne(
        { _id: listId },
        { $inc: { vocabularyCount: 1 } }
      );
    } else if (action === "remove" && already) {
      await Vocabulary.updateOne(
        { _id: vocabId },
        { $pull: { lists: listId } }
      );
      await VocabList.updateOne(
        { _id: listId },
        { $inc: { vocabularyCount: -1 } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assign vocabulary error:", error);
    return NextResponse.json(
      { error: "Failed to update assignment" },
      { status: 500 }
    );
  }
}
