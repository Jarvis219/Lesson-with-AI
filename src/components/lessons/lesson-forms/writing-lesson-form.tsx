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

export function WritingLessonForm() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

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
    fields: checklistFields,
    append: appendChecklist,
    remove: removeChecklist,
  } = useFieldArray({
    control,
    name: "content.checklist",
  });

  const contentErrors = errors.content as
    | {
        writingType?: { message?: string };
        instruction?: {
          prompt?: { message?: string };
          requirements?: { message?: string };
        };
        writingFramework?: {
          structure?: { message?: string };
        };
      }
    | undefined;

  return (
    <div className="space-y-8">
      {/* Writing Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Writing Type *</label>
        <Controller
          control={control}
          name="content.writingType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
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
          )}
        />
        {contentErrors?.writingType && (
          <p className="text-sm text-red-500">
            {contentErrors.writingType.message}
          </p>
        )}
      </div>

      {/* Instruction Section */}
      <div className="space-y-4 border rounded-lg p-6 bg-green-50">
        <h3 className="text-lg font-semibold text-green-900">
          Writing Instructions
        </h3>

        {/* Prompt */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt *</label>
          <textarea
            placeholder="Enter the writing prompt..."
            {...register("content.instruction.prompt")}
            rows={4}
            className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none ${
              contentErrors?.instruction?.prompt ? "border-red-500" : ""
            }`}
          />
          {contentErrors?.instruction?.prompt && (
            <p className="text-sm text-red-500">
              {contentErrors.instruction.prompt.message}
            </p>
          )}
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Requirements *</label>
          {requirementFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`content.instruction.requirements.${index}`)}
                placeholder="e.g., 200-250 words"
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
          ))}
          <Button
            type="button"
            onClick={() => appendRequirement("")}
            size="sm"
            variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Requirement
          </Button>
          {contentErrors?.instruction?.requirements && (
            <p className="text-sm text-red-500">
              {contentErrors.instruction.requirements.message}
            </p>
          )}
        </div>

        {/* Optional fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Audience (optional)</label>
            <Input
              placeholder="e.g., Teacher, Friend"
              {...register("content.instruction.audience")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Purpose (optional)</label>
            <Input
              placeholder="e.g., Inform, Persuade"
              {...register("content.instruction.purpose")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tone (optional)</label>
            <Input
              placeholder="e.g., Formal, Informal"
              {...register("content.instruction.tone")}
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Structure *</label>
          {structureFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`content.writingFramework.structure.${index}`)}
                placeholder="e.g., Introduction"
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
          ))}
          <Button
            type="button"
            onClick={() => appendStructure("")}
            size="sm"
            variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Structure Item
          </Button>
          {contentErrors?.writingFramework?.structure && (
            <p className="text-sm text-red-500">
              {contentErrors.writingFramework.structure.message}
            </p>
          )}
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

      {/* Checklist */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Self-Check Checklist</h3>
        {checklistFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              {...register(`content.checklist.${index}`)}
              placeholder="e.g., Did I check my spelling?"
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
          variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Checklist Item
        </Button>
      </div>
    </div>
  );
}
