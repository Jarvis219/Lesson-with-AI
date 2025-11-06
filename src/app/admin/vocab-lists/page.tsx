"use client";

import CreateVocabListDialog from "@/components/admin/vocab-lists/CreateVocabListDialog";
import ListsTable from "@/components/admin/vocab-lists/ListsTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { vocabService } from "@/lib/vocab-service";
import { IPagination } from "@/types/pagination";
import { VocabList } from "@/types/vocab";
import { uniqBy } from "lodash-es";
import {
  Calendar,
  FolderPlus,
  LayoutGrid,
  List as ListIcon,
  Search,
  SortAsc,
} from "lucide-react";
import { useEffect, useState } from "react";

interface VocabListItem extends VocabList {}

export default function AdminVocabListsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [lists, setLists] = useState<VocabListItem[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "name-asc" | "name-desc" | "most-words"
  >("newest");

  // form moved into dialog component
  async function fetchListsInternal(targetPage: number, append: boolean) {
    setLoading(true);
    try {
      const data = await vocabService.listVocabLists({
        q: debouncedQuery || undefined,
        page: targetPage,
        limit: 10,
      });
      const listsData = data.lists || [];

      setLists((prev) =>
        append ? uniqBy([...prev, ...listsData], "slug") : listsData
      );
      setPage(targetPage);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLists([]);
    fetchListsInternal(1, false);
  }, [debouncedQuery]);

  async function handleLoadMore() {
    if (loading || !pagination?.hasNextPage) return;
    const next = page + 1;
    await fetchListsInternal(next, true);
  }

  const sortedLists = [...lists].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "most-words":
        return (b.vocabularyCount || 0) - (a.vocabularyCount || 0);
      default:
        return 0;
    }
  });
  const totalShown = sortedLists.length;
  const totalItems = pagination?.total ?? totalShown;
  const totalWords = sortedLists.reduce(
    (sum, item) => sum + (item.vocabularyCount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-100">
            <FolderPlus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Vocab Lists
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Create, search, and manage grouped vocabulary for your lessons.
            </p>
          </div>
        </div>
        <CreateVocabListDialog onCreated={() => fetchListsInternal(1, false)} />
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="group relative overflow-hidden border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
          <CardHeader className="p-6">
            <CardDescription>Total lists</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {totalItems}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="group relative overflow-hidden border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
          <CardHeader className="p-6">
            <CardDescription>Total words (shown)</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              {totalWords}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="group relative overflow-hidden border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <CardHeader className="p-6">
            <CardDescription>View</CardDescription>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="gap-2">
                <ListIcon className="h-4 w-4" /> Table
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-2">
                <LayoutGrid className="h-4 w-4" /> Grid
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Content card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm">
        {/* Sticky toolbar */}
        <div className="rounded-t-2xl border-b bg-white/80 backdrop-blur px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-medium text-slate-900">Lists</h2>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  className="pl-9 h-10 rounded-xl"
                  placeholder="Search lists..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-slate-400" />
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                  <SelectTrigger className="w-44 h-10 rounded-xl">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="most-words">Most words</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          {!loading && sortedLists.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="mx-auto mb-3 rounded-full bg-gray-100 p-3">
                <LayoutGrid className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-base font-medium text-gray-900">
                No lists found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or create a new list.
              </p>
              <div className="mt-4">
                <CreateVocabListDialog
                  onCreated={() => fetchListsInternal(1, false)}
                />
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <InfiniteScroll
              onLoadMore={handleLoadMore}
              hasMore={!!pagination?.hasNextPage}
              isLoading={loading}
              endMessage={
                <span className="block p-4 text-center text-sm text-gray-500">
                  No more results
                </span>
              }>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedLists.map((item) => (
                  <Card
                    key={item._id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80" />
                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20">
                          <LayoutGrid className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="mt-0.5 text-sm text-slate-600 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {item.vocabularyCount} words
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </InfiniteScroll>
          ) : (
            <InfiniteScroll
              onLoadMore={handleLoadMore}
              hasMore={!!pagination?.hasNextPage}
              isLoading={loading}
              endMessage={
                <span className="block p-4 text-center text-sm text-gray-500">
                  No more results
                </span>
              }>
              <ListsTable items={sortedLists} loading={loading} />
            </InfiniteScroll>
          )}

          {loading && lists.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-lg border border-gray-200 bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
