"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { CreateLessonRequest, Lesson } from "@/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface LessonWithStats extends Lesson {
  completionCount?: number;
  averageScore?: number;
  totalAttempts?: number;
}

interface AdminLessonsContextValue {
  // Data
  lessons: LessonWithStats[];
  filteredLessons: LessonWithStats[];
  loading: boolean;

  // Filters
  searchTerm: string;
  selectedSkill: string;
  selectedDifficulty: string;
  selectedStatus: string;
  setSearchTerm: (v: string) => void;
  setSelectedSkill: (v: string) => void;
  setSelectedDifficulty: (v: string) => void;
  setSelectedStatus: (v: string) => void;

  // Modals and selections
  showCreateModal: boolean;
  setShowCreateModal: (v: boolean) => void;
  showAIModal: boolean;
  setShowAIModal: (v: boolean) => void;
  editingLesson: Lesson | null;
  setEditingLesson: (l: Lesson | null) => void;
  previewLesson: Lesson | null;
  setPreviewLesson: (l: Lesson | null) => void;

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
  const [filteredLessons, setFilteredLessons] = useState<LessonWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLessons();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = [...lessons];

    if (searchTerm) {
      filtered = filtered.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSkill !== "all") {
      filtered = filtered.filter((lesson) => lesson.type === selectedSkill);
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (lesson) => lesson.difficulty === selectedDifficulty
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(() => Math.random() > 0.3);
    }

    setFilteredLessons(filtered);
  }, [lessons, searchTerm, selectedSkill, selectedDifficulty, selectedStatus]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getLessons();
      const lessonsWithStats = response.lessons.map((lesson: Lesson) => ({
        ...lesson,
        completionCount: Math.floor(Math.random() * 100) + 10,
        averageScore: Math.floor(Math.random() * 40) + 60,
        totalAttempts: Math.floor(Math.random() * 200) + 50,
        isAIGenerated: Math.random() > 0.7,
      }));
      setLessons(lessonsWithStats);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (lessonData: CreateLessonRequest) => {
    try {
      const response = await apiClient.createLesson(lessonData);
      setLessons((prev) => [...prev, response.lesson]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  const handleUpdateLesson = async (lessonData: CreateLessonRequest) => {
    if (!editingLesson) return;

    try {
      console.log("Updating lesson:", lessonData);
      const response = await apiClient.updateLesson(
        editingLesson._id,
        lessonData
      );
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson._id === editingLesson._id ? response.lesson : lesson
        )
      );
      setEditingLesson(null);
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      try {
        console.log("Deleting lesson:", lessonId);
        fetchLessons();
      } catch (error) {
        console.error("Error deleting lesson:", error);
      }
    }
  };

  const value = useMemo<AdminLessonsContextValue>(
    () => ({
      lessons,
      filteredLessons,
      loading,
      searchTerm,
      selectedSkill,
      selectedDifficulty,
      selectedStatus,
      setSearchTerm,
      setSelectedSkill,
      setSelectedDifficulty,
      setSelectedStatus,
      showCreateModal,
      setShowCreateModal,
      showAIModal,
      setShowAIModal,
      editingLesson,
      setEditingLesson,
      previewLesson,
      setPreviewLesson,
      fetchLessons,
      handleCreateLesson,
      handleUpdateLesson,
      handleDeleteLesson,
    }),
    [
      lessons,
      filteredLessons,
      loading,
      searchTerm,
      selectedSkill,
      selectedDifficulty,
      selectedStatus,
      showCreateModal,
      showAIModal,
      editingLesson,
      previewLesson,
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
