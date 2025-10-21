"use client";

import {
  ExerciseRenderer,
  GrammarLessonContent,
  LessonHeader,
  ListeningLessonContent,
  ReadingLessonContent,
  SpeakingLessonContent,
  VocabularyLessonContent,
  WritingLessonContent,
} from "@/components/lessons/lesson-content";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/useAuth";
import { fetchLessonDetail } from "@/lib/student-courses-service";
import { LessonDetailResponse } from "@/types";
import { BaseExercise } from "@/types/lesson-content";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentLessonPage() {
  const params = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<LessonDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchLesson();
    }
  }, [isAuthenticated, params.id]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const { lesson: lessonData } = await fetchLessonDetail(params.id);
      setLesson(lessonData);
    } catch (error: any) {
      console.error("Error fetching lesson:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to load lesson",
        variant: "destructive",
      });
      router.push("/student/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (exerciseId: string, answer: any) => {
    setUserAnswers((prev) => ({
      ...prev,
      [exerciseId]: answer,
    }));
  };

  const handleSubmitExercise = () => {
    setShowResults(true);
    toast({
      title: "Exercise Submitted",
      description: "Check your results below!",
    });
  };

  const handleNextExercise = () => {
    // Get exercises from the lesson content based on lesson type
    let exercises: BaseExercise[] = [];

    if (lesson?.content) {
      const content = lesson.content as any;
      if (content.exercises && content.exercises.length > 0) {
        exercises = content.exercises;
      }
    }

    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setShowResults(false);
    }

    //  when finished all exercises, submit the lesson
    if (currentExerciseIndex === exercises.length - 1) {
      // calculate the score
      // const correctAnswers = exercises.filter(
      //   (exercise: BaseExercise) =>
      //     exercise?.correctAnswer ===
      //     userAnswers[exercise.id || exercise.question]
      // ).length;
      // const totalQuestions = exercises.length;
      // console.log(totalQuestions, correctAnswers);
      // const score = (correctAnswers / totalQuestions) * 100;
      // console.log("Score:", score);
      // submit the lesson
      // submitLesson(score);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
      setShowResults(false);
    }
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual recording functionality
  };

  const handleBackClick = () => {
    router.push(
      lesson?.course
        ? `/student/courses/${lesson.course._id}`
        : "/student/courses"
    );
  };

  // Get exercises from lesson content
  const getExercises = (): BaseExercise[] => {
    if (!lesson?.content) return [];
    const content = lesson.content as any;
    return content.exercises || [];
  };

  // Show loading if auth is still loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading lesson...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Lesson not found
            </h1>
            <p className="text-gray-600 mb-6">
              The lesson you're looking for doesn't exist or is not available.
            </p>
            <Button onClick={() => router.push("/student/courses")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Lesson Header */}
        <LessonHeader lesson={lesson} onBackClick={handleBackClick} />

        {/* Lesson Content */}
        <div className="space-y-6">
          {lesson.type === "vocab" && (
            <VocabularyLessonContent
              content={lesson.content as any}
              isPlaying={isPlaying}
              onToggleAudio={toggleAudio}
            />
          )}
          {lesson.type === "grammar" && (
            <GrammarLessonContent content={lesson.content as any} />
          )}
          {lesson.type === "listening" && (
            <ListeningLessonContent
              content={lesson.content as any}
              isPlaying={isPlaying}
              onToggleAudio={toggleAudio}
            />
          )}
          {lesson.type === "speaking" && (
            <SpeakingLessonContent
              content={lesson.content as any}
              isPlaying={isPlaying}
              isRecording={isRecording}
              onToggleAudio={toggleAudio}
              onToggleRecording={toggleRecording}
            />
          )}
          {lesson.type === "reading" && (
            <ReadingLessonContent content={lesson.content as any} />
          )}
          {lesson.type === "writing" && (
            <WritingLessonContent content={lesson.content as any} />
          )}

          {/* Exercises */}
          <ExerciseRenderer
            exercises={getExercises()}
            currentExerciseIndex={currentExerciseIndex}
            userAnswers={userAnswers}
            showResults={showResults}
            onAnswerChange={handleAnswerChange}
            onPreviousExercise={handlePreviousExercise}
            onNextExercise={handleNextExercise}
            onSubmitExercise={handleSubmitExercise}
          />
        </div>
      </div>
    </div>
  );
}
