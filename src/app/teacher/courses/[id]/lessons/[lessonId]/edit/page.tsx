"use client";

import {
  GrammarLessonForm,
  ListeningLessonForm,
  ReadingLessonForm,
  SpeakingLessonForm,
  VocabularyLessonForm,
  WritingLessonForm,
} from "@/components/lessons/lesson-forms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { TeacherService } from "@/lib/teacher-service";
import {
  grammarLessonFormSchema,
  listeningLessonFormSchema,
  readingLessonFormSchema,
  speakingLessonFormSchema,
  vocabularyLessonFormSchema,
  writingLessonFormSchema,
} from "@/lib/validations/lesson-schemas";
import type { LessonContent, LessonType } from "@/types/lesson-content";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Eye, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";

// Import Select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define form data types
type VocabularyFormData = z.infer<typeof vocabularyLessonFormSchema>;
type GrammarFormData = z.infer<typeof grammarLessonFormSchema>;
type ListeningFormData = z.infer<typeof listeningLessonFormSchema>;
type SpeakingFormData = z.infer<typeof speakingLessonFormSchema>;
type ReadingFormData = z.infer<typeof readingLessonFormSchema>;
type WritingFormData = z.infer<typeof writingLessonFormSchema>;

type LessonFormData =
  | VocabularyFormData
  | GrammarFormData
  | ListeningFormData
  | SpeakingFormData
  | ReadingFormData
  | WritingFormData;

