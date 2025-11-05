import { AILessonGenerateResponseSchema } from "@/constant/ai.schema.constant";
import { EXERCISE_QUESTION_TYPES, Lesson } from "@/types";
import {
  LessonFeedbackRequest,
  LessonFeedbackResponse,
} from "@/types/feedback";
import type {
  Exercise,
  LessonContent,
  LessonType,
  ListeningLessonContent,
  PartOfSpeech,
  ReadingLessonContent,
  SpeakingLessonContent,
  TrueFalseExercise,
  WritingLessonContent,
} from "@/types/lesson-content";
import { PARTS_OF_SPEECH } from "@/types/lesson-enums";
import { GoogleGenAI, Type } from "@google/genai";
import { getSchemaForType } from "utils/lesson.util";
import { DIFFICULTY_LEVELS } from "./constants";

// Initialize AI client
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY || "" });

export interface AIGrammarRequest {
  text: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface AIGrammarResponse {
  original: string;
  corrected: string;
  errors: Array<{
    type: string;
    original: string;
    correction: string;
    explanation: string;
  }>;
  score: number;
  suggestions: string[];
}

export interface AIVocabRequest {
  category: string;
  numberOfWords: number;
  excludeWords?: string[];
}

export interface AIVocabResponse {
  words: Array<{
    word: string;
    definition: string;
    translation: string;
    example: string;
    synonyms: string[];
    pronunciation: string;
    phonetic: string;
    partOfSpeech: PartOfSpeech;
    level: (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];
    category: string;
    antonyms: string[];
  }>;
}

export interface AISpeakingRequest {
  text: string;
  userAudio?: string; // base64 audio data
}

export interface AISpeakingResponse {
  feedback: {
    pronunciation: number;
    fluency: number;
    accuracy: number;
    overall: number;
  };
  suggestions: string[];
  correctPronunciation?: string;
}

export interface AILessonPlanRequest {
  prompt: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  focus?: string[];
}

export interface AILessonPlanResponse {
  title: string;
  description: string;
  objectives: string[];
  content: {
    vocabulary: Array<{
      word: string;
      definition: string;
      example: string;
    }>;
    exercises: Array<{
      type: string;
      question: string;
      options?: string[];
      answer: string;
    }>;
  };
  estimatedTime: number;
}

export type {
  LessonFeedbackRequest,
  LessonFeedbackResponse,
} from "@/types/feedback";

// ==================== AI LESSON GENERATION ====================

export interface AILessonGenerateRequest {
  title?: string;
  description?: string;
  type: LessonType;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number;
  topic?: string;
  focusAreas?: string[];
  numberOfExercises?: number;
}

export interface AILessonGenerateResponse {
  title: string;
  description: string;
  type: LessonType;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number;
  tags: string[];
  content: LessonContent;
}

// Generate complete lesson content using Google AI
export async function generateLessonContent(
  request: AILessonGenerateRequest,
  maxRetries: number = 3
): Promise<AILessonGenerateResponse> {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const lessonTypeDescriptions = {
        vocab:
          "vocabulary lesson with words, definitions, examples, and vocabulary exercises",
        grammar:
          "grammar lesson with rules, explanations, examples, and grammar exercises",
        listening:
          "listening lesson with audio content, pre-listening activities, and comprehension exercises",
        speaking:
          "speaking lesson with conversation practice, pronunciation tips, and speaking exercises",
        reading:
          "reading lesson with a passage, pre-reading activities, and comprehension questions",
        writing:
          "writing lesson with instructions, examples, framework, and writing exercises",
      };

      const prompt = `
You are an expert English teacher creating a ${
        lessonTypeDescriptions[request.type]
      } for ${request.difficulty} level students.

${request.topic ? `Topic: ${request.topic}` : ""}
${request.title ? `Suggested Title: ${request.title}` : ""}
${request.description ? `Description: ${request.description}` : ""}
Estimated Time: ${request.estimatedTime} minutes
${
  request.focusAreas && request.focusAreas.length > 0
    ? `Focus Areas: ${request.focusAreas.join(", ")}`
    : ""
}
Number of Exercises: ${request.numberOfExercises || 5}

Create a complete lesson following this structure:

**BASIC INFO:**
- title: A clear, engaging lesson title
- description: Detailed description of what students will learn (at least 100 characters)
- tags: 3-5 relevant tags (comma-separated)

**CONTENT STRUCTURE:**

${
  request.type === "vocab"
    ? `
VOCABULARY LESSON:
{
  "thematicGroup": "Topic theme (e.g., Food, Travel, Technology)",
  "vocabulary": [
    {
      "word": "word",
      "definition": "clear definition",
      "example": "example sentence",
      "pronunciation": "IPA notation",
      "partOfSpeech": "noun/verb/adjective/adverb/preposition/conjunction/pronoun/interjection",
      "synonyms": ["synonym1", "synonym2"],
      "antonyms": ["antonym1"],
      "difficulty": "beginner/intermediate/advanced"
    }
  ],
  "exercises": [
    {
      "type": "multiple-choice",
      "question": "What does [word] mean?",
      "translation": "Vietnamese translation",
      "options": [
        {"value": "correct answer", "translate": "Vietnamese"},
        {"value": "wrong answer 1", "translate": "Vietnamese"},
        {"value": "wrong answer 2", "translate": "Vietnamese"}
      ],
      "correctAnswer": "correct answer",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "Why this is correct"
    },
    {
      "type": "fill-in-the-blank",
      "question": "Complete the sentence by filling in the blank",
      "translation": "Hoàn thành câu bằng cách điền vào chỗ trống",
      "sentence": "I like to ___ in the morning.",
      "blanks": [
        {
          "position": 0,
          "correctAnswer": "exercise",
          "alternatives": ["run", "jog", "work out"]
        }
      ],
      "hint": "Think about activities you do in the morning",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "Exercise, run, jog, and work out are all correct verbs for physical activities in the morning"
    },
    {
      "type": "true-false",
      "question": "This is a statement",
      "translation": "Vietnamese translation",
      "correctAnswer": "true",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "This statement is correct"
    },
    {
      "type": "translation",
      "question": "Translate to Vietnamese",
      "translation": "Vietnamese translation",
      "sentence": "Hello, how are you?",
      "correctAnswers": ["Xin chào, bạn có khỏe không?", "Chào bạn, bạn thế nào?"],
      "points": 10,
      "difficulty": "beginner",
      "explanation": "These are correct translations"
    }
  ]
}
`
    : ""
}

${
  request.type === "grammar"
    ? `
GRAMMAR LESSON:
{
  "grammarRule": {
    "name": "Grammar Rule Name (e.g., Present Simple Tense)",
    "explanation": "Detailed explanation of the grammar rule",
    "examples": [
      {
        "sentence": "Example sentence",
        "translation": "Vietnamese translation",
        "highlight": "part to highlight",
        "explanation": "Why this demonstrates the rule"
      }
    ]
  },
  "exercises": [
    {
      "type": "fill-in-the-blank",
      "question": "Complete the sentence with the correct past tense verb",
      "translation": "Hoàn thành câu với động từ quá khứ đúng",
      "sentence": "I ___ to school yesterday.",
      "blanks": [
        {
          "position": 0,
          "correctAnswer": "went",
          "alternatives": []
        }
      ],
      "hint": "What is the past tense of 'go'?",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "The past tense of 'go' is 'went'. We use past tense for actions that happened yesterday."
    },
    {
      "type": "fill-in-the-blank",
      "question": "Fill in the blanks with appropriate words",
      "translation": "Điền vào chỗ trống với các từ phù hợp",
      "sentence": "She ___ a beautiful ___ to the party.",
      "blanks": [
        {
          "position": 0,
          "correctAnswer": "wore",
          "alternatives": ["put on", "had on"]
        },
        {
          "position": 1,
          "correctAnswer": "dress",
          "alternatives": ["gown", "outfit"]
        }
      ],
      "hint": "Think about what people wear to parties",
      "points": 15,
      "difficulty": "intermediate",
      "explanation": "The sentence describes someone wearing a dress to a party. 'Wore' is the past tense of 'wear', and 'dress' is appropriate clothing for a party."
    },
    {
      "type": "multiple-choice",
      "question": "Which sentence is correct?",
      "translation": "Vietnamese translation",
      "options": [
        {"value": "I go to school yesterday", "translate": "Vietnamese"},
        {"value": "I went to school yesterday", "translate": "Vietnamese"}
      ],
      "correctAnswer": "I went to school yesterday",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "Use past tense for past actions"
    }
  ],
  "visualAids": []
}
`
    : ""
}

${
  request.type === "listening"
    ? `
LISTENING LESSON:
{
  "audio": {
    "text": "Audio text",
    "timestamps": [
      {
        "time": 0,
        "text": "Text at this time"
      }
    ],
    "speed": "normal/fast/slow",
    "accent": "american/british"
  },
  "preListening": {
    "context": "Background information about the audio topic",
    "vocabulary": [
      {
        "word": "word",
        "definition": "definition",
        "example": "example sentence",
        "partOfSpeech": "noun/verb/adjective/adverb/preposition/conjunction/pronoun/interjection",
        "difficulty": "beginner/intermediate/advanced"
      }
    ],
    "predictionQuestions": ["What do you think this audio is about?"]
  },
  "exercises": [
    {
      "type": "multiple-choice",
      "question": "What is the main idea?",
      "translation": "Vietnamese translation",
      "options": [
        {"value": "correct answer", "translate": "Vietnamese"},
        {"value": "wrong answer 1", "translate": "Vietnamese"},
        {"value": "wrong answer 2", "translate": "Vietnamese"}
      ],
      "correctAnswer": "correct answer",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "This is the main idea of the audio"
    },
    {
      "type": "fill-in-the-blank",
      "question": "Complete the sentence with the correct verb",
      "translation": "Vietnamese translation",
      "sentence": "I ___ to school yesterday.",
      "blanks": [
        {
          "position": 0,
          "correctAnswer": "went",
          "alternatives": []
        }
      ],
      "hint": "What is the past tense of 'go'?",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "The past tense of 'go' is 'went'. We use past tense for actions that happened yesterday."
    },
    {
      "type": "true-false",
      "question": "This is a statement",
      "translation": "Vietnamese translation",
      "correctAnswer": "true",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "This statement is correct"
    },
    {
      "type": "translation",
      "question": "Translate to Vietnamese",
      "translation": "Vietnamese translation",
      "sentence": "Hello, how are you?",
      "correctAnswers": ["Xin chào, bạn có khỏe không?", "Chào bạn, bạn thế nào?"],
      "points": 10,
      "difficulty": "beginner",
      "explanation": "These are correct translations"
    }
    {
      "type": "translation",
      "question": "Translate to Vietnamese",
      "translation": "Vietnamese translation",
      "sentence": "Hello, how are you?",
      "correctAnswers": ["Xin chào, bạn có khỏe không?", "Chào bạn, bạn thế nào?"],
      "points": 10,
      "difficulty": "beginner",
      "explanation": "These are correct translations"
    }
  ]
}
`
    : ""
}

${
  request.type === "speaking"
    ? `
SPEAKING LESSON:
{
  "pronunciation": {
    "sounds": [
      {
        "phoneme": "/θ/",
        "description": "Description of the sound and how to pronounce it",
        "examples": ["think", "thought", "bath"]
      }
    ],
    "intonation": [
      {
        "pattern": "Rising intonation for questions",
        "description": "Description of the intonation pattern",
        "examples": ["Really?", "Is that true?"]
      }
    ]
  },
  "conversation": {
    "scenario": "At a restaurant",
    "dialogues": [
      {
        "speaker": "Waiter",
        "text": "What would you like to order?"
      },
      {
        "speaker": "Customer",
        "text": "I'll have the pasta, please."
      }
    ]
  },
  "exercises": [
    {
      "type": "multiple-choice",
      "question": "What is the main idea?",
      "translation": "Vietnamese translation",
      "options": [
        {"value": "correct answer", "translate": "Vietnamese"},
        {"value": "wrong answer 1", "translate": "Vietnamese"},
        {"value": "wrong answer 2", "translate": "Vietnamese"}
      ],
      "correctAnswer": "correct answer",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "This is the main idea of the audio"
    },
    {
      "type": "fill-in-the-blank",
      "question": "Complete the sentence with the correct verb",
      "translation": "Vietnamese translation",
      "sentence": "I ___ to school yesterday.",
      "blanks": [
        {
          "position": 0,
          "correctAnswer": "went",
          "alternatives": []
        }
      ],
      "hint": "What is the past tense of 'go'?",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "The past tense of 'go' is 'went'. We use past tense for actions that happened yesterday."
    }
    {
      "type": "true-false",
      "question": "This is a statement",
      "translation": "Vietnamese translation",
      "correctAnswer": "true",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "This statement is correct"
    }
    {
      "type": "translation",
      "question": "Translate to Vietnamese",
      "translation": "Vietnamese translation",
      "sentence": "Hello, how are you?",
      "correctAnswers": ["Xin chào, bạn có khỏe không?", "Chào bạn, bạn thế nào?"],
      "points": 10,
      "difficulty": "beginner",
      "explanation": "These are correct translations"
    }
  ]
}
`
    : ""
}

${
  request.type === "reading"
    ? `
READING LESSON:
{
  "passage": {
    "title": "Article Title",
    "content": "Full passage text (at least 200 words)",
    "genre": "article/blog/news/story/essay/poem/letter"
  },
  "preReading": {
    "context": "Background information about the passage",
    "predictions": ["What do you think this passage is about?"],
    "vocabulary": [
      {
        "word": "word",
        "definition": "definition",
        "example": "example sentence",
        "partOfSpeech": "noun/verb/adjective/adverb/preposition/conjunction/pronoun/interjection",
        "difficulty": "beginner/intermediate/advanced"
      }
    ]
  },
  "postReading": {
    "discussionQuestions": ["Discussion question about the passage"]
    "summaryTask": "Summary task"
  },
  "exercises": [
    {
      "type": "multiple-choice",
      "question": "What is the main idea?",
      "translation": "Vietnamese translation",
      "options": [
        {"value": "correct answer", "translate": "Vietnamese"},
        {"value": "wrong answer 1", "translate": "Vietnamese"},
        {"value": "wrong answer 2", "translate": "Vietnamese"}
      ],
    }
    {
      "type": "fill-in-the-blank",
      "question": "Complete the sentence with the correct verb",
      "translation": "Vietnamese translation",
      "sentence": "I ___ to school yesterday.",
      "blanks": [
        {
          "position": 0,
          "correctAnswer": "went",
          "alternatives": []
        }
      ],
    }
    {
      "type": "true-false",
      "question": "This is a statement",
      "translation": "Vietnamese translation",
      "correctAnswer": "true",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "This statement is correct"
    }
  ]
}
`
    : ""
}

${
  request.type === "writing"
    ? `
WRITING LESSON:
{
  "writingType": "essay/letter/email/report/story",
  "instruction": {
    "prompt": "Writing task prompt",
    "requirements": ["200-250 words", "Include introduction and conclusion"]
  },
  "modelText": {
    "title": "Model Essay Title",
    "text": "Complete model text showing good writing"
  },
  "writingFramework": {
    "structure": ["Introduction", "Body Paragraph 1", "Body Paragraph 2", "Conclusion"],
    "usefulPhrases": [
      {
        "category": "Opening",
        "phrases": ["useful phrase 1", "useful phrase 2"]
      }
    ]
  },
  "exercises": [
    {
      "type": "multiple-choice",
      "question": "What is the main idea?",
      "translation": "Vietnamese translation",
      "options": [
        {"value": "correct answer", "translate": "Vietnamese"},
        {"value": "wrong answer 1", "translate": "Vietnamese"},
        {"value": "wrong answer 2", "translate": "Vietnamese"}
      ],
      "correctAnswer": "correct answer",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "This is the main idea of the audio"
    },
    {
      "type": "fill-in-the-blank",
      "question": "Complete the sentence with the correct verb",
      "translation": "Vietnamese translation",
      "sentence": "I ___ to school yesterday.",
      "blanks": [
        {
          "position": 0,
          "correctAnswer": "went",
          "alternatives": []
        }
      ],
      "hint": "What is the past tense of 'go'?",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "The past tense of 'go' is 'went'. We use past tense for actions that happened yesterday."
    },
    {
      "type": "true-false",
      "question": "This is a statement",
      "translation": "Vietnamese translation",
      "correctAnswer": "true",
      "points": 10,
      "difficulty": "beginner",
      "explanation": "This statement is correct"
    },
    {
      "type": "translation",
      "question": "Translate to Vietnamese",
      "translation": "Vietnamese translation",
      "sentence": "Hello, how are you?",
      "correctAnswers": ["Xin chào, bạn có khỏe không?", "Chào bạn, bạn thế nào?"],
      "points": 10,
      "difficulty": "beginner",
      "explanation": "These are correct translations"
    }
  ],
}
}
`
    : ""
}

**IMPORTANT RULES:**
1. All exercises must have proper structure based on their type
2. All exercises MUST have the correct answer format based on type:
   - Multiple-choice: use "correctAnswer" (string) - the VALUE of the correct option
   - Single-choice: use "correctAnswer" (string) - the VALUE of the correct option
   - Fill-in-the-blank: use "blanks" array with objects containing:
     * position: number (0-based index indicating which blank)
     * correctAnswer: string (the correct answer for this blank)
     * alternatives: array of strings (optional alternative acceptable answers)
   - True-false: use "correctAnswer" (string) - either "true" or "false"
   - Translation: use "correctAnswers" (array of strings) - possible correct translations
3. Multiple-choice and single-choice exercises MUST have options array with at least 2 options
4. Fill-in-the-blank exercises MUST have:
   - "sentence" field with the sentence containing "___" for blanks
   - "blanks" array with at least one blank object
   - Each blank object must have position (0 for first blank, 1 for second, etc.)
   - Each blank object must have correctAnswer
   - alternatives array is optional but recommended for flexibility
5. True-false exercises MUST have correctAnswer as string "true" or "false"
6. Translation exercises MUST have correctAnswers array with at least one translation
7. All exercises should have "hint" field (string) for additional guidance (optional)
8. All fields marked as required in the schema MUST be filled
9. Content must be appropriate for ${request.difficulty} level
10. All text must be meaningful and educational
11. For vocabulary lessons: use "thematicGroup" and "vocabulary" array
12. For grammar lessons: use "name" in grammarRule (not "title")
13. For reading lessons: use "content" in passage (not "text")
14. For speaking lessons: intonation should be an array (not object)

Return ONLY the JSON object with all required fields.`;

