import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
} from "@/types";
import { apiService } from "./axios";

// Auth Service class
export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      "/api/auth/login",
      credentials
    );

    if (response.data?.token) {
      apiService.setAuthToken(response.data.token);
    }

    return response.data;
  }

  // Register user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<ApiResponse<AuthResponse>>(
        "/api/auth/register",
        userData
      );

      if (response.data?.token) {
        apiService.setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Đăng ký thất bại");
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiService.post("/api/auth/logout");
    } catch (error) {
      // Continue with logout even if API call fails
      console.error("Logout API error:", error);
    } finally {
      apiService.removeAuthToken();
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<ApiResponse<User>>("/api/auth/me");
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Cannot get user data");
    }
  }

  // Update user profile
  async updateProfile(updates: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiService.put<ApiResponse<User>>(
        "/api/auth/me",
        updates
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Cannot update user data");
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }

  // Get stored token
  getToken(): string | null {
    return apiService.getAuthToken();
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Helper function to check auth status
export const isAuthenticated = (): boolean => {
  return authService.isAuthenticated();
};

// Helper function to get current user with error handling
export const getCurrentUserSafe = async (): Promise<User | null> => {
  try {
    if (!isAuthenticated()) {
      return null;
    }
    return await authService.getCurrentUser();
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
