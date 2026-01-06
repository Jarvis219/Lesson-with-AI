"use client";

import { VocabCardGrid } from "@/components/admin/vocabulary/VocabCardGrid";
import { VocabFilters } from "@/components/admin/vocabulary/VocabFilters";
import { VocabSearchBar } from "@/components/admin/vocabulary/VocabSearchBar";
import { VocabStatsCards } from "@/components/admin/vocabulary/VocabStatsCards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { DIFFICULTY_LEVELS } from "@/lib/constants";
import { vocabService } from "@/lib/vocab-service";
import { IPagination } from "@/types/pagination";
import { VocabList, VocabularyItem } from "@/types/vocab";
import { uniqBy } from "lodash-es";
import { BookMarked } from "lucide-react";
import { useEffect, useState } from "react";

interface VocabListItem extends VocabList {}

interface VocabItem extends VocabularyItem {}

export default function StudentVocabularyPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lists, setLists] = useState<VocabListItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [items, setItems] = useState<VocabItem[]>([]);
  const [q, setQ] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "word-asc" | "word-desc" | "level"
  >("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const debouncedQ = useDebounce(q, 500);

  async function loadLists() {
    try {
      const data = await vocabService.listVocabLists({
        active: true,
        limit: 100,
      });
      setLists(data.lists);
    } catch (error) {
      console.error("Failed to load vocab lists:", error);
    }
  }

  async function loadVocab(resetPage = true) {
    if (resetPage) {
      setLoading(true);
      setCurrentPage(1);
    } else {
      setLoadingMore(true);
    }

    try {
      const pageToLoad = resetPage ? 1 : currentPage + 1;
      const data = await vocabService.listVocabulary({
        q: debouncedQ || undefined,
        category: selectedCategory || undefined,
        level: selectedLevel || undefined,
        page: pageToLoad,
        limit: pageSize,
      });

      const fetched = data.vocabulary || [];

      // Client-side sort (since API doesn't support sort yet)
      const sorted = [...fetched].sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "word-asc":
            return a.word.localeCompare(b.word);
          case "word-desc":
            return b.word.localeCompare(a.word);
          case "level":
            return (a.level || "").localeCompare(b.level || "");
          default:
            return 0;
        }
      });

      if (resetPage) {
        setItems(sorted);
      } else {
        setItems((prev) => uniqBy([...prev, ...sorted], "_id"));
      }

      if (data.pagination) {
        setPagination(data.pagination);
        setCurrentPage(pageToLoad);
      }
    } catch (e) {
      toast({
        title: "Failed to load vocabulary",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    loadVocab(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedLevel, sortBy, debouncedQ]);

  function loadMoreServer() {
    if (pagination?.hasNextPage && !loadingMore) {
      loadVocab(false);
    }
  }

  const levelOptions = Object.values(DIFFICULTY_LEVELS).map((level) => ({
    value: level,
    label: level.charAt(0).toUpperCase() + level.slice(1),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Top header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-100">
            <BookMarked className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-white"></div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Vocabulary
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Browse and learn vocabulary words
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <VocabStatsCards
        total={pagination?.total ?? items.length}
        selectedList={selectedCategory}
        lists={lists}
        items={items}
      />

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        {/* Search */}
        <VocabSearchBar
          value={q}
          onChange={setQ}
          onSearch={() => loadVocab(true)}
        />
        {/* Vocab List Filter */}
        <VocabFilters
          lists={lists}
          selectedCategory={selectedCategory}
          onChangeCategory={setSelectedCategory}
        />
        {/* Level Filter */}
        <Select
          value={selectedLevel || "all"}
          onValueChange={(v) => setSelectedLevel(v === "all" ? "" : v)}>
          <SelectTrigger className="md:w-44 h-11 rounded-xl border-slate-200/80 bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            {levelOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Sort */}
        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="md:w-44 h-11 rounded-xl border-slate-200/80 bg-white/80 backdrop-blur-sm">
            <SelectValue placeholder="Sort: newest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Sort: newest</SelectItem>
            <SelectItem value="oldest">Sort: oldest</SelectItem>
            <SelectItem value="word-asc">Word (A-Z)</SelectItem>
            <SelectItem value="word-desc">Word (Z-A)</SelectItem>
            <SelectItem value="level">Level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards with infinite scroll */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-lg p-6">
        <VocabCardGrid
          items={items}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={pagination?.hasNextPage ?? false}
          total={pagination?.total}
          expandedId={expandedId}
          onToggleExpand={(id) =>
            setExpandedId((prev) => (prev === id ? null : id))
          }
          onLoadMore={loadMoreServer}
        />
      </div>
    </div>
  );
}
