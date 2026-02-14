/**
 * Frontend (UX-only) validation for pre-registration form.
 * Rules per docs/specs/11-pre-register-field-mapping.md. Backend remains source of truth.
 */

import type { PreRegisterPayload } from '@/lib/api/preRegistration';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export interface FieldError {
  field: keyof PreRegisterPayload;
  message: string;
}

function required(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length >= 1;
}

function isoDate(value: string | undefined): boolean {
  return typeof value === 'string' && ISO_DATE.test(value);
}

export function validatePreRegisterForm(
  data: PreRegisterPayload
): FieldError[] {
  const errors: FieldError[] = [];

  // Step 2 – required string + email
  if (!required(data.applicantEmail))
    errors.push({ field: 'applicantEmail', message: 'Email pendaftar wajib diisi.' });
  else if (!EMAIL.test(data.applicantEmail))
    errors.push({ field: 'applicantEmail', message: 'Format email tidak valid.' });

  if (!required(data.reasonLivingAbroad))
    errors.push({ field: 'reasonLivingAbroad', message: 'Jenis penugasan/alasan tinggal di luar negeri wajib diisi.' });
  if (!required(data.reasonToApply))
    errors.push({ field: 'reasonToApply', message: 'Alasan mendaftar ke SIDH wajib diisi.' });
  if (!required(data.applicantRelationship))
    errors.push({ field: 'applicantRelationship', message: 'Hubungan pendaftar dengan calon siswa wajib dipilih.' });
  if (!required(data.applicantName))
    errors.push({ field: 'applicantName', message: 'Nama orang tua pendaftar wajib diisi.' });
  if (!required(data.assignmentCity))
    errors.push({ field: 'assignmentCity', message: 'Alamat domisili wajib diisi.' });
  if (!required(data.assignmentCountry))
    errors.push({ field: 'assignmentCountry', message: 'Negara domisili wajib dipilih.' });

  if (!required(data.domicileStartDate))
    errors.push({ field: 'domicileStartDate', message: 'Tanggal mulai domisili wajib diisi.' });
  else if (!isoDate(data.domicileStartDate))
    errors.push({ field: 'domicileStartDate', message: 'Format tanggal tidak valid (YYYY-MM-DD).' });

  if (!required(data.domicileEndDate))
    errors.push({ field: 'domicileEndDate', message: 'Tanggal akhir domisili wajib diisi.' });
  else if (!isoDate(data.domicileEndDate))
    errors.push({ field: 'domicileEndDate', message: 'Format tanggal tidak valid (YYYY-MM-DD).' });
  else if (data.domicileStartDate && data.domicileEndDate && data.domicileEndDate < data.domicileStartDate)
    errors.push({ field: 'domicileEndDate', message: 'Tanggal akhir harus sama atau setelah tanggal mulai.' });

  if (!required(data.permitExpiryDate))
    errors.push({ field: 'permitExpiryDate', message: 'Tanggal masa berlaku visa/izin tinggal wajib diisi.' });
  else if (!isoDate(data.permitExpiryDate))
    errors.push({ field: 'permitExpiryDate', message: 'Format tanggal tidak valid (YYYY-MM-DD).' });

  // Step 3 – required string / enum / date; nisn optional
  if (!required(data.programChoice))
    errors.push({ field: 'programChoice', message: 'Program wajib dipilih.' });
  if (!required(data.educationLevel))
    errors.push({ field: 'educationLevel', message: 'Jenjang pendidikan wajib dipilih.' });
  if (!required(data.gradeApplied))
    errors.push({ field: 'gradeApplied', message: 'Kelas wajib diisi.' });
  if (!required(data.studentName))
    errors.push({ field: 'studentName', message: 'Nama calon siswa wajib diisi.' });
  if (data.studentGender !== 'MALE' && data.studentGender !== 'FEMALE')
    errors.push({ field: 'studentGender', message: 'Jenis kelamin wajib dipilih.' });
  if (!required(data.lastEducationLocation))
    errors.push({ field: 'lastEducationLocation', message: 'Riwayat pendidikan terakhir wajib dipilih.' });
  if (!required(data.studentBirthDate))
    errors.push({ field: 'studentBirthDate', message: 'Tanggal lahir wajib diisi.' });
  else if (!isoDate(data.studentBirthDate))
    errors.push({ field: 'studentBirthDate', message: 'Format tanggal tidak valid (YYYY-MM-DD).' });

  return errors;
}

