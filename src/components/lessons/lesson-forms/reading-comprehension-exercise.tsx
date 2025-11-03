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
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

interface ReadingComprehensionExerciseProps {
  index: number;
  onRemove: () => void;
  basePath?: string;
}

export function ReadingComprehensionExercise({
  index,
  onRemove,
  basePath: providedBasePath,
}: ReadingComprehensionExerciseProps) {
  const { watch } = useFormContext();

  const basePath = providedBasePath || `content.exercises.${index}`;
  const exerciseType = watch(`${basePath}.type`);

  const renderExercise = () => {
    switch (exerciseType) {
      case "multiple-choice":
        return (
          <MultipleChoiceExercise
            index={index}
            basePath={basePath}
            onRemove={onRemove}
          />
        );
      case "single-choice":
        return (
          <SingleChoiceExercise
            index={index}
            basePath={basePath}
            onRemove={onRemove}
          />
        );
      case "fill-in-the-blank":
        return (
          <FillInBlankExercise
            index={index}
            basePath={basePath}
            onRemove={onRemove}
          />
        );
      case "true-false":
        return (
          <TrueFalseExercise
            index={index}
            basePath={basePath}
            onRemove={onRemove}
          />
        );
      case "translation":
        return (
          <TranslationExercise
            index={index}
            basePath={basePath}
            onRemove={onRemove}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white">
      {renderExercise()}
    </div>
  );
}

// Multiple Choice Exercise
function MultipleChoiceExercise({ index, basePath, onRemove }: any) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const options = watch(`${basePath}.options`) || [];

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
    <>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Multiple Choice Question</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

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

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Answer Options <span className="text-red-500">*</span>
        </label>
        {options.map((option: any, optionIndex: number) => (
          <div key={optionIndex} className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <Controller
                control={control}
                name={`${basePath}.options.${optionIndex}.value`}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      placeholder={`Option ${optionIndex + 1}`}
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
                name={`${basePath}.options.${optionIndex}.translate`}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Dịch (optional)"
                    className="text-sm"
                  />
                )}
              />
            </div>
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
      </div>

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
                    .filter((opt: any) => opt.value?.trim())
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
    </>
  );
}

// Single Choice Exercise
function SingleChoiceExercise({ index, basePath, onRemove }: any) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const options = watch(`${basePath}.options`) || [];

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
    <>
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
      </div>

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
    </>
  );
}

// Fill in Blank Exercise
function FillInBlankExercise({ index, basePath, onRemove }: any) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const blanks = watch(`${basePath}.blanks`) || [];

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
    <>
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Translation (Vietnamese)</label>
        <Controller
          control={control}
          name={`${basePath}.translation`}
          render={({ field }) => (
            <Input {...field} placeholder="Enter translation" />
          )}
        />
      </div>

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

      <div className="space-y-2">
        <label className="text-sm font-medium">Hint (optional)</label>
        <Controller
          control={control}
          name={`${basePath}.hint`}
          render={({ field }) => (
            <Input {...field} placeholder="Give students a hint..." />
          )}
        />
      </div>
    </>
  );
}

// True/False Exercise
function TrueFalseExercise({ index, basePath, onRemove }: any) {
  const { control } = useFormContext();

  return (
    <>
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Translation (Vietnamese)</label>
        <Controller
          control={control}
          name={`${basePath}.translation`}
          render={({ field }) => (
            <Input {...field} placeholder="Translate the question" />
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Correct Answer <span className="text-red-500">*</span>
        </label>
        <Controller
          control={control}
          name={`${basePath}.correctAnswer`}
          render={({ field, fieldState }) => (
            <>
              <RadioGroup
                value={field.value.toString()}
                onValueChange={(value: string) =>
                  field.onChange(value === "true")
                }>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={index + "true"} />
                  <label
                    htmlFor={index + "true"}
                    className="text-sm font-medium cursor-pointer">
                    True
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={index + "false"} />
                  <label
                    htmlFor={index + "false"}
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
    </>
  );
}

// Translation Exercise
function TranslationExercise({ index, basePath, onRemove }: any) {
  const { control, watch, setValue } = useFormContext();
  const correctAnswers = watch(`${basePath}.correctAnswers`) || [];
  const hints = watch(`${basePath}.hints`) || [];

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
    <>
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

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Question/Instruction <span className="text-red-500">*</span>
        </label>
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Translation (Vietnamese)</label>
        <Controller
          control={control}
          name={`${basePath}.translation`}
          render={({ field }) => (
            <Input {...field} placeholder="Dịch hướng dẫn sang tiếng Việt" />
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Sentence to Translate <span className="text-red-500">*</span>
        </label>
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

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Correct Answers <span className="text-red-500">*</span>
        </label>
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
      </div>

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
    </>
  );
}
