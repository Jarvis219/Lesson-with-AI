import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { toastEventEmitter } from "./toast-event-emitter";

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  // timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Token management
class TokenManager {
  private static instance: TokenManager;
  private token: string | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setToken(token: string): void {
    this.token = token;
    console.log("auth_token", token);
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
    return this.token;
  }

  removeToken(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const tokenManager = TokenManager.getInstance();
    const token = tokenManager.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and show toast notifications
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const tokenManager = TokenManager.getInstance();
      tokenManager.removeToken();

      // Redirect to login page if we're on client side
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/auth")
      ) {
        window.location.href = "/auth";
      }
    }

    // Emit toast event for error notifications
    if (typeof window !== "undefined") {
      const errorMessage =
        error.response?.data?.error || error.message || "An error occurred";
      const statusCode = error.response?.status;

      // Don't show toast for 401 errors (already handled with redirect)
      if (statusCode !== 401) {
        toastEventEmitter.error(
          errorMessage,
          `Error ${statusCode ? `(${statusCode})` : ""}`,
          5000
        );
      }
    }

    return Promise.reject(error);
  }
);

// API Service class
export class ApiService {
  private static instance: ApiService;
  private tokenManager: TokenManager;

  constructor() {
    this.tokenManager = TokenManager.getInstance();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Generic request methods
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<any, any, {}>> {
    const response = await axiosInstance.get(url, config);
    return response;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<any, any, {}>> {
    const response = await axiosInstance.post(url, data, config);
    return response;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<any, any, {}>> {
    const response = await axiosInstance.put(url, data, config);
    return response;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<any, any, {}>> {
    const response = await axiosInstance.patch(url, data, config);
    return response;
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<any, any, {}>> {
    const response = await axiosInstance.delete<AxiosResponse<any, any, {}>>(
      url,
      config
    );
    return response;
  }

  // Auth methods
  setAuthToken(token: string): void {
    this.tokenManager.setToken(token);
  }

  removeAuthToken(): void {
    this.tokenManager.removeToken();
  }

  getAuthToken(): string | null {
    return this.tokenManager.getToken();
  }

  isAuthenticated(): boolean {
    return this.tokenManager.isAuthenticated();
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();

// Export the axios instance for direct use if needed
export { axiosInstance };

// Export token manager for advanced usage
export { TokenManager };
