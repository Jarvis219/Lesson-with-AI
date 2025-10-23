/**
 * React hook for Text-to-Speech functionality
 * Provides easy integration with the TTS service in React components
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { TTSOptions, ttsService, TTSState } from "../text-to-speech";

export interface UseTTSReturn {
  // State
  isPlaying: boolean;
  isPaused: boolean;
  isSupported: boolean;
  currentText: string;
  currentId: string;

  // Actions
  speak: (text: string, options?: TTSOptions, id?: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  toggle: () => void;

  // Utilities
  isCurrentlyPlaying: () => boolean;
  isCurrentlyPaused: () => boolean;
  getCurrentText: () => string;
  isComponentPlaying: (id: string) => boolean;
}

export function useTTS(): UseTTSReturn {
  const [state, setState] = useState<TTSState>(ttsService.getState());
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Subscribe to TTS state changes
    unsubscribeRef.current = ttsService.subscribe((newState) => {
      setState(newState);
    });

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const speak = useCallback(
    async (text: string, options?: TTSOptions, id?: string) => {
      try {
        await ttsService.speak(text, options, id || "");
      } catch (error) {
        console.error("TTS Error:", error);
        throw error;
      }
    },
    []
  );

  const pause = useCallback(() => {
    ttsService.pause();
  }, []);

  const resume = useCallback(() => {
    ttsService.resume();
  }, []);

  const stop = useCallback(() => {
    ttsService.stop();
  }, []);

  const toggle = useCallback(() => {
    ttsService.toggle();
  }, []);

  const isCurrentlyPlaying = useCallback(() => {
    return ttsService.isCurrentlyPlaying();
  }, []);

  const isCurrentlyPaused = useCallback(() => {
    return ttsService.isCurrentlyPaused();
  }, []);

  const getCurrentText = useCallback(() => {
    return ttsService.getCurrentText();
  }, []);

  const isComponentPlaying = useCallback((id: string) => {
    return ttsService.isComponentPlaying(id);
  }, []);

  return {
    // State
    isPlaying: state.isPlaying,
    isPaused: state.isPaused,
    isSupported: state.isSupported,
    currentText: state.currentText,
    currentId: state.currentId,

    // Actions
    speak,
    pause,
    resume,
    stop,
    toggle,

    // Utilities
    isCurrentlyPlaying,
    isCurrentlyPaused,
    getCurrentText,
    isComponentPlaying,
  };
}

/**
 * Hook for speaking specific text with automatic cleanup
 */
export function useSpeakText(text: string, options?: TTSOptions, id?: string) {
  const { speak, stop, isSupported } = useTTS();
  const [state, setState] = useState(ttsService.getState());

  const speakText = useCallback(async () => {
    if (!isSupported) {
      console.warn("Text-to-speech is not supported in this browser");
      return;
    }

    try {
      await speak(text, options, id);
    } catch (error) {
      console.error("Failed to speak text:", error);
    }
  }, [text, options, id, speak, isSupported]);

  // Subscribe to global TTS state changes
  useEffect(() => {
    const unsubscribe = ttsService.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, [id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const isThisPlaying = id ? state.currentId === id : false;

  return {
    speakText,
    stop,
    isPlaying: isThisPlaying && (state.isPlaying || state.isPreparing), // NEW: Include preparing state
    isPaused: isThisPlaying && state.isPaused,
    isSupported,
  };
}

/**
 * Hook for managing multiple TTS instances
 */
export function useMultipleTTS() {
  const [instances, setInstances] = useState<Map<string, TTSState>>(new Map());
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    unsubscribeRef.current = ttsService.subscribe((state) => {
      setInstances((prev) => {
        const newMap = new Map(prev);
        newMap.set("main", state);
        return newMap;
      });
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const speak = useCallback(
    async (id: string, text: string, options?: TTSOptions) => {
      try {
        await ttsService.speak(text, options);
      } catch (error) {
        console.error(`TTS Error for ${id}:`, error);
        throw error;
      }
    },
    []
  );

  const stop = useCallback(() => {
    ttsService.stop();
  }, []);

  const getInstanceState = useCallback(
    (id: string) => {
      return (
        instances.get(id) || {
          isPlaying: false,
          isPaused: false,
          isSupported: ttsService.getState().isSupported,
          currentText: "",
          currentUtterance: null,
        }
      );
    },
    [instances]
  );

  return {
    instances,
    speak,
    stop,
    getInstanceState,
  };
}