      // Get the appropriate schema for validation
      const schema = getSchemaForType(request.type);

      // Note: We use a flexible schema since content structure varies by lesson type
      // The AI will generate the appropriate content structure based on the prompt
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: AILessonGenerateResponseSchema(request.type),
        },
      });

      const text = response.text?.trim();

      if (!text) {
        throw new Error("No response text received from AI");
      }

      const data = JSON.parse(text);

      // console.dir(data.content, { depth: null });

      let content = data.content as LessonContent;
      content = {
        ...data.content,
        exercises: data.content.exercises?.map((exercise: Exercise) => {
          if (exercise.type === "true-false") {
            // replace answer string to boolean
            return {
              ...exercise,
              correctAnswer:
                (exercise.correctAnswer as unknown as string) === "true",
            };
          }

          return exercise;
        }),
      };

      if (data.type === "listening") {
        const listeningContent = content as ListeningLessonContent;
        content = {
          ...content,
          exercises: listeningContent.exercises.map((exercise) => {
            if (exercise.type === "true-false") {
              return {
                ...exercise,
                correctAnswer:
                  ((exercise as TrueFalseExercise)
                    .correctAnswer as unknown as string) === "true",
              };
            }

            return exercise;
          }),
        };
      }

      if (data.type === "speaking") {
        const speakingContent = content as SpeakingLessonContent;
        content = {
          ...content,
          exercises: speakingContent.exercises.map((exercise) => {
            if (exercise.type === "true-false") {
              return {
                ...exercise,
                correctAnswer:
                  ((exercise as TrueFalseExercise)
                    .correctAnswer as unknown as string) === "true",
              };
            }

            return exercise;
          }),
        };
      }

      if (data.type === "reading") {
        const readingContent = content as ReadingLessonContent;
        content = {
          ...content,
          exercises: readingContent.exercises.map((exercise) => {
            if (exercise.type === "true-false") {
              return {
                ...exercise,
                correctAnswer:
                  ((exercise as TrueFalseExercise)
                    .correctAnswer as unknown as string) === "true",
              };
            }

            return exercise;
          }),
        };
      }

      if (data.type === "writing") {
        const writingContent = content as WritingLessonContent;
        content = {
          ...content,
          exercises: (writingContent.exercises || [])?.map((exercise) => {
            if (exercise.type === "true-false") {
              return {
                ...exercise,
                correctAnswer:
                  ((exercise as TrueFalseExercise)
                    .correctAnswer as unknown as string) === "true",
              };
            }

            return exercise;
          }),
        };
      }

      const result: AILessonGenerateResponse = {
        title: data.title || request.title || "AI Generated Lesson",
        description: data.description || request.description || "",
        type: request.type,
        difficulty:
          (data.difficulty as "beginner" | "intermediate" | "advanced") ||
          request.difficulty,
        estimatedTime: data.estimatedTime || request.estimatedTime,
        tags: data?.tags?.join(", "),
        content,
      };

      // console.log("---------------result----------------", result);

      // Validate the response against the schema
      const validatedData = schema.parse(result);
      // console.log("Validated Data:", validatedData);

      return {
        ...validatedData,
        tags: validatedData?.tags?.split(", ").map((tag: string) => tag.trim()),
      } as unknown as AILessonGenerateResponse;
    } catch (error) {
      attempts++;
      console.error(
        `Lesson generation error (attempt ${attempts}/${maxRetries}):`,
        error
      );

      if (attempts >= maxRetries) {
        console.error(
          "Max retries reached. Failed to generate lesson content."
        );
        throw new Error(
          "Failed to generate lesson content after multiple attempts"
        );
      }

      // Continue to next attempt
      console.log(
        `Retrying lesson generation... (attempt ${attempts + 1}/${maxRetries})`
      );
    }
  }

  // This should never be reached, but TypeScript requires it
  throw new Error("Failed to generate lesson content");
}

