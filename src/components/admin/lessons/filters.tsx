"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminLessons } from "@/context/admin-lessons-context";
import { Filter, Search } from "lucide-react";

const skills = [
  { value: "vocab", label: "Vocabulary", icon: "📚" },
  { value: "grammar", label: "Grammar", icon: "📝" },
  { value: "listening", label: "Listening", icon: "👂" },
  { value: "speaking", label: "Speaking", icon: "🗣️" },
  { value: "reading", label: "Reading", icon: "📖" },
  { value: "writing", label: "Writing", icon: "✍️" },
];

const difficulties = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const statuses = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export default function AdminLessonsFilters() {
  const {
    searchTerm,
    selectedSkill,
    selectedDifficulty,
    selectedStatus,
    setSearchTerm,
    setSelectedSkill,
    setSelectedDifficulty,
    setSelectedStatus,
  } = useAdminLessons();

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={selectedSkill} onValueChange={setSelectedSkill}>
          <SelectTrigger>
            <SelectValue placeholder="Skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All skills</SelectItem>
            {skills.map((skill) => (
              <SelectItem key={skill.value} value={skill.value}>
                {skill.icon} {skill.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedDifficulty}
          onValueChange={setSelectedDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            {difficulties.map((diff) => (
              <SelectItem key={diff.value} value={diff.value}>
                {diff.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
