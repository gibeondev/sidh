'use client';

import { FormProvider, useForm } from 'react-hook-form';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';

const defaultValues: FullRegistrationPayload = {
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
  // Step 2 — Data Orang Tua/Wali
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
  // Step 3 — Alamat & Domisili
  parentServiceCountry: '',
  domicilePeriodStart: '',
  domicilePeriodEnd: '',
  parentVisaType: 'Diplomat' as 'Diplomat' | 'Student' | 'Diaspora',
  // Step 4 — Kebutuhan Khusus & Informasi Tambahan
  description: '',
  additionalInfo: '',
};

/**
 * Shared form state across full registration wizard steps (1–4).
 */
export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const methods = useForm<FullRegistrationPayload>({
    defaultValues,
    mode: 'onTouched',
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}
