"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  VocabularyLessonContent as VocabularyContent,
  VocabularyWord,
} from "@/types/lesson-content";
import { BookOpen, Pause, Volume2 } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { getLevelColor, getLevelIcon } from "utils/lesson.util";

interface VocabularyLessonContentProps {
  content: VocabularyContent;
  isPlaying: boolean;
  onToggleAudio: () => void;
}

export function VocabularyLessonContent({
  content,
  isPlaying,
  onToggleAudio,
}: VocabularyLessonContentProps) {
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const [expandedWord, setExpandedWord] = useState<number | null>(null);

  if (!content?.vocabulary || content.vocabulary.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Thematic Group */}
      {content.thematicGroup && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Theme: {content.thematicGroup}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Vocabulary Words */}
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Vocabulary Words
            </span>
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Learn these vocabulary words and their meanings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6">
            {content.vocabulary.map((word: VocabularyWord, index: number) => (
              <div
                key={index}
                className={twMerge(
                  "group relative border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer",
                  hoveredWord === index
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md"
                    : "bg-white border-gray-200 hover:border-blue-200"
                )}
                onMouseEnter={() => setHoveredWord(index)}
                onMouseLeave={() => setHoveredWord(null)}
                onClick={() =>
                  setExpandedWord(expandedWord === index ? null : index)
                }>
                {/* Main Word Content */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Word and Pronunciation */}
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {word.word}
                      </h3>
                      {word.pronunciation && (
                        <span className="text-lg text-gray-500 italic bg-gray-100 px-3 py-1 rounded-full">
                          /{word.pronunciation}/
                        </span>
                      )}
                    </div>

                    {/* Definition */}
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {word.definition}
                    </p>

                    {/* Example */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      <p className="text-gray-700 italic text-lg">
                        "{word.example}"
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="text-sm px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                        {word.partOfSpeech}
                      </Badge>
                      <Badge
                        className={twMerge(
                          "text-sm px-3 py-1 !text-foreground",
                          getLevelColor(word.difficulty)
                        )}>
                        {getLevelIcon(word.difficulty)} {word.difficulty}
                      </Badge>
                    </div>

                    {/* Additional Information - Expandable */}
                    <div
                      className={twMerge(
                        "overflow-hidden transition-all duration-300",
                        expandedWord === index
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      )}>
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        {/* Synonyms */}
                        {word.synonyms && word.synonyms.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                              Synonyms
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {word.synonyms.map(
                                (synonym: string, synIndex: number) => (
                                  <Badge
                                    key={synIndex}
                                    variant="secondary"
                                    className="text-xs px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                                    {synonym}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Antonyms */}
                        {word.antonyms && word.antonyms.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                              Antonyms
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {word.antonyms.map(
                                (antonym: string, antIndex: number) => (
                                  <Badge
                                    key={antIndex}
                                    variant="secondary"
                                    className="text-xs px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
                                    {antonym}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Collocations */}
                        {word.collocations && word.collocations.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                              Collocations
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {word.collocations.map(
                                (collocation: string, colIndex: number) => (
                                  <Badge
                                    key={colIndex}
                                    variant="secondary"
                                    className="text-xs px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                                    {collocation}
                                  </Badge>
                                )
                              )}
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
                          expandedWord === index
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-400"
                        )}>
                        <svg
                          className={twMerge(
                            "w-4 h-4 transition-transform duration-300",
                            expandedWord === index ? "rotate-180" : ""
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

                  {/* Audio Button */}
                  {word.audioUrl && (
                    <div className="ml-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className={twMerge(
                          "rounded-full w-12 h-12 transition-all duration-300 hover:scale-110",
                          isPlaying
                            ? "bg-green-100 text-green-600 border-green-300"
                            : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleAudio();
                        }}>
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Hover Effect Overlay */}
                <div
                  className={twMerge(
                    "absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 pointer-events-none",
                    hoveredWord === index ? "opacity-100" : ""
                  )}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
