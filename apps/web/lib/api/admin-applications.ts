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
  /** Catatan Internal (admin-only) */
  note: string | null;
  /** Pre-registration status */
  status?: ApplicationStatus;
  decisionReason?: string | null;
  submittedAt?: string | null;
}

export interface RegistrationSubmissionListItem {
  studentFullName: string;
  programChoice: string;
  gradeApplied: string;
  studentGender: string;
  studentBirthDate: string;
  birthPlace: string;
  nik: string;
  religion: string;
  heightCm?: number;
  weightKg?: number;
  nisn?: string;
  lastSchoolIndonesia?: string;
  currentSchoolName?: string;
  currentSchoolCountry?: string;
  childOrder?: number;
  siblingsCount?: number;
  lastDiplomaSerialNumber?: string | null;
  hasSpecialNeeds?: string;
  /** Keterangan kebutuhan khusus (jika ada) */
  description?: string | null;
  /** Informasi tambahan yang dibutuhkan oleh sekolah */
  additionalInfo?: string | null;
  addressIndonesia?: string;
  domicileRegion?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  [key: string]: unknown;
}

export interface ApplicationContactItem {
  id: string;
  relationship: string;
  fullName: string;
  birthPlace: string;
  birthDate: string;
  nik: string;
  educationLevel: string;
  occupation: string;
  incomeRange: string;
  phone: string;
  email: string;
}

export interface ApplicationDocumentItem {
  id: string;
  documentType: string;
  status: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  reviewedAt?: string | null;
  reviewNote?: string | null;
}

export interface ApplicationListItem {
  id: string;
  applicationNo: string;
  applicantEmail: string;
  status: ApplicationStatus;
  submittedAt: string | null;
  createdAt: string;
  preRegistration: ApplicationPreRegistration | null;
  registrationSubmission?: RegistrationSubmissionListItem | null;
}

export interface ApplicationDetail extends ApplicationListItem {
  decisionReason?: string | null;
  registrationPeriod?: { id: string; name: string };
  registrationSubmission?: RegistrationSubmissionListItem | null;
  contacts?: ApplicationContactItem[];
  documents?: ApplicationDocumentItem[];
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
  hasFullRegistration?: boolean;
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
  if (params.hasFullRegistration === true) searchParams.set('hasFullRegistration', 'true');
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

export async function approveApplication(
  id: string,
  statusType?: 'preRegistration' | 'fullRegistration'
): Promise<ApplicationDetail> {
  const searchParams = new URLSearchParams();
  if (statusType) searchParams.set('statusType', statusType);
  const q = searchParams.toString();
  return request<ApplicationDetail>(`/admin/applications/${id}/approve${q ? `?${q}` : ''}`, {
    method: 'POST',
    credentials,
  });
}

export async function rejectApplication(
  id: string,
  note: string,
  statusType?: 'preRegistration' | 'fullRegistration'
): Promise<ApplicationDetail> {
  const searchParams = new URLSearchParams();
  if (statusType) searchParams.set('statusType', statusType);
  const q = searchParams.toString();
  return request<ApplicationDetail>(`/admin/applications/${id}/reject${q ? `?${q}` : ''}`, {
    method: 'POST',
    body: { note },
    credentials,
  });
}

export async function requestChangesApplication(
  id: string,
  note: string,
  statusType?: 'preRegistration' | 'fullRegistration'
): Promise<ApplicationDetail> {
  const searchParams = new URLSearchParams();
  if (statusType) searchParams.set('statusType', statusType);
  const q = searchParams.toString();
  return request<ApplicationDetail>(`/admin/applications/${id}/request-changes${q ? `?${q}` : ''}`, {
    method: 'POST',
    body: { note },
    credentials,
  });
}

export async function updateInternalNote(
  id: string,
  note: string
): Promise<ApplicationDetail> {
  return request<ApplicationDetail>(`/admin/applications/${id}/internal-note`, {
    method: 'PATCH',
    body: { note },
    credentials,
  });
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  decisionReason?: string,
  statusType?: 'preRegistration' | 'fullRegistration'
): Promise<ApplicationDetail> {
  const searchParams = new URLSearchParams();
  if (statusType) searchParams.set('statusType', statusType);
  const q = searchParams.toString();
  return request<ApplicationDetail>(`/admin/applications/${id}/status${q ? `?${q}` : ''}`, {
    method: 'PATCH',
    body: { status, decisionReason },
    credentials,
  });
}

export { ApiError };
