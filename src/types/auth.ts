// Auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  level?: "beginner" | "intermediate" | "advanced";
  goals?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  level: "beginner" | "intermediate" | "advanced";
  goals: string;
  streak: number;
  preferences: {
    language: string;
    notifications: boolean;
    difficulty: "easy" | "medium" | "hard";
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface UpdateUserRequest {
  name?: string;
  level?: "beginner" | "intermediate" | "advanced";
  goals?: string;
  preferences?: {
    language?: string;
    notifications?: boolean;
    difficulty?: "easy" | "medium" | "hard";
  };
}
