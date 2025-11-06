"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VocabList } from "@/types/vocab";

export function VocabFilters({
  lists,
  selectedList,
  onChangeList,
}: {
  lists: VocabList[];
  selectedList: string;
  onChangeList: (listId: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <Select
        value={selectedList || "all"}
        onValueChange={(v) => onChangeList(v === "all" ? "" : v)}>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="All lists" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All lists</SelectItem>
          {lists.map((l) => (
            <SelectItem key={l._id} value={l._id}>
              {l.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


