export type SkillName =
  | "vocab"
  | "grammar"
  | "listening"
  | "speaking"
  | "reading"
  | "writing";

export interface TeacherStudentListItem {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  level: string;
  lastLogin: string | Date;
  status: "active" | "inactive";
  progressPercent: number;
}

export interface TeacherStudentsStatsResponse {
  totalStudents: number;
  averageScore: number; // 0-100
  completionRate: number; // 0-100
  weakSkills: SkillName[];
}

export interface TeacherStudentsSkillsStatsResponse {
  skills: Array<{
    skill: SkillName;
    average: number; // 0-100
  }>;
}

export interface TeacherStudentsListResponse<PaginationType> {
  students: TeacherStudentListItem[];
  pagination: PaginationType;
}
