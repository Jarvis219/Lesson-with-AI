"use client";

import { CreateVocabularyForm } from "@/components/admin/vocabulary/CreateVocabularyForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VocabList } from "@/types/vocab";
import { Plus } from "lucide-react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export function VocabCreateDialog<Values>({
  form,
  lists,
  onSubmit,
  isSubmitting,
  triggerLabel = "Add Word",
}: {
  form: UseFormReturn<FieldValues>;
  lists: VocabList[];
  onSubmit: () => void;
  isSubmitting: boolean;
  triggerLabel?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/25 transition-all duration-200">
          <Plus className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 sm:rounded-2xl">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Create New Word
            </DialogTitle>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Add a new vocabulary word to your collection
            </p>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          <CreateVocabularyForm form={form} lists={lists} onSubmit={onSubmit} />
        </div>
        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-white sticky bottom-0 z-10">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="submit"
              form="vocab-create-form"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none sm:min-w-[140px] h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating...
                </span>
              ) : (
                "Create Word"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
