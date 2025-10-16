import { imageConstants } from "@/constant/image.constant";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lean English AI - Learn English with AI",
  description:
    "Master English with personalized AI-powered lessons, grammar correction, speaking practice, and vocabulary building.",
  keywords:
    "English learning, AI, grammar, vocabulary, speaking practice, language learning",
  authors: [{ name: "Lean English AI Team" }],
  openGraph: {
    title: "Lean English AI",
    description: "Master English with personalized AI-powered lessons",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: imageConstants.favicon,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
