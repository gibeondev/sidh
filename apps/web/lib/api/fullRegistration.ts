/**
 * Full Registration wizard API.
 * PATCH /parent/applications/:id — update (draft).
 * POST /parent/applications/:id/submit — submit (per spec 04-api-surface.phase1).
 * All calls use credentials: 'include' for auth.
 */

import { request, ApiError } from './client';

const credentials = 'include' as RequestCredentials;

/** Parent application list item (from GET /parent/applications). */
export interface ParentApplicationListItem {
  id: string;
  applicationNo: string;
  applicantEmail: string;
  status: string;
  submittedAt: string | null;
  createdAt: string;
  registrationPeriod?: { id: string; name: string };
  preRegistration?: { applicantName?: string; studentName?: string; status?: string };
  registrationSubmission?: unknown;
}

/**
 * GET /parent/applications
 * List applications for the logged-in parent (for Pendaftaran list and wizard entry).
 */
export async function listParentApplications(): Promise<ParentApplicationListItem[]> {
  return request<ParentApplicationListItem[]>('/parent/applications', { credentials });
}

/** Single application detail (from GET /parent/applications/:id) for wizard pre-fill. */
export interface ParentApplicationDetail {
  id: string;
  status: string;
  registrationSubmission?: {
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
    parentServiceCountry?: string | null;
    domicilePeriodStart?: string | null;
    domicilePeriodEnd?: string | null;
    parentVisaType?: string | null;
    description?: string | null;
    additionalInfo?: string | null;
  } | null;
  contacts?: Array<{
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
  }>;
}

/**
 * GET /parent/applications/:id
 * Fetch one application for the logged-in parent (used to pre-fill wizard).
 */
export async function getParentApplication(applicationId: string): Promise<ParentApplicationDetail> {
  return request<ParentApplicationDetail>(`/parent/applications/${applicationId}`, { credentials });
}

