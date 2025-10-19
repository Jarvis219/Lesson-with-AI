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
import { AIService } from "@/lib/ai-service";
import { TeacherService } from "@/lib/teacher-service";
import {
  grammarLessonFormSchema,
  listeningLessonFormSchema,
  readingLessonFormSchema,
  speakingLessonFormSchema,
  vocabularyLessonFormSchema,
  writingLessonFormSchema,
} from "@/lib/validations/lesson-schemas";
import type {
  GrammarLessonContent,
  LessonContent,
  LessonType,
  ListeningLessonContent,
  ReadingLessonContent,
  SpeakingLessonContent,
  VocabularyLessonContent,
  WritingLessonContent,
} from "@/types/lesson-content";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { getSchemaForType } from "utils/lesson.util";
import type { z } from "zod";

// Helper to initialize empty content based on lesson type
const initializeContentForType = (type: LessonType): LessonContent => {
  switch (type) {
    case "vocab":
      return {
        vocabulary: [],
        exercises: [],
        thematicGroup: "",
      } as VocabularyLessonContent;
    case "grammar":
      return {
        grammarRule: {
          title: "",
          explanation: "",
          structure: "",
          usage: [""],
          examples: [],
          notes: [],
          commonMistakes: [],
          relatedTopics: [],
        },
        exercises: [],
        visualAids: [],
      } as GrammarLessonContent;
    case "listening":
      return {
        audio: {
          url: "",
          duration: 0,
          transcript: "",
          speed: "normal",
          accent: "american",
        },
        preListening: {
          context: "",
          vocabulary: [],
          predictionQuestions: [],
        },
        whileListening: {
          exercises: [],
        },
        postListening: {
          comprehensionQuestions: [],
          discussionQuestions: [],
          summaryTask: "",
        },
      } as ListeningLessonContent;
    case "speaking":
      return {
        conversation: {
          scenario: "",
          dialogues: [],
          usefulPhrases: [],
        },
        practiceExercises: [],
        topics: [],
      } as SpeakingLessonContent;
    case "reading":
      return {
        passage: {
          title: "",
          text: "",
          wordCount: 0,
          readingTime: 0,
          genre: "article",
        },
        preReading: {
          context: "",
          predictions: [],
          vocabulary: [],
        },
        whileReading: {
          annotations: [],
          questions: [],
        },
        postReading: {
          comprehensionQuestions: [],
          vocabularyExercises: [],
          discussionQuestions: [],
          summaryTask: "",
        },
      } as ReadingLessonContent;
    case "writing":
      return {
        writingType: "essay",
        instruction: {
          prompt: "",
          requirements: [],
          audience: "",
          purpose: "",
          tone: "",
        },
        writingFramework: {
          structure: [],
          usefulPhrases: [],
          grammarPoints: [],
          vocabularyBank: [],
        },
        exercises: [],
        checklist: [],
      } as WritingLessonContent;
  }
};

// Type for lesson form data based on lesson type
type VocabularyFormData = z.infer<typeof vocabularyLessonFormSchema>;
type GrammarFormData = z.infer<typeof grammarLessonFormSchema>;
type ListeningFormData = z.infer<typeof listeningLessonFormSchema>;
type SpeakingFormData = z.infer<typeof speakingLessonFormSchema>;
type ReadingFormData = z.infer<typeof readingLessonFormSchema>;
type WritingFormData = z.infer<typeof writingLessonFormSchema>;

// Union type for all lesson form data
type LessonFormData =
  | VocabularyFormData
  | GrammarFormData
  | ListeningFormData
  | SpeakingFormData
  | ReadingFormData
  | WritingFormData;

