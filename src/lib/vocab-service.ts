import { apiService } from "@/lib/axios";
import {
  CreateVocabListRequest,
  CreateVocabularyRequest,
  VocabList,
  VocabListResponse,
  VocabularyItem,
  VocabularyListResponse,
} from "@/types/vocab";

export const vocabService = {
  async listVocabLists(params?: {
    q?: string;
    active?: boolean;
    page?: number;
    limit?: number;
  }): Promise<VocabListResponse> {
    const search = new URLSearchParams();
    if (params?.q) search.set("q", params.q);
    if (typeof params?.active === "boolean")
      search.set("active", String(params.active));
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    const res = await apiService.get<VocabListResponse>(
      `/api/vocab-lists${search.toString() ? `?${search.toString()}` : ""}`
    );
    return res.data;
  },

  async createVocabList(payload: CreateVocabListRequest) {
    const res = await apiService.post<{ list: VocabList }>(
      "/api/vocab-lists",
      payload
    );
    return res.data.list as unknown as VocabList;
  },

  async listVocabulary(params?: {
    q?: string;
    category?: string;
    level?: string;
    pos?: string;
    page?: number;
    limit?: number;
  }) {
    const search = new URLSearchParams();
    if (params?.q) search.set("q", params.q);
    if (params?.category) search.set("category", params.category);
    if (params?.level) search.set("level", params.level);
    if (params?.pos) search.set("pos", params.pos);
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    const res = await apiService.get<VocabularyListResponse>(
      `/api/vocabulary${search.toString() ? `?${search.toString()}` : ""}`
    );
    return res.data as unknown as VocabularyListResponse;
  },

  async createVocabulary(payload: CreateVocabularyRequest) {
    const res = await apiService.post<{ vocabulary: VocabularyItem }>(
      "/api/vocabulary",
      payload
    );
    return res.data.vocabulary as unknown as VocabularyItem;
  },

  async assignVocabulary(params: {
    vocabId: string;
    listId: string;
    action: "add" | "remove";
  }) {
    const res = await apiService.post<{ success: boolean }>(
      "/api/vocabulary/assign",
      params
    );
    return res.data.success;
  },
};
