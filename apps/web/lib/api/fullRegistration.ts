/**
 * Full Registration wizard API.
 * PATCH /parent/applications/:id — update (draft).
 * POST /parent/applications/:id/submit — submit (per spec 04-api-surface.phase1).
 * All calls use credentials: 'include' for auth.
 */

import { request, ApiError } from './client';

/** Form payload for full registration wizard. Fields per Figma Full Registration design; align with backend DTO when defined. */
export interface FullRegistrationPayload {
  // Step 1 — Data Siswa
  studentName: string;
  programChoice: string;
  gradeApplied: string;
  studentGender: 'MALE' | 'FEMALE';
  studentBirthDate: string;
  birthPlace: string;
  nik: string;
  religion: string;
  heightCm: string;
  weightKg: string;
  nisn: string;
  lastSchoolIndonesia: string;
  currentSchoolName: string;
  currentSchoolCountry: string;
  childOrder: string;
  siblingCount: string;
  lastDiplomaSerialNumber: string;
  hasSpecialNeeds: 'YES' | 'NO';
  addressIndonesia: string;
  domicileRegion: string;
  phoneCountryCode: string;
  phoneNumber: string;
  // Step 2 — Data Orang Tua/Wali (existing)
  applicantName: string;
  applicantRelationship: string;
  applicantEmail: string;
  assignmentCity: string;
  assignmentCountry: string;
  // Step 3 — Alamat & Domisili
  addressLine: string;
  postalCode: string;
  // Step 4 — Kebutuhan Khusus & Informasi Tambahan
  educationLevel: string;
  lastEducationLocation: string;
}

const credentials = 'include' as RequestCredentials;

/**
 * PATCH /parent/applications/:id
 * Update application (draft). Payload shape TBD by backend DTO.
 */
export async function updateApplication(
  applicationId: string,
  payload: Partial<FullRegistrationPayload>
): Promise<unknown> {
  return request<unknown>(`/parent/applications/${applicationId}`, {
    method: 'PATCH',
    body: payload,
    credentials,
  });
}

/**
 * POST /parent/applications/:id/submit
 * Submit full registration. Payload shape TBD by backend DTO.
 * TODO: Wire to backend when endpoint and DTO are defined.
 */
export async function submitFullRegistration(
  applicationId: string,
  payload: FullRegistrationPayload
): Promise<{ ok: boolean }> {
  try {
    await request<unknown>(`/parent/applications/${applicationId}/submit`, {
      method: 'POST',
      body: payload,
      credentials,
    });
    return { ok: true };
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError('Pengiriman gagal.', undefined, { message: 'Submit failed' });
  }
}

export { ApiError };
