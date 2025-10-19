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

interface FillInBlankBuilderProps {
  index: number;
  onRemove: () => void;
}

export function FillInBlankBuilder({
  index,
  onRemove,
}: FillInBlankBuilderProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const basePath = `content.exercises.${index}` as const;
  const blanks = watch(`${basePath}.blanks`) || [];

  // Get nested errors safely
  const contentErrors = errors?.content as any;
  const exerciseError = contentErrors?.exercises?.[index];

  const addBlank = () => {
    setValue(`${basePath}.blanks`, [
      ...blanks,
      { position: blanks.length, correctAnswer: "", alternatives: [] },
    ]);
  };

  const removeBlank = (blankIndex: number) => {
    setValue(
      `${basePath}.blanks`,
      blanks.filter((_: any, i: number) => i !== blankIndex)
    );
  };

  const addAlternative = (blankIndex: number) => {
    const updatedBlanks = [...blanks];
    updatedBlanks[blankIndex] = {
      ...updatedBlanks[blankIndex],
      alternatives: [...(updatedBlanks[blankIndex].alternatives || []), ""],
    };
    setValue(`${basePath}.blanks`, updatedBlanks);
  };

  const removeAlternative = (blankIndex: number, altIndex: number) => {
    const updatedBlanks = [...blanks];
    updatedBlanks[blankIndex] = {
      ...updatedBlanks[blankIndex],
      alternatives: updatedBlanks[blankIndex].alternatives.filter(
        (_: string, i: number) => i !== altIndex
      ),
    };
    setValue(`${basePath}.blanks`, updatedBlanks);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Fill in the Blank</h4>
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
                placeholder="e.g., Complete the sentence by filling in the blanks"
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

      {/* Sentence with Blanks */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Sentence (use ___ for blanks) <span className="text-red-500">*</span>
        </label>
        <Controller
          control={control}
          name={`${basePath}.sentence`}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                placeholder="e.g., I ___ to the store yesterday."
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
        <p className="text-xs text-gray-500">
          Use three underscores (___) to mark where blanks should appear
        </p>
      </div>

      {/* Translation */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Translation (Vietnamese)</label>
        <Controller
          control={control}
          name={`${basePath}.translation`}
          render={({ field, fieldState }) => (
            <>
              <Input {...field} placeholder="Enter translation" />
              {fieldState.error && (
                <p className="text-sm text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Blanks Configuration */}
      <div className="space-y-3">
        <label className="text-sm font-medium">
          Blank Answers <span className="text-red-500">*</span>
        </label>
        {blanks.map((blank: any, blankIndex: number) => (
          <div key={blankIndex} className="border rounded p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Blank #{blankIndex + 1}
              </span>
              {blanks.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBlank(blankIndex)}
                  className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Correct Answer */}
            <div className="space-y-1">
              <label className="text-xs font-medium">Correct Answer</label>
              <Controller
                control={control}
                name={`${basePath}.blanks.${blankIndex}.correctAnswer`}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      placeholder="Enter correct answer"
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

            {/* Alternative Answers */}
            <div className="space-y-2">
              <label className="text-xs font-medium">
                Alternative Answers (optional)
              </label>
              {blank.alternatives?.map((alt: string, altIndex: number) => (
                <div key={altIndex} className="space-y-1">
                  <div className="flex gap-2">
                    <Controller
                      control={control}
                      name={`${basePath}.blanks.${blankIndex}.alternatives.${altIndex}`}
                      render={({ field, fieldState: { error } }) => (
                        <div className="flex-1">
                          <Input
                            {...field}
                            placeholder={`Alternative ${altIndex + 1}`}
                            className={`text-sm ${
                              error ? "border-red-500" : ""
                            }`}
                          />
                          {error && (
                            <p className="text-sm text-red-500 mt-1">
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAlternative(blankIndex, altIndex)}
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
                onClick={() => addAlternative(blankIndex)}
                className="w-full text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Alternative
              </Button>
            </div>
          </div>
        ))}
        {exerciseError?.blanks?.message && (
          <p className="text-sm text-red-500">{exerciseError.blanks.message}</p>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addBlank}
          className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Blank
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

      {/* Hint */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Hint (optional)</label>
        <Controller
          control={control}
          name={`${basePath}.hint`}
          render={({ field, fieldState }) => (
            <>
              <Input {...field} placeholder="Give students a hint..." />
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
