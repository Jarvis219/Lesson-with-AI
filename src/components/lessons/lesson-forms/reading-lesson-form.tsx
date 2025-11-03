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
import { useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { addExerciseToLesson } from "utils/lesson.util";
import { ReadingComprehensionExercise } from "./reading-comprehension-exercise";

export function ReadingLessonForm() {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useFormContext();

  const {
    fields: predictionFields,
    append: appendPrediction,
    remove: removePrediction,
  } = useFieldArray({
    control,
    name: "content.preReading.predictions",
  });

  const {
    fields: exerciseFields,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({
    control,
    name: "content.exercises",
  });

  const {
    fields: discussionFields,
    append: appendDiscussion,
    remove: removeDiscussion,
  } = useFieldArray({
    control,
    name: "content.postReading.discussionQuestions",
  });

  const contentErrors = errors.content as
    | {
        passage?: {
          title?: { message?: string };
          text?: { message?: string };
          readingTime?: { message?: string };
        };
        preReading?: {
          context?: { message?: string };
        };
      }
    | undefined;

  const exercisesError = (errors.content as any)?.exercises;

  // Auto-calculate word count
  const passageText = watch("content.passage.text");
  const wordCount = +(passageText ? passageText.trim().split(/\s+/).length : 0);

  useEffect(() => {
    setValue("content.passage.wordCount", wordCount);
    trigger("content.passage.wordCount");
  }, [wordCount]);

  const addExercise = (type: ExerciseType) => {
    addExerciseToLesson(type, (exercise) => {
      appendExercise(exercise);
    });
  };

  return (
    <div className="space-y-8">
      {/* Reading Passage */}
      <div className="space-y-4 border rounded-lg p-6 bg-orange-50">
        <h3 className="text-lg font-semibold text-orange-900">
          Reading Passage
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="content.passage.title"
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  placeholder="e.g., The History of Coffee"
                  className={fieldState.error ? "border-red-500" : ""}
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Genre <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="content.passage.genre"
            render={({ field, fieldState }) => (
              <>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={fieldState.error ? "border-red-500" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="essay">Essay</SelectItem>
                    <SelectItem value="biography">Biography</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="poem">Poem</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Text <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="content.passage.text"
            render={({ field, fieldState }) => (
              <>
                <textarea
                  {...field}
                  placeholder="Enter the reading passage..."
                  rows={10}
                  className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none ${
                    fieldState.error ? "border-red-500" : ""
                  }`}
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
                <p className="text-xs text-gray-600">Word count: {wordCount}</p>
              </>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Word Count <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="content.passage.wordCount"
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    type="number"
                    // min="1"
                    value={wordCount}
                    readOnly
                    className="bg-gray-100"
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Reading Time (minutes) <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="content.passage.readingTime"
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    type="number"
                    // min="1"
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    className={error ? "border-red-500" : ""}
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Source (optional)</label>
            <Controller
              control={control}
              name="content.passage.source"
              render={({ field }) => (
                <Input {...field} placeholder="e.g., National Geographic" />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Author (optional)</label>
            <Controller
              control={control}
              name="content.passage.author"
              render={({ field }) => (
                <Input {...field} placeholder="e.g., John Doe" />
              )}
            />
          </div>
        </div>
      </div>

      {/* Pre-Reading */}
      <div className="space-y-4 border rounded-lg p-6 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900">Pre-Reading</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Context <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="content.preReading.context"
            render={({ field, fieldState }) => (
              <>
                <textarea
                  {...field}
                  placeholder="Provide background information about the reading..."
                  rows={4}
                  className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none ${
                    fieldState.error ? "border-red-500" : ""
                  }`}
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex flex-col gap-2">
            Prediction Questions
          </label>
          {predictionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Controller
                control={control}
                name={`content.preReading.predictions.${index}`}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g., What do you think this text is about?"
                  />
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
            Add Prediction
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
                <ReadingComprehensionExercise
                  key={field.id}
                  index={index}
                  basePath={`content.exercises.${index}`}
                  onRemove={() => removeExercise(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 flex flex-col gap-2">
          <label className="text-sm font-medium">Discussion Questions</label>
          {discussionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Controller
                control={control}
                name={`content.postReading.discussionQuestions.${index}`}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g., What is the main idea?"
                  />
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeDiscussion(index)}
                className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendDiscussion("")}
            size="sm"
            variant="outline"
            className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add Discussion Question
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Summary Task (optional)</label>
          <Controller
            control={control}
            name="content.postReading.summaryTask"
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Ask students to summarize what they read..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
