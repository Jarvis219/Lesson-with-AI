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
import LessonResultModal from "@/components/lessons/lesson-result-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { fetchLessonDetail } from "@/lib/student-courses-service";
import { LessonDetailResponse, LessonProgressSubmitResponse } from "@/types";
import {
  BaseExercise,
  GrammarLessonContent as GrammarContent,
  ListeningLessonContent as ListeningContent,
  ReadingLessonContent as ReadingContent,
  SpeakingLessonContent as SpeakingContent,
  VocabularyLessonContent as VocabularyContent,
  WritingLessonContent as WritingContent,
} from "@/types/lesson-content";
import { ArrowLeft, Clock, Target, Trophy } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { isEmpty } from "utils/lodash.util";

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
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [showReviewMode, setShowReviewMode] = useState(false);
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchLesson();
    }
  }, [isAuthenticated, params.id]);

  // Track time spent only when lesson has started
  useEffect(() => {
    if (startTime && hasStarted && !lessonCompleted) {
      const interval = setInterval(() => {
        const now = new Date();
        const diffInMinutes = Math.floor(
          (now.getTime() - startTime.getTime()) / (1000 * 60)
        );
        setTimeSpent(diffInMinutes);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime, hasStarted, lessonCompleted]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const { lesson: lessonData } = await fetchLessonDetail(params.id);
      setLesson(lessonData);

      // Check if user has completed this lesson before
      await checkPreviousCompletion();
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

  const checkPreviousCompletion = async () => {
    try {
      const result = await apiClient.getLessonResult(params.id);
      if (result.result) {
        setHasCompletedBefore(true);
        setFinalScore(result.result.score);
        setTimeSpent(Math.round(result.result.timeSpent / 60));
      }
    } catch (error) {
      // No previous completion found
      console.log("No previous completion found");
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
  };

  // Removed calculateScore function - now handled by backend

  const submitLessonProgress = async (): Promise<
    LessonProgressSubmitResponse | undefined
  > => {
    try {
      setIsSubmitting(true);

      const result = await apiClient.submitLessonProgress({
        lessonId: lesson?._id || "",
        timeSpent,
        userAnswers,
        exercises,
        lessonType: lesson?.type || "",
      });

      console.log("Lesson progress saved:", result);

      // Extract score and questions data from backend response
      const { score } = result;

      setFinalScore(score);
      setLessonCompleted(true);
      setShowResultModal(true);

      toast({
        title: "Lesson Completed!",
        description: `Your score: ${score}% - ${
          score >= 70 ? "Congratulations!" : "Keep practicing!"
        }`,
      });

      return result;
    } catch (error) {
      console.error("Error submitting lesson progress:", error);
      toast({
        title: "Error",
        description: "Failed to save lesson progress",
        variant: "destructive",
      });
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
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
    } else {
      // Finished all exercises, submit to backend for calculation
      setLessonCompleted(true);

      // Submit lesson progress - backend will calculate score and return results
      submitLessonProgress();
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

  const handleCloseResultModal = () => {
    setShowResultModal(false);
  };

  const handleContinueLearning = () => {
    setShowResultModal(false);
    router.push(
      lesson?.course
        ? `/student/courses/${lesson.course._id}`
        : "/student/courses"
    );
  };

  const handleStartLesson = () => {
    setHasStarted(true);
    setStartTime(new Date());
    setTimeSpent(0);
    setCurrentExerciseIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setLessonCompleted(false);
    setFinalScore(0);
    setShowReviewMode(false);
  };

  const handleRetakeLesson = () => {
    setHasStarted(true);
    setStartTime(new Date());
    setTimeSpent(0);
    setCurrentExerciseIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setLessonCompleted(false);
    setFinalScore(0);
    setShowReviewMode(false);
    setShowResultModal(false);
    setHasCompletedBefore(false);
  };

  const handleViewResults = () => {
    setShowReviewMode(true);
    setShowResultModal(false);
  };

  // Get exercises from lesson content
  const exercises = useMemo((): BaseExercise[] => {
    if (!lesson?.content) return [];
    const content = lesson.content as any;
    return content.exercises || [];
  }, [lesson?.content]);

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
          {/* Lesson Content - Always show */}
          {lesson.type === "vocab" && (
            <VocabularyLessonContent
              content={lesson.content as VocabularyContent}
              isPlaying={isPlaying}
              onToggleAudio={toggleAudio}
            />
          )}
          {lesson.type === "grammar" && (
            <GrammarLessonContent content={lesson.content as GrammarContent} />
          )}
          {lesson.type === "listening" && (
            <ListeningLessonContent
              content={lesson.content as ListeningContent}
            />
          )}
          {lesson.type === "speaking" && (
            <SpeakingLessonContent
              content={lesson.content as SpeakingContent}
              isPlaying={isPlaying}
              isRecording={isRecording}
              onToggleAudio={toggleAudio}
              onToggleRecording={toggleRecording}
            />
          )}
          {lesson.type === "reading" && (
            <ReadingLessonContent content={lesson.content as ReadingContent} />
          )}
          {lesson.type === "writing" && (
            <WritingLessonContent content={lesson.content as WritingContent} />
          )}

          {/* Previous Completion Results - Show when user has completed before */}
          {hasCompletedBefore && !hasStarted && !lessonCompleted && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Lesson Previously Completed
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Your previous score:{" "}
                    <span className="font-bold text-green-600">
                      {finalScore}%
                    </span>
                  </p>
                  <p className="text-gray-600 mb-6">
                    Time spent:{" "}
                    <span className="font-medium">{timeSpent} minutes</span>
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => setShowResultModal(true)}
                    variant="outline"
                    className="px-6 py-2 border-2 hover:bg-gray-50">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Previous Results
                  </Button>
                  <Button
                    onClick={handleRetakeLesson}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Target className="h-4 w-4 mr-2" />
                    Retake Lesson
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Start Lesson Button - Show when not started and not completed and no previous completion */}
          {!isEmpty(exercises) &&
            !hasStarted &&
            !lessonCompleted &&
            !hasCompletedBefore && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Ready to Start Exercises?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      This lesson contains {exercises.length} exercises. Review
                      the lesson content above, then start the exercises when
                      you're ready!
                    </p>
                  </div>
                  <Button
                    onClick={handleStartLesson}
                    className="px-8 py-3 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    <Target className="h-5 w-5 mr-2" />
                    Start Exercises
                  </Button>
                </div>
              </div>
            )}

          {/* Completed Lesson Actions - Show when just completed (not previously completed) */}
          {lessonCompleted && !showReviewMode && !hasCompletedBefore && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Lesson Completed!
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Your score:{" "}
                    <span className="font-bold text-green-600">
                      {finalScore}%
                    </span>
                  </p>
                  <p className="text-gray-600 mb-6">
                    Time spent:{" "}
                    <span className="font-medium">{timeSpent} minutes</span>
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleViewResults}
                    variant="outline"
                    className="px-6 py-2 border-2 hover:bg-gray-50">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                  <Button
                    onClick={handleRetakeLesson}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Target className="h-4 w-4 mr-2" />
                    Retake Lesson
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator - Only show when started and not completed */}
          {hasStarted && !lessonCompleted && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="h-4 w-4" />
                    <span>
                      Progress: {currentExerciseIndex + 1} / {exercises.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Time: {timeSpent} min</span>
                  </div>
                </div>
                {finalScore > 0 && (
                  <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <Trophy className="h-4 w-4" />
                    <span>Score: {finalScore}%</span>
                  </div>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentExerciseIndex + 1) / exercises.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Exercises - Only show when started */}
          {hasStarted && !isEmpty(exercises) && (
            <ExerciseRenderer
              isLoading={isSubmitting}
              exercises={exercises}
              currentExerciseIndex={currentExerciseIndex}
              userAnswers={userAnswers}
              showResults={showResults}
              onAnswerChange={handleAnswerChange}
              onPreviousExercise={handlePreviousExercise}
              onNextExercise={handleNextExercise}
              onSubmitExercise={handleSubmitExercise}
            />
          )}
        </div>

        {/* Lesson Result Modal */}
        {showResultModal && lesson._id && (
          <LessonResultModal
            lessonId={lesson._id}
            onClose={handleCloseResultModal}
            onContinue={handleContinueLearning}
          />
        )}
      </div>
    </div>
  );
}
