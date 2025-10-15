"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Play } from "lucide-react";
import type React from "react";

interface LessonCardProps {
  icon: React.ReactNode;
  lessonType: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  title: string;
  description: string;
  duration: number;
  progress?: number;
  isCompleted?: boolean;
  onClick?: () => void;
}

export function LessonCard({
  icon,
  lessonType,
  difficulty,
  title,
  description,
  duration,
  progress = 0,
  isCompleted = false,
  onClick,
}: LessonCardProps) {
  const difficultyColors: Record<LessonCardProps["difficulty"], string> = {
    Beginner: "bg-green-100 text-green-700",
    Intermediate: "bg-purple-100 text-purple-700",
    Advanced: "bg-orange-100 text-orange-700",
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="group relative overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              {icon}
            </div>
            <span className="text-sm font-medium text-foreground">
              {lessonType}
            </span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "border font-medium capitalize",
              difficultyColors[difficulty]
            )}>
            {difficulty}
          </Badge>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold leading-tight text-balance text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{duration} minutes</span>
        </div>

        {/* Progress Section */}
        {isCompleted && progress > 0 && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-foreground">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full transition-all duration-500 rounded-full bg-green-500"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5 text-success",
                getProgressColor(progress)
              )}>
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={onClick}
          className={cn(
            "w-full gap-2 font-medium transition-all",
            isCompleted
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          size="lg">
          <Play className="h-4 w-4" />
          {isCompleted ? "Review" : "Start learning"}
        </Button>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-lg border-2 border-primary opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
    </Card>
  );
}
