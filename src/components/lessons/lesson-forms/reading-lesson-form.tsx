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
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

export function ReadingLessonForm() {
  const {
    control,
    register,
    formState: { errors },
    watch,
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

  // Auto-calculate word count
  const passageText = watch("content.passage.text");
  const wordCount = passageText ? passageText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8">
      {/* Reading Passage */}
      <div className="space-y-4 border rounded-lg p-6 bg-orange-50">
        <h3 className="text-lg font-semibold text-orange-900">
          Reading Passage
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Title *</label>
          <Input
            placeholder="e.g., The History of Coffee"
            {...register("content.passage.title")}
            className={contentErrors?.passage?.title ? "border-red-500" : ""}
          />
          {contentErrors?.passage?.title && (
            <p className="text-sm text-red-500">
              {contentErrors.passage.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Genre *</label>
          <Controller
            control={control}
            name="content.passage.genre"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
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
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Text *</label>
          <textarea
            placeholder="Enter the reading passage..."
            {...register("content.passage.text")}
            rows={10}
            className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none ${
              contentErrors?.passage?.text ? "border-red-500" : ""
            }`}
          />
          {contentErrors?.passage?.text && (
            <p className="text-sm text-red-500">
              {contentErrors.passage.text.message}
            </p>
          )}
          <p className="text-xs text-gray-600">Word count: {wordCount}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Word Count *</label>
            <Input
              type="number"
              min="1"
              {...register("content.passage.wordCount", {
                valueAsNumber: true,
              })}
              value={wordCount}
              readOnly
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Reading Time (minutes) *
            </label>
            <Input
              type="number"
              min="1"
              {...register("content.passage.readingTime", {
                valueAsNumber: true,
              })}
              className={
                contentErrors?.passage?.readingTime ? "border-red-500" : ""
              }
            />
            {contentErrors?.passage?.readingTime && (
              <p className="text-sm text-red-500">
                {contentErrors.passage.readingTime.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Source (optional)</label>
            <Input
              placeholder="e.g., National Geographic"
              {...register("content.passage.source")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Author (optional)</label>
            <Input
              placeholder="e.g., John Doe"
              {...register("content.passage.author")}
            />
          </div>
        </div>
      </div>

      {/* Pre-Reading */}
      <div className="space-y-4 border rounded-lg p-6 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900">Pre-Reading</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Context *</label>
          <textarea
            placeholder="Provide background information about the reading..."
            {...register("content.preReading.context")}
            rows={4}
            className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none ${
              contentErrors?.preReading?.context ? "border-red-500" : ""
            }`}
          />
          {contentErrors?.preReading?.context && (
            <p className="text-sm text-red-500">
              {contentErrors.preReading.context.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Prediction Questions</label>
          {predictionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`content.preReading.predictions.${index}`)}
                placeholder="e.g., What do you think this text is about?"
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
            variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Prediction
          </Button>
        </div>
      </div>

      {/* Post-Reading */}
      <div className="space-y-4 border rounded-lg p-6 bg-green-50">
        <h3 className="text-lg font-semibold text-green-900">Post-Reading</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Discussion Questions</label>
          {discussionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(
                  `content.postReading.discussionQuestions.${index}`
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
            variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Discussion Question
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Summary Task (optional)</label>
          <textarea
            placeholder="Ask students to summarize what they read..."
            {...register("content.postReading.summaryTask")}
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </div>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Comprehension questions should be added
          separately using the exercise builder.
        </p>
      </div>
    </div>
  );
}
