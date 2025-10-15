"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminLessons } from "@/context/admin-lessons-context";
import { BookOpen, Edit, Eye, Trash2, TrendingUp, Users } from "lucide-react";

export default function AdminLessonsTable() {
  const {
    lessons,
    loading,
    setPreviewLesson,
    setEditingLesson,
    setDeletingLesson,
  } = useAdminLessons();

  const getSkillInfo = (skill: string) => {
    const skills = [
      { value: "vocab", label: "Vocabulary", icon: "📚" },
      { value: "grammar", label: "Grammar", icon: "📝" },
      { value: "listening", label: "Listening", icon: "👂" },
      { value: "speaking", label: "Speaking", icon: "🗣️" },
      { value: "reading", label: "Reading", icon: "📖" },
      { value: "writing", label: "Writing", icon: "✍️" },
    ];
    return (
      skills.find((s) => s.value === skill) || {
        value: skill,
        label: skill,
        icon: "📚",
      }
    );
  };

  const getDifficultyInfo = (difficulty: string) => {
    const difficulties = [
      {
        value: "beginner",
        label: "Beginner",
        color: "bg-green-100 text-green-700",
      },
      {
        value: "intermediate",
        label: "Intermediate",
        color: "bg-yellow-100 text-yellow-700",
      },
      {
        value: "advanced",
        label: "Advanced",
        color: "bg-red-100 text-red-700",
      },
    ];
    return (
      difficulties.find((d) => d.value === difficulty) || {
        value: difficulty,
        label: difficulty,
        color: "bg-gray-100 text-gray-700",
      }
    );
  };

  const getStatusInfo = (status: string) => {
    const statuses = [
      {
        value: "published",
        label: "Published",
        color: "bg-green-100 text-green-700",
      },
      {
        value: "draft",
        label: "Draft",
        color: "bg-yellow-100 text-yellow-700",
      },
      {
        value: "archived",
        label: "Archived",
        color: "bg-gray-100 text-gray-700",
      },
    ];
    return (
      statuses.find((s) => s.value === status) || {
        value: status,
        label: status,
        color: "bg-gray-100 text-gray-700",
      }
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[300px]">Lesson</TableHead>
              <TableHead className="min-w-[120px] hidden sm:table-cell">
                Skill
              </TableHead>
              <TableHead className="min-w-[120px] hidden md:table-cell">
                Difficulty
              </TableHead>
              <TableHead className="min-w-[120px] hidden lg:table-cell">
                Stats
              </TableHead>
              <TableHead className="min-w-[120px] hidden md:table-cell">
                Status
              </TableHead>
              <TableHead className="min-w-[120px] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="animate-pulse h-6 bg-gray-200 rounded w-16"></div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="animate-pulse h-6 bg-gray-200 rounded w-12"></div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-20"></div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="animate-pulse h-6 bg-gray-200 rounded w-16"></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-20 ml-auto"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : lessons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 sm:py-12">
                  <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    No lessons found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 px-4">
                    Try adjusting filters or create a new lesson
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              lessons.map((lesson) => {
                const skillInfo = getSkillInfo(lesson.type);
                const difficultyInfo = getDifficultyInfo(lesson.difficulty);
                const statusInfo = getStatusInfo("published");

                return (
                  <TableRow key={lesson._id}>
                    <TableCell>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                              {lesson.title}
                            </h3>
                            {lesson?.createdByAI && (
                              <Badge className="bg-purple-100 text-nowrap text-purple-700 border-0 text-xs">
                                🤖 AI
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {lesson.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <p className="text-xs text-gray-500">
                              {lesson.content?.exercises.length} questions
                            </p>
                            <p className="text-xs text-gray-500">
                              {lesson.estimatedTime} mins
                            </p>
                            {/* Show skill and difficulty badges on mobile */}
                            <div className="flex gap-1 sm:hidden">
                              <Badge
                                className={`${skillInfo.icon} bg-blue-100 text-blue-700 border-0 text-xs`}>
                                {skillInfo.label}
                              </Badge>
                              <Badge
                                className={`${difficultyInfo.color} border-0 text-xs`}>
                                {difficultyInfo.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        className={`${skillInfo.icon} bg-blue-100 text-blue-700 border-0`}>
                        {skillInfo.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Badge className={`${difficultyInfo.color} border-0`}>
                        {difficultyInfo.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="h-3 w-3" />
                          <span>{lesson.completionCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <TrendingUp className="h-3 w-3" />
                          <span>{lesson.averageScore}%</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Badge className={`${statusInfo.color} border-0`}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewLesson(lesson)}
                          className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingLesson(lesson)}
                          className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingLesson(lesson)}
                          className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
