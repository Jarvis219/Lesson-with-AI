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
import { LessonProvider, useLesson } from "@/contexts/LessonContext";
import { useLessonTimeTracking } from "@/contexts/useLessonTimeTracking";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { fetchLessonDetail } from "@/lib/student-courses-service";
import {
  GrammarLessonContent as GrammarContent,
  ListeningLessonContent as ListeningContent,
  ReadingLessonContent as ReadingContent,
  SpeakingLessonContent as SpeakingContent,
  VocabularyLessonContent as VocabularyContent,
  WritingLessonContent as WritingContent,
} from "@/types/lesson-content";
import { ArrowLeft, Clock, Target, Trophy } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { isEmpty } from "utils/lodash.util";

// Main component that provides context
export default function StudentLessonPage() {
  return (
    <LessonProvider>
      <LessonPageContent />
    </LessonProvider>
  );
}

// Component that uses the context
function LessonPageContent() {
  const params = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const { toast } = useToast();

  const {
    state,
    dispatch,
    handleAnswerChange,
    handleSubmitExercise,
    handleNextExercise,
    handlePreviousExercise,
    handleStartLesson,
    handleRetakeLesson,
    handleViewResults,
    handleCloseResultModal,
    handleContinueLearning,
    toggleAudio,
    toggleRecording,
    exercises,
  } = useLesson();

  const { timeSpent } = useLessonTimeTracking();

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchLesson();
    }
  }, [isAuthenticated, params.id]);

  const fetchLesson = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { lesson: lessonData } = await fetchLessonDetail(params.id);
      dispatch({ type: "SET_LESSON", payload: lessonData });

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
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const checkPreviousCompletion = async () => {
    try {
      const result = await apiClient.getLessonResult(params.id);
      if (result.result) {
        dispatch({ type: "SET_HAS_COMPLETED_BEFORE", payload: true });
        dispatch({ type: "SET_FINAL_SCORE", payload: result.result.score });
        dispatch({
          type: "SET_TIME_SPENT",
          payload: Math.round(result.result.timeSpent / 60),
        });
      }
    } catch (error) {
      // No previous completion found
      console.log("No previous completion found");
    }
  };

  const handleBackClick = () => {
    router.push(
      state.lesson?.course
        ? `/student/courses/${state.lesson.course._id}`
        : "/student/courses"
    );
  };

  const handleContinueLearningWithNavigation = () => {
    handleContinueLearning();
    router.push(
      state.lesson?.course
        ? `/student/courses/${state.lesson.course._id}`
        : "/student/courses"
    );
  };

  // Show loading if auth is still loading
  if (authLoading || state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading lesson...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (!state.lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-12 max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <Target className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Lesson not found
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            The lesson you're looking for doesn't exist or is not available.
          </p>
          <Button
            onClick={() => router.push("/student/courses")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
      {/* Animated Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto">
        {/* Lesson Header */}
        <LessonHeader lesson={state.lesson} onBackClick={handleBackClick} />

        {/* Lesson Content */}
        <div className="space-y-6">
          {/* Lesson Content - Always show */}
          {state.lesson.type === "vocab" && (
            <VocabularyLessonContent
              content={state.lesson.content as VocabularyContent}
              isPlaying={state.isPlaying}
              onToggleAudio={toggleAudio}
            />
          )}
          {state.lesson.type === "grammar" && (
            <GrammarLessonContent
              content={state.lesson.content as GrammarContent}
            />
          )}
          {state.lesson.type === "listening" && (
            <ListeningLessonContent
              content={state.lesson.content as ListeningContent}
            />
          )}
          {state.lesson.type === "speaking" && (
            <SpeakingLessonContent
              content={state.lesson.content as SpeakingContent}
              isPlaying={state.isPlaying}
              isRecording={state.isRecording}
              onToggleAudio={toggleAudio}
              onToggleRecording={toggleRecording}
            />
          )}
          {state.lesson.type === "reading" && (
            <ReadingLessonContent
              content={state.lesson.content as ReadingContent}
            />
          )}
          {state.lesson.type === "writing" && (
            <WritingLessonContent
              content={state.lesson.content as WritingContent}
            />
          )}

          {/* Previous Completion Results - Show when user has completed before */}
          {state.hasCompletedBefore &&
            !state.hasStarted &&
            !state.lessonCompleted && (
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
                        {state.finalScore}%
                      </span>
                    </p>
                    <p className="text-gray-600 mb-6">
                      Time spent:{" "}
                      <span className="font-medium">{timeSpent} minutes</span>
                    </p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() =>
                        dispatch({
                          type: "SET_SHOW_RESULT_MODAL",
                          payload: true,
                        })
                      }
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
            !state.hasStarted &&
            !state.lessonCompleted &&
            !state.hasCompletedBefore && (
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
          {state.lessonCompleted &&
            !state.showReviewMode &&
            !state.hasCompletedBefore && (
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
                        {state.finalScore}%
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
          {state.hasStarted && !state.lessonCompleted && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="h-4 w-4" />
                    <span>
                      Progress: {state.currentExerciseIndex + 1} /{" "}
                      {exercises.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Time: {timeSpent} min</span>
                  </div>
                </div>
                {state.finalScore > 0 && (
                  <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <Trophy className="h-4 w-4" />
                    <span>Score: {state.finalScore}%</span>
                  </div>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((state.currentExerciseIndex + 1) / exercises.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Exercises - Only show when started */}
          {state.hasStarted && !isEmpty(exercises) && (
            <ExerciseRenderer
              isLoading={state.isSubmitting}
              exercises={exercises}
              currentExerciseIndex={state.currentExerciseIndex}
              userAnswers={state.userAnswers}
              showResults={state.showResults}
              onAnswerChange={handleAnswerChange}
              onPreviousExercise={handlePreviousExercise}
              onNextExercise={handleNextExercise}
              onSubmitExercise={handleSubmitExercise}
            />
          )}
        </div>

        {/* Lesson Result Modal */}
        {state.showResultModal && state.lesson._id && (
          <LessonResultModal
            lessonId={state.lesson._id}
            onClose={handleCloseResultModal}
            onContinue={handleContinueLearningWithNavigation}
          />
        )}
      </div>
    </div>
  );
}
