"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { vocabService } from "@/lib/vocab-service";
import { VocabList } from "@/types/vocab";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface VocabListItem extends VocabList {}

export default function AdminVocabListsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [lists, setLists] = useState<VocabListItem[]>([]);

  const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(200),
    description: z.string().max(1000).optional(),
  });
  type FormValues = z.infer<typeof formSchema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  const filtered = useMemo(() => {
    if (!query) return lists;
    const q = query.toLowerCase();
    return lists.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q)
    );
  }, [lists, query]);

  async function fetchLists() {
    setLoading(true);
    try {
      const data = await vocabService.listVocabLists();
      setLists(data.lists || []);
    } catch (e: any) {
      toast({
        title: "Load failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const onCreate = handleSubmit(async (values) => {
    try {
      const created = await vocabService.createVocabList({
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
      });
      toast({
        title: "Created",
        description: `Created list "${created.name}"`,
      });
      reset();
      fetchLists();
    } catch (e: any) {
      toast({
        title: "Create failed",
        description: e.message,
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Vocab Lists</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form
            onSubmit={onCreate}
            className="space-y-3 bg-white p-4 rounded-md shadow-sm border">
            <h2 className="text-lg font-medium">Create new list</h2>
            <div>
              <label className="text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="name"
                render={({ field, formState: { errors } }) => (
                  <div className="space-y-1">
                    <Input
                      placeholder="List name (e.g., IELTS, TOEIC 600+)"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.name && (
                      <div className="text-xs text-red-500">
                        {errors.name.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Controller
                control={control}
                name="description"
                render={({ field, formState: { errors } }) => (
                  <div className="space-y-1">
                    <Textarea
                      placeholder="Description"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.description && (
                      <div className="text-xs text-red-500">
                        {errors.description.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-md shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">Lists</h2>
              <Input
                className="w-64"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Words</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-gray-600">
                      {item.description || "-"}
                    </TableCell>
                    <TableCell>{item.vocabularyCount || 0}</TableCell>
                    <TableCell className="text-gray-500">{item.slug}</TableCell>
                    <TableCell>
                      {item.isActive ? "Active" : "Inactive"}
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500">
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
