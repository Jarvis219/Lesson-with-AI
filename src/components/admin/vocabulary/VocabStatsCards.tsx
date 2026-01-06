"use client";

import { VocabList, VocabularyItem } from "@/types/vocab";
import { BookOpen, CalendarDays, TrendingUp } from "lucide-react";

interface VocabStatsCardsProps {
  total: number;
  selectedList: string;
  lists: VocabList[];
  items: VocabularyItem[];
}

export function VocabStatsCards({
  total,
  selectedList,
  lists,
  items,
}: VocabStatsCardsProps) {
  const thisWeekCount = items.filter((it) => {
    const created = new Date(it.createdAt as any);
    const now = new Date();
    const weekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );
    return created >= weekAgo;
  }).length;

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div className="relative p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Total Words
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {total}
            </p>
          </div>
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BookOpen className="h-7 w-7" />
          </div>
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div className="relative p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Current List
            </p>
            <p className="text-lg font-semibold text-slate-900 line-clamp-1">
              {selectedList
                ? lists.find(
                    (l) => l._id === selectedList || l.slug === selectedList
                  )?.name || "List"
                : "All lists"}
            </p>
          </div>
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
            <CalendarDays className="h-7 w-7" />
          </div>
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div className="relative p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">This Week</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              {thisWeekCount}
            </p>
          </div>
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <TrendingUp className="h-7 w-7" />
          </div>
        </div>
      </div>
    </div>
  );
}
