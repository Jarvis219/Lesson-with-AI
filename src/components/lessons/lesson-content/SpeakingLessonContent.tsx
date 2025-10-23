"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DialogueTurn,
  PhonemeSound,
  SpeakingLessonContent as SpeakingContent,
  SpeakingExercise,
} from "@/types/lesson-content";
import {
  Clock,
  MessageCircle,
  Mic,
  MicOff,
  Pause,
  Play,
  Users,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface SpeakingLessonContentProps {
  content: SpeakingContent;
  isPlaying: boolean;
  isRecording: boolean;
  onToggleAudio: () => void;
  onToggleRecording: () => void;
}

export function SpeakingLessonContent({
  content,
  isPlaying,
  isRecording,
  onToggleAudio,
  onToggleRecording,
}: SpeakingLessonContentProps) {
  const [hoveredExercise, setHoveredExercise] = useState<number | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const toggleExercise = (index: number) => {
    setExpandedExercise(expandedExercise === index ? null : index);
  };

  const handleAudioPlay = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
      onToggleAudio();
    } else {
      setPlayingAudio(audioUrl);
      onToggleAudio();
    }
  };

  return (
    <div className="space-y-8">
      {/* Conversation Scenario */}
      {content.conversation && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Conversation Scenario
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Scenario Description */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Scenario
                </h4>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {content.conversation.scenario}
                </p>
              </div>

              {/* Dialogues */}
              {content.conversation.dialogues &&
                content.conversation.dialogues.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Conversation Dialogues
                    </h4>
                    <div className="space-y-3">
                      {content.conversation.dialogues.map(
                        (dialogue: DialogueTurn, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400 hover:bg-purple-100 transition-colors">
                            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              {dialogue.speaker.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-semibold text-gray-800">
                                  {dialogue.speaker}
                                </h5>
                                {dialogue.audioUrl && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleAudioPlay(dialogue.audioUrl!)
                                    }
                                    className={twMerge(
                                      "rounded-full w-8 h-8 transition-all duration-300 hover:scale-110",
                                      playingAudio === dialogue.audioUrl
                                        ? "bg-green-100 text-green-600 border-green-300"
                                        : "bg-blue-50 text-blue-600 border-blue-200"
                                    )}>
                                    {playingAudio === dialogue.audioUrl ? (
                                      <Pause className="h-3 w-3" />
                                    ) : (
                                      <Play className="h-3 w-3" />
                                    )}
                                  </Button>
                                )}
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {dialogue.text}
                              </p>
                              {dialogue.translation && (
                                <div className="mt-2 p-3 bg-white rounded-lg border">
                                  <p className="text-sm text-gray-600 italic">
                                    "{dialogue.translation}"
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Useful Phrases */}
              {content.conversation.usefulPhrases &&
                content.conversation.usefulPhrases.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Useful Phrases
                    </h4>
                    <div className="space-y-3">
                      {content.conversation.usefulPhrases.map(
                        (phrase: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400 hover:bg-green-100 transition-colors">
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              ✓
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              "{phrase}"
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Cultural Notes */}
              {content.conversation.culturalNotes &&
                content.conversation.culturalNotes.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Cultural Notes
                    </h4>
                    <div className="space-y-3">
                      {content.conversation.culturalNotes.map(
                        (note: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 hover:bg-yellow-100 transition-colors">
                            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              💡
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {note}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pronunciation Practice */}
      {content.pronunciation && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Volume2 className="h-6 w-6 text-purple-600" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Pronunciation Practice
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Phoneme Sounds */}
              {content.pronunciation?.sounds &&
                content.pronunciation.sounds.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Phoneme Sounds
                    </h4>
                    <div className="grid gap-4">
                      {content.pronunciation.sounds.map(
                        (sound: PhonemeSound, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                              {sound.phoneme.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h5 className="text-lg font-semibold text-gray-800">
                                {sound.phoneme}
                              </h5>
                              <p className="text-gray-600">
                                {sound.description}
                              </p>
                              {sound.examples && sound.examples.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500 mb-1">
                                    Examples:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {sound.examples.map(
                                      (
                                        example: string,
                                        exampleIndex: number
                                      ) => (
                                        <Badge
                                          key={exampleIndex}
                                          variant="outline"
                                          className="text-xs px-2 py-1 bg-purple-50 text-purple-700">
                                          {example}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {sound.audioUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleAudioPlay(sound.audioUrl!)
                                  }
                                  className={twMerge(
                                    "rounded-full w-10 h-10 transition-all duration-300 hover:scale-110",
                                    playingAudio === sound.audioUrl
                                      ? "bg-green-100 text-green-600 border-green-300"
                                      : "bg-blue-50 text-blue-600 border-blue-200"
                                  )}>
                                  {playingAudio === sound.audioUrl ? (
                                    <Pause className="h-4 w-4" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Intonation Patterns */}
              {content.pronunciation?.intonation && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Intonation Patterns
                  </h4>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-l-4 border-yellow-400">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-lg font-semibold text-gray-800">
                        {content.pronunciation.intonation.pattern}
                      </h5>
                      {content.pronunciation?.intonation?.audioUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleAudioPlay(
                              content.pronunciation!.intonation!.audioUrl!
                            )
                          }
                          className={twMerge(
                            "rounded-full w-10 h-10 transition-all duration-300 hover:scale-110",
                            playingAudio ===
                              content.pronunciation?.intonation?.audioUrl
                              ? "bg-green-100 text-green-600 border-green-300"
                              : "bg-blue-50 text-blue-600 border-blue-200"
                          )}>
                          {playingAudio ===
                          content.pronunciation?.intonation?.audioUrl ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {content.pronunciation.intonation.description}
                    </p>
                    {content.pronunciation.intonation.examples &&
                      content.pronunciation.intonation.examples.length > 0 && (
                        <div className="space-y-3">
                          <h6 className="font-semibold text-gray-800">
                            Examples:
                          </h6>
                          {content.pronunciation.intonation.examples.map(
                            (example: string, index: number) => (
                              <div
                                key={index}
                                className="p-3 bg-white rounded-lg border">
                                <p className="text-gray-700 italic">
                                  "{example}"
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Practice Exercises */}
      {content.practiceExercises && content.practiceExercises.length > 0 && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-orange-600" />
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Practice Exercises
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {content.practiceExercises.map(
                (exercise: SpeakingExercise, index: number) => (
                  <div
                    key={index}
                    className={twMerge(
                      "border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] cursor-pointer",
                      hoveredExercise === index
                        ? "bg-gradient-to-r from-orange-50 to-red-50 border-orange-300 shadow-md"
                        : "bg-white border-gray-200 hover:border-orange-200"
                    )}
                    onMouseEnter={() => setHoveredExercise(index)}
                    onMouseLeave={() => setHoveredExercise(null)}
                    onClick={() => toggleExercise(index)}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              Exercise {index + 1}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {exercise.type.replace("-", " ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {exercise.timeLimit
                              ? `${Math.round(exercise.timeLimit / 60)}`
                              : "5"}{" "}
                            min
                          </Badge>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <p className="text-gray-800 font-medium text-lg">
                          {exercise.prompt}
                        </p>
                      </div>

                      {exercise.sampleAnswer && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-400">
                          <h5 className="text-sm font-semibold text-gray-600 mb-2">
                            Sample Answer:
                          </h5>
                          <p className="text-gray-700 italic">
                            "{exercise.sampleAnswer}"
                          </p>
                        </div>
                      )}

                      {/* Recording Section */}
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border-l-4 border-red-400">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-semibold text-gray-600 mb-1">
                              Record Your Response:
                            </h5>
                            <p className="text-xs text-gray-500">
                              Click the microphone to start recording
                            </p>
                          </div>
                          <Button
                            size="lg"
                            className={twMerge(
                              "rounded-full w-16 h-16 transition-all duration-300 hover:scale-110",
                              isRecording
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-blue-500 hover:bg-blue-600"
                            )}
                            onClick={onToggleRecording}>
                            {isRecording ? (
                              <MicOff className="h-8 w-8 text-white" />
                            ) : (
                              <Mic className="h-8 w-8 text-white" />
                            )}
                          </Button>
                        </div>
                        {isRecording && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 bg-white rounded-full h-2">
                              <div
                                className="bg-red-500 h-2 rounded-full animate-pulse"
                                style={{ width: "60%" }}></div>
                            </div>
                            <span className="text-xs text-red-600 font-medium">
                              Recording...
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Expandable Content */}
                      <div
                        className={twMerge(
                          "overflow-hidden transition-all duration-300",
                          expandedExercise === index
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        )}>
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                          {exercise.tips && exercise.tips.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-semibold text-gray-600">
                                Tips:
                              </h5>
                              <ul className="space-y-1">
                                {exercise.tips.map(
                                  (tip: string, tipIndex: number) => (
                                    <li
                                      key={tipIndex}
                                      className="flex items-start gap-2 text-sm text-gray-600">
                                      <span className="text-blue-500 mt-1">
                                        •
                                      </span>
                                      {tip}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                          {exercise.sampleAudioUrl && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-semibold text-gray-600">
                                Sample Audio:
                              </h5>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleAudioPlay(exercise.sampleAudioUrl!)
                                  }
                                  className={twMerge(
                                    "rounded-full w-10 h-10 transition-all duration-300 hover:scale-110",
                                    playingAudio === exercise.sampleAudioUrl
                                      ? "bg-green-100 text-green-600 border-green-300"
                                      : "bg-blue-50 text-blue-600 border-blue-200"
                                  )}>
                                  {playingAudio === exercise.sampleAudioUrl ? (
                                    <Pause className="h-4 w-4" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                </Button>
                                <span className="text-sm text-gray-600">
                                  Listen to the sample answer
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expand/Collapse Indicator */}
                      <div className="flex items-center justify-center pt-2">
                        <div
                          className={twMerge(
                            "w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300",
                            expandedExercise === index
                              ? "bg-orange-100 text-orange-600"
                              : "text-gray-400"
                          )}>
                          <svg
                            className={twMerge(
                              "w-4 h-4 transition-transform duration-300",
                              expandedExercise === index ? "rotate-180" : ""
                            )}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
