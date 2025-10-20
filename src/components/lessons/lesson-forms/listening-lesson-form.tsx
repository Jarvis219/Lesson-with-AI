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
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const {
    fields: predictionFields,
    append: appendPrediction,
    remove: removePrediction,
  } = useFieldArray({
    control,
    name: "content.preListening.predictionQuestions",
  });

  const {
    fields: comprehensionFields,
    append: appendComprehension,
    remove: removeComprehension,
  } = useFieldArray({
    control,
    name: "content.postListening.comprehensionQuestions",
  });

  const {
    fields: discussionFields,
    append: appendDiscussion,
    remove: removeDiscussion,
  } = useFieldArray({
    control,
    name: "content.postListening.discussionQuestions",
  });

  const contentErrors = errors.content as
    | {
        audio?: {
          url?: { message?: string };
          duration?: { message?: string };
          transcript?: { message?: string };
        };
        preListening?: {
          context?: { message?: string };
        };
        postListening?: {
          comprehensionQuestions?: { message?: string };
        };
      }
    | undefined;

  const addExercise = (type: ExerciseType) => {
    addExerciseToLesson(type, (exercise) => {
      appendComprehension(exercise);
    });
  };

  return (
    <div className="space-y-8">
      {/* Audio Section */}
      <div className="space-y-4 border rounded-lg p-6 bg-purple-50">
        <h3 className="text-lg font-semibold text-purple-900">Audio Content</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Audio URL <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="https://..."
            {...register("content.audio.url")}
            className={contentErrors?.audio?.url ? "border-red-500" : ""}
          />
          {contentErrors?.audio?.url && (
            <p className="text-sm text-red-500">
              {contentErrors.audio.url.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Duration (seconds) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min="1"
              {...register("content.audio.duration", { valueAsNumber: true })}
              className={contentErrors?.audio?.duration ? "border-red-500" : ""}
            />
            {contentErrors?.audio?.duration && (
              <p className="text-sm text-red-500">
                {contentErrors.audio.duration.message}
              </p>
            )}
          </div>

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

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Transcript <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Enter the audio transcript..."
            {...register("content.audio.transcript")}
            rows={6}
            className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none ${
              contentErrors?.audio?.transcript ? "border-red-500" : ""
            }`}
          />
          {contentErrors?.audio?.transcript && (
            <p className="text-sm text-red-500">
              {contentErrors.audio.transcript.message}
            </p>
          )}
        </div>
      </div>

      {/* Pre-Listening */}
      <div className="space-y-4 border rounded-lg p-6 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900">Pre-Listening</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Context <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Provide background information about the listening..."
            {...register("content.preListening.context")}
            rows={4}
            className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none ${
              contentErrors?.preListening?.context ? "border-red-500" : ""
            }`}
          />
          {contentErrors?.preListening?.context && (
            <p className="text-sm text-red-500">
              {contentErrors.preListening.context.message}
            </p>
          )}
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">Prediction Questions</label>
          {predictionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(
                  `content.preListening.predictionQuestions.${index}`
                )}
                placeholder="e.g., What do you think the topic is about?"
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

      {/* Post-Listening */}
      <div className="space-y-4 border rounded-lg p-6 bg-green-50">
        <h3 className="text-lg font-semibold text-green-900">Post-Listening</h3>

        {/* Comprehension Questions */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-md font-semibold">
              Comprehension Questions
              {contentErrors?.postListening?.comprehensionQuestions
                ?.message && (
                <span className="text-sm ml-2 text-red-500 font-normal">
                  * {contentErrors.postListening.comprehensionQuestions.message}
                </span>
              )}
            </h4>
            <div className="flex gap-2">
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

          {comprehensionFields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-gray-500 mb-4">
                No comprehension questions yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comprehensionFields.map((field, index) => (
                <ListeningComprehensionExercise
                  key={field.id}
                  index={index}
                  onRemove={() => removeComprehension(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 flex flex-col gap-2">
          <label className="text-sm font-medium">Discussion Questions</label>
          {discussionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(
                  `content.postListening.discussionQuestions.${index}`
                )}
                placeholder="e.g., What is the main idea?"
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
            <Plus className=" h-4 w-4 mr-2" />
            Add Discussion Question
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Summary Task (optional)</label>
          <textarea
            placeholder="Ask students to summarize what they heard..."
            {...register("content.postListening.summaryTask")}
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}
