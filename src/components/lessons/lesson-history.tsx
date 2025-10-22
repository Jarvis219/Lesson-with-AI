"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { Calendar, Clock, Eye, Target, TrendingUp, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface LessonHistoryItem {
  lessonId: string;
  lesson: {
    _id: string;
    title: string;
    description: string;
    type: string;
    difficulty: string;
    estimatedTime: number;
  };
  score: number;
  timeSpent: number;
  completed: boolean;
  completedAt: string;
  attempts: number;
  stats: {
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;
    totalIncorrectAnswers: number;
    questionAnswers: any[];
  };
}

interface LessonHistoryProps {
  lessonId?: string;
  limit?: number;
}

export default function LessonHistory({
  lessonId,
  limit = 10,
}: LessonHistoryProps) {
  const [history, setHistory] = useState<LessonHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, [lessonId, limit]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getLessonHistory({
        limit,
        offset,
        lessonId,
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
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 80) return "text-blue-600 bg-blue-50";
    if (score >= 70) return "text-yellow-600 bg-yellow-50";
    if (score >= 60) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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

  if (loading && history.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Lesson History
          </h3>
          <p className="text-gray-600">
            {lessonId
              ? "You haven't completed this lesson yet."
              : "You haven't completed any lessons yet."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Lesson History ({totalCount})
        </h2>
        {lessonId && (
          <Badge variant="outline" className="text-sm">
            Filtered by lesson
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {history.map((item, index) => (
          <Card
            key={`${item.lessonId}-${item.completedAt}`}
            className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                    {item.lesson.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.lesson.description}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={getDifficultyColor(item.lesson.difficulty)}>
                      {item.lesson.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.lesson.type.toUpperCase()}
                    </Badge>
                    {item.completed && (
                      <Badge className="bg-green-100 text-green-700">
                        <Trophy className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={twMerge(
                      "text-2xl font-bold px-3 py-1 rounded-lg",
                      getScoreColor(item.score)
                    )}>
                    {item.score}%
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{item.timeSpent} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="h-4 w-4" />
                  <span>{item.stats.totalQuestionsAnswered} questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>{item.stats.totalCorrectAnswers} correct</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(item.completedAt)}</span>
                </div>
              </div>

              {/* Question Answers Summary */}
              {item.stats.questionAnswers &&
                item.stats.questionAnswers.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">
                        Question Details
                      </h4>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {item.stats.questionAnswers
                        .slice(0, 3)
                        .map((qa, qIndex) => (
                          <div
                            key={qIndex}
                            className={twMerge(
                              "p-2 rounded text-xs",
                              qa.isCorrect
                                ? "bg-green-50 border border-green-200"
                                : "bg-red-50 border border-red-200"
                            )}>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                Q{qIndex + 1}: {qa.question.substring(0, 50)}...
                              </span>
                              <Badge
                                variant="outline"
                                className={twMerge(
                                  "text-xs",
                                  qa.isCorrect
                                    ? "border-green-300 text-green-700"
                                    : "border-red-300 text-red-700"
                                )}>
                                {qa.isCorrect ? "Correct" : "Incorrect"}
                              </Badge>
                            </div>
                          </div>
                        ))}

                      {item.stats.questionAnswers.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{item.stats.questionAnswers.length - 3} more
                          questions
                        </p>
                      )}
                    </div>
                  </div>
                )}

              {/* Attempts */}
              {item.attempts > 1 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500">
                    Attempt #{item.attempts}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
            className="px-6">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
