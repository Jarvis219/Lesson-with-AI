"use client";

import {
  Award,
  BookOpen,
  Clock,
  Crown,
  Medal,
  Shield,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

interface AchievementBadgesProps {
  achievements: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  category: "streak" | "lessons" | "score" | "time" | "special";
}

const allAchievements: Achievement[] = [
  {
    id: "first_lesson",
    name: "Bước đầu",
    description: "Hoàn thành bài học đầu tiên",
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    category: "lessons",
  },
  {
    id: "streak_3",
    name: "Khởi động",
    description: "Học liên tiếp 3 ngày",
    icon: <Zap className="h-4 w-4" />,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    category: "streak",
  },
  {
    id: "streak_7",
    name: "Kiên trì",
    description: "Học liên tiếp 7 ngày",
    icon: <Target className="h-4 w-4" />,
    color: "text-green-600",
    bgColor: "bg-green-100",
    category: "streak",
  },
  {
    id: "streak_30",
    name: "Bất bại",
    description: "Học liên tiếp 30 ngày",
    icon: <Crown className="h-4 w-4" />,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    category: "streak",
  },
  {
    id: "lessons_10",
    name: "Học viên",
    description: "Hoàn thành 10 bài học",
    icon: <Star className="h-4 w-4" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    category: "lessons",
  },
  {
    id: "lessons_50",
    name: "Chuyên gia",
    description: "Hoàn thành 50 bài học",
    icon: <Trophy className="h-4 w-4" />,
    color: "text-red-600",
    bgColor: "bg-red-100",
    category: "lessons",
  },
  {
    id: "perfect_score",
    name: "Hoàn hảo",
    description: "Đạt điểm tối đa trong một bài học",
    icon: <Award className="h-4 w-4" />,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    category: "score",
  },
  {
    id: "time_master",
    name: "Thạc sĩ thời gian",
    description: "Học tổng cộng 100 giờ",
    icon: <Clock className="h-4 w-4" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    category: "time",
  },
  {
    id: "weekly_champion",
    name: "Vô địch tuần",
    description: "Hoàn thành mục tiêu tuần 4 tuần liên tiếp",
    icon: <Medal className="h-4 w-4" />,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    category: "special",
  },
  {
    id: "skill_master",
    name: "Bậc thầy kỹ năng",
    description: "Đạt 80 điểm ở tất cả kỹ năng",
    icon: <Shield className="h-4 w-4" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    category: "score",
  },
];

export default function AchievementBadges({
  achievements,
}: AchievementBadgesProps) {
  const earnedAchievements = allAchievements.filter((achievement) =>
    achievements.includes(achievement.id)
  );

  const unearnedAchievements = allAchievements.filter(
    (achievement) => !achievements.includes(achievement.id)
  );

  const getProgressPercentage = (category: string) => {
    const categoryAchievements = allAchievements.filter(
      (a) => a.category === category
    );
    const earnedInCategory = earnedAchievements.filter(
      (a) => a.category === category
    );
    return Math.round(
      (earnedInCategory.length / categoryAchievements.length) * 100
    );
  };

  const categories = [
    { key: "streak", name: "Chuỗi ngày học", color: "bg-orange-500" },
    { key: "lessons", name: "Bài học", color: "bg-blue-500" },
    { key: "score", name: "Điểm số", color: "bg-green-500" },
    { key: "time", name: "Thời gian", color: "bg-purple-500" },
    { key: "special", name: "Đặc biệt", color: "bg-pink-500" },
  ];

  return (
    <div className="space-y-4">
      {/* Achievement Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {earnedAchievements.length}
          </div>
          <div className="text-xs text-blue-600">Đã đạt được</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {allAchievements.length - earnedAchievements.length}
          </div>
          <div className="text-xs text-gray-600">Còn lại</div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 text-sm">
          Tiến trình theo danh mục
        </h4>
        {categories.map((category) => (
          <div key={category.key} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">{category.name}</span>
              <span className="text-gray-500">
                {getProgressPercentage(category.key)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${category.color}`}
                style={{
                  width: `${getProgressPercentage(category.key)}%`,
                }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 text-sm mb-3">
            Thành tích đã đạt được
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {earnedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-2 rounded-lg border-2 border-yellow-200 ${achievement.bgColor}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={achievement.color}>{achievement.icon}</div>
                  <span className="text-xs font-medium text-gray-900">
                    {achievement.name}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Achievements */}
      {unearnedAchievements.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 text-sm mb-3">
            Thành tích tiếp theo
          </h4>
          <div className="space-y-2">
            {unearnedAchievements.slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className="p-2 rounded-lg border border-gray-200 bg-gray-50 opacity-75">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-gray-400">{achievement.icon}</div>
                  <span className="text-xs font-medium text-gray-500">
                    {achievement.name}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {earnedAchievements.length === 0 && (
        <div className="text-center py-6">
          <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm mb-1">Chưa có thành tích nào</p>
          <p className="text-xs text-gray-400">
            Bắt đầu học để kiếm thành tích đầu tiên!
          </p>
        </div>
      )}
    </div>
  );
}