export default function NewLessonPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Step management
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentType, setCurrentType] = useState<LessonType>("vocab");
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Create form with dynamic schema - using VocabularyFormData as default
  const form = useForm<LessonFormData>({
    resolver: zodResolver(getSchemaForType(currentType)),
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
      type: "vocab",
      difficulty: "beginner",
      estimatedTime: 30,
      tags: "",
      content: initializeContentForType("vocab"),
    } as VocabularyFormData,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setError,
  } = form;

  const watchedType = watch("type") as LessonType;

  // Handle type change - reinitialize content when lesson type changes
  useEffect(() => {
    if (watchedType && watchedType !== currentType) {
      setCurrentType(watchedType);
      const newContent = initializeContentForType(watchedType);

      // Reset form with new schema and type
      const currentValues = form.getValues();
      reset({
        ...currentValues,
        type: watchedType,
        content: newContent,
      } as LessonFormData);
    }
  }, [watchedType, currentType, form, reset]);

  const handleGenerateWithAI = async () => {
    try {
      setIsGenerating(true);

      const requestData = {
        title: form.getValues("title"),
        description: form.getValues("description"),
        type: form.getValues("type"),
        difficulty: form.getValues("difficulty"),
        estimatedTime: form.getValues("estimatedTime"),
        topic: form.getValues("title"), // Use title as topic
        numberOfExercises: 5,
      };

      const response = await AIService.generateLesson(requestData);

      // Fill form with AI generated data
      reset({
        title: response.lesson.title,
        description: response.lesson.description,
        type: response.lesson.type,
        difficulty: response.lesson.difficulty,
        estimatedTime: response.lesson.estimatedTime,
        tags: response.lesson.tags.join(", "),
        content: response.lesson.content,
      } as LessonFormData);

      setCurrentType(response.lesson.type as LessonType);
      toast({
        title: "Success!",
        description: "Lesson content generated successfully",
      });

      setShowAIGenerator(false);
      setStep(2);
    } catch (error) {
      console.error("AI generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate lesson content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
        description: "You must be logged in to create a lesson",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Transform tags from comma-separated string to array
      const tagsArray = data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [];

      // The data is already validated by react-hook-form + zod
      await TeacherService.createLesson(params.id, {
        title: data.title,
        description: data.description,
        type: data.type,
        difficulty: data.difficulty,
        estimatedTime: data.estimatedTime,
        tags: tagsArray,
        content: data.content as LessonContent,
        teacherId: user.id,
      });

      toast({
        title: "Success!",
        description: "Lesson created successfully",
      });

      router.push(`/teacher/courses/${params.id}`);
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create lesson",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        Create New Lesson
                      </CardTitle>
                      <CardDescription>
                        Step 1: Enter basic lesson information
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAIGenerator(!showAIGenerator)}
                      className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      {showAIGenerator ? "Hide AI" : "Generate with AI"}
                    </Button>
                  </div>
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
                        <select
                          id="type"
                          {...register("type")}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="vocab">Vocabulary</option>
                          <option value="grammar">Grammar</option>
                          <option value="listening">Listening</option>
                          <option value="speaking">Speaking</option>
                          <option value="reading">Reading</option>
                          <option value="writing">Writing</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="difficulty"
                          className="text-sm font-medium">
                          Difficulty *
                        </label>
                        <select
                          id="difficulty"
                          {...register("difficulty")}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
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
                        placeholder="e.g., present-tense, verbs, basic"
                        {...register("tags")}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          router.push(`/teacher/courses/${params.id}`)
                        }
                        className="flex-1">
                        Cancel
                      </Button>
                      {showAIGenerator ? (
                        <Button
                          type="button"
                          onClick={handleGenerateWithAI}
                          disabled={isGenerating}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Generate with AI
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          className="flex-1">
                          Next: Add Content
                        </Button>
                      )}
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
                    Lesson Content -{" "}
                    {currentType.charAt(0).toUpperCase() + currentType.slice(1)}
                  </CardTitle>
                  <CardDescription>
                    Step 2: Add detailed content for your {currentType} lesson
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Dynamic form rendering based on lesson type */}
                  {currentType === "vocab" && <VocabularyLessonForm />}
                  {currentType === "grammar" && <GrammarLessonForm />}
                  {currentType === "listening" && <ListeningLessonForm />}
                  {currentType === "speaking" && <SpeakingLessonForm />}
                  {currentType === "reading" && <ReadingLessonForm />}
                  {currentType === "writing" && <WritingLessonForm />}

                  {/* Action Buttons */}
                  <div className="mt-8 flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                      disabled={isLoading}>
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Lesson...
                        </>
                      ) : (
                        "Create Lesson"
                      )}
                    </Button>
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
