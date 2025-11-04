export type PlanType = "credits" | "subscription";

export interface PricingPlanDTO {
  _id: string;
  name: string;
  description?: string;
  type: PlanType;
  price: number; // cents
  currency: string; // e.g., USD
  creditsIncluded?: number;
  isUnlimitedCredits: boolean;
  interval?: "month" | "year";
  features?: string[];
}

export interface PricingPlansResponse {
  plans: PricingPlanDTO[];
}

export interface PurchaseResponse {
  success: boolean;
}

export interface BillingStatusDTO {
  isPro: boolean;
  remainingCredits: number;
  currentPlanName: string | null;
  currentPeriodEnd?: string | null;
}
