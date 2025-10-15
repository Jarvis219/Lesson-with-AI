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
import { AlertTriangle, Brain, Plus } from "lucide-react";
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
    deletingLesson,
    setDeletingLesson,
    handleDeleteLesson,
  } = useAdminLessons();

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <Dialog open={showAIModal} onOpenChange={setShowAIModal}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50 w-full sm:w-auto">
            <Brain className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Generate with AI</span>
            <span className="sm:hidden">AI Generate</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl h-[90vh] p-0 flex flex-col mx-4 sm:mx-auto">
          <DialogHeader className="p-4 sm:p-6 flex-shrink-0 border-b bg-white">
            <DialogTitle className="text-lg sm:text-xl">
              Create lesson with AI
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Use AI to automatically generate lessons from your prompt
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-hidden">
            <AIGenerator
              onSuccess={() => {
                setShowAIModal(false);
                fetchLessons();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Create new lesson</span>
            <span className="sm:hidden">New lesson</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col mx-4 sm:mx-auto">
          <DialogHeader className="p-4 sm:p-6 flex-shrink-0 border-b bg-white">
            <DialogTitle className="text-lg sm:text-xl">
              Create new lesson
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
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
          <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col mx-4 sm:mx-auto">
            <DialogHeader className="p-4 sm:p-6 pb-0 flex-shrink-0 border-b bg-white">
              <DialogTitle className="text-lg sm:text-xl">
                Edit lesson
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Update lesson information
              </DialogDescription>
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
          <DialogContent className="max-w-3xl mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                Preview lesson
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Quickly preview lesson content and structure
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  {previewLesson.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  {previewLesson.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs sm:text-sm">
                  {previewLesson.type}
                </Badge>
                <Badge className="bg-gray-100 text-gray-700 border-0 text-xs sm:text-sm">
                  Difficulty: {previewLesson.difficulty}
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-700 border-0 text-xs sm:text-sm">
                  {previewLesson.estimatedTime} mins
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                  Questions/Exercises (
                  {previewLesson.content?.exercises?.length || 0})
                </h4>
                {previewLesson.content?.exercises?.length ? (
                  <div className="space-y-3 max-h-60 sm:max-h-80 overflow-auto pr-2">
                    {previewLesson.content.exercises.map((ex, idx) => (
                      <div
                        key={ex._id || idx}
                        className="p-2 sm:p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                            {idx + 1}
                          </Badge>
                          <span className="text-xs sm:text-sm text-gray-600">
                            {ex.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {ex.difficulty}
                          </span>
                        </div>
                        <Tooltip content={ex.question?.translate}>
                          <p className="text-xs sm:text-sm text-gray-900 font-medium mb-1">
                            {ex.question.text}
                          </p>
                        </Tooltip>
                        {Array.isArray(ex.options) && ex.options.length > 0 && (
                          <ul className="list-disc list-inside text-xs sm:text-sm ml-2 sm:ml-4 text-gray-700 space-y-0.5">
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
                        {ex.options.length === 0 &&
                          ex.correctAnswer.length !== 0 && (
                            <ul className="list-disc list-inside text-xs sm:text-sm ml-2 sm:ml-4 text-gray-700 space-y-0.5">
                              {ex.correctAnswer.map((answer) => (
                                <li
                                  key={answer}
                                  className="text-green-500 underline underline-offset-1">
                                  {answer}
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
                  <p className="text-xs sm:text-sm text-gray-600">
                    No exercises yet.
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {deletingLesson && (
        <Dialog
          open={!!deletingLesson}
          onOpenChange={() => setDeletingLesson(null)}>
          <DialogContent className="max-w-md mx-4 sm:mx-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div>
                  <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">
                    Delete Lesson
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base text-gray-600">
                    This action cannot be undone
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border">
                <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                  {deletingLesson.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                  {deletingLesson.description}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                    {deletingLesson.type}
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
                    {deletingLesson.difficulty}
                  </Badge>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600">
                Are you sure you want to delete this lesson? This will
                permanently remove the lesson and all associated data.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setDeletingLesson(null)}
                  className="flex-1 order-2 sm:order-1">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteLesson(deletingLesson._id)}
                  className="flex-1 order-1 sm:order-2">
                  Delete Lesson
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
