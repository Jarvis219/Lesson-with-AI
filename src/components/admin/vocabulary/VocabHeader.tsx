"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

export function VocabHeader({
  q,
  onChangeQuery,
  onFilter,
}: {
  q: string;
  onChangeQuery: (v: string) => void;
  onFilter: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
          Vocabulary
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create, manage and search vocabulary across lists.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search word..."
            value={q}
            onChange={(e) => onChangeQuery(e.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={onFilter} className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>
    </div>
  );
}
