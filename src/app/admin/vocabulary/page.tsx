"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { DIFFICULTY_LEVELS } from "@/lib/constants";
import { vocabService } from "@/lib/vocab-service";
import { PartOfSpeech, PARTS_OF_SPEECH } from "@/types/lesson-enums";
import { VocabList, VocabularyItem } from "@/types/vocab";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface VocabListItem extends VocabList {}

interface VocabItem extends VocabularyItem {}

export default function AdminVocabularyPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<VocabListItem[]>([]);
  const [selectedList, setSelectedList] = useState<string>("");
  const [items, setItems] = useState<VocabItem[]>([]);
  const [q, setQ] = useState("");

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

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
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

  async function loadLists() {
    try {
      const data = await vocabService.listVocabLists();
      setLists(data.lists || []);
    } catch (e: any) {
      toast({
        title: "Load lists failed",
        description: e.message,
        variant: "destructive",
      });
    }
  }

  async function loadVocab() {
    setLoading(true);
    try {
      const data = await vocabService.listVocabulary({
        q,
        listId: selectedList,
      });
      setItems(data.vocabulary || []);
    } catch (e: any) {
      toast({
        title: "Load vocab failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const onCreate = handleSubmit(async (values) => {
    try {
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
    } catch (e: any) {
      toast({
        title: "Create failed",
        description: e.message,
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    loadVocab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedList]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Vocabulary</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form
            onSubmit={onCreate}
            className="space-y-3 bg-white p-4 rounded-md shadow-sm border">
            <h2 className="text-lg font-medium">Create new word</h2>
            <div>
              <label className="text-sm font-medium">
                Word <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="word"
                render={({ field, formState: { errors } }) => (
                  <div className="space-y-1">
                    <Input
                      placeholder="Word"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.word && (
                      <div className="text-xs text-red-500">
                        {errors.word.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phonetic (IPA)</label>
              <Controller
                control={control}
                name="phonetic"
                render={({ field, formState: { errors } }) => (
                  <div className="space-y-1">
                    <Input
                      placeholder="Phonetic (IPA)"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.phonetic && (
                      <div className="text-xs text-red-500">
                        {errors.phonetic.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  Part of speech <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="partOfSpeech"
                  render={({ field, formState: { errors } }) => (
                    <div className="space-y-1">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        onOpenChange={(open) => !open && field.onBlur()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select part of speech" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PARTS_OF_SPEECH).map((pos) => (
                            <SelectItem key={pos} value={pos}>
                              {pos.charAt(0).toUpperCase() + pos.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.partOfSpeech && (
                        <div className="text-xs text-red-500">
                          {errors.partOfSpeech.message}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Level</label>
                <Controller
                  control={control}
                  name="level"
                  render={({ field, formState: { errors } }) => (
                    <div className="space-y-1">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        onOpenChange={(open) => !open && field.onBlur()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(DIFFICULTY_LEVELS).map((level) => (
                            <SelectItem key={level} value={level}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.level && (
                        <div className="text-xs text-red-500">
                          {errors.level.message}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Controller
                control={control}
                name="category"
                render={({ field, formState: { errors } }) => (
                  <div className="space-y-1">
                    <Input
                      placeholder="Category"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.category && (
                      <div className="text-xs text-red-500">
                        {errors.category.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Definition <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="definition"
                render={({ field, formState: { errors } }) => (
                  <div className="space-y-1">
                    <Textarea
                      placeholder="Definition"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.definition && (
                      <div className="text-xs text-red-500">
                        {errors.definition.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Example sentence <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="example"
                render={({ field, formState: { errors } }) => (
                  <div className="space-y-1">
                    <Textarea
                      placeholder="Example sentence"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.example && (
                      <div className="text-xs text-red-500">
                        {errors.example.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Translation (vi) <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="translation"
                render={({ field, formState: { errors } }) => (
                  <div className="space-y-1">
                    <Input
                      placeholder="Translation (vi)"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.translation && (
                      <div className="text-xs text-red-500">
                        {errors.translation.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Synonyms (comma separated)
              </label>
              <Controller
                control={control}
                name="synonyms"
                render={({ field, formState: { errors } }) => (
                  <div className="space-y-1">
                    <Input
                      placeholder="Synonyms (comma separated)"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.synonyms && (
                      <div className="text-xs text-red-500">
                        {errors.synonyms.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Antonyms (comma separated)
              </label>
              <Controller
                control={control}
                name="antonyms"
                render={({ field, formState: { errors } }) => (
                  <div className="space-y-1">
                    <Input
                      placeholder="Antonyms (comma separated)"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.antonyms && (
                      <div className="text-xs text-red-500">
                        {errors.antonyms.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Assign to lists</div>
              <div className="max-h-40 overflow-auto border rounded-md p-2 space-y-2">
                <Controller
                  control={control}
                  name="lists"
                  render={({ field, formState: { errors } }) => (
                    <div className="space-y-1">
                      {lists.map((l) => {
                        const checked = field.value?.includes(l._id);
                        return (
                          <label
                            key={l._id}
                            className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={!!checked}
                              onCheckedChange={(v) => {
                                const next = new Set(field.value || []);
                                if (v) next.add(l._id);
                                else next.delete(l._id);
                                field.onChange(Array.from(next));
                              }}
                            />
                            {l.name}
                          </label>
                        );
                      })}
                      {errors.lists && (
                        <div className="text-xs text-red-500">
                          {errors.lists.message}
                        </div>
                      )}
                    </div>
                  )}
                />
                {lists.length === 0 && (
                  <div className="text-xs text-gray-500">
                    No lists yet. Create in Vocab Lists
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-md shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <Input
                className="w-64"
                placeholder="Search word"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Button variant="secondary" onClick={loadVocab}>
                Filter
              </Button>
              <select
                className="ml-auto border rounded-md px-2 py-1 text-sm"
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}>
                <option value="">All lists</option>
                {lists.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Word</TableHead>
                  <TableHead>POS</TableHead>
                  <TableHead>Definition</TableHead>
                  <TableHead>Translation</TableHead>
                  <TableHead>Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it) => (
                  <TableRow key={it._id}>
                    <TableCell className="font-medium">{it.word}</TableCell>
                    <TableCell className="text-gray-600">
                      {it.partOfSpeech}
                    </TableCell>
                    <TableCell className="max-w-[360px] truncate">
                      {it.definition}
                    </TableCell>
                    <TableCell>{it.translation}</TableCell>
                    <TableCell>{it.level}</TableCell>
                  </TableRow>
                ))}
                {!loading && items.length === 0 && (
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
