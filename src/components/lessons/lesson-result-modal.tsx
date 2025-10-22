"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { Lesson } from "@/types";
import {
  Award,
  Brain,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { LessonFeedbackResponse, QuestionAnswer } from "@/types/feedback";
import { isEmpty } from "utils/lodash.util";

interface LessonResultModalProps {
  lessonId: string;
  onClose: () => void;
  onContinue: () => void;
}

export default function LessonResultModal({
  lessonId,
  onClose,
  onContinue,
}: LessonResultModalProps) {
  const [activeTab, setActiveTab] = useState<"feedback" | "questions">(
    "feedback"
  );
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<LessonFeedbackResponse | null>(
    null
  );
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [savedFeedback, setSavedFeedback] =
    useState<LessonFeedbackResponse | null>(null);
  const [questionsData, setQuestionsData] = useState<QuestionAnswer[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [score, setScore] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [loadingData, setLoadingData] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);

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

  // Fetch saved feedback and questions data from database
  const fetchSavedData = async () => {
    try {
      const data = await apiClient.getLessonResult(lessonId);
      if (data.result) {
        // Set lesson data from populated lessonId
        if (data.result.lessonId) {
          setLesson(data.result.lessonId as unknown as Lesson);
        }

        // Set score and timeSpent
        setScore(data.result.score);
        setTimeSpent(Math.round(data.result.timeSpent / 60)); // Convert seconds to minutes

        // Set feedback if available
        if (data.result.feedback) {
          setSavedFeedback(data.result.feedback);
          setAiFeedback(data.result.feedback);
        }

        // Set questions data
        if (
          data.result.questionResults &&
          data.result.questionResults.length > 0
        ) {
          const formattedQuestions: QuestionAnswer[] =
            data.result.questionResults.map((qr: any) => ({
              question: qr.question,
              userAnswer: qr.userAnswer,
              correctAnswer: qr.correctAnswer,
              isCorrect: qr.isCorrect,
              questionType: qr.questionType,
              explanation: qr.explanation,
            }));
          setQuestionsData(formattedQuestions);
        }

        setLoadingQuestions(false);
        setLoadingData(false);
        return true;
      }
    } catch (error) {
      console.error("Error fetching saved data:", error);
      setLoadingQuestions(false);
      setLoadingData(false);
    }
    return false;
  };

  // Fetch AI feedback
  const fetchAIFeedback = async () => {
    setLoadingFeedback(true);
    try {
      // First try to get saved data
      const hasSavedData = !isEmpty(questionsData);

      if (hasSavedData && savedFeedback) {
        setAiFeedback(savedFeedback);
        setLoadingFeedback(false);
        return;
      }

      // If no saved feedback, generate new one
      if (!lesson) {
        setLoadingFeedback(false);
        return;
      }

      const correctAnswers = Math.round(
        (score / 100) * (lesson.content?.exercises?.length || 0)
      );

      const response = await apiClient.getLessonFeedback({
        lessonType: lesson.type,
        score,
        totalQuestions: lesson.content?.exercises?.length || 0,
        correctAnswers,
        timeSpent,
        userLevel: lesson.difficulty,
        questions: questionsData,
        lessonId: lesson._id,
      });

      setAiFeedback(response.feedback);
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  // Fetch saved data when modal opens
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        await fetchSavedData();
      } catch (error) {
        // No saved data found
        console.log("No saved data found");
        setLoadingQuestions(false);
        setLoadingData(false);
      }
    };

    loadSavedData();
  }, [lessonId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm modal-enter">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 modal-content-enter">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 text-white">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Lesson Completed!</h2>
                <p className="text-purple-100 text-sm">
                  Great job on finishing the lesson
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-gradient-to-br from-gray-50 to-blue-50">
          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <span className="ml-4 text-gray-600 text-lg">
                Loading lesson results...
              </span>
            </div>
          ) : (
            <>
              {/* Score Display */}
              <div className="text-center relative">
                {/* Animated background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={twMerge(
                      "w-32 h-32 rounded-full opacity-20 animate-pulse",
                      score >= 90
                        ? "bg-green-500"
                        : score >= 80
                        ? "bg-blue-500"
                        : score >= 70
                        ? "bg-yellow-500"
                        : score >= 60
                        ? "bg-orange-500"
                        : "bg-red-500"
                    )}></div>
                </div>

                <div className="relative z-10">
                  <div className="text-8xl mb-4 animate-bounce-in">
                    {getScoreEmoji(score)}
                  </div>
                  <div
                    className={twMerge(
                      "text-5xl font-bold mb-2 animate-score-count",
                      getScoreColor(score)
                    )}>
                    {score}%
                  </div>
                  <p className="text-xl text-gray-700 mb-6 font-medium">
                    {getScoreMessage(score)}
                  </p>

                  <div className="flex items-center justify-center gap-8 text-sm">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700 font-medium">
                        {timeSpent} minutes
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-700 font-medium">
                        {lesson?.content?.exercises?.length || 0} questions
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Info */}
              {lesson && (
                <Card className="p-6 bg-white shadow-lg border-0 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600">{lesson.description}</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2 text-sm font-medium">
                      {lesson.type.toUpperCase()}
                    </Badge>
                  </div>
                </Card>
              )}

              {/* Tabs */}
              <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={twMerge(
                    "flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg",
                    activeTab === "feedback"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}>
                  <div className="flex items-center justify-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Feedback
                    {aiFeedback && (
                      <Sparkles className="h-3 w-3 text-yellow-400" />
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("questions")}
                  className={twMerge(
                    "flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 rounded-lg",
                    activeTab === "questions"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}>
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-4 w-4" />
                    Question Details ({questionsData.length})
                  </div>
                </button>
              </div>

              {/* AI Feedback Tab */}
              {activeTab === "feedback" && (
                <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">
                        AI Feedback
                      </h3>
                      {aiFeedback && (
                        <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                          Saved
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white text-purple-700 border border-purple-200 hover:bg-purple-50"
                      onClick={fetchAIFeedback}
                      disabled={loadingFeedback}>
                      {loadingFeedback ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Generate AI Feedback
                        </div>
                      )}
                    </Button>
                  </div>

                  {loadingFeedback ? (
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
                            {aiFeedback.improvements.map(
                              (improvement, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700">
                                  • {improvement}
                                </li>
                              )
                            )}
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
                                <li
                                  key={index}
                                  className="text-sm text-gray-700">
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
                            aiFeedback.detailedAnalysis.specificMistakes
                              .length > 0 && (
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
                            aiFeedback.detailedAnalysis.weakAreas.length >
                              0 && (
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
                            aiFeedback.detailedAnalysis.strongAreas.length >
                              0 && (
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
                        No AI feedback available for this lesson.
                      </p>
                    </div>
                  )}
                </Card>
              )}

              {/* Question Details Tab */}
              {activeTab === "questions" && (
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">
                      Question Details
                    </h3>
                  </div>

                  {loadingQuestions ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="ml-3 text-gray-600">
                        Loading question details...
                      </span>
                    </div>
                  ) : questionsData.length > 0 ? (
                    <div className="space-y-4">
                      {questionsData.map((question, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 ${
                            question.isCorrect
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}>
                          {/* Question Number and Status */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-700">
                                Question {index + 1}
                              </span>
                              <Badge
                                className={
                                  question.isCorrect
                                    ? "bg-green-100 text-green-700 border-0"
                                    : "bg-red-100 text-red-700 border-0"
                                }>
                                {question.isCorrect ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                {question.isCorrect ? "Correct" : "Incorrect"}
                              </Badge>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs bg-white border-gray-300">
                              {question.questionType}
                            </Badge>
                          </div>

                          {/* Question */}
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Question:
                            </p>
                            <p className="text-gray-700">{question.question}</p>
                          </div>

                          {/* User Answer */}
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Your Answer:
                            </p>
                            <p
                              className={`text-sm ${
                                question.isCorrect
                                  ? "text-green-700 font-medium"
                                  : "text-red-700 font-medium"
                              }`}>
                              {Array.isArray(question.userAnswer)
                                ? question.userAnswer.join(", ")
                                : question.userAnswer || "No answer provided"}
                            </p>
                          </div>

                          {/* Correct Answer (only show if incorrect) */}
                          {!question.isCorrect && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Correct Answer:
                              </p>
                              <p className="text-sm text-green-700 font-medium">
                                {Array.isArray(question.correctAnswer)
                                  ? question.correctAnswer.join(", ")
                                  : question.correctAnswer}
                              </p>
                            </div>
                          )}

                          {/* Explanation */}
                          {question.explanation && (
                            <div className="pt-3 border-t border-gray-200">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Explanation:
                              </p>
                              <p className="text-sm text-gray-600">
                                {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Summary */}
                      <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {questionsData.length}
                            </p>
                            <p className="text-xs text-gray-600">
                              Total Questions
                            </p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-600">
                              {questionsData.filter((q) => q.isCorrect).length}
                            </p>
                            <p className="text-xs text-gray-600">Correct</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-red-600">
                              {questionsData.filter((q) => !q.isCorrect).length}
                            </p>
                            <p className="text-xs text-gray-600">Incorrect</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-700">
                        No question details available for this lesson.
                      </p>
                    </div>
                  )}
                </Card>
              )}

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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 bg-white border-t border-gray-100 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 py-3 text-base font-medium border-2 hover:bg-gray-50 transition-all duration-200">
            <RotateCcw className="h-5 w-5 mr-2" />
            Learn Again
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            <TrendingUp className="h-5 w-5 mr-2" />
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
}
