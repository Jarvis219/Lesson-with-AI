"use client";

import { PaymentInformationSection } from "@/components/teacher/settings/payment-information-section";
import { ProfileSection } from "@/components/teacher/settings/profile-section";
import { TeachingScheduleSection } from "@/components/teacher/settings/teaching-schedule-section";

export default function SettingsProfilePage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings & Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile, teaching schedule, and payment information
        </p>
      </div>

      {/* Profile Information */}
      <ProfileSection />

      {/* Teaching Schedule */}
      <TeachingScheduleSection />

      {/* Payment Information */}
      <PaymentInformationSection />
    </div>
  );
}
