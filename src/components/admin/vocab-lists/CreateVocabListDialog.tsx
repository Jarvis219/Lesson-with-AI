"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { vocabService } from "@/lib/vocab-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface CreateVocabListDialogProps {
  onCreated?: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(1000).optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function CreateVocabListDialog({
  onCreated,
}: CreateVocabListDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
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
      setOpen(false);
      onCreated?.();
    } catch (e: any) {
      toast({
        title: "Create failed",
        description: e.message,
        variant: "destructive",
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New list</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new list</DialogTitle>
          <DialogDescription>Define a new vocabulary list.</DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
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
              render={({ field }) => (
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
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateVocabListDialog;


