"use client";

import { LessonCard } from "@/components/dashboard/lesson-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { difficulties, skills } from "@/constant/lesson.constant";
import { useRequireAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { Lesson } from "@/types";
import {
  BookOpen,
  Brain,
  Filter,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LessonWithProgress extends Lesson {
  progress?: {
    completed: boolean;
    score: number;
    timeSpent: number;
    attempts: number;
  };
  isAIGenerated?: boolean;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function LessonsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const router = useRouter();

  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(9);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [showAIGenerated, setShowAIGenerated] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLessons();
    }
  }, [
    isAuthenticated,
    page,
    limit,
    searchTerm,
    selectedSkill,
    selectedDifficulty,
    selectedTopic,
    showAIGenerated,
  ]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getLessons({
        page,
        limit,
        search: searchTerm || undefined,
        skill: selectedSkill === "all" ? undefined : selectedSkill,
        difficulty:
          selectedDifficulty === "all" ? undefined : selectedDifficulty,
        // tags/topic not supported explicitly; could map selectedTopic to tags
      });

      const lessonsWithProgress = response.lessons.map((lesson: Lesson) => ({
        ...lesson,
        // keep mock progress for UI continuity
        progress:
          Math.random() > 0.5
            ? {
                completed: Math.random() > 0.3,
                score: Math.floor(Math.random() * 40) + 60,
                timeSpent: Math.floor(Math.random() * 20) + 5,
                attempts: Math.floor(Math.random() * 3) + 1,
              }
            : undefined,
        isAIGenerated: Math.random() > 0.7,
      }));

      setLessons(lessonsWithProgress);
      // @ts-ignore API type
      setPagination(response.pagination as PaginationInfo);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setPage(1);
    fetchLessons();
  };

  const handleStartLesson = async (lesson: LessonWithProgress) => {
    try {
      // Update lesson progress if not completed
      if (!lesson.progress?.completed) {
        await apiClient.updateProgress({
          lessonId: lesson._id,
          score: 1,
          timeSpent: 15,
          skill: lesson.type,
        });
      }

      router.push(`/dashboard/lessons/${lesson._id}`);
    } catch (error) {
      console.error("Error starting lesson:", error);
    }
  };

  const getSkillInfo = (skill: string) => {
    return (
      skills.find((s) => s.value === skill) || {
        value: skill,
        label: skill,
        icon: "📚",
      }
    );
  };

  const getDifficultyInfo = (difficulty: string) => {
    return (
      difficulties.find((d) => d.value === difficulty) || {
        value: difficulty,
        label: difficulty,
        color: "bg-gray-100 text-gray-700",
      }
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lessons English
          </h1>
          <p className="text-gray-600">
            Explore and learn with hundreds of lessons optimized by AI
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total lessons
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {lessons.length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {lessons.filter((l) => l.progress?.completed).length}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  AI generated
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {lessons.filter((l) => l.isAIGenerated).length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average score
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {lessons.filter((l) => l.progress?.score).length > 0
                    ? Math.round(
                        lessons.reduce(
                          (sum, l) => sum + (l.progress?.score || 0),
                          0
                        ) / lessons.filter((l) => l.progress?.score).length
                      )
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Skill Filter */}
            <Select
              value={selectedSkill}
              onValueChange={(v) => setSelectedSkill(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All skills</SelectItem>
                {skills.map((skill) => (
                  <SelectItem key={skill.value} value={skill.value}>
                    {skill.icon} {skill.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty Filter */}
            <Select
              value={selectedDifficulty}
              onValueChange={(v) => setSelectedDifficulty(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All difficulty</SelectItem>
                {difficulties.map((diff) => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Topic Filter */}
            {/* <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Chủ đề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chủ đề</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            {/* AI Generated Filter */}
            <Select
              value={
                showAIGenerated === null
                  ? "all"
                  : showAIGenerated
                  ? "ai"
                  : "manual"
              }
              onValueChange={(value) =>
                setShowAIGenerated(value === "all" ? null : value === "ai")
              }>
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ai">🤖 AI Generated</SelectItem>
                <SelectItem value="manual">👨‍🏫 Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={applyFilters}>Apply</Button>
            <Select
              value={String(limit)}
              onValueChange={(v) => setLimit(parseInt(v))}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 / page</SelectItem>
                <SelectItem value="9">9 / page</SelectItem>
                <SelectItem value="12">12 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Lessons Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => {
              const skillInfo = getSkillInfo(lesson.type);
              const difficultyInfo = getDifficultyInfo(lesson.difficulty);
              const difficultyPretty = (
                difficultyInfo.label || "beginner"
              ).toLowerCase();
              const difficultyMapped =
                difficultyPretty === "beginner"
                  ? "Beginner"
                  : difficultyPretty === "intermediate"
                  ? "Intermediate"
                  : "Advanced";

              return (
                <LessonCard
                  key={lesson._id}
                  icon={<span className="text-base">{skillInfo.icon}</span>}
                  lessonType={skillInfo.label}
                  difficulty={
                    difficultyMapped as "Beginner" | "Intermediate" | "Advanced"
                  }
                  title={lesson.title}
                  description={lesson.description}
                  duration={lesson.estimatedTime}
                  progress={lesson.progress?.score}
                  isCompleted={Boolean(lesson.progress?.completed)}
                  onClick={() => handleStartLesson(lesson)}
                />
              );
            })}
          </div>
        )}
        {lessons.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No lessons found
            </h3>
            <p className="text-gray-600">
              Try changing the filters or search with a different keyword
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages} •{" "}
              {pagination.totalItems} lessons
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </Button>
              <Button
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={() =>
                  setPage((p) => (pagination?.hasNextPage ? p + 1 : p))
                }>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
