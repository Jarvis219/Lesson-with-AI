"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import React from "react";

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/50"></div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
            ✨ Redefining Language Education
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Master English Fluently <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              On Your Terms
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Achieve confidence in Listening, Speaking, Reading, and Writing.
            Join thousands of learners or start your journey as a top-tier
            instructor today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="default" size="lg" className="group">
              Start Learning Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" size="lg" className="group">
              <PlayCircle className="mr-2 w-5 h-5" />
              Watch How It Works
            </Button>
          </div>

          <div className="mt-12 flex justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Simple logo placeholders for social proof */}
            {["TechCrunch", "Forbes", "EdSurge", "Wired"].map((brand) => (
              <span key={brand} className="text-gray-400 font-bold text-xl">
                {brand}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
