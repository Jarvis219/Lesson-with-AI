"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { teacherProfileService } from "@/lib/teacher-profile-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Validation schema for schedule slot
const scheduleSlotSchema = z.object({
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
});

// Validation schema for schedule form
const scheduleFormSchema = z.object({
  schedule: z
    .array(scheduleSlotSchema)
    .min(1, "At least one schedule slot is required"),
  timezone: z.string().optional().default("Asia/Ho_Chi_Minh"),
});

type ScheduleFormData = z.infer<typeof scheduleFormSchema>;

const defaultSchedule = [
  { day: "Monday" as const, startTime: "09:00", endTime: "17:00" },
  { day: "Tuesday" as const, startTime: "09:00", endTime: "17:00" },
  { day: "Wednesday" as const, startTime: "09:00", endTime: "17:00" },
  { day: "Thursday" as const, startTime: "09:00", endTime: "17:00" },
  { day: "Friday" as const, startTime: "09:00", endTime: "17:00" },
];

export function TeachingScheduleSection() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      schedule: defaultSchedule,
      timezone: "Asia/Ho_Chi_Minh",
    },
  });

  const schedule = watch("schedule");

  // Fetch schedule on component mount
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const data = await teacherProfileService.getSchedule();
        reset({
          schedule: data.schedule,
          timezone: data.timezone,
        });
      } catch (error) {
        console.error("Error fetching schedule:", error);
        toast({
          title: "Error",
          description: "Failed to load schedule. Using default values.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    isAuthenticated && fetchSchedule();
  }, [reset, toast, isAuthenticated]);

  const handleTimeChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setValue("schedule", newSchedule);
  };

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      // Validate that end time is after start time for each slot
      for (const slot of data.schedule) {
        const [startHour, startMinute] = slot.startTime.split(":").map(Number);
        const [endHour, endMinute] = slot.endTime.split(":").map(Number);

        if (
          endHour < startHour ||
          (endHour === startHour && endMinute <= startMinute)
        ) {
          toast({
            title: "Validation Error",
            description: `End time must be after start time for ${slot.day}`,
            variant: "destructive",
          });
          return;
        }
      }

      // Update schedule using service
      await teacherProfileService.updateSchedule(data);

      toast({
        title: "Success",
        description: "Teaching schedule updated successfully",
      });
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast({
        title: "Error",
        description: "Failed to update schedule. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center space-y-0">
          <Calendar className="h-5 w-5 mr-2 text-gray-500" />
          <CardTitle>Teaching Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0">
        <Calendar className="h-5 w-5 mr-2 text-gray-500" />
        <CardTitle>Teaching Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-6">
          Set your available teaching hours for each day of the week
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {schedule.map((slot, index) => (
              <div
                key={slot.day}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-24 text-sm font-medium text-gray-700">
                  {slot.day}
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      handleTimeChange(index, "startTime", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      handleTimeChange(index, "endTime", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {errors.schedule && (
            <p className="mt-4 text-sm text-red-600">
              {errors.schedule.message}
            </p>
          )}

          <Button type="submit" className="mt-6" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Schedule"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
