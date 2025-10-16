"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { Lesson } from "@/types";
import {
  Award,
  Brain,
  Clock,
  Loader2,
  RotateCcw,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { LessonFeedbackResponse, QuestionAnswer } from "@/types/feedback";

interface LessonResultModalProps {
  lesson: Lesson;
  score: number;
  timeSpent: number;
  questionsData: QuestionAnswer[];
  onClose: () => void;
  onContinue: () => void;
}

export default function LessonResultModal({
  lesson,
  score,
  timeSpent,
  questionsData,
  onClose,
  onContinue,
}: LessonResultModalProps) {
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<LessonFeedbackResponse | null>(
    null
  );
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90)
      return "Congratulations! You have completed the lesson successfully!";
    if (score >= 80) return "Good! You have understood the lesson content.";
    if (score >= 70) return "Good! You have understood the lesson content.";
    if (score >= 60)
      return "You have met the requirements. Please practice more to improve.";
    return "Need improvement. Please review and try again.";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🎉";
    if (score >= 80) return "👏";
    if (score >= 70) return "👍";
    if (score >= 60) return "✅";
    return "💪";
  };

  // Fetch AI feedback
  const fetchAIFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const correctAnswers = Math.round(
        (score / 100) * lesson.content.exercises.length
      );

      const response = await apiClient.getLessonFeedback({
        lessonType: lesson.type,
        score,
        totalQuestions: lesson.content.exercises.length,
        correctAnswers,
        timeSpent,
        userLevel: lesson.difficulty,
        questions: questionsData,
      });

      setAiFeedback(response.feedback);
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  // Fetch feedback when showing AI feedback
  useEffect(() => {
    if (showAIFeedback && !aiFeedback) {
      fetchAIFeedback();
    }
  }, [showAIFeedback]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Lesson Result</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-6xl mb-4">{getScoreEmoji(score)}</div>
            <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
              {score}%
            </div>
            <p className="text-lg text-gray-600 mb-4">
              {getScoreMessage(score)}
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{timeSpent} minutes</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>{lesson.content.exercises.length} questions</span>
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                <p className="text-sm text-gray-600">{lesson.description}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-0">
                {lesson.type.toUpperCase()}
              </Badge>
            </div>
          </Card>

          {/* AI Feedback */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">AI Feedback</h3>
            </div>

            {!showAIFeedback ? (
              <Button
                variant="outline"
                onClick={() => setShowAIFeedback(true)}
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                <Brain className="h-4 w-4 mr-2" />
                View AI Feedback
              </Button>
            ) : loadingFeedback ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <span className="ml-3 text-gray-600">
                  Generating feedback...
                </span>
              </div>
            ) : aiFeedback ? (
              <div className="space-y-3">
                {/* Motivational Message */}
                <div className="p-3 bg-white rounded-lg border-l-4 border-purple-500">
                  <p className="text-sm text-gray-700">
                    {aiFeedback.motivationalMessage}
                  </p>
                </div>

                {/* Strengths */}
                {aiFeedback.strengths.length > 0 && (
                  <div className="p-3 bg-white rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Your Strengths:
                    </h4>
                    <ul className="space-y-1">
                      {aiFeedback.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {aiFeedback.improvements.length > 0 && (
                  <div className="p-3 bg-white rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-orange-600">💡</span>
                      Areas for Improvement:
                    </h4>
                    <ul className="space-y-1">
                      {aiFeedback.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          • {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Lesson Suggestions */}
                {aiFeedback.nextLessonSuggestions.length > 0 && (
                  <div className="p-3 bg-white rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-blue-600">🎯</span>
                      Next Lesson Suggestions:
                    </h4>
                    <ul className="space-y-1">
                      {aiFeedback.nextLessonSuggestions.map(
                        (suggestion, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            • {suggestion}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Detailed Analysis */}
                {aiFeedback.detailedAnalysis && (
                  <div className="space-y-3">
                    {/* Specific Mistakes */}
                    {aiFeedback.detailedAnalysis.specificMistakes &&
                      aiFeedback.detailedAnalysis.specificMistakes.length >
                        0 && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                            <span className="text-red-600">❌</span>
                            Specific Mistakes:
                          </h4>
                          <div className="space-y-2">
                            {aiFeedback.detailedAnalysis.specificMistakes.map(
                              (mistake, index) => (
                                <div
                                  key={index}
                                  className="p-2 bg-white rounded border border-red-100">
                                  <p className="text-sm font-medium text-gray-900 mb-1">
                                    Q: {mistake.question}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Your answer: {mistake.userAnswer}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Correct: {mistake.correctAnswer}
                                  </p>
                                  <p className="text-xs text-red-700 mt-1">
                                    {mistake.explanation}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Weak Areas */}
                    {aiFeedback.detailedAnalysis.weakAreas &&
                      aiFeedback.detailedAnalysis.weakAreas.length > 0 && (
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <h4 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
                            <span className="text-orange-600">⚠️</span>
                            Weak Areas:
                          </h4>
                          <ul className="space-y-1">
                            {aiFeedback.detailedAnalysis.weakAreas.map(
                              (area, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700">
                                  • {area}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Strong Areas */}
                    {aiFeedback.detailedAnalysis.strongAreas &&
                      aiFeedback.detailedAnalysis.strongAreas.length > 0 && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                            <span className="text-green-600">⭐</span>
                            Strong Areas:
                          </h4>
                          <ul className="space-y-1">
                            {aiFeedback.detailedAnalysis.strongAreas.map(
                              (area, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700">
                                  • {area}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-700">
                  Unable to load AI feedback. Please try again.
                </p>
              </div>
            )}
          </Card>

          {/* Achievement */}
          {score >= 80 && (
            <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    New achievement!
                  </h3>
                  <p className="text-sm text-gray-600">
                    You have completed the lesson with a high score!
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Learn again
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1 bg-blue-600 hover:bg-blue-700">
            <TrendingUp className="h-4 w-4 mr-2" />
            Continue learning
          </Button>
        </div>
      </div>
    </div>
  );
}
