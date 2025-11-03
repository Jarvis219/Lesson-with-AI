"use client";

import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { LessonProgressSubmitResponse } from "@/types";
import { BaseExercise } from "@/types/lesson-content";
import { createContext, ReactNode, useContext, useReducer } from "react";

// Types
interface LessonState {
  // Lesson data
  lesson: any | null;
  loading: boolean;

  // Exercise state
  currentExerciseIndex: number;
  userAnswers: Record<string, any>;
  showResults: boolean;

  // Lesson progress
  hasStarted: boolean;
  lessonCompleted: boolean;
  finalScore: number;
  timeSpent: number;
  startTime: Date | null;

  // UI state
  showResultModal: boolean;
  showReviewMode: boolean;
  hasCompletedBefore: boolean;
  isSubmitting: boolean;

  // Audio/Recording state
  isPlaying: boolean;
  isRecording: boolean;
}

type LessonAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_LESSON"; payload: any }
  | { type: "SET_CURRENT_EXERCISE_INDEX"; payload: number }
  | { type: "SET_USER_ANSWERS"; payload: Record<string, any> }
  | { type: "UPDATE_USER_ANSWER"; payload: { exerciseId: string; answer: any } }
  | { type: "SET_SHOW_RESULTS"; payload: boolean }
  | { type: "SET_HAS_STARTED"; payload: boolean }
  | { type: "SET_LESSON_COMPLETED"; payload: boolean }
  | { type: "SET_FINAL_SCORE"; payload: number }
  | { type: "SET_TIME_SPENT"; payload: number }
  | { type: "SET_START_TIME"; payload: Date | null }
  | { type: "SET_SHOW_RESULT_MODAL"; payload: boolean }
  | { type: "SET_SHOW_REVIEW_MODE"; payload: boolean }
  | { type: "SET_HAS_COMPLETED_BEFORE"; payload: boolean }
  | { type: "SET_IS_SUBMITTING"; payload: boolean }
  | { type: "SET_IS_PLAYING"; payload: boolean }
  | { type: "SET_IS_RECORDING"; payload: boolean }
  | { type: "RESET_LESSON_STATE" }
  | { type: "RESET_FOR_RETAKE" };

// Initial state
const initialState: LessonState = {
  lesson: null,
  loading: true,
  currentExerciseIndex: 0,
  userAnswers: {},
  showResults: false,
  hasStarted: false,
  lessonCompleted: false,
  finalScore: 0,
  timeSpent: 0,
  startTime: null,
  showResultModal: false,
  showReviewMode: false,
  hasCompletedBefore: false,
  isSubmitting: false,
  isPlaying: false,
  isRecording: false,
};

// Reducer
function lessonReducer(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_LESSON":
      return { ...state, lesson: action.payload };

    case "SET_CURRENT_EXERCISE_INDEX":
      return { ...state, currentExerciseIndex: action.payload };

    case "SET_USER_ANSWERS":
      return { ...state, userAnswers: action.payload };

    case "UPDATE_USER_ANSWER":
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [action.payload.exerciseId]: action.payload.answer,
        },
      };

    case "SET_SHOW_RESULTS":
      return { ...state, showResults: action.payload };

    case "SET_HAS_STARTED":
      return { ...state, hasStarted: action.payload };

    case "SET_LESSON_COMPLETED":
      return { ...state, lessonCompleted: action.payload };

    case "SET_FINAL_SCORE":
      return { ...state, finalScore: action.payload };

    case "SET_TIME_SPENT":
      return { ...state, timeSpent: action.payload };

    case "SET_START_TIME":
      return { ...state, startTime: action.payload };

    case "SET_SHOW_RESULT_MODAL":
      return { ...state, showResultModal: action.payload };

    case "SET_SHOW_REVIEW_MODE":
      return { ...state, showReviewMode: action.payload };

    case "SET_HAS_COMPLETED_BEFORE":
      return { ...state, hasCompletedBefore: action.payload };

    case "SET_IS_SUBMITTING":
      return { ...state, isSubmitting: action.payload };

    case "SET_IS_PLAYING":
      return { ...state, isPlaying: action.payload };

    case "SET_IS_RECORDING":
      return { ...state, isRecording: action.payload };

    case "RESET_LESSON_STATE":
      return {
        ...state,
        currentExerciseIndex: 0,
        userAnswers: {},
        showResults: false,
        hasStarted: false,
        lessonCompleted: false,
        finalScore: 0,
        timeSpent: 0,
        startTime: null,
        showResultModal: false,
        showReviewMode: false,
        isSubmitting: false,
      };

    case "RESET_FOR_RETAKE":
      return {
        ...state,
        currentExerciseIndex: 0,
        userAnswers: {},
        showResults: false,
        hasStarted: false,
        lessonCompleted: false,
        finalScore: 0,
        timeSpent: 0,
        startTime: null,
        showResultModal: false,
        showReviewMode: false,
        hasCompletedBefore: false,
        isSubmitting: false,
      };

    default:
      return state;
  }
}

// Context
interface LessonContextType {
  state: LessonState;
  dispatch: React.Dispatch<LessonAction>;

