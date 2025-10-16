"use client";

import { Timer } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface LessonTimerProps {
  isActive: boolean;
  onTimeUpdate?: (timeSpentSeconds: number) => void;
}

export interface LessonTimerRef {
  getCurrentTime: () => number;
}

const LessonTimer = forwardRef<LessonTimerRef, LessonTimerProps>(
  ({ isActive, onTimeUpdate }, ref) => {
    const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
    const timeRef = useRef(0);

    useEffect(() => {
      if (!isActive) return;

      const interval = setInterval(() => {
        timeRef.current += 1;
        setTimeSpentSeconds(timeRef.current);
      }, 1000);

      return () => clearInterval(interval);
    }, [isActive]);

    // Only call onTimeUpdate when timer stops (lesson completes)
    useEffect(() => {
      if (!isActive && timeRef.current > 0) {
        onTimeUpdate?.(timeRef.current);
      }
    }, [isActive, onTimeUpdate]);

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => timeRef.current,
    }));

    const formatElapsed = (totalSeconds: number) => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Timer className="h-4 w-4" />
        <span>{formatElapsed(timeSpentSeconds)}</span>
      </div>
    );
  }
);

LessonTimer.displayName = "LessonTimer";

export default LessonTimer;
