import { Button } from "@/components/ui/button";
import React from "react";

export const CTA: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-blue-900/30">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Start Your English Journey Today
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Whether you want to teach the next generation or master the language
            yourself, LinguaFlow is your gateway to success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg">
              Join as a Student
            </Button>
            <Button variant="secondary" size="lg">
              Become a Teacher
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
