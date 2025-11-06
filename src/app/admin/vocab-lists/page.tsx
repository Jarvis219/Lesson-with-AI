"use client";

import CreateVocabListDialog from "@/components/admin/vocab-lists/CreateVocabListDialog";
import ListsTable from "@/components/admin/vocab-lists/ListsTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                Vocab Lists
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create, search, and manage grouped vocabulary for your lessons.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-9"
                  placeholder="Search lists..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <CreateVocabListDialog
                onCreated={() => fetchListsInternal(1, false)}
              />
            </div>
          </div>

          {/* Quick stats & view */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Total lists</CardDescription>
                <CardTitle className="text-xl">{totalItems}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Total words (shown)</CardDescription>
                <CardTitle className="text-xl">{totalWords}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
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
        </div>
      </div>

      {/* Content card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-medium text-gray-900">Lists</h2>
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-gray-400" />
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-44">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedLists.map((item) => (
                <Card
                  key={item._id}
                  className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg leading-6 line-clamp-1">
                      {item.name}
                    </CardTitle>
                    {item.description && (
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                          {item.vocabularyCount} words
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
