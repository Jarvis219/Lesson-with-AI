"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BaseExercise,
    ListeningLessonContent as ListeningContent,
    VocabularyWord
} from "@/types/lesson-content";
import { Clock, Headphones, Pause, Play, Target, Volume2 } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { getLevelColor, getLevelIcon } from "utils/lesson.util";

interface ListeningLessonContentProps {
  content: ListeningContent;
  isPlaying: boolean;
  onToggleAudio: () => void;
}

export function ListeningLessonContent({
  content,
  isPlaying,
  onToggleAudio,
}: ListeningLessonContentProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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
                        "rounded-full w-16 h-16 transition-all duration-300 hover:scale-110",
                        isPlaying ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                      )}
                      onClick={onToggleAudio}>
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <Play className="h-8 w-8 text-white" />
                      )}
                    </Button>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {(content.audio as any).title || "Audio Track"}
                      </h3>
                      <p className="text-gray-600">
                        Duration: {(content.audio as any).duration || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {(content.audio as any).duration || "Unknown"}
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      <Volume2 className="h-4 w-4 mr-1" />
                      {(content.audio as any).speed || "Normal"}
                    </Badge>
                  </div>
                </div>

                {/* Audio Description */}
                {(content.audio as any).description && (
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
                    <p className="text-gray-700 leading-relaxed">
                      {(content.audio as any).description}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                {(content.audio as any).timestamps && 
                 (content.audio as any).timestamps.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Timestamps</h4>
                    <div className="space-y-2">
                      {(content.audio as any).timestamps.map((timestamp: any, index: number) => (
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
                                {String(Math.floor(timestamp.time % 60)).padStart(2, '0')}
                              </span>
                              <span className="text-gray-800 font-medium">
                                {timestamp.label}
                              </span>
                            </div>
                            {timestamp.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {timestamp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
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
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Context</h4>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {content.preListening.context}
                  </p>
                </div>
              )}

              {/* Key Vocabulary */}
              {content.preListening.vocabulary && content.preListening.vocabulary.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-800">Key Vocabulary</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSection('pre-vocab')}
                      className="text-sm">
                      {expandedSection === 'pre-vocab' ? 'Collapse' : 'Expand'}
                    </Button>
                  </div>
                  <div className={twMerge(
                    "overflow-hidden transition-all duration-300",
                    expandedSection === 'pre-vocab' ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <div className="grid gap-4">
                      {content.preListening.vocabulary.map((word: VocabularyWord, index: number) => (
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
                              </div>
                              <p className="text-gray-700 mb-2">{word.definition}</p>
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
                              {getLevelIcon(word.difficulty)} {word.difficulty}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Prediction Questions */}
              {content.preListening.predictionQuestions && 
               content.preListening.predictionQuestions.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Prediction Questions</h4>
                  <div className="space-y-3">
                    {content.preListening.predictionQuestions.map((question: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 hover:bg-yellow-100 transition-colors">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          ?
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {question}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* While-Listening */}
      {content.whileListening && content.whileListening.exercises && 
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
              {content.whileListening.exercises.map((exercise: BaseExercise, index: number) => (
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
                          {(exercise as any).type?.replace('-', ' ') || 'Exercise'}
                        </Badge>
                        <Badge 
                          className={twMerge(
                            "text-xs px-2 py-1 !text-foreground",
                            getLevelColor(exercise.difficulty)
                          )}>
                          {getLevelIcon(exercise.difficulty)} {exercise.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {exercise.points} pts
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <p className="text-gray-800 font-medium text-lg">
                        {exercise.question}
                      </p>
                    </div>

                    {(exercise as any).translation && (
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border-l-4 border-gray-400">
                        <p className="text-gray-600 italic text-lg">
                          {(exercise as any).translation}
                        </p>
                      </div>
                    )}

                    {(exercise as any).instructions && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-400">
                        <p className="text-green-700 text-sm">
                          <span className="font-semibold">Instructions:</span> {(exercise as any).instructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
              {/* Discussion Questions */}
              {content.postListening.discussionQuestions && 
               content.postListening.discussionQuestions.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Discussion Questions</h4>
                  <div className="space-y-3">
                    {content.postListening.discussionQuestions.map((question: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400 hover:bg-indigo-100 transition-colors">
                        <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {question}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Activity */}
              {(content.postListening as any).summaryActivity && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-400">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Summary Activity</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {(content.postListening as any).summaryActivity}
                  </p>
                </div>
              )}

              {/* Follow-up Tasks */}
              {(content.postListening as any).followUpTasks && 
               (content.postListening as any).followUpTasks.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Follow-up Tasks</h4>
                  <div className="space-y-3">
                    {(content.postListening as any).followUpTasks.map((task: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400 hover:bg-purple-100 transition-colors">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          ✓
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {task}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}