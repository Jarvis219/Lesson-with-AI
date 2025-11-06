"use client";

import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { VocabularyItem } from "@/types/vocab";
import { BookOpen, Sparkles } from "lucide-react";
import { VocabCard } from "./VocabCard";

interface VocabCardGridProps {
  items: VocabularyItem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  total?: number;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onLoadMore: () => void;
}

export function VocabCardGrid({
  items,
  loading,
  loadingMore,
  hasMore,
  total,
  expandedId,
  onToggleExpand,
  onLoadMore,
}: VocabCardGridProps) {
  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
          <BookOpen className="h-10 w-10 text-slate-400" />
        </div>
        <p className="text-lg font-medium text-slate-600 mb-1">
          No vocabulary found
        </p>
        <p className="text-sm text-slate-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={loadingMore}
      endMessage={
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-slate-500">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">
              You're all caught up! ({total ?? 0} words total)
            </span>
          </div>
        </div>
      }>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((item) => (
          <VocabCard
            key={item._id}
            item={item}
            expandedId={expandedId}
            onToggleExpand={onToggleExpand}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}
