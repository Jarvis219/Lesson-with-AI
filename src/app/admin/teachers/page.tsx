"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import { TeacherService } from "@/lib/teacher-service";
import type { Teacher } from "@/types/teacher";
import { CheckCircle, Clock, Search, UserCheck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminTeachersPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeachers();
    }
  }, [isAuthenticated, selectedStatus]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const status =
        selectedStatus === "all"
          ? "all"
          : selectedStatus === "pending"
          ? "pending"
          : "approved";
      const teachers = await TeacherService.getTeachers(status);
      setTeachers(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string, approved: boolean) => {
    try {
      await TeacherService.approveTeacher(userId, approved);

      // Refresh the teachers list
      fetchTeachers();
    } catch (error: any) {
      console.error("Error approving teacher:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const pendingCount = teachers.filter((t) => !t.isTeacherApproved).length;
  const approvedCount = teachers.filter((t) => t.isTeacherApproved).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-100">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Teacher Management
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Review and approve teacher applications
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
          <div className="relative p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Total Teachers
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                {teachers.length}
              </p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <UserCheck className="h-7 w-7" />
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
          <div className="relative p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Pending Approval
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                {pendingCount}
              </p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Clock className="h-7 w-7" />
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
          <div className="relative p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Approved
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                {approvedCount}
              </p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full pl-12 pr-3 py-2 h-11 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                className="block w-full px-3 py-2 h-11 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Teachers List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm">
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-16">
            <UserCheck className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">
              No teachers found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {selectedStatus === "pending"
                ? "No pending teacher applications"
                : "No teachers match your search criteria"}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredTeachers.map((teacher) => (
              <li key={teacher._id}>
                <div className="px-4 py-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate max-w-full">
                          {teacher.name}
                        </h3>
                        {teacher.isTeacherApproved ? (
                          <span className="inline-flex shrink-0 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-1 sm:line-clamp-none break-all sm:break-normal">
                        {teacher.email}
                      </p>
                      {teacher.teacherBio && (
                        <p className="text-sm text-slate-600 mb-2 line-clamp-2 break-words break-all">
                          {teacher.teacherBio}
                        </p>
                      )}
                      {teacher.teacherQualification && (
                        <p className="text-sm text-slate-600 mb-2 line-clamp-2 break-words break-all">
                          {teacher.teacherQualification}
                        </p>
                      )}
                      <p className="text-xs text-slate-400">
                        Applied on{" "}
                        {new Date(teacher.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="w-full sm:w-auto sm:ml-4 ml-0 mt-2 sm:mt-0 flex flex-col gap-2">
                      {!teacher.isTeacherApproved && (
                        <button
                          onClick={() => handleApprove(teacher._id, true)}
                          className="inline-flex items-center justify-center w-full sm:w-auto h-10 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </button>
                      )}
                      {teacher.isTeacherApproved && (
                        <button
                          onClick={() => handleApprove(teacher._id, false)}
                          className="inline-flex items-center justify-center w-full sm:w-auto h-10 px-4 border border-slate-200 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <XCircle className="h-4 w-4 mr-2" />
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
