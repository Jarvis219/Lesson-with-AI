import { EXERCISE_QUESTION_TYPES } from "@/types";
import { Difficulty, Skill } from "@/types/lesson-content";

export const skills: Skill[] = [
  {
    value: "vocab",
    label: "Vocabulary",
    icon: "📚",
    description: "Learn new words and how to use them",
  },
  {
    value: "grammar",
    label: "Grammar",
    icon: "📝",
    description: "Grammar rules and sentence structures",
  },
  {
    value: "listening",
    label: "Listening",
    icon: "👂",
    description: "Listen and understand English",
  },
  {
    value: "speaking",
    label: "Speaking",
    icon: "🗣️",
    description: "Practice pronunciation and communication",
  },
  {
    value: "reading",
    label: "Reading",
    icon: "📖",
    description: "Read and analyze text",
  },
  {
    value: "writing",
    label: "Writing",
    icon: "✍️",
    description: "Practice writing sentences and paragraphs",
  },
];

export const difficulties: Difficulty[] = [
  {
    value: "beginner",
    label: "Beginner",
    icon: "🌱",
    description: "Appropriate for beginners in English",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    icon: "📚",
    description: "Basic knowledge of English",
  },
  {
    value: "advanced",
    label: "Advanced",
    icon: "🚀",
    description: "Advanced level of English",
  },
];

export const focusAreas = [
  "Daily communication",
  "Work",
  "Travel",
  "Study",
  "Family",
  "Weather",
  "Sports",
  "Food",
  "Shopping",
  "Health",
  "Nature",
  "Technology",
  "Science",
  "History",
  "Art",
  "Music",
  "Movies",
  "TV",
  "Books",
  "Internet",
  "News",
  "Politics",
  "Economy",
  "Culture",
  "Language",
  "Literature",
  "Philosophy",
  "Religion",
  "Society",
];

export const questionTypes = [
  { value: EXERCISE_QUESTION_TYPES[0], label: EXERCISE_QUESTION_TYPES[0] },
  { value: EXERCISE_QUESTION_TYPES[1], label: EXERCISE_QUESTION_TYPES[1] },
  { value: EXERCISE_QUESTION_TYPES[2], label: EXERCISE_QUESTION_TYPES[2] },
  { value: EXERCISE_QUESTION_TYPES[3], label: EXERCISE_QUESTION_TYPES[3] },
];
