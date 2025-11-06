"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DIFFICULTY_LEVELS } from "@/lib/constants";
import { PARTS_OF_SPEECH } from "@/types/lesson-enums";
import { VocabList } from "@/types/vocab";
import { Controller, FieldValues, UseFormReturn } from "react-hook-form";

export function CreateVocabularyForm({
  form,
  lists,
  onSubmit,
}: {
  form: UseFormReturn<FieldValues>;
  lists: VocabList[];
  onSubmit: () => void;
}) {
  const { control, handleSubmit } = form;
  return (
    <form
      id="vocab-create-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
          Word <span className="text-red-500">*</span>
        </label>
        <Controller
          control={control}
          name="word"
          render={({ field, formState: { errors } }) => (
            <div className="space-y-1.5">
              <Input
                placeholder="Enter word"
                {...field}
                className="h-11 rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.word && (
                <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>•</span>
                  {String(errors.word.message)}
                </div>
              )}
            </div>
          )}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Phonetic (IPA)
        </label>
        <Controller
          control={control}
          name="phonetic"
          render={({ field, formState: { errors } }) => (
            <div className="space-y-1.5">
              <Input
                placeholder="e.g., /əˈkɑːst/"
                {...field}
                className="h-11 rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 font-mono"
              />
              {errors.phonetic && (
                <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>•</span>
                  {String(errors.phonetic.message)}
                </div>
              )}
            </div>
          )}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
            Part of Speech <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="partOfSpeech"
            render={({ field, formState: { errors } }) => (
              <div className="space-y-1.5">
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  onOpenChange={(open) => !open && field.onBlur()}>
                  <SelectTrigger className="h-11 rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20">
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
                  <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <span>•</span>
                    {String(errors.partOfSpeech.message)}
                  </div>
                )}
              </div>
            )}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Difficulty Level
          </label>
          <Controller
            control={control}
            name="level"
            render={({ field, formState: { errors } }) => (
              <div className="space-y-1.5">
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  onOpenChange={(open) => !open && field.onBlur()}>
                  <SelectTrigger className="h-11 rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20">
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
                  <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <span>•</span>
                    {String(errors.level.message)}
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Category</label>
        <Controller
          control={control}
          name="category"
          render={({ field, formState: { errors } }) => (
            <div className="space-y-1.5">
              <Input
                placeholder="e.g., General, Business, Academic"
                {...field}
                className="h-11 rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.category && (
                <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>•</span>
                  {String(errors.category.message)}
                </div>
              )}
            </div>
          )}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
          Definition <span className="text-red-500">*</span>
        </label>
        <Controller
          control={control}
          name="definition"
          render={({ field, formState: { errors } }) => (
            <div className="space-y-1.5">
              <Textarea
                placeholder="Enter the definition of the word"
                {...field}
                rows={3}
                className="rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
              {errors.definition && (
                <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>•</span>
                  {String(errors.definition.message)}
                </div>
              )}
            </div>
          )}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
          Example Sentence <span className="text-red-500">*</span>
        </label>
        <Controller
          control={control}
          name="example"
          render={({ field, formState: { errors } }) => (
            <div className="space-y-1.5">
              <Textarea
                placeholder="Enter an example sentence using this word"
                {...field}
                rows={3}
                className="rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
              {errors.example && (
                <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>•</span>
                  {String(errors.example.message)}
                </div>
              )}
            </div>
          )}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
          Translation (Vietnamese) <span className="text-red-500">*</span>
        </label>
        <Controller
          control={control}
          name="translation"
          render={({ field, formState: { errors } }) => (
            <div className="space-y-1.5">
              <Input
                placeholder="Enter Vietnamese translation"
                {...field}
                className="h-11 rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.translation && (
                <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>•</span>
                  {String(errors.translation.message)}
                </div>
              )}
            </div>
          )}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Synonyms
          </label>
          <Controller
            control={control}
            name="synonyms"
            render={({ field, formState: { errors } }) => (
              <div className="space-y-1.5">
                <Input
                  placeholder="e.g., word1, word2, word3"
                  {...field}
                  className="h-11 rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.synonyms && (
                  <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <span>•</span>
                    {String(errors.synonyms.message)}
                  </div>
                )}
              </div>
            )}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Antonyms
          </label>
          <Controller
            control={control}
            name="antonyms"
            render={({ field, formState: { errors } }) => (
              <div className="space-y-1.5">
                <Input
                  placeholder="e.g., word1, word2, word3"
                  {...field}
                  className="h-11 rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.antonyms && (
                  <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <span>•</span>
                    {String(errors.antonyms.message)}
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Assign to Lists
        </label>
        <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-4 bg-slate-50/50">
          <Controller
            control={control}
            name="lists"
            render={({ field, formState: { errors } }) => (
              <div className="space-y-3">
                {lists.length === 0 ? (
                  <div className="text-sm text-slate-500 text-center py-4">
                    No lists available. Create lists in Vocab Lists section.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lists.map((l) => {
                      const checked = field.value?.includes(l._id);
                      return (
                        <label
                          key={l._id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer group">
                          <Checkbox
                            checked={!!checked}
                            onCheckedChange={(v) => {
                              const next = new Set(field.value || []);
                              if (v) next.add(l._id);
                              else next.delete(l._id);
                              field.onChange(Array.from(next));
                            }}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                            {l.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
                {errors.lists && (
                  <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <span>•</span>
                    {String(errors.lists.message)}
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </form>
  );
}
