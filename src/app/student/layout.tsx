import StudentDashboardLayout from "@/components/dashboard/dashboard-layout";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentDashboardLayout>{children}</StudentDashboardLayout>;
}
