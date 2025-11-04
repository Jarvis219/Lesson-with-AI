import mongoose, { Document, Schema } from "mongoose";

export type PlanType = "credits" | "subscription";

export interface IPricingPlan extends Document {
  name: string;
  description?: string;
  type: PlanType;
  price: number; // in smallest currency unit (e.g., cents)
  currency: string; // e.g., USD, VND
  creditsIncluded?: number; // for credit packs or monthly credit bundles
  isUnlimitedCredits: boolean; // for pro subscription
  interval?: "month" | "year"; // for subscription plans
  isActive: boolean;
  sortOrder: number;
  features?: string[];
  externalProductId?: string; // e.g., Stripe product/price id
  createdAt: Date;
  updatedAt: Date;
}

const PricingPlanSchema = new Schema<IPricingPlan>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String },
    type: { type: String, enum: ["credits", "subscription"], required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, default: "USD" },
    creditsIncluded: { type: Number, min: 0 },
    isUnlimitedCredits: { type: Boolean, default: false },
    interval: { type: String, enum: ["month", "year"], required: false },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
    features: [{ type: String }],
    externalProductId: { type: String },
  },
  { timestamps: true }
);

PricingPlanSchema.index({ isActive: 1, sortOrder: 1 });

export default mongoose.models.PricingPlan ||
  mongoose.model<IPricingPlan>("PricingPlan", PricingPlanSchema);
