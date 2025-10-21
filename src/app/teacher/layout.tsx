import TeacherDashboardLayout from "@/components/teacher/teacher-dashboard-layout";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherDashboardLayout>{children}</TeacherDashboardLayout>;
}
