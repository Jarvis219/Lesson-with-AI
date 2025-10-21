import type {
  AddPaymentMethodRequest,
  AddPaymentMethodResponse,
  GetPaymentMethodsResponse,
  GetScheduleResponse,
  SetPrimaryPaymentMethodRequest,
  SetPrimaryPaymentMethodResponse,
  UpdatePaymentInfoRequest,
  UpdatePaymentInfoResponse,
  UpdatePaymentMethodRequest,
  UpdatePaymentMethodResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdateScheduleRequest,
  UpdateScheduleResponse,
  UploadAvatarResponse,
} from "@/types/teacher-profile";
import { apiService } from "./axios";

class TeacherProfileService {
  /**
   * Update teacher profile information
   */
  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    const response = await apiService.patch<UpdateProfileResponse>(
      "/api/teacher/profile",
      data
    );
    return response.data;
  }

  /**
   * Upload teacher avatar
   */
  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiService.post<UploadAvatarResponse>(
      "/api/teacher/profile/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  /**
   * Remove teacher avatar
   */
  async removeAvatar(): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(
      "/api/teacher/profile/avatar"
    );
    return response.data;
  }

  /**
   * Get teaching schedule
   */
  async getSchedule(): Promise<GetScheduleResponse> {
    const response = await apiService.get<GetScheduleResponse>(
      "/api/teacher/profile/schedule"
    );
    return response.data;
  }

  /**
   * Update teaching schedule
   */
  async updateSchedule(
    data: UpdateScheduleRequest
  ): Promise<UpdateScheduleResponse> {
    const response = await apiService.patch<UpdateScheduleResponse>(
      "/api/teacher/profile/schedule",
      data
    );
    return response.data;
  }

  /**
   * Get all payment methods
   */
  async getPaymentMethods(): Promise<GetPaymentMethodsResponse> {
    const response = await apiService.get<GetPaymentMethodsResponse>(
      "/api/teacher/profile/payment"
    );
    return response.data;
  }

  /**
   * Add new payment method
   */
  async addPaymentMethod(
    data: AddPaymentMethodRequest
  ): Promise<AddPaymentMethodResponse> {
    const response = await apiService.post<AddPaymentMethodResponse>(
      "/api/teacher/profile/payment",
      data
    );
    return response.data;
  }

  /**
   * Update existing payment method
   */
  async updatePaymentMethod(
    data: UpdatePaymentMethodRequest
  ): Promise<UpdatePaymentMethodResponse> {
    const response = await apiService.patch<UpdatePaymentMethodResponse>(
      "/api/teacher/profile/payment",
      data
    );
    return response.data;
  }

  /**
   * Set primary payment method
   */
  async setPrimaryPaymentMethod(
    data: SetPrimaryPaymentMethodRequest
  ): Promise<SetPrimaryPaymentMethodResponse> {
    const response = await apiService.put<SetPrimaryPaymentMethodResponse>(
      "/api/teacher/profile/payment",
      data
    );
    return response.data;
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(
    paymentMethodId: string
  ): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(
      `/api/teacher/profile/payment?id=${paymentMethodId}`
    );
    return response.data;
  }

  /**
   * Update payment information (Legacy method for backward compatibility)
   */
  async updatePaymentInfo(
    data: UpdatePaymentInfoRequest
  ): Promise<UpdatePaymentInfoResponse> {
    const response = await apiService.patch<UpdatePaymentInfoResponse>(
      "/api/teacher/profile/payment",
      data
    );
    return response.data;
  }
}

export const teacherProfileService = new TeacherProfileService();
