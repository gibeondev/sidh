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
  const body = { ...payload };
  if (body.nisn === '' || body.nisn === undefined) {
    delete body.nisn;
  }
  return request<PreRegisterResult>('/public/applications/pre-register', {
    method: 'POST',
    body,
  });
}

export { ApiError };
