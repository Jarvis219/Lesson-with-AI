"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TTSVocabularyButton } from "@/components/ui/tts-button";
import ipaData from "@/data/ipa.json";
import useSpeechRecognition from "@/lib/hooks/use-speech-recognition";
import type { IPAData } from "@/types/ipa";
import { IPASymbol } from "@/types/ipa";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

const ipaChartData = ipaData as IPAData;

export default function IPAPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<IPASymbol | null>(null);
  const [pronunciationResults, setPronunciationResults] = useState<
    Map<string, { transcript: string; confidence: number; isCorrect: boolean }>
  >(new Map());

  const { listening, transcript, error, startListening, stopListening } =
    useSpeechRecognition({ lang: "en-US" });

  const isRecognitionSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      "SpeechRecognition" in window ||
      (("webkitSpeechRecognition" in window) as any)
    );
  }, []);

  useEffect(() => {
    if (!selectedSymbol || !transcript) return;

    const normalizedTranscript = transcript
      .trim()
      .toLowerCase()
      .replace(/[.,!?;:]/g, "");
    const normalizedExample = selectedSymbol.example.toLowerCase();
    const normalizedSymbol = selectedSymbol.symbol
      .toLowerCase()
      .replace(/[\/\[\]]/g, "");

    const matchesExample =
      normalizedTranscript === normalizedExample ||
      normalizedTranscript.split(/\s+/).includes(normalizedExample) ||
      normalizedExample.split(/\s+/).includes(normalizedTranscript) ||
      normalizedTranscript.includes(normalizedExample) ||
      normalizedExample.includes(normalizedTranscript);

    const matchesSymbol =
      normalizedTranscript.includes(normalizedSymbol) ||
      normalizedSymbol
        .split("")
        .some((char) => normalizedTranscript.includes(char));

    const isCorrect = matchesExample || matchesSymbol;
    const confidence = isCorrect ? 0.9 : 0.4;

    setPronunciationResults((prev) => {
      const newMap = new Map(prev);
      newMap.set(selectedSymbol.symbol, {
        transcript,
        confidence,
        isCorrect,
      });
      return newMap;
    });
  }, [selectedSymbol, transcript]);

  const handleMicClick = (symbol: IPASymbol) => {
    if (selectedSymbol?.symbol === symbol.symbol && listening) {
      stopListening();
      setSelectedSymbol(null);
    } else {
      if (listening) {
        stopListening();
      }
      setSelectedSymbol(symbol);
      setTimeout(() => {
        startListening();
      }, 100);
    }
  };

  const getPronunciationResult = (symbol: string) => {
    return pronunciationResults.get(symbol);
  };

  const renderIPACard = (symbol: IPASymbol) => {
    const result = getPronunciationResult(symbol.symbol);
    const isActive = selectedSymbol?.symbol === symbol.symbol && listening;

    return (
      <Card
        key={symbol.symbol}
        className={twMerge(
          "p-4 hover:shadow-lg transition-all duration-200",
          isActive && "ring-2 ring-blue-500 shadow-lg"
        )}>
        <div className="flex flex-col gap-3">
          {/* Symbol and Example */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                /{symbol.symbol}/
              </div>
              <div className="text-lg font-semibold text-blue-600">
                {symbol.example}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {symbol.description}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* TTS Button */}
              <TTSVocabularyButton
                word={symbol.example}
                id={`ipa-${symbol.symbol}`}
                className="flex-shrink-0"
              />

              {/* Microphone Button */}
              {/* TODO: fix bug can't start network */}
              {/* {isRecognitionSupported ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMicClick(symbol)}
                  className={twMerge(
                    "rounded-full w-10 h-10 transition-all duration-200 hover:scale-110",
                    isActive
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                  )}
                  title={
                    isActive
                      ? "Stop recording"
                      : "Record pronunciation to check accuracy"
                  }>
                  {isActive ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  className="rounded-full w-10 h-10 opacity-50 cursor-not-allowed"
                  title="Speech recognition not supported">
                  <MicOff className="h-4 w-4" />
                </Button>
              )} */}
            </div>
          </div>

          {/* Pronunciation Result */}
          {result && (
            <div
              className={twMerge(
                "p-3 rounded-lg border-2 transition-all duration-200",
                result.isCorrect
                  ? "bg-green-50 border-green-200"
                  : "bg-orange-50 border-orange-200"
              )}>
              <div className="flex items-start gap-2">
                {result.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={twMerge(
                        "font-semibold text-sm",
                        result.isCorrect ? "text-green-700" : "text-orange-700"
                      )}>
                      {result.isCorrect ? "Good!" : "Try again"}
                    </span>
                    <Badge
                      variant="outline"
                      className={twMerge(
                        "text-xs",
                        result.isCorrect
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-orange-100 text-orange-700 border-orange-300"
                      )}>
                      {Math.round(result.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">You said:</span>{" "}
                    <span className="italic">"{result.transcript}"</span>
                  </div>
                  {!result.isCorrect && (
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Expected:</span>{" "}
                      <span className="italic">"{symbol.example}"</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Listening Indicator */}
          {isActive && (
            <div className="flex items-center gap-2 text-sm text-red-600 animate-pulse">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="font-medium">Listening...</span>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-4 border border-blue-200/50">
            <span className="text-sm font-semibold text-blue-700">
              Pronunciation Guide
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            IPA Chart
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            International Phonetic Alphabet - Learn English pronunciation
          </p>

          {/* Info Alert */}
          {!isRecognitionSupported && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">
                  Speech recognition not available
                </p>
                <p>
                  Your browser doesn't support speech recognition. You can still
                  listen to pronunciations using the play buttons.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Vowels Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <span className="text-2xl">🔊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vowels</h2>
              <p className="text-sm text-gray-600">
                {ipaChartData.vowels.length} vowel sounds
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ipaChartData.vowels.map((vowel) => renderIPACard(vowel))}
          </div>
        </section>

        {/* Consonants Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <span className="text-2xl">🗣️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Consonants</h2>
              <p className="text-sm text-gray-600">
                {ipaChartData.consonants.length} consonant sounds
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ipaChartData.consonants.map((consonant) =>
              renderIPACard(consonant)
            )}
          </div>
        </section>

        {/* Diphthongs Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
              <span className="text-2xl">🎵</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Diphthongs</h2>
              <p className="text-sm text-gray-600">
                {ipaChartData.diphthongs.length} diphthong sounds
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ipaChartData.diphthongs.map((diphthong) =>
              renderIPACard(diphthong)
            )}
          </div>
        </section>

        {/* Instructions */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            How to use this chart
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Listen:</strong> Click the play button (▶️) to hear the
                pronunciation of each sound
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                <strong>Practice:</strong> Click the microphone button (🎤) to
                record your pronunciation and check if it's correct
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>
                <strong>Learn:</strong> Study the example words to understand
                how each sound is used in English
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