// Grammar correction using Google AI
export async function correctGrammar(
  request: AIGrammarRequest
): Promise<AIGrammarResponse> {
  try {
    const prompt = `
You are an English grammar teacher. Please correct the following text and provide detailed feedback.

Text: "${request.text}"
Level: ${request.level}

Please respond in JSON format with:
{
  "corrected": "corrected text",
  "errors": [
    {
      "type": "error type",
      "original": "original text",
      "correction": "corrected text",
      "explanation": "explanation of the error"
    }
  ],
  "score": 85,
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            corrected: {
              type: Type.STRING,
              description: "The corrected text",
            },
            errors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    description: "Type of error",
                  },
                  original: {
                    type: Type.STRING,
                    description: "Original incorrect text",
                  },
                  correction: {
                    type: Type.STRING,
                    description: "Corrected text",
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Explanation of the error",
                  },
                },
              },
            },
            score: {
              type: Type.NUMBER,
              description: "Grammar score from 0 to 100",
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "Learning suggestions",
              },
            },
          },
        },
      },
    });

    console.log("response-----------", response);

    const text = response.text;

    if (!text) {
      throw new Error("No response text received");
    }

    // Parse JSON response (should be valid JSON now)
    const data = JSON.parse(text);

    return {
      original: request.text,
      corrected: data.corrected || request.text,
      errors: data.errors || [],
      score: data.score || 0,
      suggestions: data.suggestions || [],
    };
  } catch (error) {
    console.error("Grammar correction error:", error);
    throw new Error("Failed to correct grammar");
  }
}

// Vocabulary learning using Google AI
export async function getVocabularyInfo(
  request: AIVocabRequest
): Promise<AIVocabResponse> {
  try {
    console.log(request.excludeWords);

    const prompt = `
    You are an English vocabulary teacher. Please generate ${
      request.numberOfWords
    } words for the category "${request.category}".
    Please provide:
    1. Clear definition in English
    2. Vietnamese translation
    3. Example sentences with Vietnamese translations
    4. Synonyms
    5. Pronunciation guide
    6. Phonetic pronunciation guide
    7. Part of speech of the word
    8. Difficulty level (beginner/intermediate/advanced)
    9. Antonyms

    If excludeWords is provided, do not include these words in the response.
    excludeWords: ${request.excludeWords?.join(", ") || ""}
    
    Format as JSON:
    {
      "words": [
        {
          "word": "word",
          "definition": "definition",
          "translation": "Vietnamese translation",
          "example": "Example sentences with Vietnamese translations",
          "pronunciation": "Pronunciation guide",
          "phonetic": "Phonetic pronunciation guide",
          "partOfSpeech": "Part of speech of the word",
          "synonyms": ["synonym1", "synonym2"],
          "level": "beginner/intermediate/advanced",
          "antonyms": ["antonym1", "antonym2"]
        }
      ]
    }
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            words: {
              type: Type.ARRAY,
              minItems: request.numberOfWords,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: {
                    type: Type.STRING,
                    description: "The word",
                  },
                  definition: {
                    type: Type.STRING,
                    description: "Clear definition in English",
                  },
                  translation: {
                    type: Type.STRING,
                    description: "Vietnamese translation",
                  },
                  example: {
                    type: Type.STRING,
                    description:
                      "Example sentences with Vietnamese translations",
                  },
                  pronunciation: {
                    type: Type.STRING,
                    description: "Pronunciation guide",
                  },
                  phonetic: {
                    type: Type.STRING,
                    description: "Phonetic pronunciation guide",
                  },
                  partOfSpeech: {
                    type: Type.STRING,
                    description: "Part of speech of the word",
                    enum: [...PARTS_OF_SPEECH],
                  },
                  synonyms: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.STRING,
                      description: "Synonyms of the word",
                    },
                  },
                  level: {
                    type: Type.STRING,
                    enum: Object.values(DIFFICULTY_LEVELS),
                    description:
                      "Difficulty level: beginner, intermediate, or advanced",
                  },
                  antonyms: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.STRING,
                      description: "Antonyms of the word",
                    },
                  },
                },
                required: [
                  "word",
                  "definition",
                  "translation",
                  "example",
                  "synonyms",
                  "pronunciation",
                  "phonetic",
                  "partOfSpeech",
                  "level",
                  "antonyms",
                ],
              },
            },
          },
        },
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response text received");
    }

    // Parse JSON response (should be valid JSON now)
    const data = JSON.parse(text) as AIVocabResponse;

    return {
      words: data.words.map((val) => ({
        word: val.word || "",
        definition: val.definition || "",
        translation: val.translation || "",
        example: val.example || "",
        synonyms: val.synonyms || [],
        pronunciation: val.pronunciation || "",
        phonetic: val.phonetic || "",
        partOfSpeech: (val.partOfSpeech as PartOfSpeech) || "noun",
        level:
          (val.level as (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS]) ||
          "beginner",
        category: request.category,
        antonyms: val.antonyms,
      })),
    };
  } catch (error) {
    console.error("Vocabulary lookup error:", error);
    throw new Error("Failed to get vocabulary information");
  }
}

