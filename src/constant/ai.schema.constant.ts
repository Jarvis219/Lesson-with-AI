import {
  ACCENTS,
  DIFFICULTY_LEVELS,
  EXERCISE_TYPES,
  LESSON_TYPES,
  LessonType,
  PARTS_OF_SPEECH,
  READING_GENRES,
  SPEAKING_EXERCISE_TYPES,
  WRITING_TYPES,
} from "@/types/lesson-enums";
import { Type } from "@google/genai";

const VocabularyWordSchema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING },
    definition: { type: Type.STRING },
    example: { type: Type.STRING },
    pronunciation: { type: Type.STRING, nullable: true },
    partOfSpeech: { type: Type.STRING, enum: [...PARTS_OF_SPEECH] },
    synonyms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      nullable: true,
    },
    antonyms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      nullable: true,
    },
    imageUrl: { type: Type.STRING, nullable: true },
    audioUrl: { type: Type.STRING, nullable: true },
    difficulty: { type: Type.STRING, enum: [...DIFFICULTY_LEVELS] },
    collocations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      nullable: true,
    },
  },
  required: ["word", "definition", "example", "partOfSpeech", "difficulty"],
};

const BaseExerciseSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, nullable: true },
    type: { type: Type.STRING, enum: [...EXERCISE_TYPES] },
    question: { type: Type.STRING },
    translation: { type: Type.STRING, nullable: true },
    points: { type: Type.NUMBER },
    difficulty: { type: Type.STRING, enum: [...DIFFICULTY_LEVELS] },
    explanation: { type: Type.STRING, nullable: true },
    audioUrl: { type: Type.STRING, nullable: true },
    imageUrl: { type: Type.STRING, nullable: true },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        description:
          "Options for the exercise, require for multiple-choice and single-choice exercises",
        properties: {
          value: { type: Type.STRING, description: "The value of the option" },
          translate: {
            type: Type.STRING,
            description: "The translation of the option",
          },
        },
      },
    },
    correctAnswer: { type: Type.STRING },
    sentence: { type: Type.STRING },
    correctAnswers: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    hint: { type: Type.STRING, nullable: true },
  },
  required: [
    "type",
    "question",
    "options",
    "points",
    "correctAnswer",
    "correctAnswers",
    "difficulty",
    "sentence",
  ],
};

const VocabularyLessonContentSchema = {
  type: Type.OBJECT,
  properties: {
    thematicGroup: { type: Type.STRING },
    vocabulary: { type: Type.ARRAY, items: VocabularyWordSchema },
    exercises: { type: Type.ARRAY, items: BaseExerciseSchema },
  },
  required: ["thematicGroup", "vocabulary", "exercises"],
};

const GrammarLessonContentSchema = {
  type: Type.OBJECT,
  properties: {
    grammarRule: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        explanation: { type: Type.STRING },
        examples: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sentence: { type: Type.STRING },
              translation: { type: Type.STRING },
              highlight: { type: Type.STRING, nullable: true },
              explanation: { type: Type.STRING, nullable: true },
            },
          },
        },
      },
      required: ["name", "explanation", "examples"],
    },
    exercises: { type: Type.ARRAY, items: BaseExerciseSchema },
    visualAids: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      nullable: true,
    },
  },
  required: ["grammarRule", "exercises"],
};

const ListeningLessonContentSchema = {
  type: Type.OBJECT,
  properties: {
    audio: {
      type: Type.OBJECT,
      properties: {
        url: { type: Type.STRING },
        duration: { type: Type.NUMBER },
        accent: { type: Type.STRING, enum: [...ACCENTS] },
        transcript: { type: Type.STRING },
      },
      required: ["url", "duration", "accent", "transcript"],
    },
    preListening: {
      type: Type.OBJECT,
      properties: {
        vocabulary: {
          type: Type.ARRAY,
          items: VocabularyWordSchema,
          nullable: true,
        },
        context: { type: Type.STRING },
        predictionQuestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          nullable: true,
        },
      },
      required: ["context"],
    },
    whileListening: {
      type: Type.OBJECT,
      properties: {
        exercises: { type: Type.ARRAY, items: BaseExerciseSchema },
      },
      required: ["exercises"],
    },
    postListening: {
      type: Type.OBJECT,
      properties: {
        comprehensionQuestions: { type: Type.ARRAY, items: BaseExerciseSchema },
        discussionQuestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          nullable: true,
        },
        summaryTask: { type: Type.STRING, nullable: true },
      },
      required: ["comprehensionQuestions"],
    },
  },
  required: ["audio", "preListening", "whileListening", "postListening"],
};

