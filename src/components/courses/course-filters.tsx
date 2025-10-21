"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { difficulties, skills } from "@/constant/lesson.constant";
import { Search } from "lucide-react";

interface CourseFiltersProps {
  search: string;
  skill: string;
  level: string;
  onSearchChange: (value: string) => void;
  onSkillChange: (value: string) => void;
  onLevelChange: (value: string) => void;
}

export default function CourseFilters({
  search,
  skill,
  level,
  onSearchChange,
  onSkillChange,
  onLevelChange,
}: CourseFiltersProps) {
  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
        </div>

        {/* Category Filter */}
        <Select value={skill} onValueChange={onSkillChange}>
          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {skills.map(({ value, icon, label }) => (
              <SelectItem key={value} value={value}>
                {icon} {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Level Filter */}
        <Select value={level} onValueChange={onLevelChange}>
          <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {difficulties.map(({ value, label, icon }) => (
              <SelectItem key={value} value={value}>
                {icon} {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
