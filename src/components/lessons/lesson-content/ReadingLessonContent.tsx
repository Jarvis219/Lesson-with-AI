"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BaseExercise,
  ReadingLessonContent as ReadingContent,
  VocabularyWord,
} from "@/types/lesson-content";
import { BookOpen, Clock, Eye, Target } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { getLevelColor, getLevelIcon } from "utils/lesson.util";

interface ReadingLessonContentProps {
  content: ReadingContent;
  onExerciseAnswersChange?: (
    sectionId: string,
    answers: Record<string, any>
  ) => void;
  onSubmitSection?: (
    sectionId: string,
    answers: Record<string, any>,
    exercises: BaseExercise[]
  ) => void;
  isSubmitting?: boolean;
}

export function ReadingLessonContent({
  content,
  onExerciseAnswersChange,
  onSubmitSection,
  isSubmitting = false,
}: ReadingLessonContentProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleExerciseAnswersChange =
    (sectionId: string) => (answers: Record<string, any>) => {
      if (onExerciseAnswersChange) {
        onExerciseAnswersChange(sectionId, answers);
      }
    };

  const handleSubmitSection =
    (sectionId: string) =>
    (answers: Record<string, any>, exercises: BaseExercise[]) => {
      if (onSubmitSection) {
        onSubmitSection(sectionId, answers, exercises);
      }
    };

  const exercises: BaseExercise[] | undefined = (content as any)?.exercises;

  return (
    <div className="space-y-8">
      {/* Reading Passage */}
      {content.passage && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Reading Passage
              </span>
            </CardTitle>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="outline" className="text-sm px-3 py-1">
                <BookOpen className="h-4 w-4 mr-1" />
                {content.passage.genre || "Article"}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Clock className="h-4 w-4 mr-1" />
                {content.passage.wordCount} words
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Target className="h-4 w-4 mr-1" />
                {content.passage.readingTime} min read
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Passage Title */}
              {content.passage.title && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {content.passage.title}
                  </h2>
                </div>
              )}

              {/* Passage Content */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-8 rounded-xl border-l-4 border-blue-400">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">
                    {content.passage.text}
                  </p>
                </div>
              </div>

              {/* Passage Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {content.passage.author && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">
                      Author
                    </h4>
                    <p className="text-gray-800 font-medium">
                      {content.passage.author}
                    </p>
                  </div>
                )}

                {content.passage.source && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-400">
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">
                      Source
                    </h4>
                    <p className="text-gray-800 font-medium">
                      {content.passage.source}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pre-Reading */}
      {content.preReading && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Pre-Reading
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Background Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Background Information
                </h4>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {content.preReading.context}
                </p>
              </div>

              {/* Key Vocabulary */}
              {content.preReading.vocabulary &&
                content.preReading.vocabulary.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Key Vocabulary
                      </h4>
                      <Badge variant="outline" className="text-sm">
                        {content.preReading.vocabulary.length} words
                      </Badge>
                    </div>
                    <div className="grid gap-4">
                      {content.preReading.vocabulary.map(
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
                )}

              {/* Prediction Questions */}
              {content.preReading.predictions &&
                content.preReading.predictions.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Prediction Questions
                    </h4>
                    <div className="space-y-3">
                      {content.preReading.predictions.map(
                        (question: string, index: number) => (
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
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* While-Reading removed in new schema (annotations now omitted) */}

      {/* Post-Reading */}
      {content.postReading && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Post-Reading
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Discussion Questions */}
              {content.postReading.discussionQuestions &&
                content.postReading.discussionQuestions.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Discussion Questions
                    </h4>
                    <div className="space-y-3">
                      {content.postReading.discussionQuestions.map(
                        (question: string, index: number) => (
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
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Summary Activity */}
              {content.postReading.summaryTask && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-400">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Summary Activity
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {content.postReading.summaryTask}
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
