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
  
  // Data Ayah - all fields required
  if (!required(data.fatherFullName))
    errors.push('Nama lengkap ayah wajib diisi.');
  if (!required(data.fatherBirthPlace))
    errors.push('Tempat lahir ayah wajib diisi.');
  if (!required(data.fatherBirthDate))
    errors.push('Tanggal lahir ayah wajib diisi.');
  else if (!isoDate(data.fatherBirthDate))
    errors.push('Format tanggal lahir ayah tidak valid (YYYY-MM-DD).');
  if (!required(data.fatherNik))
    errors.push('NIK ayah wajib diisi.');
  if (!required(data.fatherEducationLevel))
    errors.push('Pendidikan terakhir ayah wajib diisi.');
  if (!required(data.fatherOccupation))
    errors.push('Pekerjaan ayah wajib diisi.');
  if (!required(data.fatherIncomeRange))
    errors.push('Kisaran pendapatan ayah wajib diisi.');
  if (!required(data.fatherPhone))
    errors.push('Nomor telepon ayah wajib diisi.');
  if (!required(data.fatherEmail))
    errors.push('Email ayah wajib diisi.');
  else if (!EMAIL.test(data.fatherEmail))
    errors.push('Format email ayah tidak valid.');
  
  // Data Ibu - all fields required
  if (!required(data.motherFullName))
    errors.push('Nama lengkap ibu wajib diisi.');
  if (!required(data.motherBirthPlace))
    errors.push('Tempat lahir ibu wajib diisi.');
  if (!required(data.motherBirthDate))
    errors.push('Tanggal lahir ibu wajib diisi.');
  else if (!isoDate(data.motherBirthDate))
    errors.push('Format tanggal lahir ibu tidak valid (YYYY-MM-DD).');
  if (!required(data.motherNik))
    errors.push('NIK ibu wajib diisi.');
  if (!required(data.motherEducationLevel))
    errors.push('Pendidikan terakhir ibu wajib diisi.');
  if (!required(data.motherOccupation))
    errors.push('Pekerjaan ibu wajib diisi.');
  if (!required(data.motherIncomeRange))
    errors.push('Kisaran pendapatan ibu wajib diisi.');
  if (!required(data.motherPhone))
    errors.push('Nomor telepon ibu wajib diisi.');
  if (!required(data.motherEmail))
    errors.push('Email ibu wajib diisi.');
  else if (!EMAIL.test(data.motherEmail))
    errors.push('Format email ibu tidak valid.');
  
  // Data Wali - optional (no validation required)
  
  return errors;
}

/** Step 3 — Alamat & Domisili */
export function validateStep3(data: FullRegistrationPayload): string[] {
  const errors: string[] = [];
  
  // Negara tempat dinas orang tua/ studi orang tua
  if (!required(data.parentServiceCountry))
    errors.push('Negara tempat dinas orang tua/ studi orang tua wajib dipilih.');
  
  // Rencana periode domisili
  if (!required(data.domicilePeriodStart))
    errors.push('Tanggal mulai periode domisili wajib diisi.');
  else if (!isoDate(data.domicilePeriodStart))
    errors.push('Format tanggal mulai periode domisili tidak valid (YYYY-MM-DD).');
  
  if (!required(data.domicilePeriodEnd))
    errors.push('Tanggal akhir periode domisili wajib diisi.');
  else if (!isoDate(data.domicilePeriodEnd))
    errors.push('Format tanggal akhir periode domisili tidak valid (YYYY-MM-DD).');
  
  // Validate date range
  if (data.domicilePeriodStart && data.domicilePeriodEnd) {
    const startDate = new Date(data.domicilePeriodStart);
    const endDate = new Date(data.domicilePeriodEnd);
    if (endDate < startDate) {
      errors.push('Tanggal akhir periode domisili harus setelah atau sama dengan tanggal mulai.');
    }
  }
  
  // Informasi visa/ijin tinggal orang tua yang digunakan
  if (!data.parentVisaType || (data.parentVisaType !== 'Diplomat' && data.parentVisaType !== 'Student' && data.parentVisaType !== 'Diaspora'))
    errors.push('Informasi visa/ijin tinggal orang tua yang digunakan wajib dipilih.');
  
  return errors;
}

/** Step 4 — Kebutuhan Khusus & Informasi Tambahan */
export function validateStep4(_data: FullRegistrationPayload): string[] {
  // Step 4 fields are optional (no required validation)
  // Both textarea fields can be empty
  return [];
}

/** Step 5 — Dokumen */
export function validateStep5(documents: Record<string, { file: File | null }>): string[] {
  const errors: string[] = [];
  const requiredFields = [
    'reportCard',
    'lastDiploma',
    'nisnCard',
    'transferLetter',
    'birthCertificate',
    'familyCard',
    'studentResidencePermit',
    'studentPassport',
    'studentPhoto',
    'parentResidencePermit',
    'parentPassport',
  ];

  requiredFields.forEach((key) => {
    if (!documents[key]?.file) {
      errors.push(`Dokumen ${key} wajib diunggah.`);
    }
  });

  return errors;
}
