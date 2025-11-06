"use client";

import { imageConstants } from "@/constant/image.constant";
import { useAuth, useRequireAuth } from "@/hooks/useAuth";
import {
  BarChart3,
  BookDashed,
  BookOpen,
  ChevronRight,
  History,
  Home,
  Languages,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

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
    name: "IPA Chart",
    href: "/student/ipa",
    icon: Languages,
    description: "International Phonetic Alphabet",
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
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useRequireAuth();
  const { user } = useAuth();

  useLayoutEffect(() => {
    if (!isLoading && user) {
      if (user.role !== "student") {
        router.push("/");
        return;
      }
    }
  }, [user, isLoading, router]);

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
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}>
        {/* Backdrop with blur */}
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
              {/* Close button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm">
                <X className="h-5 w-5" />
              </button>

              {/* Logo */}
              {/* TODO: show when have new logo */}
              {/* <div className="mb-6">
                <Image
                  src={imageConstants.logo}
                  alt="logo"
                  width={80}
                  height={80}
                  className="brightness-0 invert"
                />
              </div> */}

              {/* User Profile Section */}
              {user && (
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                      <User className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg truncate">
                      {user.name}
                    </h3>
                    <p className="text-white/80 text-sm truncate">
                      {user.email}
                    </p>
                    {user.level && (
                      <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30">
                        {user.level.charAt(0).toUpperCase() +
                          user.level.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="px-4 space-y-2">
                {navigation.map((item, index) => {
                  const isActive =
                    pathname === "/student" && item.href === "/student"
                      ? true
                      : pathname.includes(item.href) &&
                        item.href !== "/student";

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
                      style={{
                        animationDelay: `${index * 30}ms`,
                      }}>
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
                            className={`text-xs mt-0.5 ${
                              isActive
                                ? "text-blue-600"
                                : "text-gray-500 group-hover:text-gray-600"
                            }`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 flex-shrink-0 transition-transform ${
                          isActive
                            ? "text-blue-600 translate-x-0"
                            : "text-gray-400 -translate-x-1 group-hover:translate-x-0 group-hover:text-gray-600"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
              <Link
                href="/student/profile"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <div className="flex-shrink-0 p-2 rounded-lg bg-gray-200 text-gray-600">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">View Profile</div>
                  <div className="text-xs text-gray-500">
                    Manage your account
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 z-10 ${
          desktopSidebarCollapsed ? "lg:w-16" : "lg:w-64"
        }`}>
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200 shadow-lg">
          {/* Header with logo and toggle button */}
          <div className="mx-auto">
            <Link
              href="/student"
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
                Hi, {user?.name}
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
