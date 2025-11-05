import { DIFFICULTY_LEVELS } from "@/lib/constants";
import { PartOfSpeech, PARTS_OF_SPEECH } from "@/types/lesson-enums";
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IVocabulary extends Document {
  word: string;
  definition: string;
  translation: string;
  example: string;
  pronunciation: string;
  phonetic: string;
  partOfSpeech: PartOfSpeech;
  level: (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];
  category: string;
  synonyms: string[];
  antonyms: string[];
  lists?: Types.ObjectId[];
  frequency: number; // how often this word appears
  audioUrl?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VocabularySchema = new Schema<IVocabulary>(
  {
    word: {
      type: String,
      required: [true, "Word is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    definition: {
      type: String,
      required: [true, "Definition is required"],
      trim: true,
    },
    translation: {
      type: String,
      required: [true, "Translation is required"],
      trim: true,
    },
    example: {
      type: String,
      required: [true, "Example is required"],
      trim: true,
    },
    pronunciation: {
      type: String,
      trim: true,
    },
    phonetic: {
      type: String,
      trim: true,
    },
    partOfSpeech: {
      type: String,
      enum: PARTS_OF_SPEECH,
      required: true,
    },
    level: {
      type: String,
      enum: Object.values(DIFFICULTY_LEVELS),
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    synonyms: [
      {
        type: String,
        trim: true,
      },
    ],
    antonyms: [
      {
        type: String,
        trim: true,
      },
    ],
    lists: [
      {
        type: Schema.Types.ObjectId,
        ref: "VocabList",
      },
    ],
    frequency: {
      type: Number,
      default: 0,
      min: 0,
    },
    audioUrl: String,
    imageUrl: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
VocabularySchema.index({ word: 1 });
VocabularySchema.index({ level: 1 });
VocabularySchema.index({ category: 1 });
VocabularySchema.index({ partOfSpeech: 1 });
VocabularySchema.index({ isActive: 1 });
VocabularySchema.index({ lists: 1 });

// Text index for search functionality
VocabularySchema.index({
  word: "text",
  definition: "text",
  translation: "text",
  category: "text",
});

export default mongoose.models.Vocabulary ||
  mongoose.model<IVocabulary>("Vocabulary", VocabularySchema);
