import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Lesson from "@/models/Lesson";
import Progress from "@/models/Progress";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

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

    // Get user and progress data
    const user = await User.findById(userPayload.userId);
    const progress = await Progress.findOne({ userId: userPayload.userId });
    const lessons = await Lesson.find({});

    if (!user || !progress) {
      return NextResponse.json({
        suggestions: [],
      });
    }

    // Generate AI suggestions based on user progress and preferences
    const suggestions = await generateAISuggestions(user, progress, lessons);

    return NextResponse.json({
      suggestions,
    });
  } catch (error) {
    console.error("AI suggestions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateAISuggestions(
  user: any,
  progress: any,
  lessons: any[]
): Promise<any[]> {
  const suggestions: any[] = [];
  const userLanguage = user.preferences?.language || "vi";

  // Analyze user's weak skills
  const skillScores = {
    vocab: 0,
    grammar: 0,
    listening: 0,
    speaking: 0,
    reading: 0,
    writing: 0,
  };

  progress.scores.forEach((score: any) => {
    if (skillScores.hasOwnProperty(score.skill)) {
      skillScores[score.skill as keyof typeof skillScores] = score.score;
    }
  });

  // Find weakest skills
  const weakestSkills = Object.entries(skillScores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2)
    .map(([skill]) => skill);

  // Generate suggestions based on different criteria

  // 1. Weak skill improvement suggestions
  if (weakestSkills.length > 0) {
    const skillNames = {
      vocab: "từ vựng",
      grammar: "ngữ pháp",
      listening: "nghe hiểu",
      speaking: "nói",
      reading: "đọc hiểu",
      writing: "viết",
    };

    weakestSkills.forEach((skill) => {
      const skillName = skillNames[skill as keyof typeof skillNames];

      suggestions.push({
        type: "lesson",
        title: `Cải thiện ${skillName}`,
        description:
          userLanguage === "vi"
            ? `Dựa trên tiến trình học tập của bạn, kỹ năng ${skillName} cần được cải thiện. Hãy thử các bài học chuyên về ${skillName} để nâng cao điểm số.`
            : `Based on your learning progress, your ${skill} skills need improvement. Try lessons focused on ${skill} to boost your score.`,
        priority: "high",
        estimatedTime: 15,
        skill: skill,
        reason:
          userLanguage === "vi"
            ? `Điểm ${skillName} hiện tại: ${
                skillScores[skill as keyof typeof skillScores]
              }% - thấp hơn mức trung bình`
            : `Current ${skill} score: ${
                skillScores[skill as keyof typeof skillScores]
              }% - below average`,
      });
    });
  }

  // 2. Streak maintenance suggestions
  if (progress.streak > 0 && progress.streak < 7) {
    suggestions.push({
      type: "practice",
      title:
        userLanguage === "vi"
          ? "Duy trì chuỗi ngày học"
          : "Maintain learning streak",
      description:
        userLanguage === "vi"
          ? `Bạn đang có chuỗi học ${progress.streak} ngày! Hãy tiếp tục học để đạt được thành tích "Kiên trì" (7 ngày liên tiếp).`
          : `You have a ${progress.streak}-day learning streak! Keep going to earn the "Persistent" achievement (7 consecutive days).`,
      priority: "medium",
      estimatedTime: 10,
      reason:
        userLanguage === "vi"
          ? `Chuỗi ngày học hiện tại: ${progress.streak} ngày`
          : `Current streak: ${progress.streak} days`,
    });
  }

  // 3. Weekly goal suggestions
  const weeklyProgressPercentage =
    (progress.weeklyProgress / progress.weeklyGoal) * 100;
  if (weeklyProgressPercentage < 60) {
    suggestions.push({
      type: "lesson",
      title:
        userLanguage === "vi"
          ? "Hoàn thành mục tiêu tuần"
          : "Complete weekly goal",
      description:
        userLanguage === "vi"
          ? `Bạn đã hoàn thành ${progress.weeklyProgress}/${progress.weeklyGoal} bài học tuần này. Hãy cố gắng hoàn thành mục tiêu để nhận thành tích!`
          : `You've completed ${progress.weeklyProgress}/${progress.weeklyGoal} lessons this week. Try to reach your goal for an achievement!`,
      priority: "medium",
      estimatedTime: 20,
      reason:
        userLanguage === "vi"
          ? `Tiến trình tuần: ${Math.round(weeklyProgressPercentage)}%`
          : `Weekly progress: ${Math.round(weeklyProgressPercentage)}%`,
    });
  }

  // 4. Review suggestions for completed lessons
  const completedLessons = progress.lessonProgress.filter(
    (lesson: any) => lesson.completed
  );
  if (completedLessons.length > 0) {
    // Find lessons with low scores that need review
    const lowScoreLessons = completedLessons.filter(
      (lesson: any) => lesson.score < 80
    );

    if (lowScoreLessons.length > 0) {
      suggestions.push({
        type: "review",
        title: userLanguage === "vi" ? "Ôn tập bài học" : "Review lessons",
        description:
          userLanguage === "vi"
            ? `Bạn có ${lowScoreLessons.length} bài học cần ôn tập (điểm < 80%). Việc ôn tập sẽ giúp củng cố kiến thức và cải thiện điểm số.`
            : `You have ${lowScoreLessons.length} lessons that need review (score < 80%). Reviewing will help reinforce knowledge and improve scores.`,
        priority: "medium",
        estimatedTime: 15,
        reason:
          userLanguage === "vi"
            ? `${lowScoreLessons.length} bài học có điểm thấp cần ôn tập`
            : `${lowScoreLessons.length} low-scoring lessons need review`,
      });
    }
  }

  // 5. Advanced lesson suggestions
  if (progress.scores.length > 0) {
    const averageScore =
      progress.scores.reduce((sum: any, score: any) => sum + score.score, 0) /
      progress.scores.length;

    if (averageScore >= 80 && progress.lessonsCompleted.length >= 10) {
      suggestions.push({
        type: "lesson",
        title:
          userLanguage === "vi" ? "Thử thách nâng cao" : "Advanced challenge",
        description:
          userLanguage === "vi"
            ? `Bạn đang học rất tốt! Hãy thử các bài học nâng cao để mở rộng kiến thức và đạt được thành tích cao hơn.`
            : `You're doing great! Try advanced lessons to expand your knowledge and achieve higher achievements.`,
        priority: "low",
        estimatedTime: 25,
        reason:
          userLanguage === "vi"
            ? `Điểm trung bình: ${Math.round(
                averageScore
              )}% - sẵn sàng cho thử thách`
            : `Average score: ${Math.round(
                averageScore
              )}% - ready for challenges`,
      });
    }
  }

  // 6. Time-based suggestions
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 6 && hour < 10) {
    suggestions.push({
      type: "practice",
      title: userLanguage === "vi" ? "Bắt đầu ngày mới" : "Start your day",
      description:
        userLanguage === "vi"
          ? "Buổi sáng là thời điểm tốt để học từ vựng mới. Hãy bắt đầu ngày với một bài học ngắn!"
          : "Morning is a great time to learn new vocabulary. Start your day with a short lesson!",
      priority: "low",
      estimatedTime: 10,
      reason:
        userLanguage === "vi"
          ? "Thời gian học tối ưu: buổi sáng"
          : "Optimal learning time: morning",
    });
  } else if (hour >= 18 && hour < 22) {
    suggestions.push({
      type: "review",
      title: userLanguage === "vi" ? "Ôn tập cuối ngày" : "Evening review",
      description:
        userLanguage === "vi"
          ? "Cuối ngày là thời điểm tốt để ôn tập những gì đã học. Hãy củng cố kiến thức trước khi kết thúc ngày!"
          : "Evening is perfect for reviewing what you've learned. Reinforce your knowledge before ending the day!",
      priority: "low",
      estimatedTime: 15,
      reason:
        userLanguage === "vi"
          ? "Thời gian ôn tập tối ưu: buổi tối"
          : "Optimal review time: evening",
    });
  }

  // Sort suggestions by priority and return top 4
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return suggestions
    .sort(
      (a, b) =>
        priorityOrder[b.priority as keyof typeof priorityOrder] -
        priorityOrder[a.priority as keyof typeof priorityOrder]
    )
    .slice(0, 4);
}
