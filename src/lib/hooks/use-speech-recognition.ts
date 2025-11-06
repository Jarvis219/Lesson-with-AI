// useSpeechRecognition.js
"use client";
import { useEffect, useRef, useState } from "react";

export default function useSpeechRecognition({ lang = "en-US" } = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  console.log(transcript);
  const [error, setError] = useState("");
  console.log(error);
  const recognitionRef = useRef<any>(null);
  const autoStopTimeoutRef = useRef<number | null>(null);
  const hasRetriedNetworkRef = useRef<boolean>(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Browser does not support Speech Recognition API");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onstart = () => {
      setListening(true);
      // clear previous safety timer
      if (autoStopTimeoutRef.current) {
        window.clearTimeout(autoStopTimeoutRef.current);
      }
      // safety auto-stop after 8s
      autoStopTimeoutRef.current = window.setTimeout(() => {
        try {
          recognitionRef.current?.stop?.();
        } catch (_) {}
      }, 8000);
    };

    recognition.onresult = (e: any) => {
      const res = e.results[0];
      const text = res[0].transcript;
      console.log("0000", text);
      setTranscript(text);
      // if final result, stop to end session cleanly
      if (res.isFinal) {
        try {
          recognitionRef.current?.stop?.();
        } catch (_) {}
      }
    };

    recognition.onerror = (e: any) => {
      if (e?.error === "network") {
        if (!hasRetriedNetworkRef.current) {
          hasRetriedNetworkRef.current = true;
          try {
            recognitionRef.current?.stop?.();
          } catch (_) {}
          setTimeout(() => {
            try {
              recognitionRef.current?.start?.();
            } catch (_) {}
          }, 500);
          return;
        }
        setError(
          "Network error. Check internet/VPN/Firewall or try Chrome without shields."
        );
      } else {
        setError(e.error || "speech-error");
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      if (autoStopTimeoutRef.current) {
        window.clearTimeout(autoStopTimeoutRef.current);
        autoStopTimeoutRef.current = null;
      }
      hasRetriedNetworkRef.current = false;
    };

    recognitionRef.current = recognition;
  }, [lang]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setTranscript("");
    setError("");
    // prime mic permission to reduce flakiness
    const start = () => {
      try {
        recognitionRef.current.start();
      } catch (_) {
        // ignore; errors will surface via onerror
      }
    };
    if (navigator?.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => start())
        .catch(() => start());
    } else {
      start();
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    if (autoStopTimeoutRef.current) {
      window.clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }
  };

  return {
    listening,
    transcript,
    error,
    startListening,
    stopListening,
  };
}
