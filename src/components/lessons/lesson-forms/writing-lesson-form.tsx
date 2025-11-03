"use client";

import {
  FillInBlankBuilder,
  MultipleChoiceBuilder,
  SingleChoiceBuilder,
  TranslationBuilder,
  TrueFalseBuilder,
} from "@/components/lessons/exercise-builders";
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

export function WritingLessonForm() {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const contentErrors = errors.content as
    | {
        instruction?: {
          requirements?: { message?: string } | Array<{ message?: string }>;
        };
        writingFramework?: {
          structure?: { message?: string } | Array<{ message?: string }>;
        };
        rubric?: {
          criteria?: { message?: string };
        };
      }
    | undefined;

  const {
    fields: structureFields,
    append: appendStructure,
    remove: removeStructure,
  } = useFieldArray({
    control,
    name: "content.writingFramework.structure",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "content.instruction.requirements",
  });

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control,
    name: "content.modelText.highlights",
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
    fields: rubricFields,
    append: appendRubric,
    remove: removeRubric,
  } = useFieldArray({
    control,
    name: "content.rubric.criteria",
  });

  const {
    fields: checklistFields,
    append: appendChecklist,
    remove: removeChecklist,
  } = useFieldArray({
    control,
    name: "content.checklist",
  });

  const addExercise = (type: ExerciseType) => {
    addExerciseToLesson(type, (exercise) => {
      appendExercise(exercise);
    });
  };

  const contentAny = errors.content as any;
  const exercisesError = contentAny?.exercises;

  return (
    <div className="space-y-8">
      {/* Writing Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Writing Type <span className="text-red-500">*</span>
        </label>
        <Controller
          control={control}
          name="content.writingType"
          render={({ field, fieldState }) => (
            <>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={fieldState.error ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="essay">Essay</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
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

      {/* Instruction Section */}
      <div className="space-y-4 border rounded-lg p-6 bg-green-50">
        <h3 className="text-lg font-semibold text-green-900">
          Writing Instructions
        </h3>

        {/* Prompt */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Prompt <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="content.instruction.prompt"
            render={({ field, fieldState }) => (
              <>
                <textarea
                  {...field}
                  placeholder="Enter the writing prompt..."
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

        {/* Requirements */}
        <div className="space-y-2 flex flex-col gap-2">
          <label className="text-sm font-medium flex flex-col gap-2">
            <p>
              Requirements <span className="text-red-500">*</span>
            </p>
            {!Array.isArray(contentErrors?.instruction?.requirements) &&
              contentErrors?.instruction?.requirements?.message && (
                <span className="text-sm ml-2 text-red-500 font-normal">
                  * {contentErrors.instruction.requirements.message}
                </span>
              )}
          </label>
          {requirementFields.map((field, index) => {
            const requirementError = Array.isArray(
              contentErrors?.instruction?.requirements
            )
              ? contentErrors.instruction.requirements[index]
              : undefined;

            return (
              <div key={field.id} className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <Controller
                    control={control}
                    name={`content.instruction.requirements.${index}`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g., 200-250 words"
                        className={requirementError ? "border-red-500" : ""}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                    className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {requirementError && (
                  <p className="text-sm text-red-500 ml-2">
                    {requirementError.message}
                  </p>
                )}
              </div>
            );
          })}
          <Button
            type="button"
            onClick={() => appendRequirement("")}
            size="sm"
            variant="outline"
            className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add Requirement
          </Button>
        </div>

        {/* Optional fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Audience (optional)</label>
            <Controller
              control={control}
              name="content.instruction.audience"
              render={({ field }) => (
                <Input {...field} placeholder="e.g., Teacher, Friend" />
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Purpose (optional)</label>
            <Controller
              control={control}
              name="content.instruction.purpose"
              render={({ field }) => (
                <Input {...field} placeholder="e.g., Inform, Persuade" />
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tone (optional)</label>
            <Controller
              control={control}
              name="content.instruction.tone"
              render={({ field }) => (
                <Input {...field} placeholder="e.g., Formal, Informal" />
              )}
            />
          </div>
        </div>
      </div>

      {/* Writing Framework */}
      <div className="space-y-4 border rounded-lg p-6 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900">
          Writing Framework
        </h3>

        {/* Structure */}
        <div className="space-y-2 flex flex-col gap-2">
          <label className="text-sm font-medium flex flex-col gap-2">
            <p>
              Structure <span className="text-red-500">*</span>
            </p>
            {!Array.isArray(contentErrors?.writingFramework?.structure) &&
              contentErrors?.writingFramework?.structure?.message && (
                <span className="text-sm ml-2 text-red-500 font-normal">
                  * {contentErrors.writingFramework.structure.message}
                </span>
              )}
          </label>
          {structureFields.map((field, index) => {
            const structureError = Array.isArray(
              contentErrors?.writingFramework?.structure
            )
              ? contentErrors.writingFramework.structure[index]
              : undefined;

            return (
              <div key={field.id} className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <Controller
                    control={control}
                    name={`content.writingFramework.structure.${index}`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g., Introduction"
                        className={structureError ? "border-red-500" : ""}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStructure(index)}
                    className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {structureError && (
                  <p className="text-sm text-red-500 ml-2">
                    {structureError.message}
                  </p>
                )}
              </div>
            );
          })}
          <Button
            type="button"
            onClick={() => appendStructure("")}
            size="sm"
            variant="outline"
            className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add Structure Item
          </Button>
        </div>

        {/* Grammar Points */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Grammar Points (optional, comma-separated)
          </label>
          <Controller
            control={control}
            name="content.writingFramework.grammarPoints"
            render={({ field }) => (
              <Input
                placeholder="e.g., Present Perfect, Linking Words"
                value={(field.value || []).join(", ")}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    value
                      ? value
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s)
                      : []
                  );
                }}
              />
            )}
          />
        </div>

        {/* Vocabulary Bank */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Vocabulary Bank (optional, comma-separated)
          </label>
          <Controller
            control={control}
            name="content.writingFramework.vocabularyBank"
            render={({ field }) => (
              <Input
                placeholder="e.g., Furthermore, Moreover, In addition"
                value={(field.value || []).join(", ")}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    value
                      ? value
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s)
                      : []
                  );
                }}
              />
            )}
          />
        </div>
      </div>

      {/* Model Text */}
      <div className="space-y-4 border rounded-lg p-6 bg-purple-50">
        <h3 className="text-lg font-semibold text-purple-900">Model Text</h3>
        <p className="text-sm text-gray-600">
          Provide a sample text for students to reference
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="content.modelText.title"
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  placeholder="e.g., Sample Essay"
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
            Text <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="content.modelText.text"
            render={({ field, fieldState }) => (
              <>
                <textarea
                  {...field}
                  placeholder="Enter the model text..."
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
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Analysis (optional)</label>
          <Controller
            control={control}
            name="content.modelText.analysis"
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Analyze the structure and key elements..."
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            )}
          />
        </div>

        <div className="space-y-2 flex flex-col gap-2">
          <label className="text-sm font-medium">Highlights (optional)</label>
          {highlightFields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded p-3 space-y-2 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Highlight #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeHighlight(index)}
                  className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Controller
                control={control}
                name={`content.modelText.highlights.${index}.text`}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      placeholder="Highlighted text"
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
              <Controller
                control={control}
                name={`content.modelText.highlights.${index}.explanation`}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      placeholder="Explanation"
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
          ))}
          <Button
            type="button"
            onClick={() => appendHighlight({ text: "", explanation: "" })}
            size="sm"
            variant="outline"
            className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add Highlight
          </Button>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4 border rounded-lg p-6 bg-yellow-50">
        <h3 className="text-lg font-semibold text-yellow-900">
          Practice Exercises <span className="text-red-500">*</span>
        </h3>
        {exercisesError?.message && (
          <span className="text-sm ml-2 text-red-500 font-normal">
            * {exercisesError.message}
          </span>
        )}

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

        {exerciseFields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 mb-4">
              No exercises yet - At least one exercise is required
            </p>
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
                  {exerciseType === "single-choice" && (
                    <SingleChoiceBuilder
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
                  {exerciseType === "true-false" && (
                    <TrueFalseBuilder
                      index={index}
                      onRemove={() => removeExercise(index)}
                    />
                  )}
                  {exerciseType === "translation" && (
                    <TranslationBuilder
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

      {/* Rubric */}
      <div className="space-y-4 border rounded-lg p-6 bg-pink-50">
        <h3 className="text-lg font-semibold text-pink-900">
          Grading Rubric <span className="text-red-500">*</span>
        </h3>

        <div className="space-y-2 flex flex-col gap-2">
          <label className="text-sm font-medium">
            Criteria <span className="text-red-500">*</span>
          </label>
          {contentErrors?.rubric?.criteria?.message && (
            <span className="text-sm ml-2 text-red-500 font-normal">
              * {contentErrors.rubric.criteria.message}
            </span>
          )}
          {rubricFields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded p-3 space-y-2 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Criterion #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRubric(index)}
                  className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Controller
                control={control}
                name={`content.rubric.criteria.${index}.name`}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      placeholder="Criterion name"
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
              <Controller
                control={control}
                name={`content.rubric.criteria.${index}.description`}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      placeholder="Description"
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
              <Controller
                control={control}
                name={`content.rubric.criteria.${index}.maxPoints`}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      placeholder="Max points"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
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
          ))}
          <Button
            type="button"
            onClick={() =>
              appendRubric({ name: "", description: "", maxPoints: 0 })
            }
            size="sm"
            variant="outline"
            className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add Criterion
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Total Points <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="content.rubric.totalPoints"
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type="number"
                  min="1"
                  placeholder="Total points"
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
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
      </div>

      {/* Checklist */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Self-Check Checklist</h3>
        <div className="space-y-2 flex flex-col gap-2">
          {checklistFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Controller
                control={control}
                name={`content.checklist.${index}`}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g., Did I check my spelling?"
                  />
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeChecklist(index)}
                className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendChecklist("")}
            size="sm"
            variant="outline"
            className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add Checklist Item
          </Button>
        </div>
      </div>
    </div>
  );
}
