"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WritingLessonContent as WritingContent } from "@/types/lesson-content";
import { BookOpen, CheckCircle, FileText, PenTool, Target } from "lucide-react";
import { useState } from "react";

interface WritingLessonContentProps {
  content: WritingContent;
}

export function WritingLessonContent({ content }: WritingLessonContentProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-8">
      {/* Writing Instructions */}
      {content.instruction && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PenTool className="h-6 w-6 text-blue-600" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Writing Instructions
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Writing Type */}
              {content.writingType && (
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <FileText className="h-4 w-4 mr-1" />
                    {content.writingType}
                  </Badge>
                </div>
              )}

              {/* Prompt */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Prompt
                </h4>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {content.instruction.prompt}
                </p>
              </div>

              {/* Requirements */}
              {content.instruction.requirements &&
                content.instruction.requirements.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Requirements
                    </h4>
                    <div className="space-y-3">
                      {content.instruction.requirements.map(
                        (req: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400 hover:bg-green-100 transition-colors">
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              ✓
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {req}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Optional Meta */}
              {(content.instruction.audience ||
                content.instruction.purpose ||
                content.instruction.tone) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {content.instruction.audience && (
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border">
                      <h4 className="text-sm font-semibold text-gray-600 mb-1">
                        Audience
                      </h4>
                      <p className="text-gray-800 font-medium">
                        {content.instruction.audience}
                      </p>
                    </div>
                  )}
                  {content.instruction.purpose && (
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border">
                      <h4 className="text-sm font-semibold text-gray-600 mb-1">
                        Purpose
                      </h4>
                      <p className="text-gray-800 font-medium">
                        {content.instruction.purpose}
                      </p>
                    </div>
                  )}
                  {content.instruction.tone && (
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border">
                      <h4 className="text-sm font-semibold text-gray-600 mb-1">
                        Tone
                      </h4>
                      <p className="text-gray-800 font-medium">
                        {content.instruction.tone}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Text */}
      {content.modelText && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Model Text
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Model Text Content */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border-l-4 border-purple-400">
                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                  {content.modelText.title}
                </h4>
                <div className="prose prose-lg max-w-none mt-3">
                  <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">
                    {content.modelText.text}
                  </p>
                </div>
              </div>

              {/* Analysis */}
              {content.modelText.analysis && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Text Analysis
                  </h4>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400">
                    <p className="text-gray-700 leading-relaxed">
                      {content.modelText.analysis}
                    </p>
                  </div>
                </div>
              )}

              {/* Highlights */}
              {content.modelText.highlights &&
                content.modelText.highlights.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Highlights
                    </h4>
                    <div className="space-y-3">
                      {content.modelText.highlights.map((h, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400 hover:bg-purple-100 transition-colors">
                          <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700 leading-relaxed font-medium">
                              {h.text}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              {h.explanation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Writing Framework */}
      {content.writingFramework && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Writing Framework
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Framework Structure */}
              {content.writingFramework.structure &&
                content.writingFramework.structure.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Structure
                    </h4>
                    <div className="space-y-3">
                      {content.writingFramework.structure.map(
                        (item: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400 hover:bg-green-100 transition-colors">
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {item}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Useful Phrases */}
              {content.writingFramework.usefulPhrases &&
                content.writingFramework.usefulPhrases.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Useful Phrases
                    </h4>
                    <div className="space-y-4">
                      {content.writingFramework.usefulPhrases.map(
                        (group: any, idx: number) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {group.category}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {group.phrases.map((p: string, i: number) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs px-2 py-1 bg-blue-50 text-blue-700">
                                  {p}
                                </Badge>
                              ))}
                            </div>
                            {group.examples && group.examples.length > 0 && (
                              <div className="space-y-1">
                                {group.examples.map(
                                  (ex: string, ei: number) => (
                                    <p
                                      key={ei}
                                      className="text-sm text-gray-600 italic">
                                      "{ex}"
                                    </p>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Grammar Points */}
              {content.writingFramework.grammarPoints &&
                content.writingFramework.grammarPoints.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Grammar Points
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {content.writingFramework.grammarPoints.map(
                        (gp: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs px-2 py-1 bg-purple-50 text-purple-700">
                            {gp}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Vocabulary Bank */}
              {content.writingFramework.vocabularyBank &&
                content.writingFramework.vocabularyBank.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Vocabulary Bank
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {content.writingFramework.vocabularyBank.map(
                        (vb: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs px-2 py-1 bg-teal-50 text-teal-700">
                            {vb}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rubric */}
      {content.rubric && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Assessment Rubric
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Rubric Criteria */}
              {content.rubric.criteria &&
                content.rubric.criteria.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Evaluation Criteria
                    </h4>
                    <div className="space-y-4">
                      {content.rubric.criteria.map(
                        (criterion: any, index: number) => (
                          <div
                            key={index}
                            className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h5 className="text-lg font-semibold text-gray-800">
                                  {criterion.name}
                                </h5>
                                <Badge variant="outline" className="text-sm">
                                  {criterion.maxPoints} points
                                </Badge>
                              </div>

                              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border-l-4 border-orange-400">
                                <p className="text-gray-700 leading-relaxed">
                                  {criterion.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              {typeof content.rubric.totalPoints === "number" && (
                <div className="text-sm text-gray-600">
                  Total Points:{" "}
                  <span className="font-semibold">
                    {content.rubric.totalPoints}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Writing Checklist */}
      {(content as any).checklist && (content as any).checklist.length > 0 && (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Writing Checklist
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Use this checklist to review your writing before submitting:
              </p>
              <div className="space-y-3">
                {(content as any).checklist.map(
                  (item: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400 hover:bg-indigo-100 transition-colors">
                      <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        ✓
                      </div>
                      <p className="text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Writing Area */}
      {/* <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gray-100 rounded-lg">
              <PenTool className="h-6 w-6 text-gray-600" />
            </div>
            <span className="bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
              Your Writing
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Start writing your response here..."
              className="min-h-[400px] text-lg leading-relaxed"
            />
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Word count: <span className="font-medium">0</span> words
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Save Draft
                </Button>
                <Button size="sm">Submit</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
