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
import {
  DifficultyLevel,
  Exercise,
  ExerciseType,
  LessonType,
} from "@/types/lesson-content";

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

export const getLevelColor = (level: DifficultyLevel) => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "bg-gradient-to-r from-emerald-400 to-green-500 text-white";
    case "intermediate":
      return "bg-gradient-to-r from-cyan-400 to-blue-500 text-white";
    case "advanced":
      return "bg-gradient-to-r from-purple-400 to-pink-500 text-white";
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
  }
};

export const getLevelIcon = (level: DifficultyLevel) => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "🌱";
    case "intermediate":
      return "📚";
    case "advanced":
      return "🚀";
    default:
      return "📖";
  }
};
