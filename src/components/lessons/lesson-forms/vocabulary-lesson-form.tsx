"use client";

import {
  FillInBlankBuilder,
  MultipleChoiceBuilder,
  SingleChoiceBuilder,
  TranslationBuilder,
  TrueFalseBuilder,
} from "@/components/lessons/exercise-builders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExerciseType, VocabularyWord } from "@/types/lesson-content";
import { Plus, Trash2 } from "lucide-react";
import {
  Controller,
  FieldErrors,
  FieldValues,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { addExerciseToLesson } from "utils/lesson.util";

export function VocabularyLessonForm() {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const {
    fields: vocabularyFields,
    append: appendVocabulary,
    remove: removeVocabulary,
  } = useFieldArray({
    control,
    name: "content.vocabulary",
  });

  const {
    fields: exerciseFields,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({
    control,
    name: "content.exercises",
  });

  type ContentErrorsType = {
    vocabulary?:
      | { message?: string }
      | Array<{
          word?: { message?: string };
          definition?: { message?: string };
          example?: { message?: string };
        }>;
    exercises?: { message?: string };
    thematicGroup?: { message?: string };
  };

  const contentErrors = errors.content as ContentErrorsType | undefined;
  const vocabularyError = contentErrors?.vocabulary;
  const vocabularyMessage =
    vocabularyError && !Array.isArray(vocabularyError)
      ? vocabularyError.message
      : undefined;

  const addVocabularyWord = () => {
    const newWord: VocabularyWord = {
      word: "",
      definition: "",
      example: "",
      partOfSpeech: "noun",
      difficulty: "beginner",
      synonyms: [],
      antonyms: [],
    };
    appendVocabulary(newWord);
  };

  const addExercise = (type: ExerciseType) => {
    addExerciseToLesson(type, (exercise) => {
      appendExercise(exercise);
    });
  };

  return (
    <div className="space-y-8">
      {/* Thematic Group */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Thematic Group (Optional)</label>
        <Controller
          control={control}
          name="content.thematicGroup"
          render={({ field }) => (
            <Input
              placeholder="e.g., Food & Dining, Travel, Business"
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
        <p className="text-xs text-gray-500">
          Group vocabulary by topic or theme
        </p>
      </div>

      {/* Vocabulary Words Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex flex-col items-start">
            Vocabulary Words ({vocabularyFields.length})
            {vocabularyMessage && (
              <span className="text-sm text-red-500 font-normal">
                * {vocabularyMessage}
              </span>
            )}
          </h3>
          <Button type="button" onClick={addVocabularyWord} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Word
          </Button>
        </div>

        {vocabularyFields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 mb-4">No vocabulary words yet</p>
            <Button type="button" onClick={addVocabularyWord} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Word
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {vocabularyFields.map((field, index) => (
              <VocabularyWordCard
                key={field.id}
                index={index}
                onRemove={() => removeVocabulary(index)}
                errors={contentErrors}
              />
            ))}
          </div>
        )}
      </div>

      {/* Exercises Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex flex-col items-start">
            Exercises ({exerciseFields.length})
            {contentErrors?.exercises?.message && (
              <span className="text-sm text-red-500 font-normal">
                * {contentErrors.exercises.message}
              </span>
            )}
          </h3>
          <div className="flex gap-2">
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
            <p className="text-gray-500 mb-4">No exercises yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exerciseFields.map((field, index) => {
              const exerciseType = watch(`content.exercises.${index}.type`);
              return (
                <div key={field.id}>
                  {exerciseType === "multiple-choice" && (
                    <MultipleChoiceBuilder
                      index={index}
                      onRemove={() => removeExercise(index)}
                    />
                  )}
                  {exerciseType === "single-choice" && (
                    <SingleChoiceBuilder
                      index={index}
                      onRemove={() => removeExercise(index)}
                    />
                  )}
                  {exerciseType === "fill-in-the-blank" && (
                    <FillInBlankBuilder
                      index={index}
                      onRemove={() => removeExercise(index)}
                    />
                  )}
                  {exerciseType === "true-false" && (
                    <TrueFalseBuilder
                      index={index}
                      onRemove={() => removeExercise(index)}
                    />
                  )}
                  {exerciseType === "translation" && (
                    <TranslationBuilder
                      index={index}
                      onRemove={() => removeExercise(index)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== VOCABULARY WORD CARD COMPONENT ==========

interface VocabularyWordCardProps {
  index: number;
  onRemove: () => void;
  errors?:
    | {
        vocabulary?:
          | { message?: string }
          | Array<{
              word?: { message?: string };
              definition?: { message?: string };
              example?: { message?: string };
            }>;
      }
    | undefined;
}

function VocabularyWordCard({
  index,
  onRemove,
  errors,
}: VocabularyWordCardProps) {
  const { control, register } = useFormContext();

  const vocabularyErrors = errors?.vocabulary;
  const wordErrors =
    vocabularyErrors && Array.isArray(vocabularyErrors)
      ? vocabularyErrors[index]
      : undefined;

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Word #{index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Word */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Word <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g., restaurant"
            {...register(`content.vocabulary.${index}.word`)}
            className={wordErrors?.word ? "border-red-500" : ""}
          />
          {wordErrors?.word && (
            <p className="text-sm text-red-500">{wordErrors.word.message}</p>
          )}
        </div>

        {/* Part of Speech */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Part of Speech <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name={`content.vocabulary.${index}.partOfSpeech`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noun">Noun</SelectItem>
                  <SelectItem value="verb">Verb</SelectItem>
                  <SelectItem value="adjective">Adjective</SelectItem>
                  <SelectItem value="adverb">Adverb</SelectItem>
                  <SelectItem value="preposition">Preposition</SelectItem>
                  <SelectItem value="conjunction">Conjunction</SelectItem>
                  <SelectItem value="pronoun">Pronoun</SelectItem>
                  <SelectItem value="interjection">Interjection</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Definition */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Definition <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="A place where you can eat meals"
          {...register(`content.vocabulary.${index}.definition`)}
          className={wordErrors?.definition ? "border-red-500" : ""}
        />
        {wordErrors?.definition && (
          <p className="text-sm text-red-500">
            {wordErrors.definition.message}
          </p>
        )}
      </div>

      {/* Example */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Example Sentence <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="We went to a nice restaurant for dinner."
          {...register(`content.vocabulary.${index}.example`)}
          className={wordErrors?.example ? "border-red-500" : ""}
        />
        {wordErrors?.example && (
          <p className="text-sm text-red-500">{wordErrors.example.message}</p>
        )}
      </div>

      {/* Pronunciation (IPA) */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Pronunciation (IPA)</label>
        <Input
          placeholder="/ˈrestərɑnt/"
          {...register(`content.vocabulary.${index}.pronunciation`)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Synonyms */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Synonyms (comma-separated)
          </label>
          <Controller
            control={control}
            name={`content.vocabulary.${index}.synonyms`}
            render={({ field }) => (
              <Input
                placeholder="eatery, diner, café"
                value={(field.value || []).join(", ")}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    value
                      ? value
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s)
                      : []
                  );
                }}
              />
            )}
          />
        </div>

        {/* Antonyms */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Antonyms (comma-separated)
          </label>
          <Controller
            control={control}
            name={`content.vocabulary.${index}.antonyms`}
            render={({
              field,
              formState: { errors },
            }: {
              field: FieldValues;
              formState: { errors: FieldErrors };
            }) => (
              <>
                <Input
                  placeholder="home kitchen"
                  value={(field.value || []).join(", ")}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(
                      value
                        ? value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s)
                        : []
                    );
                  }}
                />
                {errors.antonyms?.message && (
                  <p className="text-sm text-red-500">
                    {errors.antonyms?.message as string}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Difficulty Level</label>
        <Controller
          control={control}
          name={`content.vocabulary.${index}.difficulty`}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Image & Audio URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Image URL (optional)</label>
          <Input
            placeholder="https://..."
            {...register(`content.vocabulary.${index}.imageUrl`)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Audio URL (optional)</label>
          <Input
            placeholder="https://..."
            {...register(`content.vocabulary.${index}.audioUrl`)}
          />
        </div>
      </div>
    </div>
  );
}
