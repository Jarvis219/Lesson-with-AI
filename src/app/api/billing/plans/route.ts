import connectDB from "@/lib/db";
import PricingPlan from "@/models/PricingPlan";
import { NextRequest, NextResponse } from "next/server";

async function ensureSeeded() {
  const count = await PricingPlan.countDocuments({});
  if (count > 0) return;

  const monthlyPrice = 1999; // $19.99/month
  const yearlyPrice = Math.round(monthlyPrice * 12 * 0.9); // 10% discount

  await PricingPlan.create([
    {
      name: "Free",
      description: "Try it out. No credits included by default.",
      type: "credits",
      price: 0,
      currency: "USD",
      creditsIncluded: 0,
      isUnlimitedCredits: false,
      isActive: true,
      sortOrder: 0,
      features: ["Teacher registration bonus: 10 trial credits"],
    },
    {
      name: "Credit Pack 50",
      description: "50 AI lesson credits.",
      type: "credits",
      price: 900, // $9.00
      currency: "USD",
      creditsIncluded: 50,
      isUnlimitedCredits: false,
      isActive: true,
      sortOrder: 1,
      features: ["Create 50 AI lessons"],
    },
    {
      name: "Pro Monthly",
      description: "Unlimited AI lesson credits.",
      type: "subscription",
      price: monthlyPrice,
      currency: "USD",
      isUnlimitedCredits: true,
      interval: "month",
      isActive: true,
      sortOrder: 2,
      features: ["Unlimited AI lessons", "Priority processing"],
    },
    {
      name: "Pro Yearly (10% off)",
      description: "Unlimited AI lesson credits with annual billing.",
      type: "subscription",
      price: yearlyPrice,
      currency: "USD",
      isUnlimitedCredits: true,
      interval: "year",
      isActive: true,
      sortOrder: 3,
      features: ["Unlimited AI lessons", "Priority processing", "Save 10%"],
    },
  ]);
}

export async function GET(_request: NextRequest) {
  try {
    await connectDB();
    await ensureSeeded();
    const plans = await PricingPlan.find({ isActive: true }).sort({
      sortOrder: 1,
    });
    return NextResponse.json({ plans });
  } catch (error) {
    console.error("List plans error:", error);
    return NextResponse.json(
      { error: "Failed to load plans" },
      { status: 500 }
    );
  }
}
