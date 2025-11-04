import { apiService } from "@/lib/axios";
import {
  PricingPlanDTO,
  PricingPlansResponse,
  PurchaseResponse,
} from "@/types/billing";

export class PlanService {
  /**
   * Fetch active pricing plans (credits, monthly, yearly)
   */
  static async getPlans(): Promise<PricingPlanDTO[]> {
    const response = await apiService.get<PricingPlansResponse>(
      "/api/billing/plans"
    );
    return response.data.plans || [];
  }

  /**
   * Purchase a plan (credit pack or subscription)
   */
  static async purchase(planId: string): Promise<PurchaseResponse> {
    const response = await apiService.post<PurchaseResponse>(
      "/api/billing/purchase",
      { planId }
    );
    return response.data;
  }
}
