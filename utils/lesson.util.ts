import {
  grammarLessonFormSchema,
  grammarLessonSchema,
  listeningLessonFormSchema,
  listeningLessonSchema,
  readingLessonFormSchema,
  readingLessonSchema,
  speakingLessonFormSchema,
  speakingLessonSchema,
  vocabularyLessonFormSchema,
  vocabularyLessonSchema,
  writingLessonFormSchema,
  writingLessonSchema,
} from "@/lib/validations/lesson-schemas";
import { Exercise, ExerciseType, LessonType } from "@/types/lesson-content";

export const addExerciseToLesson = (
  type: ExerciseType,
  callback: (exercise: Exercise) => void
) => {
  const baseExercise: Partial<Exercise> = {
    type,
    question: "",
    points: 1,
    difficulty: "beginner",
  };

  const newExercise =
    type === "multiple-choice"
      ? {
          ...baseExercise,
          type: "multiple-choice" as const,
          options: [
            { value: "", translate: "" },
            { value: "", translate: "" },
            { value: "", translate: "" },
          ],
          correctAnswer: "",
        }
      : type === "single-choice"
      ? {
          ...baseExercise,
          type: "single-choice" as const,
          options: [
            { value: "", translate: "" },
            { value: "", translate: "" },
            { value: "", translate: "" },
          ],
          correctAnswer: "",
        }
      : type === "true-false"
      ? {
          ...baseExercise,
          type: "true-false" as const,
          correctAnswer: true,
        }
      : type === "translation"
      ? {
          ...baseExercise,
          type: "translation" as const,
          sentence: "",
          correctAnswers: [""],
        }
      : {
          ...baseExercise,
          type: "fill-in-the-blank" as const,
          sentence: "",
          translation: "",
          blanks: [
            {
              position: 0,
              correctAnswer: "",
              alternatives: [],
            },
          ],
          hint: "",
        };

  callback(newExercise as Exercise);
};

export const getSchemaForType = (type: LessonType) => {
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
  }
};

export const getAISchemaForType = (type: LessonType) => {
  switch (type) {
    case "vocab":
      return vocabularyLessonSchema;
    case "grammar":
      return grammarLessonSchema;
    case "listening":
      return listeningLessonSchema;
    case "speaking":
      return speakingLessonSchema;
    case "reading":
      return readingLessonSchema;
    case "writing":
      return writingLessonSchema;
  }
};