// Speaking practice feedback using Google AI
export async function analyzeSpeaking(
  request: AISpeakingRequest
): Promise<AISpeakingResponse> {
  try {
    const prompt = `
You are an English pronunciation coach. Analyze this spoken text and provide feedback.

Text: "${request.text}"

Provide feedback on:
1. Pronunciation accuracy (0-100)
2. Fluency (0-100) 
3. Grammar accuracy (0-100)
4. Overall score (0-100)

Give specific suggestions for improvement.

Format as JSON:
{
  "feedback": {
    "pronunciation": 85,
    "fluency": 78,
    "accuracy": 92,
    "overall": 85
  },
  "suggestions": ["suggestion1", "suggestion2"],
  "correctPronunciation": "phonetic guide"
}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: {
              type: Type.OBJECT,
              properties: {
                pronunciation: {
                  type: Type.NUMBER,
                  description: "Pronunciation accuracy score (0-100)",
                },
                fluency: {
                  type: Type.NUMBER,
                  description: "Fluency score (0-100)",
                },
                accuracy: {
                  type: Type.NUMBER,
                  description: "Grammar accuracy score (0-100)",
                },
                overall: {
                  type: Type.NUMBER,
                  description: "Overall score (0-100)",
                },
              },
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "Specific suggestions for improvement",
              },
            },
            correctPronunciation: {
              type: Type.STRING,
              description: "Phonetic pronunciation guide",
            },
          },
        },
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response text received");
    }

    // Parse JSON response (should be valid JSON now)
    const data = JSON.parse(text);

    return {
      feedback: data.feedback || {
        pronunciation: 0,
        fluency: 0,
        accuracy: 0,
        overall: 0,
      },
      suggestions: data.suggestions || [],
      correctPronunciation: data.correctPronunciation,
    };
  } catch (error) {
    console.error("Speaking analysis error:", error);
    throw new Error("Failed to analyze speaking");
  }
}

// Generate personalized lesson plan using Google AI
export async function generateLessonPlan(
  request: AILessonPlanRequest,
  numberOfQuestions: number,
  maxRetries: number = 3
): Promise<Omit<Lesson, "progress"> | undefined> {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const prompt = `
Create a personalized English lesson plan based on the following requirements:

User Request: "${request.prompt}"
Level: ${request.level}
Duration: ${request.duration} minutes
Focus Areas: ${request.focus?.join(", ") || "General English"}

Create a complete lesson that includes:
1. A concise title and a detailed description.
2. The main content for the lesson with explanations and examples.
3. ${numberOfQuestions} engaging questions or exercises of different types to test understanding.
4. An assessment of the appropriate difficulty level (beginner, intermediate, or advanced).
5. The primary skill category this lesson focuses on (e.g., vocab, grammar, speaking).
6. An estimated time for completion.

**QUESTION TYPES AND REQUIREMENTS:**

1. **MULTIPLE-CHOICE QUESTIONS:**
   - MUST have options array with at least 2 options
   - Each option must have "value" and "translate" fields
   - correctAnswer contains the VALUE(s) of correct option(s)
   - Can have single or multiple correct answers

2. **FILL-IN-THE-BLANK QUESTIONS:**
   - MUST have options array with at least 2 options
   - Each option must have "value" and "translate" fields
   - correctAnswer contains the VALUE(s) of correct option(s)
   - Usually has single correct answer

3. **TRUE-FALSE QUESTIONS:**
   - NO options array needed (will be empty array)
   - correctAnswer contains either ["true"] or ["false"]
   - Question should be a statement that can be evaluated as true or false

4. **TRANSLATION QUESTIONS:**
   - NO options array needed (will be empty array)
   - correctAnswer contains the correct translation as a string
   - Question asks for translation from English to Vietnamese or vice versa

**CRITICAL VALIDATION RULES:**
- Multiple-choice and fill-in-the-blank: MUST have options array with at least 2 options
- True-false and translation: MUST have empty options array
- All questions must have valid correctAnswer array
- For true-false: correctAnswer must be ["true"] or ["false"]
- For translation: correctAnswer must contain the translation text
- All questions must have explanation and points (1-100)

**EXAMPLES:**

Multiple-choice:
{
  "type": "multiple-choice",
  "question": {
    "text": "Which of the following are colors?",
    "translate": "Những màu nào sau đây là màu sắc?"
  },
  "options": [
    {"value": "red", "translate": "đỏ"},
    {"value": "blue", "translate": "xanh dương"},
    {"value": "car", "translate": "xe hơi"},
    {"value": "green", "translate": "xanh lá"}
  ],
  "correctAnswer": ["red", "blue", "green"],
  "explanation": "Red, blue, and green are all colors, while car is not a color.",
  "points": 10
}

True-false:
{
  "type": "true-false",
  "question": {
    "text": "The capital of Vietnam is Hanoi.",
    "translate": "Thủ đô của Việt Nam là Hà Nội."
  },
  "options": [],
  "correctAnswer": ["true"],
  "explanation": "Hanoi is indeed the capital city of Vietnam.",
  "points": 10
}

Translation:
{
  "type": "translation",
  "question": {
    "text": "Translate to Vietnamese: 'Hello, how are you?'",
    "translate": "Dịch sang tiếng Việt: 'Xin chào, bạn có khỏe không?'"
  },
  "options": [],
  "correctAnswer": ["Xin chào, bạn có khỏe không?"],
  "explanation": "This is the correct Vietnamese translation of the English greeting.",
  "points": 10
}

The lesson should be engaging and educational for the specified level.`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "title",
              "description",
              "content",
              "difficulty",
              "skill",
              "estimatedTime",
              "questions",
            ],
            properties: {
              title: { type: Type.STRING, description: "Lesson title" },
              description: {
                type: Type.STRING,
                description: "Detailed lesson description",
              },
              content: {
                type: Type.STRING,
                description:
                  "Full lesson content with explanations and examples",
              },
              difficulty: {
                type: Type.STRING,
                description:
                  "Difficulty level: beginner, intermediate, or advanced",
                enum: ["beginner", "intermediate", "advanced"],
              },
              skill: {
                type: Type.STRING,
                description:
                  "Skill category: vocab, grammar, listening, speaking, reading, or writing",
                enum: [
                  "vocab",
                  "grammar",
                  "listening",
                  "speaking",
                  "reading",
                  "writing",
                ],
              },
              estimatedTime: {
                type: Type.NUMBER,
                description: "Estimated completion time in minutes",
              },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: [
                    "type",
                    "question",
                    "correctAnswer",
                    "explanation",
                    "points",
                  ],
                  properties: {
                    type: {
                      type: Type.STRING,
                      description: `Question type:  ${EXERCISE_QUESTION_TYPES.join(
                        ", "
                      )}`,
                      enum: EXERCISE_QUESTION_TYPES,
                    },
                    question: {
                      type: Type.OBJECT,
                      properties: {
                        text: {
                          type: Type.STRING,
                          description: "Question text",
                        },
                        translate: {
                          type: Type.STRING,
                          description: "Translate to Vietnamese",
                        },
                      },
                    },
                    options: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          value: {
                            type: Type.STRING,
                            description: "Question value",
                          },
                          translate: {
                            type: Type.STRING,
                            description: "Translate to Vietnamese",
                          },
                        },
                      },
                    },
                    correctAnswer: {
                      type: Type.ARRAY,
                      description:
                        "Correct answer(s) - array of strings for multiple correct answers",
                      nullable: false,
                      items: {
                        type: Type.STRING,
                        description: "Correct answer value",
                      },
                    },
                    explanation: {
                      type: Type.STRING,
                      description: "Explanation of why the answer is correct",
                    },
                    points: {
                      type: Type.NUMBER,
                      description: "Points for this question",
                    },
                  },
                },
              },
            },
          },
        },
      });

      const text = response.text?.trim();

      if (!text) {
        throw new Error("No response text received from AI");
      }

      const data = JSON.parse(text);

      // Validate questions based on their types
      let isValid = true;
      if (data.questions && Array.isArray(data.questions)) {
        for (let i = 0; i < data.questions.length; i++) {
          const question = data.questions[i];

          // Check basic requirements for all questions
          if (
            !question.correctAnswer ||
            !Array.isArray(question.correctAnswer) ||
            question.correctAnswer.length === 0
          ) {
            console.warn(
              `Question ${i + 1} has no valid correctAnswer. Attempt ${
                attempts + 1
              }/${maxRetries}`
            );
            isValid = false;
            break;
          }

          // Type-specific validation
          if (
            question.type === "multiple-choice" ||
            question.type === "fill-in-the-blank"
          ) {
            // Check if options array exists
            if (!question.options || !Array.isArray(question.options)) {
              console.warn(
                `Question ${i + 1} is ${
                  question.type
                } but has no options array. Attempt ${
                  attempts + 1
                }/${maxRetries}`
              );
              isValid = false;
              break;
            }

            // Check minimum options
            if (question.options.length < 2) {
              console.warn(
                `Question ${i + 1} is ${
                  question.type
                } but has less than 2 options (${
                  question.options.length
                }). Attempt ${attempts + 1}/${maxRetries}`
              );
              isValid = false;
              break;
            }

            // Check if correctAnswer values exist in options
            const optionValues = question.options.map((opt: any) => opt.value);
            const invalidAnswers = question.correctAnswer.filter(
              (answer: string) => !optionValues.includes(answer)
            );
            if (invalidAnswers.length > 0) {
              console.warn(
                `Question ${
                  i + 1
                } has correctAnswer values that don't match any option: ${invalidAnswers.join(
                  ", "
                )}. Attempt ${attempts + 1}/${maxRetries}`
              );
              isValid = false;
              break;
            }
          } else if (question.type === "true-false") {
            // Check if options array is empty or doesn't exist
            if (question.options && question.options.length > 0) {
              console.warn(
                `Question ${
                  i + 1
                } is true-false but has options array. Attempt ${
                  attempts + 1
                }/${maxRetries}`
              );
              isValid = false;
              break;
            }

            // Check if correctAnswer is "true" or "false"
            if (
              question.correctAnswer.length !== 1 ||
              (question.correctAnswer[0] !== "true" &&
                question.correctAnswer[0] !== "false")
            ) {
              console.warn(
                `Question ${
                  i + 1
                } is true-false but correctAnswer is not "true" or "false": ${question.correctAnswer.join(
                  ", "
                )}. Attempt ${attempts + 1}/${maxRetries}`
              );
              isValid = false;
              break;
            }
          } else if (question.type === "translation") {
            // Check if options array is empty or doesn't exist
            if (question.options && question.options.length > 0) {
              console.warn(
                `Question ${
                  i + 1
                } is translation but has options array. Attempt ${
                  attempts + 1
                }/${maxRetries}`
              );
              isValid = false;
              break;
            }

            // Check if correctAnswer is not empty
            if (
              question.correctAnswer.length === 0 ||
              question.correctAnswer[0].trim() === ""
            ) {
              console.warn(
                `Question ${
                  i + 1
                } is translation but correctAnswer is empty. Attempt ${
                  attempts + 1
                }/${maxRetries}`
              );
              isValid = false;
              break;
            }
          }
        }
      }

      // If validation passes, return the lesson
      if (isValid) {
        const lessonId = `lesson-${Date.now()}-${Math.random()
          .toFixed(3)
          .toString()
          .substring(2, 15)}`;
        const now = new Date().toISOString();

        return {
          _id: lessonId,
          title: data.title || "Generated Lesson",
          description: data.description || "",
          content: data.content || "",
          difficulty: data.difficulty || "beginner",
          type: data.skill || "vocab",
          estimatedTime: data.estimatedTime || request.duration,
          questions: data.questions || [],
          createdAt: now,
          updatedAt: now,
        };
      }

      // If validation fails and we have retries left, try again
      attempts++;
      if (attempts >= maxRetries) {
        console.error(
          "Max retries reached. Returning lesson with validation warnings."
        );
        // Return the lesson anyway, but with warnings
        const lessonId = `lesson-${Date.now()}-${Math.random()
          .toFixed(3)
          .toString()
          .substring(2, 15)}`;
        const now = new Date().toISOString();

        return {
          _id: lessonId,
          title: data.title || "Generated Lesson",
          description: data.description || "",
          content: data.content || "",
          difficulty: data.difficulty || "beginner",
          type: data.skill || "vocab",
          estimatedTime: data.estimatedTime || request.duration,
          questions: data.questions || [],
          createdAt: now,
          updatedAt: now,
        };
      }
    } catch (error) {
      attempts++;
      if (attempts >= maxRetries) {
        console.error("Lesson plan generation error:", error);
        throw new Error(
          "Failed to generate lesson plan after multiple attempts"
        );
      }
      // Continue to next attempt
    }
  }
}

// Generate lesson feedback using Google AI
export async function generateLessonFeedback(
  request: LessonFeedbackRequest
): Promise<LessonFeedbackResponse> {
  try {
    // Format questions and answers for AI
    const questionsDetail = request.questions
      .map((q, index) => {
        const userAns = Array.isArray(q.userAnswer)
          ? q.userAnswer.join(", ")
          : q.userAnswer;
        const correctAns = Array.isArray(q.correctAnswer)
          ? q.correctAnswer.join(", ")
          : q.correctAnswer;
        return `
