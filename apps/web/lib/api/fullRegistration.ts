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
  // Step 2 — Data Orang Tua/Wali
  // Legacy fields (kept for backward compatibility, not used in Step 2)
  applicantName?: string;
  applicantRelationship?: string;
  applicantEmail?: string;
  assignmentCity?: string;
  assignmentCountry?: string;
  // Data Ayah
  fatherFullName: string;
  fatherBirthPlace: string;
  fatherBirthDate: string;
  fatherNik: string;
  fatherEducationLevel: string;
  fatherOccupation: string;
  fatherIncomeRange: string;
  fatherPhone: string;
  fatherEmail: string;
  // Data Ibu
  motherFullName: string;
  motherBirthPlace: string;
  motherBirthDate: string;
  motherNik: string;
  motherEducationLevel: string;
  motherOccupation: string;
  motherIncomeRange: string;
  motherPhone: string;
  motherEmail: string;
  // Data Wali
  guardianFullName: string;
  guardianBirthPlace: string;
  guardianBirthDate: string;
  guardianNik: string;
  guardianEducationLevel: string;
  guardianOccupation: string;
  guardianIncomeRange: string;
  guardianPhone: string;
  guardianEmail: string;
  // Step 3 — Alamat & Domisili
  parentServiceCountry: string; // Negara tempat dinas orang tua/ studi orang tua
  domicilePeriodStart: string; // Rencana periode domisili - Start
  domicilePeriodEnd: string; // Rencana periode domisili - End
  parentVisaType: 'Diplomat' | 'Student' | 'Diaspora'; // Informasi visa/ijin tinggal orang tua yang digunakan
  // Step 4 — Kebutuhan Khusus & Informasi Tambahan
  description: string; // Deskripsi
  additionalInfo: string; // Informasi tambahan yang dibutuhkan oleh sekolah
  // Step 5 — Dokumen (file references - will be handled separately via document upload API)
  // Document fields are stored as file references/IDs, not in this payload
  // Contacts for API submission
  contacts?: Array<{
    relationship: 'Father' | 'Mother' | 'Guardian';
    fullName: string;
    birthPlace: string;
    birthDate: string;
    nik: string;
    educationLevel: string;
    occupation: string;
    incomeRange: string;
    phone: string;
    email: string;
  }>;
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
