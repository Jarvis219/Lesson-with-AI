import { requireAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Billing from "@/models/Billing";
import { NextRequest, NextResponse } from "next/server";

export const GET = requireAuth(async (_req: NextRequest, ctx: any) => {
  try {
    await connectDB();
    const userId = ctx.user.userId;
    const billing = await Billing.findOne({ userId });

    return NextResponse.json({
      isPro: billing?.isPro ?? false,
      remainingCredits: billing?.remainingCredits ?? 0,
      currentPlanName: billing?.planName ?? null,
      currentPeriodEnd: billing?.currentPeriodEnd ?? null,
    });
  } catch (error) {
    console.error("Get credits error:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
});
