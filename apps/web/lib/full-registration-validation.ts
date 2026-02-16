/**
 * Frontend (UX-only) validation for full registration wizard.
 * Backend remains source of truth. Per-step validation for gating "Lanjut".
 */

import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function required(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length >= 1;
}

function isoDate(value: string | undefined): boolean {
  return typeof value === 'string' && ISO_DATE.test(value);
}

/** Step 1 — Data Siswa: all fields mandatory for "Lanjut" */
export function validateStep1(data: FullRegistrationPayload): string[] {
  const errors: string[] = [];
  if (!required(data.studentName))
    errors.push('Nama lengkap wajib diisi.');
  if (!required(data.programChoice))
    errors.push('Program wajib dipilih.');
  if (!required(data.gradeApplied))
    errors.push('Kelas yang didaftarkan wajib diisi.');
  if (data.studentGender !== 'MALE' && data.studentGender !== 'FEMALE')
    errors.push('Jenis kelamin wajib dipilih.');
  if (!required(data.studentBirthDate))
    errors.push('TTL (tanggal lahir) wajib diisi.');
  else if (!isoDate(data.studentBirthDate))
    errors.push('Format tanggal lahir tidak valid (YYYY-MM-DD).');
  if (!required(data.birthPlace))
    errors.push('TTL (tempat lahir) wajib diisi.');
  if (!required(data.nik))
    errors.push('NIK wajib diisi.');
  if (!required(data.religion))
    errors.push('Agama wajib diisi.');
  if (!required(data.heightCm))
    errors.push('Tinggi badan wajib diisi.');
  if (!required(data.weightKg))
    errors.push('Berat badan wajib diisi.');
  if (!required(data.nisn))
    errors.push('NISN wajib diisi.');
  if (!required(data.lastSchoolIndonesia))
    errors.push('Informasi sekolah terakhir di Indonesia wajib diisi.');
  if (!required(data.currentSchoolName))
    errors.push('Nama sekolah (informasi sekolah saat ini) wajib diisi.');
  if (!required(data.currentSchoolCountry))
    errors.push('Negara (sekolah saat ini) wajib diisi.');
  if (!required(data.childOrder))
    errors.push('Anak ke berapa wajib diisi.');
  if (!required(data.siblingCount))
    errors.push('Jumlah saudara kandung wajib diisi.');
  if (!required(data.lastDiplomaSerialNumber))
    errors.push('Nomor seri ijazah terakhir wajib diisi.');
  if (data.hasSpecialNeeds !== 'YES' && data.hasSpecialNeeds !== 'NO')
    errors.push('Informasi berkebutuhan khusus wajib dipilih.');
  if (!required(data.addressIndonesia))
    errors.push('Alamat tinggal Indonesia wajib diisi.');
  if (!required(data.domicileRegion))
    errors.push('Alamat tinggal domisili penugasan orang tua wajib dipilih.');
  if (!required(data.phoneNumber))
    errors.push('Nomor telepon rumah wajib diisi.');
  return errors;
}

/** Step 2 — Data Orang Tua/Wali */
export function validateStep2(data: FullRegistrationPayload): string[] {
  const errors: string[] = [];
  if (!required(data.applicantName))
    errors.push('Nama orang tua/wali wajib diisi.');
  if (!required(data.applicantEmail))
    errors.push('Email wajib diisi.');
  else if (!EMAIL.test(data.applicantEmail))
    errors.push('Format email tidak valid.');
  if (!required(data.applicantRelationship))
    errors.push('Hubungan dengan siswa wajib diisi.');
  if (!required(data.assignmentCity))
    errors.push('Kota domisili wajib diisi.');
  if (!required(data.assignmentCountry))
    errors.push('Negara domisili wajib diisi.');
  return errors;
}

/** Step 3 — Alamat & Domisili */
export function validateStep3(data: FullRegistrationPayload): string[] {
  const errors: string[] = [];
  if (!required(data.addressLine))
    errors.push('Alamat wajib diisi.');
  if (!required(data.postalCode))
    errors.push('Kode pos wajib diisi.');
  return errors;
}

/** Step 4 — Kebutuhan Khusus & Informasi Tambahan (minimal) */
export function validateStep4(_data: FullRegistrationPayload): string[] {
  return [];
}

/** Step 5 — Dokumen (no required fields for "Lanjut" if just upload list) */
export function validateStep5(_data: FullRegistrationPayload): string[] {
  return [];
}
