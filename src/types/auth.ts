// Auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: "student" | "teacher" | "admin";
  level?: "beginner" | "intermediate" | "advanced";
  goals?: string;
  teacherBio?: string;
  teacherQualification?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "student" | "teacher" | "admin";
  level: "beginner" | "intermediate" | "advanced";
  goals: string;
  streak: number;
  preferences: {
    language: string;
    notifications: boolean;
    difficulty: "easy" | "medium" | "hard";
  };
  isTeacherApproved?: boolean;
  teacherBio?: string;
  teacherQualification?: string;
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