  // Actions
  handleAnswerChange: (exerciseId: string, answer: any) => void;
  handleSubmitExercise: () => void;
  handleNextExercise: () => void;
  handlePreviousExercise: () => void;
  handleStartLesson: () => void;
  handleRetakeLesson: () => void;
  handleViewResults: () => void;
  handleCloseResultModal: () => void;
  handleContinueLearning: () => void;
  toggleAudio: () => void;
  toggleRecording: () => void;

  // API calls
  submitLessonProgress: (params: {
    userAnswers: Record<string, any>;
    exercises: BaseExercise[];
    lessonType: string;
    timeSpent: number;
    lessonId: string;
  }) => Promise<LessonProgressSubmitResponse | undefined>;

  // Computed values
  exercises: BaseExercise[];
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

// Provider
interface LessonProviderProps {
  children: ReactNode;
}

export function LessonProvider({ children }: LessonProviderProps) {
  const [state, dispatch] = useReducer(lessonReducer, initialState);
  const { toast } = useToast();

  // Computed values
  const exercises: BaseExercise[] = state.lesson?.content?.exercises || [];

  // Actions
  const handleAnswerChange = (exerciseId: string, answer: any) => {
    dispatch({ type: "UPDATE_USER_ANSWER", payload: { exerciseId, answer } });
  };

  const handleSubmitExercise = () => {
    dispatch({ type: "SET_SHOW_RESULTS", payload: true });
  };

  const handleNextExercise = () => {
    if (state.currentExerciseIndex < exercises.length - 1) {
      dispatch({
        type: "SET_CURRENT_EXERCISE_INDEX",
        payload: state.currentExerciseIndex + 1,
      });
      dispatch({ type: "SET_SHOW_RESULTS", payload: false });
    } else {
      // Finished all exercises, submit to backend
      dispatch({ type: "SET_LESSON_COMPLETED", payload: true });
      submitLessonProgress({
        userAnswers: state.userAnswers,
        exercises,
        lessonType: state.lesson?.type || "",
        timeSpent: state.timeSpent,
        lessonId: state.lesson?._id || "",
      });
    }
  };

  const handlePreviousExercise = () => {
    if (state.currentExerciseIndex > 0) {
      dispatch({
        type: "SET_CURRENT_EXERCISE_INDEX",
        payload: state.currentExerciseIndex - 1,
      });
      dispatch({ type: "SET_SHOW_RESULTS", payload: false });
    }
  };

  const handleStartLesson = () => {
    dispatch({ type: "SET_HAS_STARTED", payload: true });
    dispatch({ type: "SET_START_TIME", payload: new Date() });
    dispatch({ type: "SET_TIME_SPENT", payload: 0 });
    dispatch({ type: "SET_CURRENT_EXERCISE_INDEX", payload: 0 });
    dispatch({ type: "SET_USER_ANSWERS", payload: {} });
    dispatch({ type: "SET_SHOW_RESULTS", payload: false });
    dispatch({ type: "SET_LESSON_COMPLETED", payload: false });
    dispatch({ type: "SET_FINAL_SCORE", payload: 0 });
    dispatch({ type: "SET_SHOW_REVIEW_MODE", payload: false });
  };

  const handleRetakeLesson = () => {
    dispatch({ type: "RESET_FOR_RETAKE" });
  };

  const handleViewResults = () => {
    dispatch({ type: "SET_SHOW_REVIEW_MODE", payload: true });
    dispatch({ type: "SET_SHOW_RESULT_MODAL", payload: false });
  };

  const handleCloseResultModal = () => {
    dispatch({ type: "SET_SHOW_RESULT_MODAL", payload: false });
  };

  const handleContinueLearning = () => {
    dispatch({ type: "SET_SHOW_RESULT_MODAL", payload: false });
    // Navigation will be handled by parent component
  };

  const toggleAudio = () => {
    dispatch({ type: "SET_IS_PLAYING", payload: !state.isPlaying });
  };

  const toggleRecording = () => {
    dispatch({ type: "SET_IS_RECORDING", payload: !state.isRecording });
  };

  const submitLessonProgress = async (params: {
    userAnswers: Record<string, any>;
    exercises: BaseExercise[];
    lessonType: string;
    timeSpent: number;
    lessonId: string;
  }): Promise<LessonProgressSubmitResponse | undefined> => {
    try {
      dispatch({ type: "SET_IS_SUBMITTING", payload: true });

      const result = await apiClient.submitLessonProgress(params);

      console.log("Lesson progress saved:", result);

      const { score } = result;
      dispatch({ type: "SET_FINAL_SCORE", payload: score });
      dispatch({ type: "SET_LESSON_COMPLETED", payload: true });
      dispatch({ type: "SET_SHOW_RESULT_MODAL", payload: true });

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
      dispatch({ type: "SET_IS_SUBMITTING", payload: false });
    }
  };

  const value: LessonContextType = {
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
    submitLessonProgress,
    exercises,
  };

  return (
    <LessonContext.Provider value={value}>{children}</LessonContext.Provider>
  );
}

// Hook
export function useLesson() {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error("useLesson must be used within a LessonProvider");
  }
  return context;
}
