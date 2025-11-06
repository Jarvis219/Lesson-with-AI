"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function VocabStats({
  totalWords,
  currentListName,
  sortBy,
  onSortChange,
}: {
  totalWords: number;
  currentListName: string;
  sortBy: "newest" | "oldest" | "word-asc" | "word-desc" | "level";
  onSortChange: (v: "newest" | "oldest" | "word-asc" | "word-desc" | "level") => void;
}) {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Card>
        <CardHeader className="p-4">
          <CardDescription>Total words</CardDescription>
          <CardTitle className="text-xl">{totalWords}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="p-4">
          <CardDescription>Current list</CardDescription>
          <CardTitle className="text-base">{currentListName}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="p-4">
          <CardDescription>Sort</CardDescription>
          <Select value={sortBy} onValueChange={(v) => onSortChange(v as typeof sortBy)}>
            <SelectTrigger className="h-9 w-48">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="word-asc">Word (A-Z)</SelectItem>
              <SelectItem value="word-desc">Word (Z-A)</SelectItem>
              <SelectItem value="level">Level</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
      </Card>
    </div>
  );
}


