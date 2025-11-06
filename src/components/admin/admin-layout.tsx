"use client";

import { imageConstants } from "@/constant/image.constant";
import { useRequireAdmin } from "@/hooks/useAuth";
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Home,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
    description: "Overview and analytics",
  },
  {
    name: "Lessons",
    href: "/admin/lessons",
    icon: BookOpen,
    description: "Manage lessons and content",
  },
  {
    name: "Vocab Lists",
    href: "/admin/vocab-lists",
    icon: BookOpen,
    description: "Manage vocabulary groups",
  },
  {
    name: "Vocabulary",
    href: "/admin/vocabulary",
    icon: BookOpen,
    description: "Create and organize words",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    description: "User management",
  },
  {
    name: "Teachers",
    href: "/admin/teachers",
    icon: CheckCircle,
    description: "Approve teacher applications",
  },
  {
    name: "Statistics",
    href: "/admin/stats",
    icon: BarChart3,
    description: "Analytics and reports",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "System configuration",
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isAdmin, isLoading: authLoading } = useRequireAdmin();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar - matches teacher dashboard style */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar panel */}
        <div
          className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
          <div className="flex flex-col h-full">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-6 py-8">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm">
                <X className="h-5 w-5" />
              </button>

              {/* Logo */}
              <div className="mb-2">
                <Image
                  src={imageConstants.logo}
                  alt="logo"
                  width={80}
                  height={80}
                  className="brightness-0 invert"
                />
              </div>

              <h2 className="text-white font-semibold text-lg">Admin Panel</h2>
              <p className="text-white/80 text-sm">Manage the platform</p>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="px-4 space-y-2">
                {navigation.map((item, index) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md"
                          : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                      }`}
                      style={{ animationDelay: `${index * 30}ms` }}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                          }`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-semibold text-base ${
                              isActive ? "text-blue-900" : "text-gray-900"
                            }`}>
                            {item.name}
                          </div>
                          <div
                            className={`${
                              isActive
                                ? "text-blue-600"
                                : "text-gray-500 group-hover:text-gray-600"
                            } text-xs mt-0.5`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar - aligned with teacher dashboard visuals */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200 shadow-lg">
          <div className="mx-auto py-4">
            <Link
              href="/"
              className="cursor-pointer transition-opacity duration-300">
              <Image
                src={imageConstants.logo}
                alt="logo"
                width={120}
                height={120}
              />
            </Link>
          </div>
          <div className="flex-1 flex flex-col pt-2 pb-4 overflow-y-auto">
            <nav className="mt-2 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-100 text-blue-900 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}>
                    <item.icon
                      className={`flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                        isActive
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-3`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar to open mobile sidebar */}
        <div className="sticky top-0 z-10 lg:hidden bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 pr-2">
              Admin Panel
            </h1>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
