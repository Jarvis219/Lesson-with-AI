import {
  AIGrammarRequest,
  AILessonPlanRequest,
  AIResponse,
  AISpeakingRequest,
  AISuggestion,
  AIVocabRequest,
  AchievementsResponse,
  ApiResponse,
  CreateLessonRequest,
  DashboardStats,
  Lesson,
  LessonProgressRequest,
  LessonProgressSubmitResponse,
  LessonResultResponse,
  LessonsFilterParams,
  LessonsResponse,
  ProgressStats,
  UpdateWeeklyGoalRequest,
} from "@/types";
import {
  LessonFeedbackRequest,
  LessonFeedbackResponse,
} from "@/types/feedback";
import { apiService } from "./axios";

// API Client class
export class ApiClient {
  private static instance: ApiClient;

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiService.get<
      ApiResponse<{ stats: DashboardStats }>
    >("/api/dashboard/stats");

    return response.data.stats;
  }

  async getStudentStats(): Promise<DashboardStats> {
    const response = await apiService.get<
      ApiResponse<{ stats: DashboardStats }>
    >("/api/student/stats");

    return response.data.stats;
  }

  async getAISuggestions(): Promise<AISuggestion[]> {
    const response = await apiService.get<
      ApiResponse<{ suggestions: AISuggestion[] }>
    >("/api/dashboard/suggestions");
    return response.data.suggestions;
  }

  async getAchievements(): Promise<AchievementsResponse> {
    const response = await apiService.get<ApiResponse<AchievementsResponse>>(
      "/api/dashboard/achievements"
    );
    return response.data;
  }

  async updateWeeklyGoal(goal: number): Promise<{ weeklyGoal: number }> {
    const response = await apiService.put<ApiResponse<{ weeklyGoal: number }>>(
      "/api/dashboard/goals",
      { weeklyGoal: goal }
    );
    return response.data;
  }

  // Progress APIs
  async getProgress(): Promise<ProgressStats> {
    const response = await apiService.get<
      ApiResponse<{ progress: ProgressStats }>
    >("/api/progress");
    return response.data.progress;
  }

  async getProgressStats(): Promise<DashboardStats> {
    const response = await apiService.get<
      ApiResponse<{ stats: DashboardStats }>
    >("/api/progress/stats");

    return response.data.stats;
  }

  async updateProgress(
    data: LessonProgressRequest
  ): Promise<{ message: string }> {
    const response = await apiService.post<ApiResponse<{ message: string }>>(
      "/api/lessons/progress",
      data
    );
    return response.data;
  }

  async updateProgressSettings(
    data: UpdateWeeklyGoalRequest
  ): Promise<{ message: string }> {
    const response = await apiService.put<ApiResponse<{ message: string }>>(
      "/api/progress",
      data
    );
    return response.data;
  }

  // AI APIs
  async generateGrammarLesson(request: AIGrammarRequest): Promise<AIResponse> {
    const response = await apiService.post<ApiResponse<AIResponse>>(
      "/api/ai/grammar",
      request
    );
    return response.data;
  }

  async generateVocabularyLesson(request: AIVocabRequest): Promise<AIResponse> {
    const response = await apiService.post<ApiResponse<AIResponse>>(
      "/api/ai/vocab",
      request
    );
    return response.data;
  }

  async generateSpeakingLesson(
    request: AISpeakingRequest
  ): Promise<AIResponse> {
    const response = await apiService.post<ApiResponse<AIResponse>>(
      "/api/ai/speaking",
      request
    );
    return response.data;
  }

  async generateLessonPlan(
    request: AILessonPlanRequest,
    numberOfQuestions = 10
  ): Promise<{ lesson: Lesson }> {
    const response = await apiService.post<ApiResponse<{ lesson: Lesson }>>(
      "/api/ai/lesson-plan",
      { ...request, numberOfQuestions }
    );
    return response.data;
  }

  // Lessons APIs
  async getLessons(params?: LessonsFilterParams): Promise<LessonsResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "all") {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/lessons${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await apiService.get<ApiResponse<LessonsResponse>>(url);
    return response.data;
  }

  async getLesson(id: string): Promise<{ lesson: Lesson }> {
    const response = await apiService.get<ApiResponse<{ lesson: Lesson }>>(
      `/api/lessons/${id}`
    );
    return response.data;
  }

  async createAILesson(
    request: AILessonPlanRequest
  ): Promise<{ lesson: Lesson }> {
    const response = await apiService.post<ApiResponse<{ lesson: Lesson }>>(
      "/api/lessons/ai",
      request
    );
    return response.data;
  }

  async createLesson(
    request: CreateLessonRequest,
    numberOfQuestions = 10
  ): Promise<{ lesson: Lesson }> {
    const response = await apiService.post<
      ApiResponse<{ lesson: Lesson; numberOfQuestions: number }>
    >("/api/lessons", { ...request, numberOfQuestions });
    return response.data;
  }

  async updateLesson(
    id: string,
    request: CreateLessonRequest
  ): Promise<{ lesson: Lesson }> {
    const response = await apiService.put<ApiResponse<{ lesson: Lesson }>>(
      `/api/lessons/${id}`,
      request
    );
    return response.data;
  }

  async deleteLesson(id: string): Promise<{ message: string }> {
    const response = await apiService.delete<ApiResponse<{ message: string }>>(
      `/api/lessons/${id}`
    );
    return response.data;
  }

  async getLessonFeedback(
    data: LessonFeedbackRequest & { lessonId?: string }
  ): Promise<{ feedback: LessonFeedbackResponse }> {
    const response = await apiService.post<
      ApiResponse<{ feedback: LessonFeedbackResponse }>
    >(`/api/lessons/feedback`, data);
    return response.data;
  }

  async getLessonResult(id: string): Promise<LessonResultResponse> {
    const response = await apiService.get<ApiResponse<LessonResultResponse>>(
      `/api/lessons/${id}/result`
    );
    return response.data;
  }

  // Lesson Progress APIs
  async submitLessonProgress(progressData: {
    lessonId: string;
    timeSpent: number;
    userAnswers: Record<string, string>;
    exercises: any[];
    lessonType: string;
  }): Promise<LessonProgressSubmitResponse> {
    const response = await apiService.post<
      ApiResponse<LessonProgressSubmitResponse>
    >("/api/lessons/progress", progressData);
    return response.data;
  }

  async getLessonProgress(lessonId: string): Promise<any> {
    const response = await apiService.get<ApiResponse<{ progress: any }>>(
      `/api/lessons/progress?lessonId=${lessonId}`
    );
    return response.data.progress;
  }

  // Lesson History APIs
  async getLessonHistory(params?: {
    limit?: number;
    offset?: number;
    lessonId?: string;
  }): Promise<{
    lessonHistory: any[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.lessonId) queryParams.append("lessonId", params.lessonId);

    const response = await apiService.get<
      ApiResponse<{
        lessonHistory: any[];
        totalCount: number;
        hasMore: boolean;
      }>
    >(`/api/lessons/history?${queryParams.toString()}`);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();
