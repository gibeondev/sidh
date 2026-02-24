/**
 * Admin students API. Lists student profiles (created when full registration is approved).
 * All calls use credentials: 'include'. Admin only.
 */

import { request, ApiError } from './client';

export { ApiError };

export interface AdminStudentListItem {
  id: string;
  applicationId: string;
  studentFullName: string;
  programChoice: string;
  gradeApplied: string;
  studentGender: string;
  studentBirthDate: string;
  birthPlace: string;
  nik: string;
  religion: string;
  nisn: string;
  currentSchoolName: string;
  currentSchoolCountry: string;
  createdAt: string;
  application?: {
    applicationNo: string;
    applicantEmail: string;
    submittedAt: string | null;
  };
}

const credentials = 'include' as RequestCredentials;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getAdminStudents(): Promise<AdminStudentListItem[]> {
  return request<AdminStudentListItem[]>('/admin/students', { credentials });
}

export interface AdminStudentDetailContact {
  id?: string;
  relationship: string;
  fullName: string;
  occupation: string;
  birthPlace?: string;
  birthDate?: string;
  nik?: string;
  educationLevel?: string;
  incomeRange?: string;
  phone?: string;
  email?: string;
}

export interface AdminStudentDetail {
  id: string;
  applicationId: string;
  studentFullName: string;
  programChoice: string;
  gradeApplied: string;
  studentGender: string;
  studentBirthDate: string;
  birthPlace: string;
  nik: string;
  religion: string;
  heightCm: number;
  weightKg: number;
  nisn: string;
  lastSchoolIndonesia: string;
  currentSchoolName: string;
  currentSchoolCountry: string;
  childOrder: number;
  siblingsCount: number;
  lastDiplomaSerialNumber: string | null;
  hasSpecialNeeds: string;
  addressIndonesia: string;
  domicileRegion: string;
  phoneCountryCode: string;
  phoneNumber: string;
  createdAt: string;
  application?: {
    applicationNo: string;
    applicantEmail: string;
    submittedAt: string | null;
    contacts: AdminStudentDetailContact[];
  };
}

export async function getAdminStudentById(id: string): Promise<AdminStudentDetail> {
  return request<AdminStudentDetail>(`/admin/students/${id}`, { credentials });
}

export interface AdminStudentExportFilterOptions {
  grades: string[];
  countries: string[];
  occupations: string[];
}

export async function getAdminStudentExportFilterOptions(): Promise<AdminStudentExportFilterOptions> {
  return request<AdminStudentExportFilterOptions>('/admin/students/filter-options', { credentials });
}

/** Trigger download of students CSV export (UTF-8). Filters optional. */
export async function downloadAdminStudentsExportCsv(filters: {
  grade?: string;
  country?: string;
  occupation?: string;
}): Promise<void> {
  const params = new URLSearchParams();
  if (filters.grade) params.set('grade', filters.grade);
  if (filters.country) params.set('country', filters.country);
  if (filters.occupation) params.set('occupation', filters.occupation);
  const url = `${API_URL}/admin/students/export${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url, { credentials: 'include' });
  const text = await res.text();
  if (!res.ok) throw new ApiError(text || 'Export gagal', res.status);
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'daftar-siswa.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}
