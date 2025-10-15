"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { difficulties, focusAreas, skills } from "@/constant/lesson.constant";
import { apiClient } from "@/lib/api-client";
import { AILessonPlanRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  Brain,
  Clock,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod schema for form validation
const aiGeneratorSchema = z.object({
  prompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters")
    .max(500, "Prompt must be at most 500 characters"),
  skill: z.enum([
    "vocab",
    "grammar",
    "listening",
    "speaking",
    "reading",
    "writing",
  ]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z
    .number()
    .min(5, "Minimum time is 5 minutes")
    .max(120, "Maximum time is 120 minutes"),
  focus: z.array(z.string()).refine((val) => val.length > 0, {
    message: "Focus must have at least 1 focus",
  }),
});

type AIGeneratorFormData = z.infer<typeof aiGeneratorSchema>;

interface AIGeneratorProps {
  onSuccess: () => void;
}

export default function AIGenerator({ onSuccess }: AIGeneratorProps) {
  const [focus, setFocus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AIGeneratorFormData>({
    resolver: zodResolver(aiGeneratorSchema),
    defaultValues: {
      prompt: "",
      skill: "vocab",
      difficulty: "beginner",
      duration: 15,
      focus: [],
    },
  });

  const watchedValues = watch();

  const durations = [
    { value: 10, label: "10 minutes" },
    { value: 15, label: "15 minutes" },
    { value: 20, label: "20 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "60 minutes" },
  ];

  const toggleFocus = (area: string) => {
    const newFocus = focus.includes(area)
      ? focus.filter((f) => f !== area)
      : [...focus, area];
    setFocus(newFocus);
    setValue("focus", newFocus);
  };

  const onSubmit = async (data: AIGeneratorFormData) => {
    setLoading(true);
    setError(null);

    try {
      const request: AILessonPlanRequest = {
        prompt: data.prompt.trim(),
        level: data.difficulty as any,
        duration: data.duration,
        focus: data.focus && data.focus.length > 0 ? data.focus : undefined,
      };

      const response = await apiClient.generateLessonPlan(request);
      setGeneratedLesson(response.lesson);

      // Auto success after generation
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error: any) {
      setError(error.message || "An error occurred while creating the lesson");
    } finally {
      setLoading(false);
    }
  };

  const getSkillInfo = (skillValue: string) => {
    return skills.find((s) => s.value === skillValue) || skills[0];
  };

  const getDifficultyInfo = (diffValue: string) => {
    return difficulties.find((d) => d.value === diffValue) || difficulties[0];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 pt-0 sm:pt-0 sm:p-6">
        <form
          id="ai-generator-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt to create a lesson
              </label>
              <textarea
                {...register("prompt")}
                placeholder="Example: Create a lesson about vocabulary about travel, including words like hotel, airport, ticket, passport..."
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.prompt ? "border-red-300" : "border-gray-300"
                }`}
                rows={3}
              />
              {errors.prompt && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.prompt.message}
                </p>
              )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill
                </label>
                <Select
                  value={watchedValues.skill}
                  onValueChange={(value) => setValue("skill", value as any)}>
                  <SelectTrigger
                    className={errors.skill ? "border-red-300" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map((skillOption) => (
                      <SelectItem
                        key={skillOption.value}
                        value={skillOption.value}>
                        <div className="flex items-center gap-2">
                          <span>{skillOption.icon}</span>
                          <span>{skillOption.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.skill && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.skill.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <Select
                  value={watchedValues.difficulty}
                  onValueChange={(value) =>
                    setValue("difficulty", value as any)
                  }>
                  <SelectTrigger
                    className={errors.difficulty ? "border-red-300" : ""}>
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
                {errors.difficulty && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.difficulty.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <Select
                  value={watchedValues.duration.toString()}
                  onValueChange={(value) =>
                    setValue("duration", parseInt(value))
                  }>
                  <SelectTrigger
                    className={errors.duration ? "border-red-300" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((durationOption) => (
                      <SelectItem
                        key={durationOption.value}
                        value={durationOption.value.toString()}>
                        {durationOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {focusAreas.map((area) => (
                  <Badge
                    key={area}
                    className={`cursor-pointer transition-colors ${
                      focus.includes(area)
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    }`}
                    onClick={() => toggleFocus(area)}>
                    {area}
                  </Badge>
                ))}
              </div>
              {errors.focus && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.focus.message}
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Preview lesson</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">Skill:</span>
                <span className="font-medium">
                  {getSkillInfo(watchedValues.skill).label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-gray-600">Difficulty:</span>
                <span className="font-medium">
                  {getDifficultyInfo(watchedValues.difficulty).label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {watchedValues.duration} minutes
                </span>
              </div>
            </div>

            {focus.length > 0 && (
              <div className="mt-3">
                <span className="text-sm text-gray-600">Focus: </span>
                <div className="inline-flex flex-wrap gap-1">
                  {focus.map((area) => (
                    <Badge
                      key={area}
                      className="bg-purple-100 text-purple-700 border-0 text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Generated Lesson Preview */}
          {generatedLesson && (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Lesson created!</h3>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>Title:</strong>{" "}
                  {generatedLesson.title || "AI Generated Lesson"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {generatedLesson.description || "AI Generated Lesson"}
                </p>
                <p>
                  <strong>Questions:</strong>{" "}
                  {generatedLesson.questions?.length || 0} questions
                </p>
              </div>
            </Card>
          )}

          {/* Tips */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Tips to create a good lesson:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Describe the topic and learning objectives clearly</li>
              <li>Specify the appropriate difficulty level</li>
              <li>Refer to specific vocabulary or concepts</li>
              <li>Request the desired number of questions</li>
            </ul>
          </div>
        </form>
      </div>

      {/* Fixed Footer with Submit Button */}
      <div className="flex-shrink-0 p-4 sm:p-6 bg-white border-t">
        <Button
          type="submit"
          form="ai-generator-form"
          disabled={isSubmitting || loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          {isSubmitting || loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span className="hidden sm:inline">Creating lesson...</span>
              <span className="sm:hidden">Creating...</span>
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create lesson with AI</span>
              <span className="sm:hidden">Create Lesson</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
