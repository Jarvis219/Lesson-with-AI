"use client";

import LessonResultModal from "@/components/lessons/lesson-result-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRequireAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { Lesson, Question } from "@/types";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Eye,
  EyeOff,
  Play,
  RotateCcw,
  Target,
  Timer,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LessonProgress {
  currentQuestion: number;
  score: number;
  timeSpent: number;
  answers: Record<string, string | string[]>;
  startTime: Date;
}

export default function LessonDetailPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<LessonProgress>({
    currentQuestion: 0,
    score: 0,
    timeSpent: 0,
    answers: {},
    startTime: new Date(),
  });
  const [showResult, setShowResult] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (isAuthenticated && lessonId) {
      fetchLesson();
    }
  }, [isAuthenticated, lessonId]);

  useEffect(() => {
    // Update timer every second
    const interval = setInterval(() => {
      setProgress((prev) => ({
        ...prev,
        timeSpent: Math.floor(
          (new Date().getTime() - prev.startTime.getTime()) / 1000 / 60
        ),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getLesson(lessonId);
      setLesson(response.lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (
    questionId: string,
    answer: string | string[]
  ) => {
    setProgress((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };

  const handleNextQuestion = () => {
    setProgress((prev) => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
    }));
    setShowAnswer(false);
  };

  const handlePreviousQuestion = () => {
    setProgress((prev) => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
    }));
    setShowAnswer(false);
  };

  const handleFinishLesson = async () => {
    try {
      // Calculate score
      let correctAnswers = 0;
      let totalQuestions = lesson?.questions.length || 0;

      lesson?.questions.forEach((question) => {
        const userAnswer = progress.answers[question.id];
        const correctAnswer = question.correctAnswer;

        if (Array.isArray(correctAnswer)) {
          if (
            Array.isArray(userAnswer) &&
            userAnswer.length === correctAnswer.length &&
            userAnswer.every((ans) => correctAnswer.includes(ans))
          ) {
            correctAnswers++;
          }
        } else {
          if (userAnswer === correctAnswer) {
            correctAnswers++;
          }
        }
      });

      const finalScore = Math.round((correctAnswers / totalQuestions) * 100);

      // Update progress
      await apiClient.updateProgress({
        lessonId: lessonId,
        score: finalScore,
        timeSpent: progress.timeSpent,
        skill: lesson?.type,
      });

      setProgress((prev) => ({
        ...prev,
        score: finalScore,
      }));

      setShowResult(true);
    } catch (error) {
      console.error("Error finishing lesson:", error);
    }
  };

  const getSkillInfo = (skill: string) => {
    const skills = {
      vocab: {
        label: "Từ vựng",
        icon: "📚",
        color: "bg-blue-100 text-blue-700",
      },
      grammar: {
        label: "Ngữ pháp",
        icon: "📝",
        color: "bg-green-100 text-green-700",
      },
      listening: {
        label: "Nghe",
        icon: "👂",
        color: "bg-purple-100 text-purple-700",
      },
      speaking: {
        label: "Nói",
        icon: "🗣️",
        color: "bg-orange-100 text-orange-700",
      },
      reading: {
        label: "Đọc",
        icon: "📖",
        color: "bg-indigo-100 text-indigo-700",
      },
      writing: {
        label: "Viết",
        icon: "✍️",
        color: "bg-pink-100 text-pink-700",
      },
    };
    return (
      skills[skill as keyof typeof skills] || {
        label: skill,
        icon: "📚",
        color: "bg-gray-100 text-gray-700",
      }
    );
  };

  const getDifficultyInfo = (difficulty: string) => {
    const difficulties = {
      easy: { label: "Dễ", color: "bg-green-100 text-green-700" },
      medium: { label: "Trung bình", color: "bg-yellow-100 text-yellow-700" },
      hard: { label: "Khó", color: "bg-red-100 text-red-700" },
    };
    return (
      difficulties[difficulty as keyof typeof difficulties] || {
        label: difficulty,
        color: "bg-gray-100 text-gray-700",
      }
    );
  };

  const renderQuestion = (question: Question) => {
    const userAnswer = progress.answers[question.id];

    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(question.id, option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                  userAnswer === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      userAnswer === option.value
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}>
                    {userAnswer === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium">{option.value}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case "fill-in-the-blank":
        return (
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Nhập câu trả lời của bạn:
              </p>
              <input
                type="text"
                value={(userAnswer as string) || ""}
                onChange={(e) =>
                  handleAnswerSelect(question.id, e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập câu trả lời..."
              />
            </div>
          </div>
        );

      case "true-false":
        return (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswerSelect(question.id, "true")}
              className={`p-6 rounded-lg border-2 transition-colors ${
                userAnswer === "true"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="font-medium text-green-700">Đúng</span>
              </div>
            </button>

            <button
              onClick={() => handleAnswerSelect(question.id, "false")}
              className={`p-6 rounded-lg border-2 transition-colors ${
                userAnswer === "false"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}>
              <div className="flex items-center justify-center gap-2">
                <XCircle className="h-6 w-6 text-red-600" />
                <span className="font-medium text-red-700">Sai</span>
              </div>
            </button>
          </div>
        );

      case "essay":
        return (
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Viết câu trả lời của bạn:
              </p>
              <textarea
                value={(userAnswer as string) || ""}
                onChange={(e) =>
                  handleAnswerSelect(question.id, e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Nhập câu trả lời chi tiết..."
              />
            </div>
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải bài học...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Bài học không tìm thấy
            </h1>
            <Button onClick={() => router.push("/lessons")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = lesson.questions[progress.currentQuestion];
  const progressPercentage =
    ((progress.currentQuestion + 1) / lesson.questions.length) * 100;
  const skillInfo = getSkillInfo(lesson.type);
  const difficultyInfo = getDifficultyInfo(lesson.difficulty);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/lessons")}
            className="mb-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách bài học
          </Button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className={`${skillInfo.color} border-0`}>
                  {skillInfo.icon} {skillInfo.label}
                </Badge>
                <Badge className={`${difficultyInfo.color} border-0`}>
                  {difficultyInfo.label}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {lesson.title}
              </h1>
              <p className="text-gray-600 mt-1">{lesson.description}</p>
            </div>
          </div>

          {/* Progress */}
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Câu hỏi {progress.currentQuestion + 1} /{" "}
                {lesson.questions.length}
              </span>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  <span>{progress.timeSpent} phút</span>
                </div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </Card>
        </div>

        {/* Question */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentQuestion.question.text}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnswer(!showAnswer)}>
                {showAnswer ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {showAnswer ? "Ẩn đáp án" : "Xem đáp án"}
              </Button>
            </div>

            {showAnswer && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                <p className="text-sm font-medium text-green-800 mb-1">
                  Đáp án đúng:
                </p>
                <p className="text-green-700">
                  {Array.isArray(currentQuestion.correctAnswer)
                    ? currentQuestion.correctAnswer.join(", ")
                    : currentQuestion.correctAnswer}
                </p>
                {currentQuestion.explanation && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      Giải thích:
                    </p>
                    <p className="text-sm text-green-700">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {renderQuestion(currentQuestion)}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={progress.currentQuestion === 0}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Câu trước
            </Button>

            <div className="flex items-center gap-2">
              {progress.currentQuestion === lesson.questions.length - 1 ? (
                <Button
                  onClick={handleFinishLesson}
                  className="bg-green-600 hover:bg-green-700">
                  <Target className="h-4 w-4 mr-2" />
                  Hoàn thành
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={!progress.answers[currentQuestion.id]}>
                  Câu tiếp
                  <Play className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Result Modal */}
      {showResult && (
        <LessonResultModal
          lesson={lesson}
          score={progress.score}
          timeSpent={progress.timeSpent}
          onClose={() => setShowResult(false)}
          onContinue={() => router.push("/lessons")}
        />
      )}
    </div>
  );
}
