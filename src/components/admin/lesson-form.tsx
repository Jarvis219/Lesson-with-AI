"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  difficulties,
  questionTypes,
  skills,
} from "@/constant/lesson.constant";
import {
  CreateLessonRequest,
  EXERCISE_QUESTION_TYPES,
  Lesson,
  Question,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2, X } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// Zod Schema for form validation
const optionSchema = z.object({
  value: z.string().min(1, "Option value is required"),
  translate: z.string().min(1, "Option translation is required"),
});

const questionSchema = z
  .object({
    id: z.string().optional(),
    type: z.enum(EXERCISE_QUESTION_TYPES as [string, ...string[]]),
    question: z.object({
      text: z.string().min(1, "Question text is required"),
      translate: z.string().min(1, "Question translation is required"),
    }),
    options: z.array(optionSchema).optional(),
    correctAnswer: z
      .array(z.string())
      .min(1, "At least one correct answer is required"),
    explanation: z.string().min(1, "Explanation is required"),
    points: z
      .number()
      .min(1, "Points must be at least 1")
      .max(100, "Points cannot exceed 100"),
  })
  .refine(
    (data) => {
      // For multiple-choice questions, validate options and correctAnswer
      if (data.type === "multiple-choice") {
        if (!data.options || data.options.length < 2) {
          return false;
        }
        // Check if all correctAnswer values exist in options
        const optionValues = data.options.map((opt) => opt.value);
        return (
          data.correctAnswer.filter((item) => optionValues.includes(item))
            .length > 0
        );
      }

      // For fill-in-the-blank questions, validate options and correctAnswer
      if (data.type === "fill-in-the-blank") {
        if (!data.options || data.options.length < 2) {
          return false;
        }
        // Check if all correctAnswer values exist in options
        const optionValues = data.options.map((opt) => opt.value);
        return (
          data.correctAnswer.filter((item) => optionValues.includes(item))
            .length > 0
        );
      }

      // For true-false questions, validate correctAnswer is "true" or "false"
      if (data.type === "true-false") {
        return (
          data.correctAnswer.length === 1 &&
          (data.correctAnswer[0] === "true" ||
            data.correctAnswer[0] === "false")
        );
      }

      // For translation questions, validate correctAnswer is not empty
      if (data.type === "translation") {
        return (
          data.correctAnswer.length > 0 && data.correctAnswer[0].trim() !== ""
        );
      }

      return true;
    },
    {
      message: "Invalid question configuration",
      path: ["correctAnswer"],
    }
  );

const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  skill: z.enum([
    "vocab",
    "grammar",
    "listening",
    "speaking",
    "reading",
    "writing",
  ]),
  estimatedTime: z
    .number()
    .min(5, "Minimum 5 minutes")
    .max(120, "Maximum 120 minutes"),
  questions: z
    .array(questionSchema as unknown as z.ZodType<Question>)
    .min(1, "At least one question is required"),
});

type LessonFormData = z.infer<typeof lessonFormSchema>;

interface LessonFormProps {
  lesson?: Lesson;
  onSubmit: (data: CreateLessonRequest) => void;
  onCancel: () => void;
}

