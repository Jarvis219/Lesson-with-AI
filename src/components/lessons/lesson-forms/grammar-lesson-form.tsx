"use client";

import {
  FillInBlankBuilder,
  MultipleChoiceBuilder,
} from "@/components/lessons/exercise-builders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Exercise, GrammarExample } from "@/types/lesson-content";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

export function GrammarLessonForm() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const {
    fields: exampleFields,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({
    control,
    name: "content.grammarRule.examples",
  });

  const {
    fields: exerciseFields,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({
    control,
    name: "content.exercises",
  });

  type ContentErrorsType = {
    grammarRule?: {
      title?: { message?: string };
      structure?: { message?: string };
      explanation?: { message?: string };
      usage?: { message?: string };
      examples?:
        | { message?: string }
        | Array<{
            sentence?: { message?: string };
            translation?: { message?: string };
          }>;
    };
    exercises?: { message?: string };
  };

  const contentErrors = errors.content as ContentErrorsType | undefined;
  const examplesError = contentErrors?.grammarRule?.examples;
  const examplesMessage =
    examplesError && !Array.isArray(examplesError)
      ? examplesError.message
      : undefined;
  const examplesArray =
    examplesError && Array.isArray(examplesError) ? examplesError : undefined;

  const addExample = () => {
    const newExample: GrammarExample = {
      sentence: "",
      translation: "",
      highlight: "",
      explanation: "",
    };
    appendExample(newExample);
  };

  const addExercise = (type: "multiple-choice" | "fill-in-the-blank") => {
    const baseExercise: Partial<Exercise> = {
      type,
      question: "",
      points: 1,
      difficulty: "beginner",
    };

    const newExercise =
      type === "multiple-choice"
        ? {
            ...baseExercise,
            type: "multiple-choice" as const,
            options: [
              { value: "", translate: "" },
              { value: "", translate: "" },
            ],
            correctAnswer: "",
          }
        : {
            ...baseExercise,
            type: "fill-in-the-blank" as const,
            sentence: "",
            correctAnswers: [""],
          };

    appendExercise(newExercise as Exercise);
  };

  return (
    <div className="space-y-8">
      {/* Grammar Rule Section */}
      <div className="space-y-4 border rounded-lg p-6 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900">Grammar Rule</h3>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Rule Title *</label>
          <Input
            placeholder="e.g., Present Simple Tense"
            {...register("content.grammarRule.title")}
            className={
              contentErrors?.grammarRule?.title ? "border-red-500" : ""
            }
          />
          {contentErrors?.grammarRule?.title && (
            <p className="text-sm text-red-500">
              {contentErrors.grammarRule.title.message}
            </p>
          )}
        </div>

        {/* Structure/Formula */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Structure/Formula *</label>
          <Input
            placeholder="e.g., S + V(s/es) + O"
            {...register("content.grammarRule.structure")}
            className={
              contentErrors?.grammarRule?.structure ? "border-red-500" : ""
            }
          />
          {contentErrors?.grammarRule?.structure && (
            <p className="text-sm text-red-500">
              {contentErrors.grammarRule.structure.message}
            </p>
          )}
          <p className="text-xs text-gray-600">
            The grammatical formula or pattern
          </p>
        </div>

        {/* Explanation */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Explanation *</label>
          <textarea
            placeholder="Explain when and how to use this grammar rule..."
            {...register("content.grammarRule.explanation")}
            rows={4}
            className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none ${
              contentErrors?.grammarRule?.explanation ? "border-red-500" : ""
            }`}
          />
          {contentErrors?.grammarRule?.explanation && (
            <p className="text-sm text-red-500">
              {contentErrors.grammarRule.explanation.message}
            </p>
          )}
        </div>

        {/* Usage Cases */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Usage Cases *</label>
          <Controller
            control={control}
            name="content.grammarRule.usage"
            render={({ field }) => (
              <textarea
                placeholder="List usage cases (one per line)&#10;- For habitual actions&#10;- For general truths&#10;- For scheduled events"
                value={(field.value || []).join("\n")}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    value ? value.split("\n").filter((u) => u.trim()) : []
                  );
                }}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            )}
          />
          {contentErrors?.grammarRule?.usage && (
            <p className="text-sm text-red-500">
              {contentErrors.grammarRule.usage.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Special Notes</label>
          <Controller
            control={control}
            name="content.grammarRule.notes"
            render={({ field }) => (
              <textarea
                placeholder="Any special notes or tips (one per line)"
                value={(field.value || []).join("\n")}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    value ? value.split("\n").filter((n) => n.trim()) : []
                  );
                }}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            )}
          />
        </div>

        {/* Common Mistakes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Common Mistakes</label>
          <Controller
            control={control}
            name="content.grammarRule.commonMistakes"
            render={({ field }) => (
              <textarea
                placeholder="List common mistakes to avoid (one per line)"
                value={(field.value || []).join("\n")}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    value ? value.split("\n").filter((m) => m.trim()) : []
                  );
                }}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            )}
          />
        </div>

        {/* Related Topics */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Related Topics (comma-separated)
          </label>
          <Controller
            control={control}
            name="content.grammarRule.relatedTopics"
            render={({ field }) => (
              <Input
                placeholder="e.g., Present Continuous, Simple Past"
                value={(field.value || []).join(", ")}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    value
                      ? value
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t)
                      : []
                  );
                }}
              />
            )}
          />
        </div>
      </div>

      {/* Examples Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Example Sentences ({exampleFields.length})
            {examplesMessage && (
              <span className="text-sm text-red-500 ml-2 font-normal">
                * {examplesMessage}
              </span>
            )}
          </h3>
          <Button type="button" onClick={addExample} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Example
          </Button>
        </div>

        {exampleFields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 mb-4">No examples yet</p>
            <Button type="button" onClick={addExample} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Example
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {exampleFields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">
                    Example #{index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExample(index)}
                    className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sentence *</label>
                  <Input
                    placeholder="She goes to school every day."
                    {...register(
                      `content.grammarRule.examples.${index}.sentence`
                    )}
                    className={
                      examplesArray?.[index]?.sentence ? "border-red-500" : ""
                    }
                  />
                  {examplesArray?.[index]?.sentence && (
                    <p className="text-sm text-red-500">
                      {examplesArray[index]?.sentence?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Translation *</label>
                  <Input
                    placeholder="Cô ấy đi học mỗi ngày."
                    {...register(
                      `content.grammarRule.examples.${index}.translation`
                    )}
                    className={
                      examplesArray?.[index]?.translation
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {examplesArray?.[index]?.translation && (
                    <p className="text-sm text-red-500">
                      {examplesArray[index]?.translation?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Highlight (part to emphasize)
                  </label>
                  <Input
                    placeholder="goes"
                    {...register(
                      `content.grammarRule.examples.${index}.highlight`
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Explanation</label>
                  <Input
                    placeholder="Explain why this example demonstrates the rule"
                    {...register(
                      `content.grammarRule.examples.${index}.explanation`
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercises Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Practice Exercises ({exerciseFields.length})
            {contentErrors?.exercises?.message && (
              <span className="text-sm text-red-500 ml-2 font-normal">
                * {contentErrors.exercises.message}
              </span>
            )}
          </h3>
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
              onClick={() => addExercise("fill-in-the-blank")}
              size="sm"
              variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Fill in Blank
            </Button>
          </div>
        </div>

        {exerciseFields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 mb-4">No exercises yet</p>
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                onClick={() => addExercise("multiple-choice")}
                variant="outline">
                Add Multiple Choice
              </Button>
              <Button
                type="button"
                onClick={() => addExercise("fill-in-the-blank")}
                variant="outline">
                Add Fill in Blank
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {exerciseFields.map((field, index) => {
              const exerciseType = watch(`content.exercises.${index}.type`);
              return (
                <div key={field.id}>
                  {exerciseType === "multiple-choice" && (
                    <MultipleChoiceBuilder
                      index={index}
                      onRemove={() => removeExercise(index)}
                    />
                  )}
                  {exerciseType === "fill-in-the-blank" && (
                    <FillInBlankBuilder
                      index={index}
                      onRemove={() => removeExercise(index)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
