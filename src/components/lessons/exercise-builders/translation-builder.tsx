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

interface TranslationBuilderProps {
  index: number;
  onRemove: () => void;
}

export function TranslationBuilder({
  index,
  onRemove,
}: TranslationBuilderProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const basePath = `content.exercises.${index}` as const;
  const correctAnswers = watch(`${basePath}.correctAnswers`) || [];
  const hints = watch(`${basePath}.hints`) || [];

  // Get nested errors safely
  const contentErrors = errors?.content as any;
  const exerciseError = contentErrors?.exercises?.[index];

  const addCorrectAnswer = () => {
    setValue(`${basePath}.correctAnswers`, [...correctAnswers, ""]);
  };

  const removeCorrectAnswer = (answerIndex: number) => {
    setValue(
      `${basePath}.correctAnswers`,
      correctAnswers.filter((_: any, i: number) => i !== answerIndex)
    );
  };

  const addHint = () => {
    setValue(`${basePath}.hints`, [...hints, ""]);
  };

  const removeHint = (hintIndex: number) => {
    setValue(
      `${basePath}.hints`,
      hints.filter((_: any, i: number) => i !== hintIndex)
    );
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm">Translation Exercise</h4>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
            Translate sentence
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
        <label className="text-sm font-medium">Question/Instruction *</label>
        <Controller
          control={control}
          name={`${basePath}.question`}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                placeholder="Enter the instruction for translation"
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
              <Input {...field} placeholder="Dịch hướng dẫn sang tiếng Việt" />
              {fieldState.error && (
                <p className="text-sm text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Sentence to Translate */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sentence to Translate *</label>
        <Controller
          control={control}
          name={`${basePath}.sentence`}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                placeholder="Enter the sentence to be translated"
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

      {/* Correct Answers */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Correct Answers *</label>
        {correctAnswers.map((answer: any, answerIndex: number) => (
          <div key={answerIndex} className="space-y-2">
            <div className="flex gap-2 items-center">
              <Controller
                control={control}
                name={`${basePath}.correctAnswers.${answerIndex}`}
                render={({ field, fieldState }) => (
                  <div className="flex-1">
                    <Input
                      {...field}
                      placeholder={`Correct answer ${answerIndex + 1}`}
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
              {correctAnswers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCorrectAnswer(answerIndex)}
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
          onClick={addCorrectAnswer}
          className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Correct Answer
        </Button>
        {exerciseError?.correctAnswers?.message && (
          <p className="text-sm text-red-500">
            {exerciseError.correctAnswers.message}
          </p>
        )}
      </div>

      {/* Hints (Optional) */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Hints (Optional)</label>
        {hints.map((hint: any, hintIndex: number) => (
          <div key={hintIndex} className="space-y-2">
            <div className="flex gap-2 items-center">
              <Controller
                control={control}
                name={`${basePath}.hints.${hintIndex}`}
                render={({ field }) => (
                  <div className="flex-1">
                    <Input {...field} placeholder={`Hint ${hintIndex + 1}`} />
                  </div>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeHint(hintIndex)}
                className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addHint}
          className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Hint
        </Button>
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
                placeholder="Provide additional context or explanation..."
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