export default function LessonForm({
  lesson,
  onSubmit,
  onCancel,
}: LessonFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: lesson?.title || "",
      description: lesson?.description || "",
      content: lesson?.content.text || "",
      difficulty: lesson?.difficulty || "beginner",
      skill: lesson?.type || "vocab",
      estimatedTime: lesson?.estimatedTime || 15,
      questions: lesson?.content.exercises || [],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const watchedQuestions = watch("questions");

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type: EXERCISE_QUESTION_TYPES[0],
      question: {
        text: "",
        translate: "",
      },
      options: [
        { value: "", translate: "" },
        { value: "", translate: "" },
      ],
      correctAnswer: [],
      explanation: "",
      points: 10,
    };
    appendQuestion(newQuestion);
  };

  const getDefaultOptionsForType = (type: string) => {
    switch (type) {
      case "true-false":
        return [];
      case "translation":
        return [];
      default:
        return [
          { value: "", translate: "" },
          { value: "", translate: "" },
        ];
    }
  };

  const handleQuestionTypeChange = (index: number, newType: string) => {
    const defaultOptions = getDefaultOptionsForType(newType);
    setValue(`questions.${index}.options`, defaultOptions);
    setValue(`questions.${index}.correctAnswer`, []);
  };

  const onSubmitForm = (data: LessonFormData) => {
    const submitData: CreateLessonRequest = {
      ...data,
      questions: data.questions.map((q) => ({
        ...q,
        id: q.id || `q_${Date.now()}`,
      })) as Question[],
      skill: data.skill as any,
    };
    onSubmit(submitData);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <form
          id="lesson-form"
          onSubmit={handleSubmit(onSubmitForm as any)}
          className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                {...register("title")}
                placeholder="Enter the title of the lesson..."
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Input
                {...register("description")}
                placeholder="Enter the description of the lesson..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill
                </label>
                <Controller
                  name="skill"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {skills.map((skill) => (
                          <SelectItem key={skill.value} value={skill.value}>
                            {skill.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.skill && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.skill.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((diff) => (
                          <SelectItem key={diff.value} value={diff.value}>
                            {diff.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.difficulty && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.difficulty.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated time
                </label>
                <Input
                  type="number"
                  {...register("estimatedTime", { valueAsNumber: true })}
                  min="5"
                  max="120"
                />
                {errors.estimatedTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.estimatedTime.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                {...register("content")}
                placeholder="Enter the detailed content of the lesson..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[100px]"
                rows={4}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold">
                Questions ({questionFields.length})
              </h3>
              <Button
                type="button"
                onClick={addQuestion}
                variant="outline"
                className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {/* Questions List */}
            {questionFields.length > 0 && (
              <div className="space-y-3">
                {questionFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto">
                        <Trash2 className="h-4 w-4 mr-2 sm:mr-0" />
                        <span className="sm:hidden">Remove Question</span>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {/* Question Type and Points */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Type
                          </label>
                          <Controller
                            name={`questions.${index}.type`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  handleQuestionTypeChange(index, value);
                                }}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {questionTypes.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.questions?.[index]?.type && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.questions[index]?.type?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Points
                          </label>
                          <Input
                            type="number"
                            {...register(`questions.${index}.points`, {
                              valueAsNumber: true,
                            })}
                            min="1"
                            max="100"
                          />
                          {errors.questions?.[index]?.points && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.questions[index]?.points?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question
                        </label>
                        <Input
                          {...register(`questions.${index}.question.text`)}
                          placeholder="Enter the question..."
                        />
                        {errors.questions?.[index]?.question?.text && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.questions[index]?.question?.text?.message}
                          </p>
                        )}
                      </div>

                      {/* Question Translation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Translation
                        </label>
                        <Input
                          {...register(`questions.${index}.question.translate`)}
                          placeholder="Enter the question translation..."
                        />
                        {errors.questions?.[index]?.question?.translate && (
                          <p className="text-red-500 text-sm mt-1">
                            {
                              errors.questions[index]?.question?.translate
                                ?.message
                            }
                          </p>
                        )}
                      </div>

                      {/* Options - Show for multiple-choice and fill-in-the-blank only */}
                      {watchedQuestions[index]?.type !== "translation" &&
                        watchedQuestions[index]?.type !== "true-false" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Options
                            </label>
                            <div className="space-y-2">
                              {watchedQuestions[index]?.options?.map(
                                (option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className="flex flex-col sm:flex-row gap-2">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <Input
                                        {...register(
                                          `questions.${index}.options.${optionIndex}.value`
                                        )}
                                        placeholder={`Option ${
                                          optionIndex + 1
                                        }`}
                                        disabled={
                                          watchedQuestions[index]?.type ===
                                          "true-false"
                                        }
                                      />
                                      <Input
                                        {...register(
                                          `questions.${index}.options.${optionIndex}.translate`
                                        )}
                                        placeholder="Translation"
                                        disabled={
                                          watchedQuestions[index]?.type ===
                                          "true-false"
                                        }
                                      />
                                    </div>
                                    {watchedQuestions[index]?.type !==
                                      "true-false" &&
                                      watchedQuestions[index]?.options &&
                                      watchedQuestions[index]?.options.length >
                                        2 && (
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const currentOptions =
                                              getValues(
                                                `questions.${index}.options`
                                              ) || [];
                                            const newOptions =
                                              currentOptions.filter(
                                                (_, i) => i !== optionIndex
                                              );
                                            setValue(
                                              `questions.${index}.options`,
                                              newOptions
                                            );
                                          }}
                                          className="w-full sm:w-auto">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                  </div>
                                )
                              )}
                              {watchedQuestions[index]?.type !==
                                "true-false" && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const currentOptions =
                                      getValues(`questions.${index}.options`) ||
                                      [];
                                    setValue(`questions.${index}.options`, [
                                      ...currentOptions,
                                      { value: "", translate: "" },
                                    ]);
                                  }}
                                  className="w-full sm:w-auto">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Option
                                </Button>
                              )}
                            </div>
                            {errors.questions?.[index]?.options && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.questions[index]?.options?.message}
                              </p>
                            )}
                          </div>
                        )}

                      {/* Correct Answer */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correct Answer <span className="text-red-500">*</span>
                        </label>
                        {watchedQuestions[index]?.type === "translation" ? (
                          <div className="space-y-2">
                            <Controller
                              name={`questions.${index}.correctAnswer`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  value={field.value?.[0] || ""}
                                  onChange={(e) => {
                                    field.onChange([e.target.value]);
                                  }}
                                  placeholder="Enter the correct translation..."
                                />
                              )}
                            />
                          </div>
                        ) : watchedQuestions[index]?.type ===
                          "multiple-choice" ? (
                          <div className="space-y-2">
                            <Controller
                              name={`questions.${index}.correctAnswer`}
                              control={control}
                              render={({ field }) => (
                                <div className="space-y-2">
                                  {watchedQuestions[index]?.options?.map(
                                    (option, optionIndex) =>
                                      option.value && (
                                        <div
                                          key={optionIndex}
                                          className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`question-${index}-option-${optionIndex}`}
                                            checked={
                                              field.value?.includes(
                                                option.value
                                              ) || false
                                            }
                                            onCheckedChange={(checked) => {
                                              const currentAnswers =
                                                field.value || [];
                                              if (checked) {
                                                field.onChange([
                                                  ...currentAnswers,
                                                  option.value,
                                                ]);
                                              } else {
                                                field.onChange(
                                                  currentAnswers.filter(
                                                    (answer: string) =>
                                                      answer !== option.value
                                                  )
                                                );
                                              }
                                            }}
                                          />
                                          <label
                                            htmlFor={`question-${index}-option-${optionIndex}`}
                                            className="text-sm font-medium text-gray-700 cursor-pointer">
                                            {option.value}
                                            {option.translate && (
                                              <span className="text-gray-500 ml-1">
                                                ({option.translate})
                                              </span>
                                            )}
                                          </label>
                                        </div>
                                      )
                                  )}
                                </div>
                              )}
                            />
                          </div>
                        ) : watchedQuestions[index]?.type === "true-false" ? (
                          <div className="space-y-2">
                            <Controller
                              name={`questions.${index}.correctAnswer`}
                              control={control}
                              render={({ field }) => (
                                <RadioGroup
                                  value={field.value?.[0] || ""}
                                  onValueChange={(value) => {
                                    field.onChange([value]);
                                  }}>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="true"
                                      id={`question-${index}-radio-true`}
                                    />
                                    <label
                                      htmlFor={`question-${index}-radio-true`}
                                      className="text-sm font-medium text-gray-700 cursor-pointer">
                                      True (Đúng)
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="false"
                                      id={`question-${index}-radio-false`}
                                    />
                                    <label
                                      htmlFor={`question-${index}-radio-false`}
                                      className="text-sm font-medium text-gray-700 cursor-pointer">
                                      False (Sai)
                                    </label>
                                  </div>
                                </RadioGroup>
                              )}
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Controller
                              name={`questions.${index}.correctAnswer`}
                              control={control}
                              render={({ field }) => (
                                <RadioGroup
                                  value={field.value?.[0] || ""}
                                  onValueChange={(value) => {
                                    field.onChange([value]);
                                  }}>
                                  {watchedQuestions[index]?.options?.map(
                                    (option, optionIndex) =>
                                      option.value && (
                                        <div
                                          key={optionIndex}
                                          className="flex items-center space-x-2">
                                          <RadioGroupItem
                                            value={option.value}
                                            id={`question-${index}-radio-${optionIndex}`}
                                          />
                                          <label
                                            htmlFor={`question-${index}-radio-${optionIndex}`}
                                            className="text-sm font-medium text-gray-700 cursor-pointer">
                                            {option.value}
                                            {option.translate && (
                                              <span className="text-gray-500 ml-1">
                                                ({option.translate})
                                              </span>
                                            )}
                                          </label>
                                        </div>
                                      )
                                  )}
                                </RadioGroup>
                              )}
                            />
                          </div>
                        )}
                        {errors.questions?.[index]?.correctAnswer && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.questions[index]?.correctAnswer?.message}
                          </p>
                        )}
                      </div>

                      {/* Explanation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Explanation
                        </label>
                        <Input
                          {...register(`questions.${index}.explanation`)}
                          placeholder="Explain why this answer is correct"
                        />
                        {errors.questions?.[index]?.explanation && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.questions[index]?.explanation?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {errors.questions &&
              typeof errors.questions === "object" &&
              "message" in errors.questions && (
                <p className="text-red-500 text-sm">
                  {errors.questions.message}
                </p>
              )}
          </div>
        </form>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 p-6 pt-4 border-t bg-white flex-shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:flex-1 order-2 sm:order-1"
          disabled={isSubmitting}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          form="lesson-form"
          className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 order-1 sm:order-2"
          disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Processing..." : lesson ? "Update" : "Create Lesson"}
        </Button>
      </div>
    </div>
  );
}