Question ${index + 1} (${q.questionType}):
- Question: ${q.question}
- User's Answer: ${userAns}
- Correct Answer: ${correctAns}
- Result: ${q.isCorrect ? "✓ Correct" : "✗ Incorrect"}
${q.explanation ? `- Explanation: ${q.explanation}` : ""}`;
      })
      .join("\n");

    const prompt = `
You are an experienced English teacher providing detailed, personalized feedback to a student.

STUDENT PERFORMANCE OVERVIEW:
- Lesson Type: ${request.lessonType}
- Score: ${request.score}%
- Correct Answers: ${request.correctAnswers}/${request.totalQuestions}
- Time Spent: ${request.timeSpent} minutes
- Student Level: ${request.userLevel}

DETAILED QUESTION ANALYSIS:
${questionsDetail}

Please provide comprehensive feedback in JSON format with:
1. strengths: 2-3 specific strengths based on their performance and correct answers
2. improvements: 2-3 specific areas for improvement with actionable advice based on their mistakes
3. nextLessonSuggestions: 2-3 suggestions for next lessons they should take
4. motivationalMessage: A motivational message (1-2 sentences)
5. detailedAnalysis: (optional) More detailed analysis including:
   - weakAreas: Specific topics or question types they struggled with
   - strongAreas: Specific topics or question types they excelled at
   - specificMistakes: List of specific mistakes made with explanations

