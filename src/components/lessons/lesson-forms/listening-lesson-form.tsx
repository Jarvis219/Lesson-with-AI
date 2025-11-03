"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExerciseType } from "@/types/lesson-content";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { addExerciseToLesson } from "utils/lesson.util";
import { ListeningComprehensionExercise } from "./listening-comprehension-exercise";

export function ListeningLessonForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const exercisesError = (errors.content as any)?.exercises;

  const {
    fields: predictionFields,
    append: appendPrediction,
    remove: removePrediction,
  } = useFieldArray({
    control,
    name: "content.preListening.predictionQuestions",
  });

  const {
    fields: exerciseFields,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({
    control,
    name: "content.exercises",
  });

  const addExercise = (type: ExerciseType) => {
    addExerciseToLesson(type, (exercise) => {
      appendExercise(exercise);
    });
  };

  return (
    <div className="space-y-8">
      {/* Audio Section */}
      <div className="space-y-4 border rounded-lg p-6 bg-purple-50">
        <h3 className="text-lg font-semibold text-purple-900">Audio Content</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Speed <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="content.audio.speed"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Accent (optional)</label>
            <Controller
              control={control}
              name="content.audio.accent"
              render={({ field }) => (
                <Select
                  value={field.value || "american"}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="american">American</SelectItem>
                    <SelectItem value="british">British</SelectItem>
                    <SelectItem value="australian">Australian</SelectItem>
                    <SelectItem value="canadian">Canadian</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Audio Text <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="content.audio.text"
            render={({ field, fieldState: { error } }) => (
              <>
                <textarea
                  placeholder="Enter the audio text..."
                  {...field}
                  rows={6}
                  className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none ${
                    error?.message ? "border-red-500" : ""
                  }`}
                />
                {error?.message && (
                  <p className="text-sm text-red-500">{error.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>

      {/* Pre-Listening */}
      <div className="space-y-4 border rounded-lg p-6 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900">Pre-Listening</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Context (optional)</label>
          <Controller
            control={control}
            name="content.preListening.context"
            render={({ field, fieldState: { error } }) => (
              <>
                <textarea
                  placeholder="Provide background information about the listening..."
                  {...field}
                  rows={4}
                  className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none ${
                    error?.message ? "border-red-500" : ""
                  }`}
                />
                {error?.message && (
                  <p className="text-sm text-red-500">{error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">Prediction Questions</label>
          {predictionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Controller
                control={control}
                name={`content.preListening.predictionQuestions.${index}`}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      {...field}
                      placeholder="e.g., What do you think the topic is about?"
                      className={error?.message ? "border-red-500" : ""}
                    />
                    {error?.message && (
                      <p className="text-sm text-red-500">{error.message}</p>
                    )}
                  </>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePrediction(index)}
                className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendPrediction("")}
            size="sm"
            variant="outline"
            className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add Prediction Question
          </Button>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4 border rounded-lg p-6 bg-green-50">
        <h3 className="text-lg font-semibold text-green-900">
          Exercises <span className="text-red-500">*</span>
          {exercisesError?.message && (
            <span className="text-sm ml-2 text-red-500 font-normal">
              * {exercisesError.message}
            </span>
          )}
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-md font-semibold">Add Exercises</h4>
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                onClick={() => addExercise("multiple-choice")}
                size="sm"
                variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Multiple Choice
              </Button>
              <Button
                type="button"
                onClick={() => addExercise("single-choice")}
                size="sm"
                variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Single Choice
              </Button>
              <Button
                type="button"
                onClick={() => addExercise("fill-in-the-blank")}
                size="sm"
                variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Fill in Blank
              </Button>
              <Button
                type="button"
                onClick={() => addExercise("true-false")}
                size="sm"
                variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                True False
              </Button>
              <Button
                type="button"
                onClick={() => addExercise("translation")}
                size="sm"
                variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Translation
              </Button>
            </div>
          </div>

          {exerciseFields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-gray-500 mb-4">
                No exercises yet - At least one exercise is required
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {exerciseFields.map((field, index) => (
                <ListeningComprehensionExercise
                  key={field.id}
                  index={index}
                  onRemove={() => removeExercise(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
