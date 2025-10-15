import { EXERCISE_QUESTION_TYPES, Lesson } from "@/types";
import { GoogleGenAI, Type } from "@google/genai";

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
  word: string;
  context?: string;
}

export interface AIVocabResponse {
  word: string;
  definition: string;
  translation: string;
  examples: Array<{
    sentence: string;
    translation: string;
  }>;
  synonyms: string[];
  pronunciation: string;
  level: string;
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
    const prompt = `
Provide detailed information about the English word "${request.word}".

Context: ${request.context || "General usage"}

Please provide:
1. Clear definition in English
2. Vietnamese translation
3. 3 example sentences with Vietnamese translations
4. 3 synonyms
5. Pronunciation guide
6. Difficulty level (beginner/intermediate/advanced)

Format as JSON:
{
  "definition": "definition",
  "translation": "Vietnamese translation",
  "examples": [
    {"sentence": "example", "translation": "Vietnamese"}
  ],
  "synonyms": ["synonym1", "synonym2"],
  "pronunciation": "pronunciation guide",
  "level": "beginner/intermediate/advanced"
}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: {
              type: Type.STRING,
              description: "Clear definition in English",
            },
            translation: {
              type: Type.STRING,
              description: "Vietnamese translation",
            },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sentence: {
                    type: Type.STRING,
                    description: "Example sentence in English",
                  },
                  translation: {
                    type: Type.STRING,
                    description: "Vietnamese translation of the sentence",
                  },
                },
              },
            },
            synonyms: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "Synonyms of the word",
              },
            },
            pronunciation: {
              type: Type.STRING,
              description: "Pronunciation guide",
            },
            level: {
              type: Type.STRING,
              description:
                "Difficulty level: beginner, intermediate, or advanced",
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
      word: request.word,
      definition: data.definition || "",
      translation: data.translation || "",
      examples: data.examples || [],
      synonyms: data.synonyms || [],
      pronunciation: data.pronunciation || "",
      level: data.level || "beginner",
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
): Promise<Lesson | undefined> {
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
