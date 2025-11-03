"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ExerciseType } from "@/types/lesson-content";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { addExerciseToLesson } from "utils/lesson.util";
import { ListeningComprehensionExercise } from "./listening-comprehension-exercise";

export function SpeakingLessonForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: dialogueFields,
    append: appendDialogue,
    remove: removeDialogue,
  } = useFieldArray({
    control,
    name: "content.conversation.dialogues",
  });

  const {
    fields: phraseFields,
    append: appendPhrase,
    remove: removePhrase,
  } = useFieldArray({
    control,
    name: "content.conversation.usefulPhrases",
  });

  const {
    fields: exerciseFields,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({
    control,
    name: "content.exercises",
  });

  const {
    fields: topicFields,
    append: appendTopic,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: "content.topics",
  });

  const addExercise = (type: ExerciseType) => {
    addExerciseToLesson(type, (exercise) => {
      appendExercise(exercise);
    });
  };

  const contentErrors = errors.content as any;
  const exercisesError = contentErrors?.exercises;
  const dialoguesError =
    contentErrors?.conversation?.dialogues?.message ||
    contentErrors?.conversation?.dialogues?.root?.message;

  return (
    <div className="space-y-8">
      {/* Conversation Section */}
      <div className="space-y-4 border rounded-lg p-6 bg-pink-50">
        <h3 className="text-lg font-semibold text-pink-900">
          Conversation Scenario
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Scenario <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="content.conversation.scenario"
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  placeholder="e.g., At a restaurant"
                  className={fieldState.error ? "border-red-500" : ""}
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Dialogues */}
        <div className="space-y-2 flex flex-col gap-2">
          <label className="text-sm font-medium">Dialogues</label>
          {dialoguesError ? (
            <p className="text-sm text-red-500">{dialoguesError}</p>
          ) : (
            dialogueFields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-3 space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Turn #{index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDialogue(index)}
                    className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Controller
                  control={control}
                  name={`content.conversation.dialogues.${index}.speaker`}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        placeholder="Speaker"
                        className={fieldState.error ? "border-red-500" : ""}
                      />
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
                <Controller
                  control={control}
                  name={`content.conversation.dialogues.${index}.text`}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        placeholder="What they say..."
                        className={fieldState.error ? "border-red-500" : ""}
                      />
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
                <Controller
                  control={control}
                  name={`content.conversation.dialogues.${index}.audioUrl`}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        placeholder="Audio URL (optional)"
                        className={fieldState.error ? "border-red-500" : ""}
                      />
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            ))
          )}
          <Button
            type="button"
            onClick={() =>
              appendDialogue({ speaker: "", text: "", audioUrl: "" })
            }
            size="sm"
            variant="outline"
            className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add Dialogue Turn
          </Button>
        </div>

        {/* Useful Phrases */}
        <div className="space-y-2 flex flex-col gap-2">
          <label className="text-sm font-medium">Useful Phrases</label>
          {phraseFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Controller
                control={control}
                name={`content.conversation.usefulPhrases.${index}`}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g., Can I have the menu, please?"
                  />
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePhrase(index)}
                className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendPhrase("")}
            size="sm"
            variant="outline"
            className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add Useful Phrase
          </Button>
        </div>
      </div>

      {/* Practice Exercises */}
      <div className="space-y-4 border rounded-lg p-6 bg-green-50">
        <h3 className="text-lg font-semibold text-green-900">
          Practice Exercises <span className="text-red-500">*</span>
          {exercisesError?.message && (
            <span className="text-sm ml-2 text-red-500 font-normal">
              * {exercisesError.message}
            </span>
          )}
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-md font-semibold">Add Exercises</h4>
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                onClick={() => addExercise("multiple-choice")}
                size="sm"
                variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Multiple Choice
              </Button>
              <Button
                type="button"
                onClick={() => addExercise("single-choice")}
                size="sm"
                variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Single Choice
              </Button>
              <Button
                type="button"
                onClick={() => addExercise("fill-in-the-blank")}
                size="sm"
                variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Fill in Blank
              </Button>
              <Button
                type="button"
                onClick={() => addExercise("true-false")}
                size="sm"
                variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                True False
              </Button>
              <Button
                type="button"
                onClick={() => addExercise("translation")}
                size="sm"
                variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Translation
              </Button>
            </div>
          </div>

          {exerciseFields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-gray-500 mb-4">
                No exercises yet - At least one exercise is required
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {exerciseFields.map((field, index) => (
                <ListeningComprehensionExercise
                  key={field.id}
                  index={index}
                  basePath={`content.exercises.${index}`}
                  onRemove={() => removeExercise(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Discussion Topics</h3>
        {topicFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Controller
              control={control}
              name={`content.topics.${index}`}
              render={({ field }) => (
                <Input {...field} placeholder="e.g., Your favorite food" />
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeTopic(index)}
              className="text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => appendTopic("")}
          size="sm"
          variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Topic
        </Button>
      </div>
    </div>
  );
}
