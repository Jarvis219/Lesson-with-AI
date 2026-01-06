"use client";

import { OUTCOMES } from "@/constant/landing.constant";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import React from "react";

export const Outcomes: React.FC = () => {
  return (
    <section id="outcomes" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>
              <span className="text-purple-600 font-bold tracking-wider uppercase text-sm">
                Results Driven
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
                Don't Just Learn. <br />
                <span className="text-blue-600">Achieve.</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We focus on tangible results. Whether you are preparing for
                university, a new job, or immigration, our platform guarantees
                measurable progress.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {OUTCOMES.map((outcome) => (
                  <div key={outcome.title} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="text-green-500 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {outcome.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {outcome.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10">
              <Image
                width={600}
                height={500}
                src="https://picsum.photos/seed/learn/600/500"
                unoptimized
                alt="Students achieving goals"
                className="rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Course Completion Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900">94%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
