import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import VocabList from "@/models/VocabList";
import { NextRequest, NextResponse } from "next/server";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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
    const q = searchParams.get("q");
    const active = searchParams.get("active");

    const filter: any = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;

    const lists = await VocabList.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ lists, total: lists.length }, { status: 200 });
  } catch (error) {
    console.error("Get vocab lists error:", error);
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

    const { name, description } = await request.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = slugify(name);

    const existing = await VocabList.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "List with same name already exists" },
        { status: 409 }
      );
    }

    const list = await VocabList.create({
      name: name.trim(),
      description: description?.trim(),
      slug,
      createdBy: userPayload.userId,
    });

    return NextResponse.json({ list }, { status: 201 });
  } catch (error) {
    console.error("Create vocab list error:", error);
    return NextResponse.json(
      { error: "Failed to create vocab list" },
      { status: 500 }
    );
  }
}
