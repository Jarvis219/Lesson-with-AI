"use client";

import { LogoutSection } from "@/components/teacher/settings/logout-section";
import { PaymentInformationSection } from "@/components/teacher/settings/payment-information-section";
import { ProfileSection } from "@/components/teacher/settings/profile-section";
import { TeachingScheduleSection } from "@/components/teacher/settings/teaching-schedule-section";

export default function SettingsProfilePage() {
  return (
    <div className="min-h-dvh relative overflow-hidden bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1000px_300px_at_80%_-10%,rgba(59,130,246,0.10),transparent_70%),radial-gradient(800px_300px_at_10%_10%,rgba(99,102,241,0.08),transparent_60%)]" />
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            Settings & Profile
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Manage your profile, teaching schedule, and payment information
          </p>
        </div>

        {/* Profile Information */}
        <ProfileSection />

        {/* Teaching Schedule */}
        <TeachingScheduleSection />

        {/* Payment Information */}
        <PaymentInformationSection />

        {/* Logout Section */}
        <LogoutSection />
      </div>
    </div>
  );
}
