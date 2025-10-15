"use client";

import AIGenerator from "@/components/admin/ai-generator";
import LessonForm from "@/components/admin/lesson-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { useAdminLessons } from "@/context/admin-lessons-context";
import { Brain, Plus } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function AdminLessonsModals() {
  const {
    showAIModal,
    setShowAIModal,
    showCreateModal,
    setShowCreateModal,
    handleCreateLesson,
    editingLesson,
    setEditingLesson,
    handleUpdateLesson,
    fetchLessons,
    previewLesson,
    setPreviewLesson,
  } = useAdminLessons();

  return (
    <div className="flex gap-3">
      <Dialog open={showAIModal} onOpenChange={setShowAIModal}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50">
            <Brain className="h-4 w-4 mr-2" />
            Generate with AI
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create lesson with AI</DialogTitle>
            <DialogDescription>
              Use AI to automatically generate lessons from your prompt
            </DialogDescription>
          </DialogHeader>
          <AIGenerator
            onSuccess={() => {
              setShowAIModal(false);
              fetchLessons();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create new lesson
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
          <DialogHeader className="p-6 flex-shrink-0 border-b bg-white">
            <DialogTitle>Create new lesson</DialogTitle>
            <DialogDescription>
              Create a new lesson with interactive questions
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <LessonForm
              onSubmit={handleCreateLesson}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Modal */}
      {editingLesson && (
        <Dialog
          open={!!editingLesson}
          onOpenChange={() => setEditingLesson(null)}>
          <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
            <DialogHeader className="p-6 pb-0 flex-shrink-0 border-b bg-white">
              <DialogTitle>Edit lesson</DialogTitle>
              <DialogDescription>Update lesson information</DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0">
              <LessonForm
                lesson={editingLesson}
                onSubmit={handleUpdateLesson}
                onCancel={() => setEditingLesson(null)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Preview Lesson Modal */}
      {previewLesson && (
        <Dialog
          open={!!previewLesson}
          onOpenChange={() => setPreviewLesson(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Preview lesson</DialogTitle>
              <DialogDescription>
                Quickly preview lesson content and structure
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {previewLesson.title}
                </h3>
                <p className="text-gray-700">{previewLesson.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-700 border-0">
                  {previewLesson.type}
                </Badge>
                <Badge className="bg-gray-100 text-gray-700 border-0">
                  Difficulty: {previewLesson.difficulty}
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-700 border-0">
                  {previewLesson.estimatedTime} mins
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">
                  Questions/Exercises (
                  {previewLesson.content?.exercises?.length || 0})
                </h4>
                {previewLesson.content?.exercises?.length ? (
                  <div className="space-y-3 max-h-80 overflow-auto pr-2">
                    {previewLesson.content.exercises.map((ex, idx) => (
                      <div
                        key={ex._id || idx}
                        className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-purple-100 text-purple-700 border-0">
                            {idx + 1}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {ex.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {ex.difficulty}
                          </span>
                        </div>
                        <Tooltip content={ex.question?.translate}>
                          <p className="text-gray-900 font-medium mb-1">
                            {ex.question.text}
                          </p>
                        </Tooltip>
                        {Array.isArray(ex.options) && ex.options.length > 0 && (
                          <ul className="list-disc list-inside text-sm ml-4 text-gray-700 space-y-0.5">
                            {ex.options.map((opt, i) => (
                              <li key={i}>
                                <Tooltip content={opt.translate}>
                                  <span
                                    className={twMerge(
                                      ex.correctAnswer.includes(opt.value) &&
                                        "text-green-500 underline underline-offset-1"
                                    )}>
                                    {opt.value}
                                  </span>
                                </Tooltip>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                    {previewLesson.content.exercises.length > 10 && (
                      <p className="text-xs text-gray-500">
                        … and {previewLesson.content.exercises.length - 10} more
                        exercises
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No exercises yet.</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
