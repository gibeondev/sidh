/**
 * Admin applications API. All calls use credentials: 'include' for auth.
 */

import { request, ApiError } from './client';

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'REJECTED';

export interface ApplicationPreRegistration {
  applicationId: string;
  applicantName: string;
  applicantRelationship: string;
  reasonLivingAbroad: string;
  reasonToApply: string;
  assignmentCity: string;
  assignmentCountry: string;
  domicileStartDate: string;
  domicileEndDate: string;
  permitExpiryDate: string;
  programChoice: string;
  educationLevel: string;
  gradeApplied: string;
  studentName: string;
  studentGender: string;
  studentBirthDate: string;
  lastEducationLocation: string;
  nisn: string | null;
}

export interface ApplicationListItem {
  id: string;
  applicationNo: string;
  applicantEmail: string;
  status: ApplicationStatus;
  submittedAt: string | null;
  createdAt: string;
  preRegistration: ApplicationPreRegistration | null;
}

export interface ApplicationDetail extends ApplicationListItem {
  decisionReason?: string | null;
  registrationPeriod?: { id: string; name: string };
}

export interface AdminApplicationsListResponse {
  items: ApplicationListItem[];
  total: number;
  page: number;
  limit: number;
  filterOptions?: AdminFilterOptions;
}


const credentials = 'include' as RequestCredentials;

export type AdminSortField =
  | 'createdAt'
  | 'applicationNo'
  | 'studentName'
  | 'programChoice'
  | 'assignmentCountry'
  | 'submittedAt'
  | 'status';
export type AdminSortOrder = 'asc' | 'desc';

export async function getAdminApplications(params: {
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
  search?: string;
  program?: string;
  country?: string;
  sortBy?: AdminSortField;
  sortOrder?: AdminSortOrder;
}): Promise<AdminApplicationsListResponse> {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set('status', params.status);
  if (params.page != null) searchParams.set('page', String(params.page));
  if (params.limit != null) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.program) searchParams.set('program', params.program);
  if (params.country) searchParams.set('country', params.country);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  const q = searchParams.toString();
  return request<AdminApplicationsListResponse>(
    `/admin/applications${q ? `?${q}` : ''}`,
    { credentials }
  );
}

export interface AdminFilterOptions {
  programs: string[];
  countries: string[];
}

export async function getAdminFilterOptions(): Promise<AdminFilterOptions> {
  return request<AdminFilterOptions>('/admin/applications/filter-options', { credentials });
}

export async function getAdminApplicationById(id: string): Promise<ApplicationDetail> {
  return request<ApplicationDetail>(`/admin/applications/${id}`, { credentials });
}

export async function approveApplication(id: string): Promise<ApplicationDetail> {
  return request<ApplicationDetail>(`/admin/applications/${id}/approve`, {
    method: 'POST',
    credentials,
  });
}

export async function rejectApplication(id: string, note: string): Promise<ApplicationDetail> {
  return request<ApplicationDetail>(`/admin/applications/${id}/reject`, {
    method: 'POST',
    body: { note },
    credentials,
  });
}

export async function requestChangesApplication(id: string, note: string): Promise<ApplicationDetail> {
  return request<ApplicationDetail>(`/admin/applications/${id}/request-changes`, {
    method: 'POST',
    body: { note },
    credentials,
  });
}

export { ApiError };
