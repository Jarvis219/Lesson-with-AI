import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import LessonResult from "@/models/LessonResult";
import Progress, { IQuestionAnswer } from "@/models/Progress";
import { LessonProgressSubmitResponse } from "@/types/lessons";
import { NextRequest, NextResponse } from "next/server";
import { isEmpty } from "utils/lodash.util";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { lessonId, timeSpent, userAnswers, exercises, lessonType } =
      await request.json();

    // Validation
    if (!lessonId || timeSpent === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Helper function to check if answer is correct
    const checkAnswerCorrectness = (exercise: any, userAnswer: any) => {
      const userAnswersArray = (
        Array.isArray(userAnswer) ? userAnswer : [userAnswer]
      )
        ?.filter((val) => val !== undefined && val !== null)
        .map((val) => val.toString().toLowerCase().trim());

      const correctAnswers =
        isEmpty(exercise.correctAnswers) && !isEmpty(exercise.correctAnswer)
          ? [exercise.correctAnswer]
          : exercise.correctAnswers;

      if (exercise.type === "multiple-choice") {
        return (
          correctAnswers.length === userAnswersArray.length &&
          correctAnswers.every((answer: string) =>
            userAnswersArray.includes(answer.toLowerCase().trim())
          )
        );
      }

      return correctAnswers.some((answer: string) =>
        userAnswersArray.includes(answer.toLowerCase().trim())
      );
    };

    // Calculate detailed stats and create question answers data
    const totalQuestions = exercises?.length || 0;
    const questionAnswers: IQuestionAnswer[] =
      exercises?.map((exercise: any, index: number) => {
        const userAnswer = userAnswers[exercise.id || index.toString()];
        const correctAnswer = exercise.correctAnswers || exercise.correctAnswer;
        const isCorrect = checkAnswerCorrectness(exercise, userAnswer);

        return {
          questionId: exercise.id || index.toString(),
          question: exercise.question,
          questionType: exercise.type,
          userAnswer: userAnswer,
          correctAnswer: correctAnswer,
          isCorrect: isCorrect,
          explanation: exercise.explanation,
          points: exercise.points || 1,
          difficulty: exercise.difficulty || "beginner",
          answeredAt: new Date(),
        };
      }) || [];

    // Calculate stats from question answers
    const correctAnswers = questionAnswers.filter(
      (qa: IQuestionAnswer) => qa.isCorrect
    ).length;
    const incorrectAnswers = totalQuestions - correctAnswers;

    // Calculate score percentage
    const score =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    const stats = {
      totalQuestionsAnswered: totalQuestions,
      totalCorrectAnswers: correctAnswers,
      totalIncorrectAnswers: incorrectAnswers,
      questionAnswers: questionAnswers,
    };

    // Find or create user progress
    let userProgress = await Progress.findOne({ userId: userPayload.userId });

    if (!userProgress) {
      userProgress = new Progress({
        userId: userPayload.userId,
        lessonsCompleted: [],
        streak: 0,
        totalTimeSpent: 0,
        scores: [],
        lessonProgress: [],
        achievements: [],
        lastLogin: new Date(),
        weeklyGoal: 5,
        weeklyProgress: 0,
      });
    }

    // Add lesson progress
    await userProgress.addLessonProgress(lessonId, score, timeSpent, stats);

    // Update skill score
    if (lessonType) {
      await userProgress.updateScore(lessonType, score);
    }

    // Update total time spent
    userProgress.totalTimeSpent += timeSpent;
    userProgress.lastLogin = new Date();

    // Update weekly progress if lesson is completed (score >= 70)
    if (score >= 70) {
      userProgress.weeklyProgress += 1;
    }

    await userProgress.save();

    console.dir(questionAnswers, { depth: null });

    // Create or update Lesson Result for detailed tracking
    const lessonResultData = {
      userId: userPayload.userId,
      lessonId: lessonId,
      score: score,
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswers,
      timeSpent: timeSpent * 60, // Convert minutes to seconds
      completedAt: new Date(),
      questionResults: questionAnswers.map((qa) => ({
        questionId: qa.questionId || "",
        question: qa.question,
        userAnswer: qa.userAnswer || "",
        correctAnswer: qa.correctAnswer,
        isCorrect: qa.isCorrect,
        questionType: qa.questionType,
        explanation: qa.explanation,
      })),
      // reset feedback
      feedback: null,
    };

    // Use findOneAndUpdate with upsert to create or update
    await LessonResult.findOneAndUpdate(
      {
        userId: userPayload.userId,
        lessonId: lessonId,
      },
      lessonResultData,
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    const response: LessonProgressSubmitResponse = {
      success: true,
      score,
      questionAnswers,
      progress: {
        lessonId,
        score,
        timeSpent,
        completed: score >= 70,
        stats,
        questionAnswers: questionAnswers,
        totalLessonsCompleted: userProgress.lessonsCompleted.length,
        weeklyProgress: userProgress.weeklyProgress,
        weeklyGoal: userProgress.weeklyGoal,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Submit lesson progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userPayload = getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    const userProgress = await Progress.findOne({ userId: userPayload.userId });

    if (!userProgress) {
      return NextResponse.json({
        progress: null,
      });
    }

    const lessonProgress = userProgress.lessonProgress.find(
      (progress: any) => progress.lessonId.toString() === lessonId
    );

    return NextResponse.json({
      progress: lessonProgress || null,
      questionAnswers: lessonProgress?.stats?.questionAnswers || [],
      totalLessonsCompleted: userProgress.lessonsCompleted.length,
      weeklyProgress: userProgress.weeklyProgress,
      weeklyGoal: userProgress.weeklyGoal,
    });
  } catch (error) {
    console.error("Get lesson progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
