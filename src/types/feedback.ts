export interface QuestionAnswer {
  question: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  questionType: string;
  explanation?: string;
}

export interface LessonFeedbackRequest {
  lessonType: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  userLevel: string;
  questions: QuestionAnswer[];
}

export interface LessonFeedbackResponse {
  strengths: string[];
  improvements: string[];
  nextLessonSuggestions: string[];
  motivationalMessage: string;
  detailedAnalysis?: {
    weakAreas: string[];
    strongAreas: string[];
    specificMistakes: Array<{
      question: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
    }>;
  };
}