// Helper to get schema based on lesson type
const getSchemaForType = (type: LessonType) => {
  switch (type) {
    case "vocab":
      return vocabularyLessonFormSchema;
    case "grammar":
      return grammarLessonFormSchema;
    case "listening":
      return listeningLessonFormSchema;
    case "speaking":
      return speakingLessonFormSchema;
    case "reading":
      return readingLessonFormSchema;
    case "writing":
      return writingLessonFormSchema;
    default:
      return vocabularyLessonFormSchema;
  }
};

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [currentType, setCurrentType] = useState<LessonType>("vocab");
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LessonFormData>({
    resolver: zodResolver(getSchemaForType(currentType)),
    mode: "all",
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = form;

  const watchedType = watch("type") as LessonType;

  // Load existing lesson data
  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        const lesson = await TeacherService.getLessonById(
          params.id as string,
          params.lessonId as string
        );

        // Convert tags array to comma-separated string
        const tagsString = lesson.tags ? lesson.tags.join(", ") : "";

        // Reset form with lesson data
        reset({
          title: lesson.title,
          description: lesson.description,
          type: lesson.type as LessonType,
          difficulty: lesson.difficulty,
          estimatedTime: lesson.estimatedTime,
          tags: tagsString,
          content: lesson.content as LessonContent,
        } as LessonFormData);

        setCurrentType(lesson.type as LessonType);
      } catch (error) {
        console.error("Failed to load lesson:", error);
        toast({
          title: "Error",
          description: "Failed to load lesson data",
          variant: "destructive",
        });
        router.push(`/teacher/courses/${params.id}`);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadLesson();
    }
  }, [params.id, params.lessonId, user, reset, router, toast]);

  // Handle type change
  useEffect(() => {
    if (watchedType && watchedType !== currentType && !loading) {
      setCurrentType(watchedType);
      const currentValues = form.getValues();
      reset(
        {
          ...currentValues,
          type: watchedType,
        } as LessonFormData,
        { keepValues: true }
      );
    }
  }, [watchedType, currentType, form, reset, loading]);

  const handleNextStep = () => {
    // Validate basic info fields before moving to step 2
    const title = form.getValues("title");
    const description = form.getValues("description");
    const estimatedTime = form.getValues("estimatedTime");

    let isInvalid = false;

    if (!title || title.length < 3) {
      setError("title", { message: "Title must be at least 3 characters" });
      isInvalid = true;
    }

    if (!description || description.length < 10) {
      setError("description", {
        message: "Description must be at least 10 characters",
      });
      isInvalid = true;
    }

    if (!estimatedTime || estimatedTime < 1) {
      setError("estimatedTime", {
        message: "Estimated time must be at least 1 minute",
      });
      isInvalid = true;
    }

    if (isInvalid) return;

    setStep(2);
  };

  const onSubmit = async (data: LessonFormData) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update a lesson",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Convert tags string to array
      const tagsArray = data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [];

      await TeacherService.updateLesson(
        params.id as string,
        params.lessonId as string,
        {
          title: data.title,
          description: data.description,
          type: data.type,
          difficulty: data.difficulty,
          estimatedTime: data.estimatedTime,
          tags: tagsArray,
          content: data.content,
          teacherId: user.id,
        }
      );

      toast({
        title: "Success",
        description: "Lesson updated successfully!",
      });

      router.push(`/teacher/courses/${params.id}`);
    } catch (error) {
      console.error("Failed to update lesson:", error);
      toast({
        title: "Error",
        description: "Failed to update lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              type="button"
              onClick={() =>
                step === 1
                  ? router.push(`/teacher/courses/${params.id}`)
                  : setStep(1)
              }
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {step === 1 ? "Back to Course" : "Back to Basic Info"}
            </button>

            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        step === 1
                          ? "bg-blue-600 text-white"
                          : "bg-green-500 text-white"
                      }`}>
                      {step === 2 ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <span className="font-semibold">1</span>
                      )}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      Basic Info
                    </span>
                  </div>
                  <div className="w-16 h-1 bg-gray-300">
                    <div
                      className={`h-full ${
                        step === 2 ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        step === 2
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}>
                      <span className="font-semibold">2</span>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      Lesson Content
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    Edit Lesson
                  </CardTitle>
                  <CardDescription>
                    Step 1: Update basic lesson information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Lesson Title *
                      </label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="e.g., Present Tense Basics"
                        {...register("title")}
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">
                          {errors.title.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        placeholder="Describe what students will learn in this lesson..."
                        {...register("description")}
                        rows={4}
                        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none ${
                          errors.description ? "border-red-500" : ""
                        }`}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">
                          {errors.description.message as string}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="type" className="text-sm font-medium">
                          Lesson Type *
                        </label>
                        <Controller
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="vocab">
                                  Vocabulary
                                </SelectItem>
                                <SelectItem value="grammar">Grammar</SelectItem>
                                <SelectItem value="listening">
                                  Listening
                                </SelectItem>
                                <SelectItem value="speaking">
                                  Speaking
                                </SelectItem>
                                <SelectItem value="reading">Reading</SelectItem>
                                <SelectItem value="writing">Writing</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.type && (
                          <p className="text-sm text-red-500">
                            {errors.type.message as string}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="difficulty"
                          className="text-sm font-medium">
                          Difficulty *
                        </label>
                        <Controller
                          control={form.control}
                          name="difficulty"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">
                                  Beginner
                                </SelectItem>
                                <SelectItem value="intermediate">
                                  Intermediate
                                </SelectItem>
                                <SelectItem value="advanced">
                                  Advanced
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.difficulty && (
                          <p className="text-sm text-red-500">
                            {errors.difficulty.message as string}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="estimatedTime"
                          className="text-sm font-medium">
                          Time (minutes) *
                        </label>
                        <Input
                          id="estimatedTime"
                          type="number"
                          min="1"
                          placeholder="30"
                          {...register("estimatedTime", {
                            valueAsNumber: true,
                          })}
                          className={
                            errors.estimatedTime ? "border-red-500" : ""
                          }
                        />
                        {errors.estimatedTime && (
                          <p className="text-sm text-red-500">
                            {errors.estimatedTime.message as string}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="tags" className="text-sm font-medium">
                        Tags (comma-separated)
                      </label>
                      <Input
                        id="tags"
                        type="text"
                        placeholder="e.g., grammar, verbs, present-tense"
                        {...register("tags")}
                      />
                      {errors.tags && (
                        <p className="text-sm text-red-500">
                          {errors.tags.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/teacher/courses/${params.id}/lessons/${params.lessonId}/preview`
                        )
                      }>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          router.push(`/teacher/courses/${params.id}`)
                        }>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleNextStep}>
                        Next Step
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Lesson Content */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    {currentType === "vocab" && "Vocabulary Content"}
                    {currentType === "grammar" && "Grammar Content"}
                    {currentType === "listening" && "Listening Content"}
                    {currentType === "speaking" && "Speaking Content"}
                    {currentType === "reading" && "Reading Content"}
                    {currentType === "writing" && "Writing Content"}
                  </CardTitle>
                  <CardDescription>
                    Step 2: Configure the detailed lesson content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentType === "vocab" && <VocabularyLessonForm />}
                  {currentType === "grammar" && <GrammarLessonForm />}
                  {currentType === "listening" && <ListeningLessonForm />}
                  {currentType === "speaking" && <SpeakingLessonForm />}
                  {currentType === "reading" && <ReadingLessonForm />}
                  {currentType === "writing" && <WritingLessonForm />}

                  <div className="mt-6 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/teacher/courses/${params.id}/lessons/${params.lessonId}/preview`
                        )
                      }>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          router.push(`/teacher/courses/${params.id}`)
                        }>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Lesson"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
