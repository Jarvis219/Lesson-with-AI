"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import React from "react";

const TEACHER_BENEFITS = [
  "Build courses 10x faster with AI assistance",
  "Set your own prices and schedule",
  "Integrated student management dashboard",
  "Automated grading and analytics",
];

export const ForTeachers: React.FC = () => {
  return (
    <section id="teachers" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600/20 to-blue-600/20 rounded-full blur-3xl opacity-30"></div>
            <motion.img
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              src="https://picsum.photos/seed/teacher/600/600"
              alt="Teacher using dashboard"
              className="relative rounded-2xl shadow-2xl z-10"
            />
          </div>

          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                  For Instructors
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Turn Your Expertise Into <br />
                <span className="text-purple-600">Global Impact</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Focus on teaching, not administration. Our platform provides the
                tools you need to create engaging courses, manage classes, and
                grow your income.
              </p>

              <ul className="space-y-4 mb-10">
                {TEACHER_BENEFITS.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button variant="secondary" size="lg">
                Start Teaching with Us
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