const SpeakingLessonContentSchema = {
  type: Type.OBJECT,
  properties: {
    pronunciation: {
      type: Type.OBJECT,
      properties: {
        sounds: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              phoneme: { type: Type.STRING },
              description: { type: Type.STRING },
              examples: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
          nullable: true,
        },
        intonation: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              pattern: { type: Type.STRING },
              description: { type: Type.STRING },
              examples: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
          nullable: true,
        },
      },
    },
    conversation: {
      type: Type.OBJECT,
      properties: {
        scenario: { type: Type.STRING },
        dialogues: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              speaker: { type: Type.STRING },
              text: { type: Type.STRING },
            },
          },
        },
      },
      nullable: true,
    },
    practiceExercises: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: [...SPEAKING_EXERCISE_TYPES] },
          prompt: { type: Type.STRING },
        },
      },
    },
  },
  required: ["practiceExercises"],
};

const ReadingLessonContentSchema = {
  type: Type.OBJECT,
  properties: {
    passage: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        content: { type: Type.STRING },
        genre: { type: Type.STRING, enum: [...READING_GENRES] },
      },
      required: ["title", "content", "genre"],
    },
    preReading: {
      type: Type.OBJECT,
      properties: {
        predictions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          nullable: true,
        },
        vocabulary: {
          type: Type.ARRAY,
          items: VocabularyWordSchema,
          nullable: true,
        },
        context: { type: Type.STRING },
      },
      required: ["context"],
    },
    whileReading: {
      type: Type.OBJECT,
      properties: {
        questions: {
          type: Type.ARRAY,
          items: BaseExerciseSchema,
          nullable: true,
        },
      },
    },
    postReading: {
      type: Type.OBJECT,
      properties: {
        comprehensionQuestions: { type: Type.ARRAY, items: BaseExerciseSchema },
        discussionQuestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          nullable: true,
        },
      },
      required: ["comprehensionQuestions"],
    },
  },
  required: ["passage", "preReading", "postReading"],
};

const WritingLessonContentSchema = {
  type: Type.OBJECT,
  properties: {
    writingType: { type: Type.STRING, enum: [...WRITING_TYPES] },
    instruction: {
      type: Type.OBJECT,
      properties: {
        prompt: { type: Type.STRING },
        requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["prompt", "requirements"],
    },
    modelText: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        text: { type: Type.STRING },
      },
      required: ["title", "text"],
      nullable: true,
    },
    writingFramework: {
      type: Type.OBJECT,
      properties: {
        structure: { type: Type.ARRAY, items: { type: Type.STRING } },
        usefulPhrases: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              phrases: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
          nullable: true,
        },
      },
      required: ["structure"],
    },
  },
  required: ["writingType", "instruction", "writingFramework"],
};

export const AILessonGenerateResponseSchema = (type: LessonType) => {
  const contentSchema = {
    vocab: VocabularyLessonContentSchema,
    grammar: GrammarLessonContentSchema,
    listening: ListeningLessonContentSchema,
    speaking: SpeakingLessonContentSchema,
    reading: ReadingLessonContentSchema,
    writing: WritingLessonContentSchema,
  }[type];

  return {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      type: { type: Type.STRING, enum: [...LESSON_TYPES] },
      difficulty: { type: Type.STRING, enum: [...DIFFICULTY_LEVELS] },
      estimatedTime: { type: Type.NUMBER },
      tags: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
      },
      content: {
        ...contentSchema,
      },
    },
    required: [
      "title",
      "description",
      "type",
      "difficulty",
      "estimatedTime",
      "tags",
      "content",
    ],
  };
};
