"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VocabList } from "@/types/vocab";

export function VocabFilters({
  lists,
  selectedCategory,
  onChangeCategory,
}: {
  lists: VocabList[];
  selectedCategory: string;
  onChangeCategory: (category: string) => void;
}) {
  return (
    <Select
      value={selectedCategory || "all"}
      onValueChange={(v) => onChangeCategory(v === "all" ? "" : v)}>
      <SelectTrigger className="md:w-56">
        <SelectValue placeholder="All categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All categories</SelectItem>
        {lists.map((l) => (
          <SelectItem key={l.slug} value={l.slug}>
            {l.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
