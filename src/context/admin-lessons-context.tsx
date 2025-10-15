"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import {
  CreateLessonRequest,
  Lesson,
  LessonsFilterParams,
  PaginationInfo,
} from "@/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface LessonWithStats extends Lesson {
  completionCount?: number;
  averageScore?: number;
  totalAttempts?: number;
}

interface AdminLessonsContextValue {
  // Data
  lessons: LessonWithStats[];
  loading: boolean;
  pagination: PaginationInfo | null;

  // Filters
  searchTerm: string;
  selectedSkill: string;
  selectedDifficulty: string;
  selectedStatus: string;
  setSearchTerm: (v: string) => void;
  setSelectedSkill: (v: string) => void;
  setSelectedDifficulty: (v: string) => void;
  setSelectedStatus: (v: string) => void;

  // Pagination
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;

  // Modals and selections
  showCreateModal: boolean;
  setShowCreateModal: (v: boolean) => void;
  showAIModal: boolean;
  setShowAIModal: (v: boolean) => void;
  editingLesson: Lesson | null;
  setEditingLesson: (l: Lesson | null) => void;
  previewLesson: Lesson | null;
  setPreviewLesson: (l: Lesson | null) => void;
  deletingLesson: Lesson | null;
  setDeletingLesson: (l: Lesson | null) => void;

  // Actions
  fetchLessons: () => Promise<void>;
  handleCreateLesson: (lessonData: CreateLessonRequest) => Promise<void>;
  handleUpdateLesson: (lessonData: CreateLessonRequest) => Promise<void>;
  handleDeleteLesson: (lessonId: string) => Promise<void>;
}

const AdminLessonsContext = createContext<AdminLessonsContextValue | undefined>(
  undefined
);

export function AdminLessonsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useRequireAuth();

  const [lessons, setLessons] = useState<LessonWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLessons();
    }
  }, [isAuthenticated]);

  // Trigger API call when filters or pagination change
  useEffect(() => {
    if (isAuthenticated) {
      fetchLessons();
    }
  }, [
    currentPage,
    itemsPerPage,
    selectedSkill,
    selectedDifficulty,
    selectedStatus,
  ]);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    if (!isAuthenticated) return;

    const timeoutId = setTimeout(() => {
      fetchLessons();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchLessons = async () => {
    try {
      setLoading(true);

      // Build filter parameters
      const filterParams: LessonsFilterParams = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchTerm) {
        filterParams.search = searchTerm;
      }
      if (selectedSkill !== "all") {
        filterParams.skill = selectedSkill;
      }
      if (selectedDifficulty !== "all") {
        filterParams.difficulty = selectedDifficulty;
      }
      // Note: status filtering would need to be implemented in the API
      // For now, we'll skip it or map it to existing fields

      const response = await apiClient.getLessons(filterParams);

      // Add mock stats for admin view
      const lessonsWithStats = response.lessons.map((lesson: Lesson) => ({
        ...lesson,
        completionCount: Math.floor(Math.random() * 100) + 10,
        averageScore: Math.floor(Math.random() * 40) + 60,
        totalAttempts: Math.floor(Math.random() * 200) + 50,
        isAIGenerated: Math.random() > 0.7,
      }));

      setLessons(lessonsWithStats);
      setPagination(response.pagination || null);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (lessonData: CreateLessonRequest) => {
    try {
      await apiClient.createLesson(lessonData);
      setShowCreateModal(false);
      // Refresh the lessons list to get updated data from server
      await fetchLessons();
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  const handleUpdateLesson = async (lessonData: CreateLessonRequest) => {
    if (!editingLesson) return;

    try {
      console.log("Updating lesson:", lessonData);
      await apiClient.updateLesson(editingLesson._id, lessonData);
      setEditingLesson(null);
      // Refresh the lessons list to get updated data from server
      await fetchLessons();
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      console.log("Deleting lesson:", lessonId);
      await apiClient.deleteLesson(lessonId);
      setDeletingLesson(null);
      await fetchLessons();
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  const value = useMemo<AdminLessonsContextValue>(
    () => ({
      lessons,
      loading,
      pagination,
      searchTerm,
      selectedSkill,
      selectedDifficulty,
      selectedStatus,
      setSearchTerm,
      setSelectedSkill,
      setSelectedDifficulty,
      setSelectedStatus,
      currentPage,
      itemsPerPage,
      setCurrentPage,
      setItemsPerPage,
      showCreateModal,
      setShowCreateModal,
      showAIModal,
      setShowAIModal,
      editingLesson,
      setEditingLesson,
      previewLesson,
      setPreviewLesson,
      deletingLesson,
      setDeletingLesson,
      fetchLessons,
      handleCreateLesson,
      handleUpdateLesson,
      handleDeleteLesson,
    }),
    [
      lessons,
      loading,
      pagination,
      searchTerm,
      selectedSkill,
      selectedDifficulty,
      selectedStatus,
      currentPage,
      itemsPerPage,
      showCreateModal,
      showAIModal,
      editingLesson,
      previewLesson,
      deletingLesson,
    ]
  );

  return (
    <AdminLessonsContext.Provider value={value}>
      {children}
    </AdminLessonsContext.Provider>
  );
}

export function useAdminLessons() {
  const ctx = useContext(AdminLessonsContext);
  if (!ctx)
    throw new Error("useAdminLessons must be used within AdminLessonsProvider");
  return ctx;
}
