"use client";

import { CORE_SKILLS } from "@/constant/landing.constant";
import { motion } from "framer-motion";
import React from "react";

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Complete Mastery
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive curriculum covers the four pillars of language
            proficiency, ensuring you become a well-rounded speaker.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CORE_SKILLS.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 border border-transparent hover:border-blue-100 group">
              <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <skill.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {skill.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {skill.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
