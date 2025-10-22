"use client";

import { imageConstants } from "@/constant/image.constant";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  BarChart3,
  BookDashed,
  BookOpen,
  History,
  Home,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface DashboardLayoutProps {
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
    name: "Overview",
    href: "/student",
    icon: Home,
    description: "Progress and recent activity",
  },
  {
    name: "Courses",
    href: "/student/courses",
    icon: BookDashed,
    description: "Courses and progress",
  },
  {
    name: "Lessons",
    href: "/student/lessons",
    icon: BookOpen,
    description: "Lessons and progress",
  },
  {
    name: "History",
    href: "/student/history",
    icon: History,
    description: "Lesson history and results",
  },
  {
    name: "Statistics",
    href: "/student/statistics",
    icon: BarChart3,
    description: "Charts and analytics",
  },
  {
    name: "Profile",
    href: "/student/profile",
    icon: User,
    description: "Personal information and goals",
  },
  {
    name: "Settings",
    href: "/student/settings",
    icon: Settings,
    description: "Account settings",
  },
];

export default function StudentDashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}>
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Image
                src={imageConstants.logo}
                alt="logo"
                width={100}
                height={100}
              />
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === "/student" && item.href === "/student"
                    ? true
                    : pathname.includes(item.href) && item.href !== "/student";

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}>
                    <item.icon
                      className={`mr-4 flex-shrink-0 h-6 w-6 ${
                        isActive
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">
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

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ${
          desktopSidebarCollapsed ? "lg:w-16" : "lg:w-64"
        }`}>
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200 shadow-lg">
          {/* Header with logo and toggle button */}
          <div className="mx-auto">
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

          <div className="flex-1 flex flex-col pt-4 pb-4 overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === "/student" && item.href === "/student"
                    ? true
                    : pathname.includes(item.href) && item.href !== "/student";

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-100 text-blue-900 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    title={desktopSidebarCollapsed ? item.name : undefined}>
                    <item.icon
                      className={`flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                        isActive
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      } ${desktopSidebarCollapsed ? "mx-auto" : "mr-3"}`}
                    />
                    {!desktopSidebarCollapsed && (
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{item.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {item.description}
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          desktopSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}>
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop sidebar toggle */}
            <button
              type="button"
              className="hidden lg:flex items-center justify-center h-10 w-10 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              onClick={() =>
                setDesktopSidebarCollapsed(!desktopSidebarCollapsed)
              }
              title={
                desktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }>
              <Menu className="h-5 w-5" />
            </button>

            {/* Page title or breadcrumb can go here */}
            <div className="flex-1 lg:ml-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Student Dashboard
              </h1>
            </div>

            {/* User info or actions can go here */}
            <div className="flex items-center space-x-4">
              {/* Add user avatar, notifications, etc. here */}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
