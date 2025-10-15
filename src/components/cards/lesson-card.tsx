import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DIFFICULTY_LEVELS, LESSON_TYPES, USER_LEVELS } from "@/lib/constants";
import { formatTime, getDifficultyColor, getLevelColor } from "@/lib/utils";
import { BookOpen, Clock, Star, Users } from "lucide-react";
import React from "react";

interface LessonCardProps {
  lesson: {
    _id: string;
    title: string;
    description: string;
    type: string;
    level: string;
    difficulty: string;
    estimatedTime: number;
    tags: string[];
    createdAt: string;
    userProgress?: {
      completed: boolean;
      score: number;
      attempts: number;
    };
  };
  onStart: (lessonId: string) => void;
  onView: (lessonId: string) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onStart, onView }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case LESSON_TYPES.VOCAB:
        return "📚";
      case LESSON_TYPES.GRAMMAR:
        return "📝";
      case LESSON_TYPES.LISTENING:
        return "🎧";
      case LESSON_TYPES.SPEAKING:
        return "🎤";
      case LESSON_TYPES.READING:
        return "📖";
      case LESSON_TYPES.WRITING:
        return "✍️";
      default:
        return "📚";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case LESSON_TYPES.VOCAB:
        return "Vocabulary";
      case LESSON_TYPES.GRAMMAR:
        return "Grammar";
      case LESSON_TYPES.LISTENING:
        return "Listening";
      case LESSON_TYPES.SPEAKING:
        return "Speaking";
      case LESSON_TYPES.READING:
        return "Reading";
      case LESSON_TYPES.WRITING:
        return "Writing";
      default:
        return "General";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case USER_LEVELS.BEGINNER:
        return "Beginner";
      case USER_LEVELS.INTERMEDIATE:
        return "Intermediate";
      case USER_LEVELS.ADVANCED:
        return "Advanced";
      default:
        return "All Levels";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case DIFFICULTY_LEVELS.EASY:
        return "Easy";
      case DIFFICULTY_LEVELS.MEDIUM:
        return "Medium";
      case DIFFICULTY_LEVELS.HARD:
        return "Hard";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="h-full flex flex-col card-hover animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTypeIcon(lesson.type)}</span>
            <Badge variant="outline">{getTypeLabel(lesson.type)}</Badge>
          </div>
          {lesson.userProgress?.completed && (
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
          )}
        </div>
        <CardTitle className="text-lg leading-tight">{lesson.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {lesson.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getLevelColor(lesson.level)}>
            {getLevelLabel(lesson.level)}
          </Badge>
          <Badge className={getDifficultyColor(lesson.difficulty)}>
            {getDifficultyLabel(lesson.difficulty)}
          </Badge>
        </div>

        {lesson.tags && lesson.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {lesson.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {lesson.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{lesson.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatTime(lesson.estimatedTime)}</span>
          </div>
          {lesson.userProgress && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{lesson.userProgress.attempts} attempts</span>
            </div>
          )}
        </div>

        {lesson.userProgress && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progress</span>
              <span className="font-medium">{lesson.userProgress.score}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${lesson.userProgress.score}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(lesson._id)}
            className="flex-1">
            <BookOpen className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            size="sm"
            onClick={() => onStart(lesson._id)}
            className="flex-1">
            {lesson.userProgress?.completed ? "Review" : "Start"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LessonCard;
