"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  RotateCcw,
  Star,
  Target,
} from "lucide-react";
import { useState } from "react";

interface AISuggestion {
  type: "lesson" | "review" | "practice";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimatedTime: number;
}

interface AISuggestionsProps {
  suggestions: AISuggestion[];
}

export default function AISuggestions({ suggestions }: AISuggestionsProps) {
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<AISuggestion | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <BookOpen className="h-4 w-4" />;
      case "review":
        return <RotateCcw className="h-4 w-4" />;
      case "practice":
        return <Target className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "text-blue-600";
      case "review":
        return "text-orange-600";
      case "practice":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const handleStartSuggestion = (suggestion: AISuggestion) => {
    // Navigate to lesson or start practice
    console.log("Starting suggestion:", suggestion);
    // TODO: Implement navigation logic
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="text-center py-8">
        <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500 mb-2">
          Đang phân tích tiến trình của bạn...
        </p>
        <p className="text-sm text-gray-400">AI sẽ đưa ra gợi ý phù hợp</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => (
        <Card
          key={index}
          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedSuggestion === suggestion
              ? "ring-2 ring-blue-500 bg-blue-50"
              : "bg-white"
          }`}
          onClick={() =>
            setSelectedSuggestion(
              selectedSuggestion === suggestion ? null : suggestion
            )
          }>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div
                className={`p-2 rounded-full bg-gray-100 ${getTypeColor(
                  suggestion.type
                )}`}>
                {getTypeIcon(suggestion.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">
                    {suggestion.title}
                  </h4>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getPriorityColor(
                      suggestion.priority
                    )}`}>
                    {suggestion.priority === "high"
                      ? "Ưu tiên cao"
                      : suggestion.priority === "medium"
                      ? "Ưu tiên trung bình"
                      : "Ưu tiên thấp"}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {suggestion.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {suggestion.estimatedTime} phút
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {suggestion.type === "lesson"
                      ? "Bài học mới"
                      : suggestion.type === "review"
                      ? "Ôn tập"
                      : "Luyện tập"}
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              className="ml-4 bg-blue-600 hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                handleStartSuggestion(suggestion);
              }}>
              <ArrowRight className="h-3 w-3 mr-1" />
              Bắt đầu
            </Button>
          </div>

          {selectedSuggestion === suggestion && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">
                  Tại sao AI gợi ý điều này?
                </h5>
                <p className="text-sm text-blue-700">
                  {suggestion.type === "review"
                    ? "Dựa trên tiến trình học tập của bạn, việc ôn tập sẽ giúp củng cố kiến thức và cải thiện điểm số."
                    : suggestion.type === "practice"
                    ? "Luyện tập thêm sẽ giúp bạn thành thạo kỹ năng này và chuẩn bị cho các bài học khó hơn."
                    : "Bài học này phù hợp với trình độ hiện tại của bạn và sẽ giúp bạn tiến bộ."}
                </p>
              </div>
            </div>
          )}
        </Card>
      ))}

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Brain className="h-4 w-4 text-gray-500" />
          <span>Gợi ý được tạo bởi AI dựa trên tiến trình học tập của bạn</span>
        </div>
      </div>
    </div>
  );
}
