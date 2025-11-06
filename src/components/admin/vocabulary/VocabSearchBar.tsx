"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface VocabSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export function VocabSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search words or definitions...",
}: VocabSearchBarProps) {
  return (
    <div className="mb-6">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
        <Input
          className="pl-12 h-12 text-[15px] rounded-xl border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
        />
      </div>
    </div>
  );
}
