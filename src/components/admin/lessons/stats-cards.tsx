"use client";

import { Card } from "@/components/ui/card";
import { useAdminLessons } from "@/context/admin-lessons-context";
import { BookOpen, Brain, TrendingUp, Users } from "lucide-react";

export default function AdminLessonsStatsCards() {
  const { lessons } = useAdminLessons();

  const totalLessons = lessons.length;
  const totalLearners = lessons.reduce(
    (sum, lesson) => sum + (lesson.completionCount || 0),
    0
  );
  const aiGeneratedCount = lessons.filter((l) => l.createdByAI).length;
  const avgScore =
    lessons.length > 0
      ? Math.round(
          lessons.reduce((sum, l) => sum + (l.averageScore || 0), 0) /
            lessons.length
        )
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total lessons</p>
            <p className="text-2xl font-bold text-blue-600">{totalLessons}</p>
          </div>
          <BookOpen className="h-8 w-8 text-blue-600" />
        </div>
      </Card>

      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Learners</p>
            <p className="text-2xl font-bold text-green-600">{totalLearners}</p>
          </div>
          <Users className="h-8 w-8 text-green-600" />
        </div>
      </Card>

      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">AI Generated</p>
            <p className="text-2xl font-bold text-purple-600">
              {aiGeneratedCount}
            </p>
          </div>
          <Brain className="h-8 w-8 text-purple-600" />
        </div>
      </Card>

      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg. score</p>
            <p className="text-2xl font-bold text-orange-600">{avgScore}%</p>
          </div>
          <TrendingUp className="h-8 w-8 text-orange-600" />
        </div>
      </Card>
    </div>
  );
}
