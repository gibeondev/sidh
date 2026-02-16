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
  applicantName: '',
  applicantRelationship: '',
  applicantEmail: '',
  assignmentCity: '',
  assignmentCountry: '',
  addressLine: '',
  postalCode: '',
  educationLevel: '',
  lastEducationLocation: '',
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
