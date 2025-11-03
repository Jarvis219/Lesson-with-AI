"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BaseExercise } from "@/types/lesson-content";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { getLevelColor, getLevelIcon } from "utils/lesson.util";
import { ExerciseRenderer } from "./ExerciseRenderer";

interface ExerciseWrapperProps {
  exercises: BaseExercise[];
  sectionTitle: string;
  sectionIcon?: React.ReactNode;
  sectionColor?: string;
  showExerciseNumbers?: boolean;
  allowInteractiveMode?: boolean;
  // Integration with main lesson flow
  onExerciseAnswersChange?: (answers: Record<string, any>) => void;
  onSubmitSection?: (
    answers: Record<string, any>,
    exercises: BaseExercise[]
  ) => void;
  isSubmitting?: boolean;
}

export function ExerciseWrapper({
  exercises,
  sectionTitle,
  sectionIcon,
  sectionColor = "blue",
  showExerciseNumbers = true,
  allowInteractiveMode = false,
  onExerciseAnswersChange,
  onSubmitSection,
  isSubmitting = false,
}: ExerciseWrapperProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!exercises || exercises.length === 0) {
    return null;
  }

  const handleAnswerChange = (exerciseId: string, answer: any) => {
    const newAnswers = {
      ...userAnswers,
      [exerciseId]: answer,
    };
    setUserAnswers(newAnswers);

    // Notify parent component of answer changes
    if (onExerciseAnswersChange) {
      onExerciseAnswersChange(newAnswers);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleNextExercise = () => {
    setShowResults(false);
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // All exercises in this section completed
      if (onSubmitSection) {
        onSubmitSection(userAnswers, exercises);
      }
    }
  };

  const handleSubmitExercise = () => {
    setShowResults(true);
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "from-blue-50 to-indigo-50",
      purple: "from-purple-50 to-pink-50",
      green: "from-green-50 to-emerald-50",
      yellow: "from-yellow-50 to-orange-50",
      red: "from-red-50 to-pink-50",
      indigo: "from-indigo-50 to-blue-50",
    };
    return colorMap[color] || colorMap.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
      yellow: "bg-yellow-100 text-yellow-600",
      red: "bg-red-100 text-red-600",
      indigo: "bg-indigo-100 text-indigo-600",
    };
    return colorMap[color] || colorMap.blue;
  };

  const getTextColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "from-blue-600 to-indigo-600",
      purple: "from-purple-600 to-pink-600",
      green: "from-green-600 to-emerald-600",
      yellow: "from-yellow-600 to-orange-600",
      red: "from-red-600 to-pink-600",
      indigo: "from-indigo-600 to-blue-600",
    };
    return colorMap[color] || colorMap.blue;
  };

  console.log(exercises);
  //

  // If interactive mode is disabled, show exercises in a simple list format
  if (!allowInteractiveMode) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader
          className={twMerge(
            "bg-gradient-to-r",
            getColorClasses(sectionColor)
          )}>
          <CardTitle className="flex items-center gap-3 text-2xl">
            {sectionIcon && (
              <div
                className={twMerge(
                  "p-2 rounded-lg",
                  getIconColorClasses(sectionColor)
                )}>
                {sectionIcon}
              </div>
            )}
            <span
              className={twMerge(
                "bg-gradient-to-r bg-clip-text text-transparent",
                getTextColorClasses(sectionColor)
              )}>
              {sectionTitle}
            </span>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {exercises.length}{" "}
              {exercises.length === 1 ? "exercise" : "exercises"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id || index}
                className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {showExerciseNumbers && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      )}
                      <h5 className="text-lg font-semibold text-gray-800">
                        {showExerciseNumbers
                          ? `Exercise ${index + 1}`
                          : "Exercise"}
                      </h5>
                    </div>
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
                    <p className="text-gray-800 font-medium text-lg">
                      {exercise.question}
                    </p>
                    {exercise.translation && (
                      <p className="text-sm text-gray-600 italic mt-2">
                        {exercise.translation}
                      </p>
                    )}
                  </div>

                  {exercise.explanation && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-yellow-700">
                          Explanation:
                        </span>
                      </div>
                      <p className="text-yellow-700 mt-1">
                        {exercise.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Interactive mode with ExerciseRenderer
  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader
        className={twMerge("bg-gradient-to-r", getColorClasses(sectionColor))}>
        <CardTitle className="flex items-center gap-3 text-2xl">
          {sectionIcon && (
            <div
              className={twMerge(
                "p-2 rounded-lg",
                getIconColorClasses(sectionColor)
              )}>
              {sectionIcon}
            </div>
          )}
          <span
            className={twMerge(
              "bg-gradient-to-r bg-clip-text text-transparent",
              getTextColorClasses(sectionColor)
            )}>
            {sectionTitle}
          </span>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {exercises.length}{" "}
            {exercises.length === 1 ? "exercise" : "exercises"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ExerciseRenderer
          isLoading={isLoading || isSubmitting}
          exercises={exercises}
          currentExerciseIndex={currentExerciseIndex}
          userAnswers={userAnswers}
          showResults={showResults}
          onAnswerChange={handleAnswerChange}
          onPreviousExercise={handlePreviousExercise}
          onNextExercise={handleNextExercise}
          onSubmitExercise={handleSubmitExercise}
        />
      </CardContent>
    </Card>
  );
}
