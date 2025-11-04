import { requireAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Billing from "@/models/Billing";
import PricingPlan from "@/models/PricingPlan";
import { NextRequest, NextResponse } from "next/server";

export const POST = requireAuth(async (request: NextRequest, ctx: any) => {
  try {
    await connectDB();
    const userId = ctx.user.userId;
    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: "planId is required" },
        { status: 400 }
      );
    }

    const plan = await PricingPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Note: Payment integration can be added here. For now we assume success.

    if (plan.type === "credits") {
      const inc = plan.creditsIncluded || 0;
      const billing = await Billing.findOneAndUpdate(
        { userId },
        {
          $inc: { remainingCredits: inc, lifetimeCreditsPurchased: inc },
          $set: {
            lastPurchaseAt: new Date(),
            planId: plan._id,
            planName: plan.name,
            isPro: false,
          },
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({
        success: true,
        billing: {
          isPro: billing.isPro,
          remainingCredits: billing.remainingCredits,
          currentPlanName: billing.planName,
        },
      });
    }

    if (plan.type === "subscription") {
      const periodEnd = new Date();
      if (plan.interval === "year") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      const billing = await Billing.findOneAndUpdate(
        { userId },
        {
          $set: {
            isPro: plan.isUnlimitedCredits,
            planId: plan._id,
            planName: plan.name,
            currentPeriodEnd: periodEnd,
            lastPurchaseAt: new Date(),
          },
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({
        success: true,
        billing: {
          isPro: billing.isPro,
          remainingCredits: billing.remainingCredits,
          currentPlanName: billing.planName,
          currentPeriodEnd: billing.currentPeriodEnd,
        },
      });
    }

    return NextResponse.json(
      { error: "Unsupported plan type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Purchase/subscribe error:", error);
    return NextResponse.json({ error: "Failed to purchase" }, { status: 500 });
  }
});
