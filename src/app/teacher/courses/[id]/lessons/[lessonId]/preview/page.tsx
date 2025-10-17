"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { TeacherService } from "@/lib/teacher-service";
import type { Lesson } from "@/types/teacher";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Edit,
  GraduationCap,
  Tag,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Import preview components
import { GrammarPreview } from "@/components/lessons/lesson-preview/grammar-preview";
import { ListeningPreview } from "@/components/lessons/lesson-preview/listening-preview";
import { ReadingPreview } from "@/components/lessons/lesson-preview/reading-preview";
import { SpeakingPreview } from "@/components/lessons/lesson-preview/speaking-preview";
import { VocabularyPreview } from "@/components/lessons/lesson-preview/vocabulary-preview";
import { WritingPreview } from "@/components/lessons/lesson-preview/writing-preview";

export default function LessonPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        const lessonData = await TeacherService.getLessonById(
          params.id as string,
          params.lessonId as string
        );
        setLesson(lessonData);
      } catch (error) {
        console.error("Failed to load lesson:", error);
        toast({
          title: "Error",
          description: "Failed to load lesson data",
          variant: "destructive",
        });
        router.push(`/teacher/courses/${params.id}`);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadLesson();
    }
  }, [params.id, params.lessonId, user, router, toast]);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  const getLessonTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      vocab: "Vocabulary",
      grammar: "Grammar",
      listening: "Listening",
      speaking: "Speaking",
      reading: "Reading",
      writing: "Writing",
    };
    return labels[type] || type;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/teacher/courses/${params.id}`)}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    lesson.difficulty
                  )}`}>
                  {lesson.difficulty.charAt(0).toUpperCase() +
                    lesson.difficulty.slice(1)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getLessonTypeLabel(lesson.type)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {lesson.title}
              </h1>
              <p className="text-gray-600 mb-4">{lesson.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.estimatedTime} minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{getLessonTypeLabel(lesson.type)} Lesson</span>
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>
                    {lesson.difficulty.charAt(0).toUpperCase() +
                      lesson.difficulty.slice(1)}{" "}
                    Level
                  </span>
                </div>
              </div>

              {lesson.tags && lesson.tags.length > 0 && (
                <div className="flex items-start gap-2 mt-4">
                  <Tag className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="flex flex-wrap gap-2">
                    {lesson.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() =>
                router.push(
                  `/teacher/courses/${params.id}/lessons/${params.lessonId}/edit`
                )
              }
              className="ml-4">
              <Edit className="h-4 w-4 mr-2" />
              Edit Lesson
            </Button>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="space-y-6">
          {lesson.type === "vocab" && lesson.content && (
            <VocabularyPreview content={lesson.content as any} />
          )}
          {lesson.type === "grammar" && lesson.content && (
            <GrammarPreview content={lesson.content as any} />
          )}
          {lesson.type === "listening" && lesson.content && (
            <ListeningPreview content={lesson.content as any} />
          )}
          {lesson.type === "speaking" && lesson.content && (
            <SpeakingPreview content={lesson.content as any} />
          )}
          {lesson.type === "reading" && lesson.content && (
            <ReadingPreview content={lesson.content as any} />
          )}
          {lesson.type === "writing" && lesson.content && (
            <WritingPreview content={lesson.content as any} />
          )}
        </div>
      </div>
    </div>
  );
}
