import mongoose, { Document, Schema } from "mongoose";

export interface IBilling extends Document {
  userId: mongoose.Types.ObjectId;
  planId?: mongoose.Types.ObjectId; // reference to PricingPlan if subscribed
  planName?: string; // denormalized name for quick reads
  isPro: boolean; // unlimited credits if true
  remainingCredits: number; // decremented on each AI generation
  lifetimeCreditsPurchased: number; // analytics
  lastPurchaseAt?: Date;
  currentPeriodEnd?: Date; // for subscriptions
  createdAt: Date;
  updatedAt: Date;
}

const BillingSchema = new Schema<IBilling>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    planId: { type: Schema.Types.ObjectId, ref: "PricingPlan" },
    planName: { type: String },
    isPro: { type: Boolean, default: false },
    remainingCredits: { type: Number, default: 0, min: 0 },
    lifetimeCreditsPurchased: { type: Number, default: 0, min: 0 },
    lastPurchaseAt: { type: Date },
    currentPeriodEnd: { type: Date },
  },
  { timestamps: true }
);

BillingSchema.index({ userId: 1 });

export default mongoose.models.Billing ||
  mongoose.model<IBilling>("Billing", BillingSchema);
