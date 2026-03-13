/**
 * Pre-registration API. Payload field names per docs/specs/11-pre-register-field-mapping.md.
 * All pre-register API calls go through this module (no inline fetch in components).
 */

import { request, ApiError } from './client';

/** Request shape per PreRegisterDto / 11-pre-register-field-mapping.md */
export interface PreRegisterPayload {
  applicantEmail: string;
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
  studentGender: 'MALE' | 'FEMALE';
  studentBirthDate: string;
  lastEducationLocation: string;
  nisn?: string;
  /** UI only: selected visa document filename for display on review step (not sent to API) */
  visaDocumentFileName?: string;
}

/** Response shape from backend */
export interface PreRegisterResult {
  applicationId: string;
  applicationNo: string;
}

/**
 * POST /public/applications/pre-register
 * Builds payload from form values; omits nisn when empty (backend stores null).
 */
export async function submitPreRegister(
  payload: PreRegisterPayload
): Promise<PreRegisterResult> {
  const { visaDocumentFileName, ...rest } = payload;
  const body = { ...rest };
  if (body.nisn === '' || body.nisn === undefined) {
    delete body.nisn;
  }
  return request<PreRegisterResult>('/public/applications/pre-register', {
    method: 'POST',
    body,
  });
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Upload visa/izin tinggal document for pre-registration (public, no auth).
 * Must be called within 30 minutes of pre-register submit.
 */
export async function uploadPreRegisterVisaDocument(
  applicationId: string,
  file: File
): Promise<{ id: string; fileName: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${BASE_URL}/public/applications/${applicationId}/documents/visa`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      typeof data.message === 'string'
        ? data.message
        : Array.isArray(data.message)
          ? data.message.join(' ')
          : 'Gagal mengunggah dokumen visa. Silakan coba lagi.';
    throw new ApiError(msg, response.status, data);
  }

  return data;
}

export { ApiError };
