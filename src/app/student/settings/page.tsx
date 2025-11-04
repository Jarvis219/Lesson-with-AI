"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bell,
  CheckCircle2,
  Lock,
  Mail,
  Save,
  Settings,
  Sparkles,
  User as UserIcon,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Zod validation schema
const settingsSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot be more than 50 characters"),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Level is required",
  }),
  goals: z
    .string()
    .min(1, "Learning goals are required")
    .max(200, "Goals cannot be more than 200 characters"),
  language: z.string().min(1, "Language is required"),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Difficulty is required",
  }),
  notifications: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      level: "beginner",
      goals: "",
      language: "en",
      difficulty: "medium",
      notifications: true,
    },
  });

  // Reset form when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        level: user.level,
        goals: user.goals,
        language: user.preferences?.language,
        difficulty: user.preferences?.difficulty,
        notifications: user.preferences?.notifications !== false,
      });
    }
  }, [user]);

  const onSubmit = async (data: SettingsFormData) => {
    await updateProfile({
      name: data.name,
      level: data.level,
      goals: data.goals,
      preferences: {
        language: data.language,
        difficulty: data.difficulty,
        notifications: data.notifications,
      },
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-12 max-w-lg">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Settings className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Settings Not Found
            </h2>
            <p className="text-gray-600">
              Unable to load your settings information.
            </p>
          </div>
          <Button
            onClick={() => router.push("/student")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Animated background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute top-60 left-60 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-4000"></div>
        </div>

        {/* Header */}
        <div className="relative mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full border border-blue-200 mb-4">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
              Configure Settings
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-gray-600 text-lg">
            Customize your learning experience and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Profile Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Profile Information
                </h2>
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Name
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none ${
                          errors.name ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="Enter your name"
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Current Level
                  </label>
                  <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}>
                        <SelectTrigger
                          className={`w-full h-12 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                            errors.level ? "border-red-500" : "border-gray-200"
                          }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.level && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.level.message}
                    </p>
                  )}
                </div>

                {/* Goals */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Learning Goals
                  </label>
                  <Controller
                    name="goals"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        rows={4}
                        className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none ${
                          errors.goals ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="What are your language learning goals?"
                      />
                    )}
                  />
                  {errors.goals && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.goals.message}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Learning Preferences */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Learning Preferences
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Interface Language
                  </label>
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => val && field.onChange(val)}>
                        <SelectTrigger
                          className={`w-full h-12 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                            errors.language
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="vi">Vietnamese</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.language && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.language.message}
                    </p>
                  )}
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Preferred Difficulty
                  </label>
                  <Controller
                    name="difficulty"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => val && field.onChange(val)}>
                        <SelectTrigger
                          className={`w-full h-12 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                            errors.difficulty
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.difficulty && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.difficulty.message}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Email Notifications
                      </h3>
                      <p className="text-sm text-gray-600">
                        Receive updates about your progress
                      </p>
                    </div>
                  </div>
                  <Controller
                    name="notifications"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          field.value ? "bg-blue-600" : "bg-gray-300"
                        }`}>
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            field.value ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    )}
                  />
                </div>
              </div>
            </Card>

            {/* Account Security */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Account Security
                </h2>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Lock className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Password Management
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      To change your password, please contact support or use the
                      password reset feature from the login page.
                    </p>
                    <Button
                      // TODO: Add password reset feature in the future
                      disabled
                      variant="outline"
                      onClick={() => router.push("/auth?mode=forgot")}
                      className="border-2 border-yellow-400 hover:bg-yellow-100">
                      Reset Password
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Save Button */}
          <div className="sticky bottom-4 z-10">
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Save Your Changes
                    </h3>
                    <p className="text-xs text-gray-600">
                      Make sure to save before leaving this page
                    </p>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all px-8">
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      Save Changes
                    </div>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
