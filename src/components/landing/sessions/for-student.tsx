"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import React from "react";

export const ForStudents: React.FC = () => {
  return (
    <section
      id="students"
      className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  For Students
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Learn Without Limits
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                From beginner to native-level fluency, personalize your journey.
                Access world-class courses, join live classes, and track every
                step of your progress.
              </p>

              <div className="grid grid-cols-1 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-md border border-blue-50">
                  <h4 className="font-bold text-blue-900 mb-2">
                    Personalized Paths
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Our system adapts to your learning speed and goals, ensuring
                    you never waste time on what you already know.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-blue-50">
                  <h4 className="font-bold text-blue-900 mb-2">
                    Expert Instructors
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Learn from certified teachers who provide direct feedback
                    and mentorship.
                  </p>
                </div>
              </div>

              <Button variant="secondary" size="lg">
                <GraduationCap className="mr-2" />
                Join as a Student
              </Button>
            </motion.div>
          </div>

          <div className="lg:w-1/2 order-1 lg:order-2">
            <motion.img
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              src="https://picsum.photos/seed/student/600/500"
              alt="Student learning on tablet"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
