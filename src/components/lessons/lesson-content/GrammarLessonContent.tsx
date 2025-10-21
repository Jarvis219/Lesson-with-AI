"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GrammarLessonContent as GrammarContent,
  GrammarRule,
} from "@/types/lesson-content";
import { AlertTriangle, BookOpen, Edit3, Lightbulb } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface GrammarLessonContentProps {
  content: GrammarContent;
}

export function GrammarLessonContent({ content }: GrammarLessonContentProps) {
  const [hoveredExample, setHoveredExample] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!content?.grammarRule) return null;

  const rule: GrammarRule = content.grammarRule;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-8">
      {/* Main Grammar Rule Card */}
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Edit3 className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Grammar Rule: {rule.title}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Main Explanation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <h4 className="text-xl font-semibold text-gray-800">
                Explanation
              </h4>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400">
              <p className="text-lg text-gray-700 leading-relaxed">
                {rule.explanation}
              </p>
            </div>
          </div>

          {/* Structure */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-500" />
              <h4 className="text-xl font-semibold text-gray-800">Structure</h4>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <code className="text-lg font-mono text-gray-800 bg-white p-4 rounded-lg block shadow-sm">
                {rule.structure}
              </code>
            </div>
          </div>

          {/* Usage Cases */}
          {rule.usage && rule.usage.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-green-500" />
                  <h4 className="text-xl font-semibold text-gray-800">Usage</h4>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSection("usage")}
                  className="text-sm">
                  {expandedSection === "usage" ? "Collapse" : "Expand"}
                </Button>
              </div>
              <div
                className={twMerge(
                  "overflow-hidden transition-all duration-300",
                  expandedSection === "usage"
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                )}>
                <div className="space-y-3">
                  {rule.usage.map((usage: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400 hover:bg-green-100 transition-colors">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{usage}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Examples */}
          {rule.examples && rule.examples.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-orange-500" />
                  <h4 className="text-xl font-semibold text-gray-800">
                    Examples
                  </h4>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSection("examples")}
                  className="text-sm">
                  {expandedSection === "examples" ? "Collapse" : "Expand"}
                </Button>
              </div>
              <div
                className={twMerge(
                  "overflow-hidden transition-all duration-300",
                  expandedSection === "examples"
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0"
                )}>
                <div className="space-y-4">
                  {rule.examples.map((example: any, index: number) => (
                    <div
                      key={index}
                      className={twMerge(
                        "border rounded-xl p-6 transition-all duration-300 hover:shadow-md",
                        hoveredExample === index
                          ? "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-300 shadow-md"
                          : "bg-white border-gray-200 hover:border-orange-200"
                      )}
                      onMouseEnter={() => setHoveredExample(index)}
                      onMouseLeave={() => setHoveredExample(null)}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <h5 className="text-lg font-semibold text-gray-800">
                            Example {index + 1}
                          </h5>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-400">
                          <p className="text-lg font-medium text-gray-900">
                            {example.sentence}
                          </p>
                        </div>

                        {example.translation && (
                          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border-l-4 border-gray-400">
                            <p className="text-gray-600 italic text-lg">
                              {example.translation}
                            </p>
                          </div>
                        )}

                        {example.highlight && (
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-400">
                            <p className="text-sm text-orange-700">
                              <span className="font-semibold">Highlight:</span>{" "}
                              <span className="font-medium bg-yellow-200 px-2 py-1 rounded">
                                {example.highlight}
                              </span>
                            </p>
                          </div>
                        )}

                        {example.explanation && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-400">
                            <p className="text-sm text-purple-700">
                              <span className="font-semibold">
                                Explanation:
                              </span>{" "}
                              {example.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {rule.notes && rule.notes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <h4 className="text-xl font-semibold text-gray-800">Notes</h4>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSection("notes")}
                  className="text-sm">
                  {expandedSection === "notes" ? "Collapse" : "Expand"}
                </Button>
              </div>
              <div
                className={twMerge(
                  "overflow-hidden transition-all duration-300",
                  expandedSection === "notes"
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                )}>
                <div className="space-y-3">
                  {rule.notes.map((note: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 hover:bg-blue-100 transition-colors">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {rule.commonMistakes && rule.commonMistakes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h4 className="text-xl font-semibold text-red-600">
                    Common Mistakes
                  </h4>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSection("mistakes")}
                  className="text-sm">
                  {expandedSection === "mistakes" ? "Collapse" : "Expand"}
                </Button>
              </div>
              <div
                className={twMerge(
                  "overflow-hidden transition-all duration-300",
                  expandedSection === "mistakes"
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                )}>
                <div className="space-y-3">
                  {rule.commonMistakes.map((mistake: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-400 hover:bg-red-100 transition-colors">
                      <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        ⚠
                      </div>
                      <p className="text-red-700 leading-relaxed">{mistake}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Topics */}
          {rule.relatedTopics && rule.relatedTopics.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                <h4 className="text-xl font-semibold text-gray-800">
                  Related Topics
                </h4>
              </div>
              <div className="flex flex-wrap gap-3">
                {rule.relatedTopics.map((topic: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-sm px-4 py-2 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 transition-colors">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Visual Aids */}
          {content.visualAids && content.visualAids.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-purple-500" />
                <h4 className="text-xl font-semibold text-gray-800">
                  Visual Aids
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.visualAids.map((aid: string, index: number) => (
                  <div
                    key={index}
                    className="border rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <img
                      src={aid}
                      alt={`Visual aid ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
