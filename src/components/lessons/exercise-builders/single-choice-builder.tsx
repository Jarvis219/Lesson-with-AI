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
import { Controller, useFormContext } from "react-hook-form";

interface SingleChoiceBuilderProps {
  index: number;
  onRemove: () => void;
}

export function SingleChoiceBuilder({
  index,
  onRemove,
}: SingleChoiceBuilderProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const basePath = `content.exercises.${index}` as const;
  const options = watch(`${basePath}.options`) || [];

  // Get nested errors safely
  const contentErrors = errors?.content as any;
  const exerciseError = contentErrors?.exercises?.[index];

  const addOption = () => {
    setValue(`${basePath}.options`, [...options, { value: "", translate: "" }]);
  };

  const removeOption = (optionIndex: number) => {
    setValue(
      `${basePath}.options`,
      options.filter((_: any, i: number) => i !== optionIndex)
    );
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm">Single Choice Question</h4>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            Only one correct answer
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Question */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Question <span className="text-red-500">*</span>
        </label>
        <Controller
          control={control}
          name={`${basePath}.question`}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                placeholder="Enter your question"
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

      {/* Translation */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Translation (Vietnamese)</label>
        <Controller
          control={control}
          name={`${basePath}.translation`}
          render={({ field, fieldState }) => (
            <>
              <Input {...field} placeholder="Dịch câu hỏi sang tiếng Việt" />
              {fieldState.error && (
                <p className="text-sm text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Answer Options <span className="text-red-500">*</span>
        </label>
        {options.map((option: any, optionIndex: number) => (
          <div key={optionIndex} className="space-y-2">
            <div className="flex gap-2 items-center">
              <Controller
                control={control}
                name={`${basePath}.options.${optionIndex}.value`}
                render={({ field, fieldState }) => (
                  <div className="flex-1">
                    <Input
                      {...field}
                      placeholder={`Option ${optionIndex + 1}`}
                      className={fieldState.error ? "border-red-500" : ""}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(optionIndex)}
                  className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
          className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
        {exerciseError?.options?.message && (
          <p className="text-sm text-red-500">
            {exerciseError.options.message}
          </p>
        )}
      </div>

      {/* Correct Answer */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Correct Answer <span className="text-red-500">*</span>
        </label>
        <Controller
          control={control}
          name={`${basePath}.correctAnswer`}
          render={({ field, fieldState }) => (
            <>
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger
                  className={fieldState.error ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  {options
                    .filter((opt: any) => opt?.value?.trim())
                    .map((option: any, idx: number) => (
                      <SelectItem key={idx} value={option.value}>
                        {option.value}
                      </SelectItem>
                    ))}
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

      {/* Points & Difficulty */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Points</label>
          <Controller
            control={control}
            name={`${basePath}.points`}
            render={({ field, fieldState }) => (
              <>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
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
          <label className="text-sm font-medium">Difficulty</label>
          <Controller
            control={control}
            name={`${basePath}.difficulty`}
            render={({ field, fieldState }) => (
              <>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={fieldState.error ? "border-red-500" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
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
      </div>

      {/* Explanation */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Explanation (shown after answer)
        </label>
        <Controller
          control={control}
          name={`${basePath}.explanation`}
          render={({ field, fieldState }) => (
            <>
              <textarea
                {...field}
                placeholder="Explain why this is the correct answer..."
                rows={2}
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
    </div>
  );
}