/** Step-2 fields only (parent/guardian + domicile). For blocking "Lanjut" until valid. */
export type Step2Data = Pick<
  PreRegisterPayload,
  | 'applicantEmail'
  | 'applicantName'
  | 'applicantRelationship'
  | 'reasonLivingAbroad'
  | 'reasonToApply'
  | 'assignmentCity'
  | 'assignmentCountry'
  | 'domicileStartDate'
  | 'domicileEndDate'
  | 'permitExpiryDate'
>;

export function validateStep2(data: Step2Data): FieldError[] {
  const errors: FieldError[] = [];

  if (!required(data.applicantEmail))
    errors.push({ field: 'applicantEmail', message: 'Email pendaftar wajib diisi.' });
  else if (!EMAIL.test(data.applicantEmail))
    errors.push({ field: 'applicantEmail', message: 'Format email tidak valid.' });

  if (!required(data.reasonLivingAbroad))
    errors.push({ field: 'reasonLivingAbroad', message: 'Jenis penugasan/alasan tinggal di luar negeri wajib diisi.' });
  if (!required(data.reasonToApply))
    errors.push({ field: 'reasonToApply', message: 'Alasan mendaftar ke SIDH wajib diisi.' });
  if (!required(data.applicantRelationship))
    errors.push({ field: 'applicantRelationship', message: 'Hubungan pendaftar dengan calon siswa wajib dipilih.' });
  if (!required(data.applicantName))
    errors.push({ field: 'applicantName', message: 'Nama orang tua pendaftar wajib diisi.' });
  if (!required(data.assignmentCity))
    errors.push({ field: 'assignmentCity', message: 'Alamat domisili wajib diisi.' });
  if (!required(data.assignmentCountry))
    errors.push({ field: 'assignmentCountry', message: 'Negara domisili wajib dipilih.' });

  if (!required(data.domicileStartDate))
    errors.push({ field: 'domicileStartDate', message: 'Tanggal mulai domisili wajib diisi.' });
  else if (!isoDate(data.domicileStartDate))
    errors.push({ field: 'domicileStartDate', message: 'Format tanggal tidak valid (YYYY-MM-DD).' });

  if (!required(data.domicileEndDate))
    errors.push({ field: 'domicileEndDate', message: 'Tanggal akhir domisili wajib diisi.' });
  else if (!isoDate(data.domicileEndDate))
    errors.push({ field: 'domicileEndDate', message: 'Format tanggal tidak valid (YYYY-MM-DD).' });
  else if (data.domicileStartDate && data.domicileEndDate && data.domicileEndDate < data.domicileStartDate)
    errors.push({ field: 'domicileEndDate', message: 'Tanggal akhir harus sama atau setelah tanggal mulai.' });

  if (!required(data.permitExpiryDate))
    errors.push({ field: 'permitExpiryDate', message: 'Tanggal masa berlaku visa/izin tinggal wajib diisi.' });
  else if (!isoDate(data.permitExpiryDate))
    errors.push({ field: 'permitExpiryDate', message: 'Format tanggal tidak valid (YYYY-MM-DD).' });

  return errors;
}

/** Step-3 fields only (student identity). For blocking "Lanjut" until valid. */
export type Step3Data = Pick<
  PreRegisterPayload,
  | 'programChoice'
  | 'educationLevel'
  | 'gradeApplied'
  | 'studentName'
  | 'studentGender'
  | 'lastEducationLocation'
  | 'studentBirthDate'
>;

export function validateStep3(data: Step3Data): FieldError[] {
  const errors: FieldError[] = [];

  if (!required(data.programChoice))
    errors.push({ field: 'programChoice', message: 'Program wajib dipilih.' });
  if (!required(data.educationLevel))
    errors.push({ field: 'educationLevel', message: 'Jenjang pendidikan wajib dipilih.' });
  if (!required(data.gradeApplied))
    errors.push({ field: 'gradeApplied', message: 'Kelas wajib diisi.' });
  if (!required(data.studentName))
    errors.push({ field: 'studentName', message: 'Nama calon siswa wajib diisi.' });
  if (data.studentGender !== 'MALE' && data.studentGender !== 'FEMALE')
    errors.push({ field: 'studentGender', message: 'Jenis kelamin wajib dipilih.' });
  if (!required(data.lastEducationLocation))
    errors.push({ field: 'lastEducationLocation', message: 'Riwayat pendidikan terakhir wajib dipilih.' });
  if (!required(data.studentBirthDate))
    errors.push({ field: 'studentBirthDate', message: 'Tanggal lahir wajib diisi.' });
  else if (!isoDate(data.studentBirthDate))
    errors.push({ field: 'studentBirthDate', message: 'Format tanggal tidak valid (YYYY-MM-DD).' });

  return errors;
}
