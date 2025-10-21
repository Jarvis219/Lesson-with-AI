"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LessonDetailResponse } from "@/types";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Edit3,
  Eye,
  Headphones,
  Mic,
  PenTool,
} from "lucide-react";

interface LessonHeaderProps {
  lesson: LessonDetailResponse;
  onBackClick: () => void;
}

export function LessonHeader({ lesson, onBackClick }: LessonHeaderProps) {
  const getLessonIcon = (type: string) => {
    switch (type) {
      case "vocab":
        return <BookOpen className="h-5 w-5" />;
      case "grammar":
        return <Edit3 className="h-5 w-5" />;
      case "listening":
        return <Headphones className="h-5 w-5" />;
      case "speaking":
        return <Mic className="h-5 w-5" />;
      case "reading":
        return <Eye className="h-5 w-5" />;
      case "writing":
        return <PenTool className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <>
      {/* Back Button */}
      <button
        onClick={onBackClick}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to {lesson.course ? lesson.course.title : "Courses"}
      </button>

      {/* Lesson Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {getLessonIcon(lesson.type)}
                  <Badge variant="outline" className="capitalize">
                    {lesson.type}
                  </Badge>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {lesson.difficulty}
                </Badge>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {lesson.estimatedTime} min
                </div>
              </div>

              <CardTitle className="text-3xl font-bold mb-4 text-gray-900">
                {lesson.title}
              </CardTitle>

              <CardDescription className="text-lg text-gray-600">
                {lesson.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  );
}