/** Format a date from API (ISO string) to YYYY-MM-DD for form inputs. */
function toDateString(v: string | undefined): string {
  if (!v) return '';
  try {
    const d = new Date(v);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch {
    return '';
  }
}

/**
 * Map API application detail to form default values. Used when opening wizard for an existing/submitted application.
 */
export function mapApplicationToFormPayload(app: ParentApplicationDetail): FullRegistrationPayload {
  const empty: FullRegistrationPayload = {
    studentName: '',
    programChoice: 'PJJ',
    gradeApplied: '',
    studentGender: 'MALE',
    studentBirthDate: '',
    birthPlace: '',
    nik: '',
    religion: '',
    heightCm: '',
    weightKg: '',
    nisn: '',
    lastSchoolIndonesia: '',
    currentSchoolName: '',
    currentSchoolCountry: '',
    childOrder: '',
    siblingCount: '',
    lastDiplomaSerialNumber: '',
    hasSpecialNeeds: 'NO',
    addressIndonesia: '',
    domicileRegion: '',
    phoneCountryCode: '+62',
    phoneNumber: '',
    fatherFullName: '',
    fatherBirthPlace: '',
    fatherBirthDate: '',
    fatherNik: '',
    fatherEducationLevel: '',
    fatherOccupation: '',
    fatherIncomeRange: '',
    fatherPhone: '',
    fatherEmail: '',
    motherFullName: '',
    motherBirthPlace: '',
    motherBirthDate: '',
    motherNik: '',
    motherEducationLevel: '',
    motherOccupation: '',
    motherIncomeRange: '',
    motherPhone: '',
    motherEmail: '',
    guardianFullName: '',
    guardianBirthPlace: '',
    guardianBirthDate: '',
    guardianNik: '',
    guardianEducationLevel: '',
    guardianOccupation: '',
    guardianIncomeRange: '',
    guardianPhone: '',
    guardianEmail: '',
    parentServiceCountry: '',
    domicilePeriodStart: '',
    domicilePeriodEnd: '',
    parentVisaType: 'Diplomat',
    description: '',
    additionalInfo: '',
  };

  if (!app.registrationSubmission) return empty;

  const rs = app.registrationSubmission;
  const contacts = app.contacts ?? [];
  const father = contacts.find((c) => c.relationship === 'Father');
  const mother = contacts.find((c) => c.relationship === 'Mother');
  const guardian = contacts.find((c) => c.relationship === 'Guardian');

  return {
    ...empty,
    studentName: rs.studentFullName ?? '',
    programChoice: rs.programChoice ?? 'PJJ',
    gradeApplied: rs.gradeApplied ?? '',
    studentGender: (rs.studentGender === 'FEMALE' ? 'FEMALE' : 'MALE') as 'MALE' | 'FEMALE',
    studentBirthDate: toDateString(rs.studentBirthDate),
    birthPlace: rs.birthPlace ?? '',
    nik: rs.nik ?? '',
    religion: rs.religion ?? '',
    heightCm: rs.heightCm != null ? String(rs.heightCm) : '',
    weightKg: rs.weightKg != null ? String(rs.weightKg) : '',
    nisn: rs.nisn ?? '',
    lastSchoolIndonesia: rs.lastSchoolIndonesia ?? '',
    currentSchoolName: rs.currentSchoolName ?? '',
    currentSchoolCountry: rs.currentSchoolCountry ?? '',
    childOrder: rs.childOrder != null ? String(rs.childOrder) : '',
    siblingCount: rs.siblingsCount != null ? String(rs.siblingsCount) : '',
    lastDiplomaSerialNumber: rs.lastDiplomaSerialNumber ?? '',
    hasSpecialNeeds: (rs.hasSpecialNeeds === 'YES' ? 'YES' : 'NO') as 'YES' | 'NO',
    addressIndonesia: rs.addressIndonesia ?? '',
    domicileRegion: rs.domicileRegion ?? '',
    phoneCountryCode: rs.phoneCountryCode ?? '+62',
    phoneNumber: rs.phoneNumber ?? '',
    fatherFullName: father?.fullName ?? '',
    fatherBirthPlace: father?.birthPlace ?? '',
    fatherBirthDate: toDateString(father?.birthDate),
    fatherNik: father?.nik ?? '',
    fatherEducationLevel: father?.educationLevel ?? '',
    fatherOccupation: father?.occupation ?? '',
    fatherIncomeRange: father?.incomeRange ?? '',
    fatherPhone: father?.phone ?? '',
    fatherEmail: father?.email ?? '',
    motherFullName: mother?.fullName ?? '',
    motherBirthPlace: mother?.birthPlace ?? '',
    motherBirthDate: toDateString(mother?.birthDate),
    motherNik: mother?.nik ?? '',
    motherEducationLevel: mother?.educationLevel ?? '',
    motherOccupation: mother?.occupation ?? '',
    motherIncomeRange: mother?.incomeRange ?? '',
    motherPhone: mother?.phone ?? '',
    motherEmail: mother?.email ?? '',
    guardianFullName: guardian?.fullName ?? '',
    guardianBirthPlace: guardian?.birthPlace ?? '',
    guardianBirthDate: toDateString(guardian?.birthDate),
    guardianNik: guardian?.nik ?? '',
    guardianEducationLevel: guardian?.educationLevel ?? '',
    guardianOccupation: guardian?.occupation ?? '',
    guardianIncomeRange: guardian?.incomeRange ?? '',
    guardianPhone: guardian?.phone ?? '',
    guardianEmail: guardian?.email ?? '',
    parentServiceCountry: rs.parentServiceCountry ?? '',
    domicilePeriodStart: toDateString(rs.domicilePeriodStart ?? undefined),
    domicilePeriodEnd: toDateString(rs.domicilePeriodEnd ?? undefined),
    parentVisaType: (rs.parentVisaType === 'Student' || rs.parentVisaType === 'Diaspora' ? rs.parentVisaType : 'Diplomat') as 'Diplomat' | 'Student' | 'Diaspora',
    description: rs.description ?? '',
    additionalInfo: rs.additionalInfo ?? '',
  };
}

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

/**
 * Build partial payload for draft save: only include fields that have a value (no empty string).
 * Prevents overwriting existing draft data with blanks.
 */
export function buildDraftPayload(form: Partial<FullRegistrationPayload>): Partial<FullRegistrationPayload> {
  const payload: Partial<FullRegistrationPayload> = {};
  const str = (v: string | undefined) => v != null && String(v).trim() !== '';
  const set = (key: keyof FullRegistrationPayload, value: unknown) => {
    if (value !== undefined && value !== null && value !== '') {
      (payload as Record<string, unknown>)[key] = value;
    }
  };

  if (str(form.studentName)) set('studentName', form.studentName);
  if (str(form.programChoice)) set('programChoice', form.programChoice);
  if (str(form.gradeApplied)) set('gradeApplied', form.gradeApplied);
  if (form.studentGender) set('studentGender', form.studentGender);
  if (str(form.studentBirthDate)) set('studentBirthDate', form.studentBirthDate);
  if (str(form.birthPlace)) set('birthPlace', form.birthPlace);
  if (str(form.nik)) set('nik', form.nik);
  if (str(form.religion)) set('religion', form.religion);
  if (str(form.heightCm)) set('heightCm', form.heightCm);
  if (str(form.weightKg)) set('weightKg', form.weightKg);
  if (str(form.nisn)) set('nisn', form.nisn);
  if (str(form.lastSchoolIndonesia)) set('lastSchoolIndonesia', form.lastSchoolIndonesia);
  if (str(form.currentSchoolName)) set('currentSchoolName', form.currentSchoolName);
  if (str(form.currentSchoolCountry)) set('currentSchoolCountry', form.currentSchoolCountry);
  if (str(form.childOrder)) set('childOrder', form.childOrder);
  if (str(form.siblingCount)) set('siblingCount', form.siblingCount);
  if (form.lastDiplomaSerialNumber != null) set('lastDiplomaSerialNumber', form.lastDiplomaSerialNumber);
  if (form.hasSpecialNeeds) set('hasSpecialNeeds', form.hasSpecialNeeds);
  if (str(form.addressIndonesia)) set('addressIndonesia', form.addressIndonesia);
  if (str(form.domicileRegion)) set('domicileRegion', form.domicileRegion);
  if (str(form.phoneCountryCode)) set('phoneCountryCode', form.phoneCountryCode);
  if (str(form.phoneNumber)) set('phoneNumber', form.phoneNumber);

  // Step 3 — Alamat & Domisili
  if (form.parentServiceCountry !== undefined) set('parentServiceCountry', form.parentServiceCountry);
  if (str(form.domicilePeriodStart)) set('domicilePeriodStart', form.domicilePeriodStart);
  if (str(form.domicilePeriodEnd)) set('domicilePeriodEnd', form.domicilePeriodEnd);
  if (form.parentVisaType) set('parentVisaType', form.parentVisaType);

  // Step 4 — Kebutuhan Khusus & Informasi Tambahan
  if (form.description !== undefined) set('description', form.description);
  if (form.additionalInfo !== undefined) set('additionalInfo', form.additionalInfo);

  const hasFather = str(form.fatherFullName) || str(form.fatherEmail);
  const hasMother = str(form.motherFullName) || str(form.motherEmail);
  const hasGuardian = str(form.guardianFullName) || str(form.guardianEmail);
  if (hasFather || hasMother || hasGuardian) {
    const contacts: NonNullable<FullRegistrationPayload['contacts']> = [];
    if (hasFather) {
      contacts.push({
        relationship: 'Father',
        fullName: form.fatherFullName ?? '',
        birthPlace: form.fatherBirthPlace ?? '',
        birthDate: form.fatherBirthDate ?? '',
        nik: form.fatherNik ?? '',
        educationLevel: form.fatherEducationLevel ?? '',
        occupation: form.fatherOccupation ?? '',
        incomeRange: form.fatherIncomeRange ?? '',
        phone: form.fatherPhone ?? '',
        email: form.fatherEmail ?? '',
      });
    }
    if (hasMother) {
      contacts.push({
        relationship: 'Mother',
        fullName: form.motherFullName ?? '',
        birthPlace: form.motherBirthPlace ?? '',
        birthDate: form.motherBirthDate ?? '',
        nik: form.motherNik ?? '',
        educationLevel: form.motherEducationLevel ?? '',
        occupation: form.motherOccupation ?? '',
        incomeRange: form.motherIncomeRange ?? '',
        phone: form.motherPhone ?? '',
        email: form.motherEmail ?? '',
      });
    }
    if (hasGuardian) {
      contacts.push({
        relationship: 'Guardian',
        fullName: form.guardianFullName ?? '',
        birthPlace: form.guardianBirthPlace ?? '',
        birthDate: form.guardianBirthDate ?? '',
        nik: form.guardianNik ?? '',
        educationLevel: form.guardianEducationLevel ?? '',
        occupation: form.guardianOccupation ?? '',
        incomeRange: form.guardianIncomeRange ?? '',
        phone: form.guardianPhone ?? '',
        email: form.guardianEmail ?? '',
      });
    }
    payload.contacts = contacts;
  }

  return payload;
}

/**
 * PATCH /parent/applications/:id
 * Update application (draft). Send partial payload; backend only updates provided fields.
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
 * Submit full registration. Backend validates stored data (no body); parent must save draft first.
 */
export async function submitFullRegistration(applicationId: string): Promise<{ ok: boolean }> {
  try {
    await request<unknown>(`/parent/applications/${applicationId}/submit`, {
      method: 'POST',
      credentials,
    });
    return { ok: true };
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError('Pengiriman gagal.', undefined, { message: 'Submit failed' });
  }
}

export { ApiError };
