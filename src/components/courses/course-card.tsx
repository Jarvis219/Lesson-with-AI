"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DifficultyLevel } from "@/types";
import { Course } from "@/types/teacher";
import { BookOpen, GraduationCap, Star, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import { getLevelColor, getLevelIcon } from "utils/lesson.util";

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  onEnroll?: (courseId: string) => void;
  onView?: (courseId: string) => void;
}

export default function CourseCard({
  course,
  isEnrolled = false,
  onEnroll,
  onView,
}: CourseCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:-translate-y-2 max-w-md">
      {/* Course Thumbnail */}
      <div className="relative h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <GraduationCap className="h-24 w-24 text-white opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500" />
          </div>
        )}

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        {/* Level Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge
            className={`${getLevelColor(
              course.level as DifficultyLevel
            )} shadow-xl border-0 px-4 py-1.5 font-bold capitalize text-xs flex items-center gap-1.5 backdrop-blur-sm`}>
            <span className="text-sm">
              {getLevelIcon(course.level as DifficultyLevel)}
            </span>
            {course.level}
          </Badge>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge
            variant="secondary"
            className="bg-white/95 backdrop-blur-md text-gray-800 border-0 px-4 py-1.5 font-semibold shadow-lg hover:bg-white transition-colors">
            {course.category}
          </Badge>
        </div>

        {/* Popularity Indicator */}
        {course.enrolledStudents && course.enrolledStudents.length > 50 && (
          <div className="absolute bottom-4 left-4 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1 font-semibold shadow-lg flex items-center gap-1">
              <Star className="h-3 w-3 fill-white" />
              Popular
            </Badge>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute -inset-10 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 bg-gradient-to-b from-white to-gray-50/50">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-5 line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100 transition-all duration-300">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Lessons</p>
              <p className="text-sm font-bold text-gray-900">
                {course.lessons?.length || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 group-hover:from-purple-100 group-hover:to-pink-100 transition-all duration-300">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Students</p>
              <p className="text-sm font-bold text-gray-900">
                {course.enrolledStudents?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Teacher Info */}
        <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 group-hover:border-blue-200 group-hover:bg-white/80 transition-all duration-300">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {course.teacher?.name?.charAt(0) || "T"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
              Instructor
            </p>
            <p className="text-sm font-bold text-gray-900 truncate">
              {course.teacher?.name || "Unknown"}
            </p>
          </div>
          {course.enrolledStudents && course.enrolledStudents.length > 100 && (
            <div className="flex items-center gap-1 text-xs text-orange-600 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" />
              Hot
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isEnrolled ? (
            <Button
              className="flex-1 h-11 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold group/btn"
              onClick={() => onView?.(course._id)}
              variant="default">
              <BookOpen className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
              View Course
            </Button>
          ) : (
            <Button
              className="flex-1 h-11 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:via-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold group/btn"
              onClick={() => onEnroll?.(course._id)}
              variant="default">
              <GraduationCap className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
              Enroll Now
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
