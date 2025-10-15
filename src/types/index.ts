// Re-export all types from individual files
export * from "./ai";
export * from "./auth";
export * from "./dashboard";
export * from "./lessons";
export * from "./progress";

// Common types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}
