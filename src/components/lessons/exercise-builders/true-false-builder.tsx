"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

interface TrueFalseBuilderProps {
  index: number;
  onRemove: () => void;
}

export function TrueFalseBuilder({ index, onRemove }: TrueFalseBuilderProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const basePath = `content.exercises.${index}` as const;

  // Get nested errors safely
  const contentErrors = errors?.content as any;

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm">True/False Question</h4>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            Binary choice
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
        <label className="text-sm font-medium">Question *</label>
        <Controller
          control={control}
          name={`${basePath}.question`}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                placeholder="Enter your statement"
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

      {/* Correct Answer */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Correct Answer *</label>
        <Controller
          control={control}
          name={`${basePath}.correctAnswer`}
          render={({ field, fieldState }) => (
            <>
              <RadioGroup
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="true" />
                  <label
                    htmlFor="true"
                    className="text-sm font-medium cursor-pointer">
                    True
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="false" />
                  <label
                    htmlFor="false"
                    className="text-sm font-medium cursor-pointer">
                    False
                  </label>
                </div>
              </RadioGroup>
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
