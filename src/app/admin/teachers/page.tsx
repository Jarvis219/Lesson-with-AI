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
    <div className="p-6">
      <div className="">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Teacher Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Review and approve teacher applications
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Teachers
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {teachers.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Approval
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {pendingCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Approved
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {approvedCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="sr-only">
                  Search teachers
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search teachers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

        {/* Teachers Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No teachers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedStatus === "pending"
                  ? "No pending teacher applications"
                  : "No teachers match your search criteria"}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <li key={teacher._id}>
                  <div className="px-4 py-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {teacher.name}
                          </h3>
                          {teacher.isTeacherApproved ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {teacher.email}
                        </p>
                        {teacher.teacherBio && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Bio:
                            </p>
                            <p className="text-sm text-gray-600">
                              {teacher.teacherBio}
                            </p>
                          </div>
                        )}
                        {teacher.teacherQualification && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Qualifications:
                            </p>
                            <p className="text-sm text-gray-600">
                              {teacher.teacherQualification}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-gray-400">
                          Applied on{" "}
                          {new Date(teacher.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        {!teacher.isTeacherApproved && (
                          <button
                            onClick={() => handleApprove(teacher._id, true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </button>
                        )}
                        {teacher.isTeacherApproved && (
                          <button
                            onClick={() => handleApprove(teacher._id, false)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
    </div>
  );
}
