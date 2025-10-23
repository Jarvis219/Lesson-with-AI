"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TTSButton,
  TTSTimestampButton,
  TTSVocabularyButton,
} from "@/components/ui/tts-button";
import {
  AudioTimestamp,
  BaseExercise,
  ListeningLessonContent as ListeningContent,
  VocabularyWord,
} from "@/types/lesson-content";
import { Clock, Headphones, Pause, Play, Target, Volume2 } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { getLevelColor, getLevelIcon } from "utils/lesson.util";

interface ListeningLessonContentProps {
  content: ListeningContent;
}

export function ListeningLessonContent({
  content,
}: ListeningLessonContentProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-8">
      {/* Audio Content */}
      {content.audio && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <Headphones className="h-6 w-6 text-green-600" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Audio Content
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Audio Player */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Button
                      size="lg"
                      className={twMerge(
                        "rounded-full w-16 h-16 transition-all duration-300 hover:scale-110 p-0",
                        isPlaying
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      )}
                      onClick={toggleAudio}>
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <Play className="h-8 w-8 text-white" />
                      )}
                    </Button>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Audio Track
                      </h3>
                      <p className="text-gray-600">
                        Duration: {Math.floor(content.audio.duration / 60)}:
                        {(content.audio.duration % 60)
                          .toString()
                          .padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {Math.floor(content.audio.duration / 60)}:
                      {(content.audio.duration % 60)
                        .toString()
                        .padStart(2, "0")}
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      <Volume2 className="h-4 w-4 mr-1" />
                      {content.audio.speed}
                    </Badge>
                    {content.audio.accent && (
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        <Headphones className="h-4 w-4 mr-1" />
                        {content.audio.accent}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Audio Transcript */}
                <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Transcript
                    </h4>
                    <TTSButton
                      text={content.audio.transcript}
                      options={{ rate: 0.8 }}
                      size="sm"
                      showText={true}
                      className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                      id="transcript"
                    />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {content.audio.transcript}
                  </p>
                </div>

                {/* Timestamps */}
                {content.audio.timestamps &&
                  content.audio.timestamps.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Timestamps
                      </h4>
                      <div className="space-y-2">
                        {content.audio.timestamps.map(
                          (timestamp: AudioTimestamp, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-200">
                              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">
                                    {Math.floor(timestamp.time / 60)}:
                                    {String(
                                      Math.floor(timestamp.time % 60)
                                    ).padStart(2, "0")}
                                  </span>
                                  <span className="text-gray-800 font-medium">
                                    {timestamp.text}
                                  </span>
                                  <TTSTimestampButton
                                    text={timestamp.text}
                                    timestamp={timestamp.time}
                                    id={`timestamp-${index}`}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pre-Listening */}
      {content.preListening && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Pre-Listening
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Context */}
              {content.preListening.context && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Context
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {content.preListening.context}
                  </p>
                </div>
              )}

              {/* Key Vocabulary */}
              {content.preListening.vocabulary &&
                content.preListening.vocabulary.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Key Vocabulary
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSection("pre-vocab")}
                        className="text-sm">
                        {expandedSection === "pre-vocab"
                          ? "Collapse"
                          : "Expand"}
                      </Button>
                    </div>
                    <div
                      className={twMerge(
                        "overflow-hidden transition-all duration-300",
                        expandedSection === "pre-vocab"
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      )}>
                      <div className="grid gap-4">
                        {content.preListening.vocabulary.map(
                          (word: VocabularyWord, index: number) => (
                            <div
                              key={index}
                              className={twMerge(
                                "border rounded-xl p-4 transition-all duration-300 hover:shadow-md",
                                hoveredItem === index
                                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md"
                                  : "bg-white border-gray-200 hover:border-green-200"
                              )}
                              onMouseEnter={() => setHoveredItem(index)}
                              onMouseLeave={() => setHoveredItem(null)}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h5 className="text-lg font-semibold text-gray-900">
                                      {word.word}
                                    </h5>
                                    {word.pronunciation && (
                                      <span className="text-sm text-gray-500 italic bg-gray-100 px-2 py-1 rounded">
                                        /{word.pronunciation}/
                                      </span>
                                    )}
                                    <TTSVocabularyButton
                                      word={word.word}
                                      pronunciation={word.pronunciation}
                                      id={`vocab-${index}`}
                                    />
                                  </div>
                                  <p className="text-gray-700 mb-2">
                                    {word.definition}
                                  </p>
                                  {word.example && (
                                    <p className="text-sm text-gray-600 italic">
                                      "{word.example}"
                                    </p>
                                  )}
                                </div>
                                <Badge
                                  className={twMerge(
                                    "text-xs px-2 py-1 !text-foreground",
                                    getLevelColor(word.difficulty)
                                  )}>
                                  {getLevelIcon(word.difficulty)}{" "}
                                  {word.difficulty}
                                </Badge>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* Prediction Questions */}
              {content.preListening.predictionQuestions &&
                content.preListening.predictionQuestions.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Prediction Questions
                    </h4>
                    <div className="space-y-3">
                      {content.preListening.predictionQuestions.map(
                        (question: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 hover:bg-yellow-100 transition-colors">
                            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              ?
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 leading-relaxed">
                                {question}
                              </p>
                            </div>
                            <TTSButton
                              text={question}
                              options={{ rate: 0.8 }}
                              size="sm"
                              className="bg-yellow-100 text-yellow-600 border-yellow-300 hover:bg-yellow-200"
                              id={`prediction-${index}`}
                            />
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

      {/* While-Listening */}
      {content.whileListening &&
        content.whileListening.exercises &&
        content.whileListening.exercises.length > 0 && (
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Headphones className="h-6 w-6 text-purple-600" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  While-Listening Exercises
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {content.whileListening.exercises.map(
                  (exercise: BaseExercise, index: number) => (
                    <div
                      key={index}
                      className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-800">
                            Exercise {index + 1}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {exercise.type?.replace("-", " ") || "Exercise"}
                            </Badge>
                            <Badge
                              className={twMerge(
                                "text-xs px-2 py-1 !text-foreground",
                                getLevelColor(exercise.difficulty)
                              )}>
                              {getLevelIcon(exercise.difficulty)}{" "}
                              {exercise.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {exercise.points} pts
                            </Badge>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-400">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-gray-800 font-medium text-lg flex-1">
                              {exercise.question}
                            </p>
                            <TTSButton
                              text={exercise.question}
                              options={{ rate: 0.8 }}
                              size="sm"
                              className="bg-blue-100 text-blue-600 border-blue-300 hover:bg-blue-200 flex-shrink-0"
                              id={`exercise-${index}`}
                            />
                          </div>
                        </div>

                        {exercise.explanation && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-400">
                            <h5 className="text-sm font-semibold text-gray-600 mb-2">
                              Explanation:
                            </h5>
                            <p className="text-green-700 text-sm">
                              {exercise.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Post-Listening */}
      {content.postListening && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Post-Listening
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Comprehension Questions */}
              {content.postListening.comprehensionQuestions &&
                content.postListening.comprehensionQuestions.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Comprehension Questions
                    </h4>
                    <div className="space-y-4">
                      {content.postListening.comprehensionQuestions.map(
                        (question: BaseExercise, index: number) => (
                          <div
                            key={index}
                            className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                                <h5 className="text-lg font-semibold text-gray-800">
                                  Question {index + 1}
                                </h5>
                              </div>

                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-400">
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-gray-800 font-medium text-lg flex-1">
                                    {question.question}
                                  </p>
                                  <TTSButton
                                    text={question.question}
                                    options={{ rate: 0.8 }}
                                    size="sm"
                                    className="bg-blue-100 text-blue-600 border-blue-300 hover:bg-blue-200 flex-shrink-0"
                                    id={`comprehension-${index}`}
                                  />
                                </div>
                              </div>

                              {question.explanation && (
                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-400">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-yellow-700">
                                      Explanation:
                                    </span>
                                  </div>
                                  <p className="text-yellow-700 mt-1">
                                    {question.explanation}
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

              {/* Discussion Questions */}
              {content.postListening.discussionQuestions &&
                content.postListening.discussionQuestions.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Discussion Questions
                    </h4>
                    <div className="space-y-3">
                      {content.postListening.discussionQuestions.map(
                        (question: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400 hover:bg-indigo-100 transition-colors">
                            <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 leading-relaxed">
                                {question}
                              </p>
                            </div>
                            <TTSButton
                              text={question}
                              options={{ rate: 0.8 }}
                              size="sm"
                              className="bg-indigo-100 text-indigo-600 border-indigo-300 hover:bg-indigo-200"
                              id={`discussion-${index}`}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Summary Activity */}
              {content.postListening.summaryTask && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-400">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Summary Activity
                    </h4>
                    <TTSButton
                      text={content.postListening.summaryTask}
                      options={{ rate: 0.8 }}
                      size="sm"
                      className="bg-purple-100 text-purple-600 border-purple-300 hover:bg-purple-200"
                      id="summary"
                    />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {content.postListening.summaryTask}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
