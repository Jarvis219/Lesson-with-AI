"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

export function SpeakingLessonForm() {
  const {
    control,
    register,
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
    name: "content.practiceExercises",
  });

  const {
    fields: topicFields,
    append: appendTopic,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: "content.topics",
  });

  const contentErrors = errors.content as
    | {
        practiceExercises?: { message?: string };
      }
    | undefined;

  const addPracticeExercise = () => {
    appendExercise({
      type: "conversation",
      prompt: "",
      sampleAnswer: "",
      sampleAudioUrl: "",
      timeLimit: 0,
      tips: [],
    });
  };

  return (
    <div className="space-y-8">
      {/* Conversation Section */}
      <div className="space-y-4 border rounded-lg p-6 bg-pink-50">
        <h3 className="text-lg font-semibold text-pink-900">
          Conversation Scenario
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Scenario</label>
          <Input
            placeholder="e.g., At a restaurant"
            {...register("content.conversation.scenario")}
          />
        </div>

        {/* Dialogues */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Dialogues</label>
          {dialogueFields.map((field, index) => (
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
              <Input
                placeholder="Speaker"
                {...register(`content.conversation.dialogues.${index}.speaker`)}
              />
              <Input
                placeholder="What they say..."
                {...register(`content.conversation.dialogues.${index}.text`)}
              />
              <Input
                placeholder="Audio URL (optional)"
                {...register(
                  `content.conversation.dialogues.${index}.audioUrl`
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              appendDialogue({ speaker: "", text: "", audioUrl: "" })
            }
            size="sm"
            variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Dialogue Turn
          </Button>
        </div>

        {/* Useful Phrases */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Useful Phrases</label>
          {phraseFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`content.conversation.usefulPhrases.${index}`)}
                placeholder="e.g., Can I have the menu, please?"
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
            variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Useful Phrase
          </Button>
        </div>
      </div>

      {/* Practice Exercises */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Practice Exercises ({exerciseFields.length})
            {contentErrors?.practiceExercises?.message && (
              <span className="text-sm text-red-500 ml-2 font-normal">
                * {contentErrors.practiceExercises.message}
              </span>
            )}
          </h3>
          <Button type="button" onClick={addPracticeExercise} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        </div>

        {exerciseFields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 mb-4">No practice exercises yet</p>
            <Button
              type="button"
              onClick={addPracticeExercise}
              variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Exercise
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {exerciseFields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">
                    Exercise #{index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExercise(index)}
                    className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type *</label>
                  <Controller
                    control={control}
                    name={`content.practiceExercises.${index}.type`}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conversation">
                            Conversation
                          </SelectItem>
                          <SelectItem value="roleplay">Role Play</SelectItem>
                          <SelectItem value="presentation">
                            Presentation
                          </SelectItem>
                          <SelectItem value="discussion">Discussion</SelectItem>
                          <SelectItem value="pronunciation">
                            Pronunciation
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prompt *</label>
                  <Input
                    placeholder="Exercise prompt..."
                    {...register(`content.practiceExercises.${index}.prompt`)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Sample Answer (optional)
                  </label>
                  <textarea
                    placeholder="Provide a sample answer..."
                    {...register(
                      `content.practiceExercises.${index}.sampleAnswer`
                    )}
                    rows={2}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Sample Audio URL (optional)
                  </label>
                  <Input
                    placeholder="https://..."
                    {...register(
                      `content.practiceExercises.${index}.sampleAudioUrl`
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Time Limit (seconds, optional)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    {...register(
                      `content.practiceExercises.${index}.timeLimit`,
                      {
                        valueAsNumber: true,
                      }
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Topics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Discussion Topics</h3>
        {topicFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              {...register(`content.topics.${index}`)}
              placeholder="e.g., Your favorite food"
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
