"use client";

import { VocabCardGrid } from "@/components/admin/vocabulary/VocabCardGrid";
import { VocabCreateDialog } from "@/components/admin/vocabulary/VocabCreateDialog";
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
import { PartOfSpeech, PARTS_OF_SPEECH } from "@/types/lesson-enums";
import { IPagination } from "@/types/pagination";
import { VocabList, VocabularyItem } from "@/types/vocab";
import { zodResolver } from "@hookform/resolvers/zod";
import { uniqBy } from "lodash-es";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// form state with RHF + zod
const formSchema = z.object({
  word: z.string().min(1, "Word is required").max(100),
  phonetic: z.string().max(100).optional(),
  partOfSpeech: z.enum(
    Object.values(PARTS_OF_SPEECH) as [string, ...string[]],
    {
      errorMap: () => ({ message: "Invalid part of speech" }),
    }
  ),
  definition: z
    .string({
      message: "Definition is required",
    })
    .min(1, "Definition is required")
    .max(2000),
  example: z
    .string({
      message: "Example sentence is required",
    })
    .min(1, "Example sentence is required")
    .max(1000),
  translation: z.string().min(1, "Translation is required").max(500),
  synonyms: z.string().optional(),
  antonyms: z.string().optional(),
  level: z.enum(Object.values(DIFFICULTY_LEVELS) as [string, ...string[]], {
    errorMap: () => ({ message: "Invalid level" }),
  }),
  category: z.string().default("General"),
  lists: z.array(z.string()).default([]),
});
type FormValues = z.infer<typeof formSchema>;

interface VocabListItem extends VocabList {}

interface VocabItem extends VocabularyItem {}

export default function AdminVocabularyPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lists, setLists] = useState<VocabListItem[]>([]);
  const [category, setCategory] = useState<string>("");
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: "",
      phonetic: "",
      partOfSpeech: PARTS_OF_SPEECH[0],
      definition: "",
      example: "",
      translation: "",
      synonyms: "",
      antonyms: "",
      level: DIFFICULTY_LEVELS.EASY,
      category: "General",
      lists: [],
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  async function loadLists() {
    const data = await vocabService.listVocabLists({ limit: 100 });
    setLists(data.lists);
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
        q: debouncedQ,
        category,
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
        title: "Load vocab failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const onCreate = handleSubmit(async (values) => {
    const created = await vocabService.createVocabulary({
      word: values.word,
      phonetic: values.phonetic,
      part_of_speech: values.partOfSpeech as PartOfSpeech,
      definition: values.definition,
      example: values.example,
      translation: values.translation,
      synonyms: values.synonyms,
      antonyms: values.antonyms,
      level: values.level,
      category: values.category,
      lists: values.lists,
    });
    toast({
      title: "Created",
      description: `Created word "${created.word}"`,
    });
    reset();
    loadVocab();
  });

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    loadVocab(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sortBy, debouncedQ]);

  function loadMoreServer() {
    if (pagination?.hasNextPage && !loadingMore) {
      loadVocab(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Top header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-100">
            <BookOpen className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-white"></div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Vocabulary
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Master English words effortlessly
            </p>
          </div>
        </div>
        <VocabCreateDialog
          form={form as any}
          lists={lists}
          onSubmit={onCreate}
          isSubmitting={isSubmitting}
          triggerLabel="Add Word"
        />
      </div>

      {/* Stat cards */}
      <VocabStatsCards
        total={pagination?.total ?? items.length}
        selectedList={category}
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
        <VocabFilters
          lists={lists}
          selectedList={category}
          onChangeList={setCategory}
        />
        <div className="flex items-center gap-3">
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
