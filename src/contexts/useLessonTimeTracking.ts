"use client";

import { useEffect } from "react";
import { useLesson } from "./LessonContext";

export function useLessonTimeTracking() {
  const { state, dispatch } = useLesson();

  // Track time spent only when lesson has started
  useEffect(() => {
    if (state.startTime && state.hasStarted && !state.lessonCompleted) {
      const interval = setInterval(() => {
        const now = new Date();
        const diffInMinutes = Math.floor(
          (now.getTime() - state.startTime!.getTime()) / (1000 * 60)
        );
        dispatch({ type: "SET_TIME_SPENT", payload: diffInMinutes });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [state.startTime, state.hasStarted, state.lessonCompleted, dispatch]);

  return {
    timeSpent: state.timeSpent,
    startTime: state.startTime,
  };
}
