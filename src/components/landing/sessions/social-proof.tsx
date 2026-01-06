import { STATS, TESTIMONIALS } from "@/constant/landing.constant";
import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

export const SocialProof: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center pt-8 md:pt-0">
              <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-500 font-medium uppercase tracking-wide text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Loved by Learners & Teachers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-gray-50 p-8 rounded-2xl relative">
              <div className="flex gap-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <Image
                  unoptimized
                  src={t.image}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                  <span className="text-blue-600 text-xs font-semibold uppercase">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
