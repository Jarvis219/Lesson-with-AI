import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/nav-bar";
import { AiFeature } from "@/components/landing/sessions/ai-feature";
import { CTA } from "@/components/landing/sessions/CTA";
import { ForStudents } from "@/components/landing/sessions/for-student";
import { ForTeachers } from "@/components/landing/sessions/for-teacher";
import { Hero } from "@/components/landing/sessions/hero";
import { Outcomes } from "@/components/landing/sessions/out-comes";
import { Skills } from "@/components/landing/sessions/skills";
import { SocialProof } from "@/components/landing/sessions/social-proof";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Lean English AI | Learn English with AI-Powered Lessons",
  description:
    "Master English with AI: personalized lessons, instant grammar correction, speaking practice, and progress tracking. Start learning English for free.",
  keywords: [
    "learn English",
    "English learning",
    "AI English",
    "grammar correction",
    "speaking practice",
    "English lessons",
    "IELTS",
    "TOEIC",
    "TOEFL",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lean English AI | Learn English with AI-Powered Lessons",
    description:
      "Personalized English lessons created by AI with speaking and writing feedback.",
    url: "/",
    siteName: "Lean English AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lean English AI | Learn English with AI-Powered Lessons",
    description:
      "Personalized English lessons created by AI with speaking and writing feedback.",
  },
};

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Outcomes />
        <Skills />
        <ForTeachers />
        <ForStudents />
        <AiFeature />
        <SocialProof />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
