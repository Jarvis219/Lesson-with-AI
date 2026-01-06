"use client";

import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/constant/landing.constant";
import { useRequireAuth } from "@/hooks/useAuth";
import { Languages, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useRequireAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg text-white">
              <Languages size={24} />
            </div>
            <span
              className={`text-2xl font-bold tracking-tight ${
                isScrolled ? "text-gray-900" : "text-gray-900 lg:text-white"
              }`}>
              Lean English<span className="text-blue-600">AI</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  isScrolled ? "text-gray-600" : "text-gray-200"
                }`}>
                {item.label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200/20">
                <Link
                  href="/auth/"
                  className={`text-sm font-semibold ${
                    isScrolled ? "text-gray-900" : "text-white"
                  }`}>
                  Log in
                </Link>
                <Link href="/auth">
                  <Button
                    variant={isScrolled ? "secondary" : "default"}
                    size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200/20">
                <Link href="/auth">
                  <Button
                    variant={isScrolled ? "secondary" : "default"}
                    size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${
                isScrolled ? "text-gray-900" : "text-gray-900 lg:text-white"
              }`}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 shadow-lg animate-in slide-in-from-top-5">
          <div className="flex flex-col space-y-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            <Button variant="secondary" className="w-full">
              Start Teaching
            </Button>
            <Button variant="default" className="w-full">
              Join as Student
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
