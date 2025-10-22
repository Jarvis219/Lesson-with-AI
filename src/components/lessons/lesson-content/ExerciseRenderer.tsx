"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { BaseExercise, FillInBlankExercise } from "@/types/lesson-content";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { getLevelColor, getLevelIcon } from "utils/lesson.util";
import { isEmpty } from "utils/lodash.util";

interface ExerciseRendererProps {
  exercises: BaseExercise[];
  currentExerciseIndex: number;
  userAnswers: Record<string, any>;
  showResults: boolean;
  onAnswerChange: (exerciseId: string, answer: any) => void;
  onPreviousExercise: () => void;
  onNextExercise: () => void;
  onSubmitExercise: () => void;
}

export function ExerciseRenderer({
  exercises,
  currentExerciseIndex,
  userAnswers,
  showResults,
  onAnswerChange,
  onPreviousExercise,
  onNextExercise,
  onSubmitExercise,
}: ExerciseRendererProps) {
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

  if (exercises.length === 0) {
    return null;
  }

  const exercise = exercises[currentExerciseIndex];
  const userAnswer =
    userAnswers[exercise.id || currentExerciseIndex.toString()];

  const handleNextExercise = () => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      onNextExercise();
      setIsAnimating(false);
    }, 200);

    timeoutRef.current.push(timeout);
  };

  const handlePreviousExercise = () => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      onPreviousExercise();
      setIsAnimating(false);
    }, 200);

    timeoutRef.current.push(timeout);
  };

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRef.current = [];
    };
  }, []);

  const renderExerciseContent = () => {
    switch ((exercise as any).type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            {(exercise as any).options?.map((option: any, index: number) => {
              const isChecked = Array.isArray(userAnswer)
                ? userAnswer.includes(option.value)
                : false;

              return (
                <div
                  key={index}
                  className={twMerge(
                    "flex items-center space-x-3 p-4 rounded-xl border transition-all duration-300 hover:shadow-md cursor-pointer",
                    hoveredOption === index
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md"
                      : "bg-white border-gray-200 hover:border-blue-200"
                  )}
                  onMouseEnter={() => setHoveredOption(index)}
                  onMouseLeave={() => setHoveredOption(null)}>
                  <Checkbox
                    id={`${currentExerciseIndex}-${index}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const currentAnswers = Array.isArray(userAnswer)
                        ? userAnswer
                        : [];
                      let newAnswers;

                      if (checked) {
                        newAnswers = [...currentAnswers, option.value];
                      } else {
                        newAnswers = currentAnswers.filter(
                          (answer: string) => answer !== option.value
                        );
                      }

                      onAnswerChange(
                        exercise.id || currentExerciseIndex.toString(),
                        newAnswers
                      );
                    }}
                    className="w-5 h-5"
                  />
                  <label
                    htmlFor={`${currentExerciseIndex}-${index}`}
                    className="flex-1 cursor-pointer">
                    <div className="space-y-1">
                      <span className="text-gray-800 font-medium text-lg">
                        {option.value}
                      </span>
                      {option.translate && (
                        <p className="text-sm text-gray-500 italic">
                          {option.translate}
                        </p>
                      )}
                    </div>
                  </label>
                  {isChecked && (
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      case "single-choice":
        return (
          <RadioGroup
            value={userAnswer || ""}
            onValueChange={(value) =>
              onAnswerChange(
                exercise.id || currentExerciseIndex.toString(),
                value
              )
            }
            className="space-y-4">
            {(exercise as any).options?.map((option: any, index: number) => (
              <div
                key={index}
                className={twMerge(
                  "flex items-center space-x-3 p-4 rounded-xl border transition-all duration-300 hover:shadow-md cursor-pointer",
                  hoveredOption === index
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md"
                    : "bg-white border-gray-200 hover:border-blue-200"
                )}
                onMouseEnter={() => setHoveredOption(index)}
                onMouseLeave={() => setHoveredOption(null)}>
                <RadioGroupItem
                  value={option.value}
                  id={`${currentExerciseIndex}-${index}`}
                  className="w-5 h-5"
                />
                <label
                  htmlFor={`${currentExerciseIndex}-${index}`}
                  className="flex-1 cursor-pointer">
                  <div className="space-y-1">
                    <span className="text-gray-800 font-medium text-lg">
                      {option.value}
                    </span>
                    {option.translate && (
                      <p className="text-sm text-gray-500 italic">
                        {option.translate}
                      </p>
                    )}
                  </div>
                </label>
                {userAnswer === option.value && (
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </RadioGroup>
        );

      case "fill-in-the-blank":
        const fillTheBankExercise = exercise as FillInBlankExercise;
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400">
              <Tooltip
                content={
                  fillTheBankExercise?.translation || "Nothing for translation"
                }>
                <p className="text-gray-800 text-lg leading-relaxed">
                  {fillTheBankExercise.sentence}
                </p>
              </Tooltip>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Your Answer
              </label>
              <Input
                placeholder="Type your answer here..."
                value={userAnswer || ""}
                onChange={(e) =>
                  onAnswerChange(
                    fillTheBankExercise.id || currentExerciseIndex.toString(),
                    e.target.value
                  )
                }
                className="text-lg p-4 border-2 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            {fillTheBankExercise?.hint && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-700">
                    Hint
                  </span>
                </div>
                <p className="text-yellow-700">{fillTheBankExercise.hint}</p>
              </div>
            )}
          </div>
        );

      case "true-false":
        return (
          <RadioGroup
            value={userAnswer?.toString() || ""}
            onValueChange={(value) =>
              onAnswerChange(
                exercise.id || currentExerciseIndex.toString(),
                value === "true"
              )
            }
            className="space-y-4">
            <div
              className={twMerge(
                "flex items-center space-x-3 p-4 rounded-xl border transition-all duration-300 hover:shadow-md cursor-pointer",
                hoveredOption === 0
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md"
                  : "bg-white border-gray-200 hover:border-green-200"
              )}
              onMouseEnter={() => setHoveredOption(0)}
              onMouseLeave={() => setHoveredOption(null)}>
              <RadioGroupItem
                value="true"
                id={`${currentExerciseIndex}-true`}
                className="w-5 h-5"
              />
              <label
                htmlFor={`${currentExerciseIndex}-true`}
                className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    T
                  </div>
                  <span className="text-gray-800 font-medium text-lg">
                    True
                  </span>
                </div>
              </label>
              {userAnswer === true && (
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
            </div>

            <div
              className={twMerge(
                "flex items-center space-x-3 p-4 rounded-xl border transition-all duration-300 hover:shadow-md cursor-pointer",
                hoveredOption === 1
                  ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-300 shadow-md"
                  : "bg-white border-gray-200 hover:border-red-200"
              )}
              onMouseEnter={() => setHoveredOption(1)}
              onMouseLeave={() => setHoveredOption(null)}>
              <RadioGroupItem
                value="false"
                id={`${currentExerciseIndex}-false`}
                className="w-5 h-5"
              />
              <label
                htmlFor={`${currentExerciseIndex}-false`}
                className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    F
                  </div>
                  <span className="text-gray-800 font-medium text-lg">
                    False
                  </span>
                </div>
              </label>
              {userAnswer === false && (
                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <XCircle className="h-4 w-4" />
                </div>
              )}
            </div>
          </RadioGroup>
        );

      case "translation":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400">
              <p className="text-gray-800 text-lg leading-relaxed">
                {(exercise as any).sentence}
              </p>
              {(exercise as any).translation && (
                <p className="text-sm text-gray-600 italic mt-2">
                  {(exercise as any).translation}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Your Translation
              </label>
              <Textarea
                placeholder="Write your translation here..."
                value={userAnswer || ""}
                onChange={(e) =>
                  onAnswerChange(
                    exercise.id || currentExerciseIndex.toString(),
                    e.target.value
                  )
                }
                className="min-h-[120px] text-lg p-4 border-2 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            {(exercise as any).hints && (exercise as any).hints.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-700">
                    Hints
                  </span>
                </div>
                <ul className="space-y-2">
                  {(exercise as any).hints.map(
                    (hint: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-yellow-700">
                        <span className="text-yellow-600 mt-1">•</span>
                        <span className="text-sm">{hint}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-400">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">
                Unsupported Exercise Type
              </span>
            </div>
            <p className="text-yellow-700">
              Exercise type "{(exercise as any).type}" is not yet supported.
            </p>
          </div>
        );
    }
  };

  const correctAnswers =
    isEmpty((exercise as any).correctAnswers) &&
    !isEmpty((exercise as any).correctAnswer)
      ? [(exercise as any).correctAnswer]
      : (exercise as any).correctAnswers;

  const userAnswersArray = (
    Array.isArray(userAnswer) ? userAnswer : [userAnswer]
  )
    ?.filter((val) => val !== undefined && val !== null)
    .map((val) => val.toString().toLowerCase().trim());

  const isCorrect = useMemo(() => {
    if (exercise.type === "multiple-choice") {
      return (
        correctAnswers.length === userAnswersArray.length &&
        correctAnswers.every((answer: string) =>
          userAnswersArray.includes(answer.toLowerCase().trim())
        )
      );
    }

    return correctAnswers.some((answer: string) =>
      userAnswersArray.includes(answer.toLowerCase().trim())
    );
  }, [correctAnswers, userAnswersArray, exercise.type]);

  return (
    <Card
      className={twMerge(
        "shadow-lg hover:shadow-xl transition-all duration-300",
        isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"
      )}>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
              {currentExerciseIndex + 1}
            </div>
            <div>
              <span className="text-xl font-bold text-gray-800">
                Exercise {currentExerciseIndex + 1} of {exercises.length}
              </span>
              <p className="text-sm text-gray-600">
                {(exercise as any).type?.replace("-", " ") || "Exercise"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={twMerge(
                "text-sm px-3 py-1 !text-foreground",
                getLevelColor(exercise.difficulty)
              )}>
              {getLevelIcon(exercise.difficulty)} {exercise.difficulty}
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {exercise.points} pts
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Question */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400">
            <Tooltip
              content={
                (exercise as any)?.translation || "Nothing for translation"
              }>
              <h4 className="text-xl font-semibold text-gray-800 leading-relaxed">
                {exercise.question}
              </h4>
            </Tooltip>
          </div>

          {/* Exercise Content */}
          <div className="transition-all duration-300">
            {renderExerciseContent()}
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border-l-4 border-gray-400">
              <div
                className={twMerge(
                  "flex items-center gap-3 mb-4",
                  isCorrect ? "text-green-600" : "text-red-600"
                )}>
                {isCorrect ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <XCircle className="h-6 w-6" />
                )}
                <span className="text-xl font-bold">
                  {isCorrect ? "Correct!" : "Incorrect"}
                </span>
              </div>

              <div className="space-y-4">
                {exercise.type === "translation" ? (
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Correct Answers
                    </h5>
                    <div className="space-y-2">
                      {correctAnswers.map((answer: string, index: number) => (
                        <div
                          key={index}
                          className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                          <p className="text-green-800 font-medium">{answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : exercise.type === "multiple-choice" ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h5 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Correct Answers
                      </h5>
                      <div className="space-y-2">
                        {correctAnswers.map((answer: string, index: number) => (
                          <div
                            key={index}
                            className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                            <p className="text-green-800 font-medium">
                              {answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Your Answers
                      </h5>
                      <div className="space-y-2">
                        {userAnswersArray.length > 0 ? (
                          userAnswersArray.map(
                            (answer: string, index: number) => (
                              <div
                                key={index}
                                className={twMerge(
                                  "p-3 rounded-lg border-l-4",
                                  isCorrect
                                    ? "bg-green-50 border-green-400 text-green-800"
                                    : "bg-red-50 border-red-400 text-red-800"
                                )}>
                                <p className="font-medium">{answer}</p>
                              </div>
                            )
                          )
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                            <p className="text-gray-600 font-medium">
                              No answers selected
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Correct Answer
                    </h5>
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <p className="text-green-800 font-medium">
                        {correctAnswers.join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {(exercise as any).explanation && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">
                      Explanation
                    </span>
                  </div>
                  <p className="text-blue-700 leading-relaxed">
                    {(exercise as any).explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handlePreviousExercise}
              disabled={currentExerciseIndex === 0}
              className="flex items-center gap-2 px-6 py-3 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-3">
              {!showResults ? (
                <Button
                  onClick={onSubmitExercise}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 hover:scale-105">
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextExercise}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:scale-105">
                  {currentExerciseIndex < exercises.length - 1 ? (
                    <>
                      Next Exercise
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Finish
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
