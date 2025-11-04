import { apiService } from "@/lib/axios";
import type { BillingStatusDTO } from "@/types/billing";

export class BillingService {
  /**
   * Get current user's billing/credits status
   */
  static async getStatus(): Promise<BillingStatusDTO> {
    const response = await apiService.get<BillingStatusDTO>(
      "/api/billing/credits"
    );
    return response.data;
  }
}
