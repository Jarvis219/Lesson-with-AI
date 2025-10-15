"use client";

import { Badge } from "@/components/ui/badge";
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
import { useRequireAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { Lesson } from "@/types";
import {
  BookOpen,
  Brain,
  Clock,
  Filter,
  Play,
  Search,
  Star,
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

export default function LessonsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const router = useRouter();

  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<LessonWithProgress[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [showAIGenerated, setShowAIGenerated] = useState<boolean | null>(null);

  const skills = [
    { value: "vocab", label: "Từ vựng", icon: "📚" },
    { value: "grammar", label: "Ngữ pháp", icon: "📝" },
    { value: "listening", label: "Nghe", icon: "👂" },
    { value: "speaking", label: "Nói", icon: "🗣️" },
    { value: "reading", label: "Đọc", icon: "📖" },
    { value: "writing", label: "Viết", icon: "✍️" },
  ];

  const difficulties = [
    { value: "easy", label: "Dễ", color: "bg-green-100 text-green-700" },
    {
      value: "medium",
      label: "Trung bình",
      color: "bg-yellow-100 text-yellow-700",
    },
    { value: "hard", label: "Khó", color: "bg-red-100 text-red-700" },
  ];

  const topics = [
    "Giao tiếp hàng ngày",
    "Công việc",
    "Du lịch",
    "Học tập",
    "Gia đình",
    "Thời tiết",
    "Thể thao",
    "Ẩm thực",
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchLessons();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterLessons();
  }, [
    lessons,
    searchTerm,
    selectedSkill,
    selectedDifficulty,
    selectedTopic,
    showAIGenerated,
  ]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getLessons();

      // Mock progress data (in real app, this would come from API)
      const lessonsWithProgress = response.lessons.map((lesson: Lesson) => ({
        ...lesson,
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
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterLessons = () => {
    let filtered = [...lessons];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Skill filter
    if (selectedSkill !== "all") {
      filtered = filtered.filter((lesson) => lesson.skill === selectedSkill);
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (lesson) => lesson.difficulty === selectedDifficulty
      );
    }

    // Topic filter (mock - in real app would be based on lesson tags)
    if (selectedTopic !== "all") {
      filtered = filtered.filter(() => Math.random() > 0.3); // Mock filter
    }

    // AI Generated filter
    if (showAIGenerated !== null) {
      filtered = filtered.filter(
        (lesson) => lesson.isAIGenerated === showAIGenerated
      );
    }

    setFilteredLessons(filtered);
  };

  const handleStartLesson = async (lesson: LessonWithProgress) => {
    try {
      // Update lesson progress if not completed
      if (!lesson.progress?.completed) {
        await apiClient.updateProgress({
          lessonId: lesson._id,
          score: 0,
          timeSpent: 0,
          skill: lesson.skill,
        });
      }

      router.push(`/lessons/${lesson._id}`);
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

  const getProgressColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
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
            Bài Học Tiếng Anh
          </h1>
          <p className="text-gray-600">
            Khám phá và học tập với hàng trăm bài học được tối ưu hóa bởi AI
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng bài học
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
                <p className="text-sm font-medium text-gray-600">
                  Đã hoàn thành
                </p>
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
                  AI Generated
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
                <p className="text-sm font-medium text-gray-600">Điểm TB</p>
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
            <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm bài học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Skill Filter */}
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Kỹ năng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kỹ năng</SelectItem>
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
              onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả độ khó</SelectItem>
                {difficulties.map((diff) => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Topic Filter */}
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
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
            </Select>

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
                <SelectValue placeholder="Nguồn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="ai">🤖 AI Generated</SelectItem>
                <SelectItem value="manual">👨‍🏫 Manual</SelectItem>
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
            {filteredLessons.map((lesson) => {
              const skillInfo = getSkillInfo(lesson.skill);
              const difficultyInfo = getDifficultyInfo(lesson.difficulty);

              return (
                <Card
                  key={lesson._id}
                  className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${difficultyInfo.color} border-0`}>
                          {difficultyInfo.label}
                        </Badge>
                        {lesson.isAIGenerated && (
                          <Badge className="bg-purple-100 text-purple-700 border-0">
                            🤖 AI
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {lesson.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{skillInfo.icon}</span>
                      <span>{skillInfo.label}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{lesson.estimatedTime} phút</span>
                    </div>

                    {lesson.progress && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Tiến trình:</span>
                          <span
                            className={`font-medium ${getProgressColor(
                              lesson.progress.score
                            )}`}>
                            {lesson.progress.score}%
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              lesson.progress.score >= 80
                                ? "bg-green-500"
                                : lesson.progress.score >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${lesson.progress.score}%`,
                            }}></div>
                        </div>

                        {lesson.progress.completed && (
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <Star className="h-4 w-4 fill-current" />
                            <span>Đã hoàn thành</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleStartLesson(lesson)}
                    className="w-full bg-blue-600 hover:bg-blue-700">
                    <Play className="h-4 w-4 mr-2" />
                    {lesson.progress?.completed
                      ? "Học lại"
                      : lesson.progress
                      ? "Học tiếp"
                      : "Bắt đầu học"}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}

        {filteredLessons.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy bài học nào
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
