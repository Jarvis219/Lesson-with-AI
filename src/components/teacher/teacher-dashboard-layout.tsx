"use client";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  BookOpen,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const navigation = [
  {
    name: "Courses",
    href: "/teacher/courses",
    icon: BookOpen,
  },
  {
    name: "Students Management",
    href: "/teacher/students",
    icon: Users,
  },
  {
    name: "Progress & Analytics",
    href: "/teacher/analytics",
    icon: BarChart2,
  },
  {
    name: "Communication",
    href: "/teacher/communication",
    icon: MessageSquare,
  },
  {
    name: "Settings & Profile",
    href: "/teacher/settings",
    icon: Settings,
  },
];

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && user) {
      // Check if user is a teacher
      if (user.role !== "teacher") {
        router.push("/dashboard");
        return;
      }

      // Check if teacher is approved
      if (!user.isTeacherApproved) {
        router.push("/teacher/pending-approval");
        return;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
              <div className="flex flex-col flex-grow">
                <nav className="flex-1 px-2 pb-4 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          isActive
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                        )}>
                        <item.icon
                          className={cn(
                            isActive
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-3 flex-shrink-0 h-5 w-5"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
