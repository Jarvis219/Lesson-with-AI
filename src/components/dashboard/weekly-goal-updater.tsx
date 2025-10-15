"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { Check, Edit2, X } from "lucide-react";
import { useState } from "react";

interface WeeklyGoalUpdaterProps {
  currentGoal: number;
  onGoalUpdate: (newGoal: number) => void;
}

export default function WeeklyGoalUpdater({
  currentGoal,
  onGoalUpdate,
}: WeeklyGoalUpdaterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(currentGoal.toString());
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const goal = parseInt(newGoal);

    if (goal < 1 || goal > 20) {
      alert("Mục tiêu phải từ 1 đến 20 bài học mỗi tuần");
      return;
    }

    setLoading(true);

    try {
      await apiClient.updateWeeklyGoal(goal);
      onGoalUpdate(goal);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating weekly goal:", error);
      alert(error.message || "Có lỗi xảy ra khi cập nhật mục tiêu");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewGoal(currentGoal.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          max="20"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          className="w-20 h-8 text-sm"
          disabled={loading}
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={loading}
          className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700">
          <Check className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
          className="h-8 w-8 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => setIsEditing(true)}
      className="h-8 p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
      <Edit2 className="h-3 w-3 mr-1" />
      {currentGoal}
    </Button>
  );
}
