"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { apiClient } from "@/lib/api-client";
import { LessonHistoryItem } from "@/types/lessons";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface LessonHistoryProps {
  lessonId?: string;
  limit?: number;
  isCompleted?: boolean;
}

export default function LessonHistory({
  lessonId,
  limit = 10,
  isCompleted,
}: LessonHistoryProps) {
  const [history, setHistory] = useState<LessonHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    // Reset offset and fetch with offset 0 when filters change
    setOffset(0);
    const fetchWithReset = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getLessonHistory({
          limit,
          offset: 0,
          lessonId,
          isCompleted,
        });

        setHistory(response.lessonHistory);
        setTotalCount(response.totalCount);
        setHasMore(response.hasMore);
      } catch (error) {
        console.error("Error fetching lesson history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWithReset();
  }, [lessonId, limit, isCompleted]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getLessonHistory({
        limit,
        offset,
        lessonId,
        isCompleted,
      });

      if (offset === 0) {
        setHistory(response.lessonHistory);
      } else {
        setHistory((prev) => [...prev, ...response.lessonHistory]);
      }

      setTotalCount(response.totalCount);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Error fetching lesson history:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setOffset((prev) => prev + limit);
    fetchHistory();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90)
      return "text-emerald-700 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200";
    if (score >= 80)
      return "text-blue-700 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200";
    if (score >= 70)
      return "text-amber-700 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200";
    if (score >= 60)
      return "text-orange-700 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200";
    return "text-red-700 bg-gradient-to-br from-red-50 to-rose-50 border-red-200";
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 90) return "stroke-emerald-500";
    if (score >= 80) return "stroke-blue-500";
    if (score >= 70) return "stroke-amber-500";
    if (score >= 60) return "stroke-orange-500";
    return "stroke-red-500";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200";
      case "intermediate":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200";
      case "advanced":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProgressPercentage = (item: LessonHistoryItem) => {
    if (item.stats.totalQuestionsAnswered === 0) return 0;
    return Math.round(
      (item.stats.totalCorrectAnswers / item.stats.totalQuestionsAnswered) * 100
    );
  };

  const toggleQuestionExpansion = (lessonKey: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonKey)) {
        newSet.delete(lessonKey);
      } else {
        newSet.add(lessonKey);
      }
      return newSet;
    });
  };

  if (!loading && history.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
            <div className="h-5 bg-gray-100 rounded w-48 animate-pulse"></div>
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="space-y-5">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse border border-gray-200/60 bg-white overflow-hidden relative">
              {/* Gradient accent bar skeleton */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100"></div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      {/* Score badge skeleton */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-200 border-2 border-gray-100"></div>
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Title skeleton */}
                        <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                        {/* Description skeleton */}
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-100 rounded w-full"></div>
                          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                        </div>
                        {/* Badges skeleton */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score Circle skeleton */}
                  <div className="flex-shrink-0 relative">
                    <div className="relative w-20 h-20">
                      <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-gray-100"></div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-5">
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      {/* Icon box skeleton */}
                      <div className="p-2 rounded-lg bg-gray-200 w-8 h-8"></div>
                      <div className="flex-1 space-y-1.5">
                        {/* Label skeleton */}
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                        {/* Value skeleton */}
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar Skeleton */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-10"></div>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300 rounded-full w-3/4"></div>
                  </div>
                </div>

                {/* Question Answers Summary Skeleton */}
                <div className="border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-7 bg-gray-200 rounded-lg w-20"></div>
                  </div>

                  <div className="space-y-2.5">
                    {[...Array(2)].map((_, qIndex) => (
                      <div
                        key={qIndex}
                        className="p-3.5 rounded-lg border-2 border-gray-200 bg-gray-50">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {/* Icon skeleton */}
                            <div className="h-4 w-4 rounded-full bg-gray-200 mt-0.5 flex-shrink-0"></div>
                            {/* Question text skeleton */}
                            <div className="flex-1 space-y-1.5">
                              <div className="h-4 bg-gray-200 rounded w-full"></div>
                              <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                            </div>
                          </div>
                          {/* Badge skeleton */}
                          <div className="h-5 bg-gray-200 rounded-full w-16 flex-shrink-0"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 shadow-xl">
        <CardContent className="text-center py-16 px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6">
            <Target className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            No Lesson History
          </h3>
          <p className="text-gray-600 max-w-md mx-auto text-lg">
            {lessonId
              ? "You haven't completed this lesson yet. Start learning to see your progress here!"
              : "You haven't completed any lessons yet. Complete your first lesson to get started!"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Lesson History
          </h2>
          <p className="text-gray-600 mt-1">
            {totalCount} {totalCount === 1 ? "lesson" : "lessons"} completed
          </p>
        </div>
        {lessonId && (
          <Badge
            variant="outline"
            className="text-sm px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-700">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Filtered
          </Badge>
        )}
      </div>

      {/* History Cards */}
      <InfiniteScroll
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={loading}
        loader={
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
            <span className="ml-3 text-gray-600 font-medium">
              Loading more lessons...
            </span>
          </div>
        }
        endMessage={
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">
                You've reached the end of your lesson history
              </span>
            </div>
          </div>
        }
        className="space-y-5">
        {history.map((item) => {
          const progressPercentage = getProgressPercentage(item);
          const scoreColor = getScoreColor(item.score);
          const ringColor = getScoreRingColor(item.score);
          const lessonKey = `${item.lessonId}-${item.completedAt}`;
          const isExpanded = expandedQuestions.has(lessonKey);
          const questionAnswers = item.stats.questionAnswers || [];
          const displayQuestions = isExpanded
            ? questionAnswers
            : questionAnswers.slice(0, 3);
          const hasMoreQuestions = questionAnswers.length > 3;

          return (
            <Card
              key={`${item.lessonId}-${item.completedAt}`}
              className="group border border-gray-200/60 bg-white hover:border-gray-300 hover:shadow-xl transition-all duration-300 ease-out overflow-hidden relative">
              {/* Gradient accent bar */}
              <div
                className={twMerge(
                  "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  item.score >= 90
                    ? "from-emerald-500 to-green-500"
                    : item.score >= 80
                    ? "from-blue-500 to-cyan-500"
                    : item.score >= 70
                    ? "from-amber-500 to-yellow-500"
                    : item.score >= 60
                    ? "from-orange-500 to-amber-500"
                    : "from-red-500 to-rose-500"
                )}
              />

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={twMerge(
                          "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border-2",
                          scoreColor
                        )}>
                        {item.score}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-bold text-gray-900 mb-1.5 group-hover:text-gray-700 transition-colors line-clamp-1">
                          {item.lesson.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {item.lesson.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            className={twMerge(
                              "font-medium border",
                              getDifficultyColor(item.lesson.difficulty)
                            )}>
                            {item.lesson.difficulty}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs font-medium bg-gray-50">
                            {item.lesson.type.toUpperCase()}
                          </Badge>
                          {item.completed && (
                            <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 font-medium">
                              <Trophy className="h-3 w-3 mr-1.5" />
                              Completed
                            </Badge>
                          )}
                          {item.attempts > 1 && (
                            <Badge
                              variant="outline"
                              className="text-xs font-medium">
                              {item.attempts} attempts
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score Circle */}
                  <div className="flex-shrink-0 relative">
                    <div className="relative w-20 h-20">
                      <svg
                        className="w-20 h-20 transform -rotate-90"
                        viewBox="0 0 36 36">
                        <path
                          className="stroke-gray-200"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={twMerge(
                            "transition-all duration-500 ease-out",
                            ringColor
                          )}
                          strokeWidth="3"
                          strokeDasharray={`${item.score}, 100`}
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={twMerge(
                            "text-xl font-bold",
                            item.score >= 90
                              ? "text-emerald-600"
                              : item.score >= 80
                              ? "text-blue-600"
                              : item.score >= 70
                              ? "text-amber-600"
                              : item.score >= 60
                              ? "text-orange-600"
                              : "text-red-600"
                          )}>
                          {item.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-5">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50/50 border border-blue-100">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Time</p>
                      <p className="text-sm font-bold text-gray-900">
                        {item.timeSpent} min
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50/50 border border-purple-100">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Target className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        Questions
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {item.stats.totalQuestionsAnswered}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50/50 border border-emerald-100">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        Correct
                      </p>
                      <p className="text-sm font-bold text-emerald-700">
                        {item.stats.totalCorrectAnswers}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-gray-50 to-slate-50/50 border border-gray-100">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Calendar className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Date</p>
                      <p className="text-xs font-bold text-gray-900 leading-tight">
                        {formatDate(item.completedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">
                      Overall Progress
                    </span>
                    <span className="text-gray-900 font-bold">
                      {progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={twMerge(
                        "h-full rounded-full transition-all duration-500 ease-out",
                        progressPercentage >= 90
                          ? "bg-gradient-to-r from-emerald-500 to-green-500"
                          : progressPercentage >= 70
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                          : "bg-gradient-to-r from-amber-500 to-yellow-500"
                      )}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Question Answers Summary */}
                {questionAnswers.length > 0 && (
                  <div className="border-t border-gray-100 pt-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Question Details
                      </h4>
                      {hasMoreQuestions && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleQuestionExpansion(lessonKey)}
                          className="text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          {isExpanded ? "Show Less" : "View All"}
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5 ml-1 transition-transform duration-300 rotate-0" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 ml-1 transition-transform duration-300 rotate-0" />
                          )}
                        </Button>
                      )}
                    </div>

                    <div
                      className={twMerge(
                        "overflow-hidden transition-all duration-500 ease-in-out",
                        isExpanded ? "max-h-[5000px]" : "max-h-[600px]"
                      )}>
                      <div className="space-y-2.5">
                        {displayQuestions.map((qa, qIndex) => {
                          const isNewItem = isExpanded && qIndex >= 3;
                          return (
                            <div
                              key={`${qa.questionId || qIndex}-${isExpanded}`}
                              className={twMerge(
                                "p-3.5 rounded-lg border-2 transition-all duration-300 hover:shadow-sm",
                                qa.isCorrect
                                  ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
                                  : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200",
                                isNewItem
                                  ? "animate-fade-in opacity-0"
                                  : "opacity-100"
                              )}
                              style={{
                                animationDelay: isNewItem
                                  ? `${(qIndex - 3) * 50}ms`
                                  : "0ms",
                                animationFillMode: isNewItem
                                  ? "forwards"
                                  : "none",
                              }}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                  {qa.isCorrect ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-gray-800 block">
                                      <span className="font-bold">
                                        Q{qIndex + 1}:
                                      </span>{" "}
                                      {qa.question}
                                    </span>
                                    {qa.explanation && (
                                      <p className="text-xs text-gray-600 mt-1.5 italic">
                                        {qa.explanation}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={twMerge(
                                    "text-xs font-medium flex-shrink-0",
                                    qa.isCorrect
                                      ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                                      : "border-red-300 bg-red-100 text-red-700"
                                  )}>
                                  {qa.isCorrect ? "Correct" : "Incorrect"}
                                </Badge>
                              </div>
                              {!qa.isCorrect && (
                                <div
                                  className={twMerge(
                                    "mt-2 pt-2 border-t border-gray-200 transition-all duration-300",
                                    isNewItem
                                      ? "animate-slide-in opacity-0"
                                      : "opacity-100"
                                  )}
                                  style={{
                                    animationDelay: isNewItem
                                      ? `${(qIndex - 3) * 50 + 100}ms`
                                      : "0ms",
                                    animationFillMode: isNewItem
                                      ? "forwards"
                                      : "none",
                                  }}>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">
                                      Your answer:
                                    </span>{" "}
                                    {Array.isArray(qa.userAnswer)
                                      ? qa.userAnswer.join(", ")
                                      : String(qa.userAnswer)}
                                  </p>
                                  <p className="text-xs text-gray-700 mt-0.5">
                                    <span className="font-medium">
                                      Correct answer:
                                    </span>{" "}
                                    {Array.isArray(qa.correctAnswer)
                                      ? qa.correctAnswer.join(", ")
                                      : String(qa.correctAnswer)}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {!isExpanded && hasMoreQuestions && (
                          <div className="text-center pt-2 transition-opacity duration-300">
                            <p className="text-sm text-gray-500 font-medium">
                              +{questionAnswers.length - 3} more questions
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </InfiniteScroll>
    </div>
  );
}
