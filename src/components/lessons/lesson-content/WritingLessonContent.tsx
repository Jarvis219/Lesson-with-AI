"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    WritingLessonContent as WritingContent,
    WritingInstruction,
} from "@/types/lesson-content";
import { BookOpen, CheckCircle, Clock, FileText, PenTool, Target } from "lucide-react";
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
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  <FileText className="h-4 w-4 mr-1" />
                  {(content.instruction as WritingInstruction).writingType || "Essay"}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {(content.instruction as WritingInstruction).estimatedTime || "60"} min
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  <Target className="h-4 w-4 mr-1" />
                  {(content.instruction as WritingInstruction).wordCount || "300-500"} words
                </Badge>
              </div>

              {/* Task Description */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Task Description</h4>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {(content.instruction as WritingInstruction).taskDescription}
                </p>
              </div>

              {/* Requirements */}
              {(content.instruction as WritingInstruction).requirements && 
               (content.instruction as WritingInstruction).requirements.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Requirements</h4>
                  <div className="space-y-3">
                    {(content.instruction as WritingInstruction).requirements.map((req: string, index: number) => (
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
                    ))}
                  </div>
                </div>
              )}

              {/* Guidelines */}
              {(content.instruction as WritingInstruction).guidelines && 
               (content.instruction as WritingInstruction).guidelines.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Guidelines</h4>
                  <div className="space-y-3">
                    {(content.instruction as WritingInstruction).guidelines.map((guideline: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 hover:bg-yellow-100 transition-colors">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {guideline}
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
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Example Text</h4>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">
                    {(content.modelText as any).content || (content.modelText as any).text}
                  </p>
                </div>
              </div>

              {/* Analysis */}
              {(content.modelText as any).analysis && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Text Analysis</h4>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400">
                    <p className="text-gray-700 leading-relaxed">
                      {(content.modelText as any).analysis}
                    </p>
                  </div>
                </div>
              )}

              {/* Key Features */}
              {(content.modelText as any).keyFeatures && 
               (content.modelText as any).keyFeatures.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Key Features</h4>
                  <div className="space-y-3">
                    {(content.modelText as any).keyFeatures.map((feature: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400 hover:bg-purple-100 transition-colors">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {feature}
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
              {(content.writingFramework as any).structure && 
               (content.writingFramework as any).structure.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Structure</h4>
                  <div className="space-y-4">
                    {(content.writingFramework as any).structure.map((section: any, index: number) => (
                      <div
                        key={index}
                        className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <h5 className="text-lg font-semibold text-gray-800">
                              {section.title || `Section ${index + 1}`}
                            </h5>
                            <Badge variant="outline" className="text-xs">
                              {section.wordCount || "50-100"} words
                            </Badge>
                          </div>
                          
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-400">
                            <p className="text-gray-800 font-medium">
                              {section.description}
                            </p>
                          </div>

                          {section.prompts && section.prompts.length > 0 && (
                            <div className="space-y-2">
                              <h6 className="text-sm font-semibold text-gray-600">Prompts:</h6>
                              <div className="space-y-2">
                                {section.prompts.map((prompt: string, promptIndex: number) => (
                                  <div
                                    key={promptIndex}
                                    className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                                    <span className="text-yellow-600 mt-1">•</span>
                                    <p className="text-gray-700 text-sm">
                                      {prompt}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {section.examples && section.examples.length > 0 && (
                            <div className="space-y-2">
                              <h6 className="text-sm font-semibold text-gray-600">Examples:</h6>
                              <div className="space-y-2">
                                {section.examples.map((example: string, exampleIndex: number) => (
                                  <div
                                    key={exampleIndex}
                                    className="p-3 bg-gray-50 rounded-lg border">
                                    <p className="text-gray-600 italic text-sm">
                                      "{example}"
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transition Words */}
              {(content.writingFramework as any).transitionWords && 
               (content.writingFramework as any).transitionWords.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Transition Words</h4>
                  <div className="flex flex-wrap gap-2">
                    {(content.writingFramework as any).transitionWords.map((word: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-sm px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
                        {word}
                      </Badge>
                    ))}
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
              {(content.rubric as any).criteria && 
               (content.rubric as any).criteria.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Evaluation Criteria</h4>
                  <div className="space-y-4">
                    {(content.rubric as any).criteria.map((criterion: any, index: number) => (
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

                          {criterion.levels && criterion.levels.length > 0 && (
                            <div className="space-y-3">
                              <h6 className="text-sm font-semibold text-gray-600">Performance Levels:</h6>
                              <div className="space-y-2">
                                {criterion.levels.map((level: any, levelIndex: number) => (
                                  <div
                                    key={levelIndex}
                                    className="flex items-start gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-200">
                                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                      {levelIndex + 1}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-800">
                                          {level.name || `Level ${levelIndex + 1}`}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                          {level.points || 0} pts
                                        </Badge>
                                      </div>
                                      <p className="text-gray-600 text-sm">
                                        {level.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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
              <p className="text-gray-600 mb-4">Use this checklist to review your writing before submitting:</p>
              <div className="space-y-3">
                {(content as any).checklist.map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400 hover:bg-indigo-100 transition-colors">
                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Writing Area */}
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
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
                <Button size="sm">
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}