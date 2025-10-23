/**
 * TTS Button Component
 * A reusable button component for text-to-speech functionality
 */

import { Button } from "@/components/ui/button";
import { useSpeakText } from "@/lib/hooks/use-tts";
import { TTSOptions } from "@/lib/text-to-speech";
import { cn } from "@/lib/utils";
import { Pause, Play, VolumeX } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface TTSButtonProps {
  text: string;
  options?: TTSOptions;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  showText?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  id?: string;
}

export function TTSButton({
  text,
  options,
  className,
  size = "default",
  variant = "outline",
  showText = false,
  disabled = false,
  children,
  id,
}: TTSButtonProps) {
  const { speakText, stop, isPlaying, isPaused, isSupported } = useSpeakText(
    text,
    options,
    id
  );

  const handleClick = async () => {
    if (!isSupported) {
      console.warn("Text-to-speech is not supported in this browser");
      return;
    }

    if (isPlaying) {
      stop();
    } else {
      try {
        await speakText();
      } catch (error) {
        console.error("Failed to speak text:", error);
      }
    }
  };

  if (!isSupported) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled={true}
        className={cn("opacity-50 cursor-not-allowed", className)}
        title="Text-to-speech not supported in this browser">
        <VolumeX className="h-4 w-4" />
        {showText && <span className="ml-2">TTS Unavailable</span>}
      </Button>
    );
  }

  const getIcon = () => {
    if (isPlaying && !isPaused) {
      return <Pause className="h-4 w-4" />;
    }
    return <Play className="h-4 w-4" />;
  };

  const getButtonText = () => {
    if (isPlaying && !isPaused) {
      return "Pause";
    }
    if (isPaused) {
      return "Resume";
    }
    return "Play";
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className={twMerge(
        "transition-all duration-200 hover:scale-105",
        isPlaying && !isPaused
          ? "bg-green-100 text-green-600 border-green-300 hover:bg-green-200"
          : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
        className
      )}
      title={`${isPlaying && !isPaused ? "Pause" : "Play"} audio: ${text.slice(
        0,
        50
      )}${text.length > 50 ? "..." : ""}`}>
      {children || (
        <>
          {getIcon()}
          {showText && <span className="ml-2">{getButtonText()}</span>}
        </>
      )}
    </Button>
  );
}

/**
 * TTS Button for timestamps
 */
interface TTSTimestampButtonProps {
  text: string;
  timestamp: number;
  className?: string;
  id?: string;
}

export function TTSTimestampButton({
  text,
  timestamp,
  className,
  id,
}: TTSTimestampButtonProps) {
  const { speakText, stop, isPlaying, isPaused, isSupported } = useSpeakText(
    text,
    {
      rate: 0.8, // Slower for better comprehension
    },
    id
  );

  const handleClick = async () => {
    if (!isSupported) {
      console.warn("Text-to-speech is not supported in this browser");
      return;
    }

    if (isPlaying) {
      stop();
    } else {
      try {
        await speakText();
      } catch (error) {
        console.error("Failed to speak timestamp:", error);
      }
    }
  };

  if (!isSupported) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled={true}
        className={cn("opacity-50 cursor-not-allowed", className)}
        title="Text-to-speech not supported">
        <VolumeX className="h-3 w-3" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={twMerge(
        "rounded-full w-8 h-8 transition-all duration-200 hover:scale-110",
        isPlaying && !isPaused
          ? "bg-green-100 text-green-600 hover:bg-green-200"
          : "bg-blue-50 text-blue-600 hover:bg-blue-100",
        className
      )}
      title={`${isPlaying && !isPaused ? "Pause" : "Play"} timestamp: ${text}`}>
      {isPlaying && !isPaused ? (
        <Pause className="h-3 w-3" />
      ) : (
        <Play className="h-3 w-3" />
      )}
    </Button>
  );
}

/**
 * TTS Button for vocabulary words
 */
interface TTSVocabularyButtonProps {
  word: string;
  pronunciation?: string;
  className?: string;
  id?: string;
}

export function TTSVocabularyButton({
  word,
  pronunciation,
  className,
  id,
}: TTSVocabularyButtonProps) {
  const textToSpeak = pronunciation ? `${word} (${pronunciation})` : word;
  const { speakText, stop, isPlaying, isPaused, isSupported } = useSpeakText(
    textToSpeak,
    {
      rate: 0.7, // Slower for pronunciation learning
    },
    id
  );

  const handleClick = async () => {
    if (!isSupported) {
      console.warn("Text-to-speech is not supported in this browser");
      return;
    }

    if (isPlaying) {
      stop();
    } else {
      try {
        await speakText();
      } catch (error) {
        console.error("Failed to speak vocabulary:", error);
      }
    }
  };

  if (!isSupported) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled={true}
        className={cn("opacity-50 cursor-not-allowed", className)}
        title="Text-to-speech not supported">
        <VolumeX className="h-3 w-3" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={twMerge(
        "rounded-full w-8 h-8 transition-all duration-200 hover:scale-110",
        isPlaying && !isPaused
          ? "bg-green-100 text-green-600 hover:bg-green-200"
          : "bg-blue-50 text-blue-600 hover:bg-blue-100",
        className
      )}
      title={`${
        isPlaying && !isPaused ? "Pause" : "Play"
      } pronunciation: ${word}`}>
      {isPlaying && !isPaused ? (
        <Pause className="h-3 w-3" />
      ) : (
        <Play className="h-3 w-3" />
      )}
    </Button>
  );
}