Be specific and reference the actual questions and answers in your feedback.`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "Specific strengths based on performance",
              },
            },
            improvements: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description:
                  "Specific areas for improvement with actionable advice",
              },
            },
            nextLessonSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "Suggestions for next lessons",
              },
            },
            motivationalMessage: {
              type: Type.STRING,
              description: "Motivational message to encourage the student",
            },
            detailedAnalysis: {
              type: Type.OBJECT,
              description: "Detailed analysis of performance",
              properties: {
                weakAreas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING,
                    description: "Specific weak areas",
                  },
                },
                strongAreas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING,
                    description: "Specific strong areas",
                  },
                },
                specificMistakes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: {
                        type: Type.STRING,
                        description: "The question text",
                      },
                      userAnswer: {
                        type: Type.STRING,
                        description: "What the user answered",
                      },
                      correctAnswer: {
                        type: Type.STRING,
                        description: "The correct answer",
                      },
                      explanation: {
                        type: Type.STRING,
                        description: "Explanation of the mistake",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response text received");
    }

    const data = JSON.parse(text);

    return {
      strengths: data.strengths || [],
      improvements: data.improvements || [],
      nextLessonSuggestions: data.nextLessonSuggestions || [],
      motivationalMessage:
        data.motivationalMessage || "Keep up the great work!",
      detailedAnalysis: data.detailedAnalysis,
    };
  } catch (error) {
    console.error("Lesson feedback generation error:", error);
    throw new Error("Failed to generate lesson feedback");
  }
}
