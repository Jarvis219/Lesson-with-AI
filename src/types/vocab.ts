import { PartOfSpeech } from "./lesson-enums";

export interface VocabList {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  vocabularyCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyItem {
  _id: string;
  word: string;
  phonetic?: string;
  partOfSpeech: PartOfSpeech;
  definition: string;
  example?: string;
  translation: string;
  synonyms: string[];
  antonyms: string[];
  level: string;
  category: string;
  lists?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVocabListRequest {
  name: string;
  description?: string;
}

export interface CreateVocabularyRequest {
  word: string;
  phonetic?: string;
  part_of_speech?: PartOfSpeech;
  definition: string;
  example?: string;
  translation: string;
  synonyms?: string[] | string;
  antonyms?: string[] | string;
  level?: string;
  category?: string;
  lists?: string[] | string;
}

export interface VocabListResponse {
  lists: VocabList[];
  total: number;
}

export interface VocabularyListResponse {
  vocabulary: VocabularyItem[];
  count: number;
}
