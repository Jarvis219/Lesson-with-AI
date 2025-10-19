import { axiosInstance } from "./axios";

export interface AIGenerateLessonRequest {
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedTime: number;
  topic: string;
  numberOfExercises: number;
}

export interface AIGenerateLessonResponse {
  lesson: {
    title: string;
    description: string;
    type: string;
    difficulty: string;
    estimatedTime: number;
    tags: string[];
    content: any;
  };
}

export class AIService {
  /**
   * Generate lesson content using AI
   */
  static async generateLesson(
    data: AIGenerateLessonRequest
  ): Promise<AIGenerateLessonResponse> {
    const response = await axiosInstance.post<AIGenerateLessonResponse>(
      "/api/ai/generate-lesson",
      data
    );
    return response.data;
  }

  /**
   * Generate grammar explanation using AI
   */
  static async generateGrammar(data: any): Promise<any> {
    const response = await axiosInstance.post("/api/ai/grammar", data);
    return response.data;
  }

  /**
   * Generate vocabulary using AI
   */
  static async generateVocabulary(data: any): Promise<any> {
    const response = await axiosInstance.post("/api/ai/vocab", data);
    return response.data;
  }

  /**
   * Generate lesson plan using AI
   */
  static async generateLessonPlan(data: any): Promise<any> {
    const response = await axiosInstance.post("/api/ai/lesson-plan", data);
    return response.data;
  }

  /**
   * Generate speaking exercise using AI
   */
  static async generateSpeaking(data: any): Promise<any> {
    const response = await axiosInstance.post("/api/ai/speaking", data);
    return response.data;
  }
}
