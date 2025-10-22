import StudentDashboardLayout from "@/components/student/dashboard-layout";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentDashboardLayout>{children}</StudentDashboardLayout>;
}
