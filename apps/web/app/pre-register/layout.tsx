'use client';

import { FormProvider, useForm } from 'react-hook-form';
import type { PreRegisterPayload } from '@/lib/api/preRegistration';

const defaultValues: PreRegisterPayload = {
  applicantEmail: '',
  applicantName: '',
  applicantRelationship: '',
  reasonLivingAbroad: '',
  reasonToApply: '',
  assignmentCity: '',
  assignmentCountry: '',
  domicileStartDate: '',
  domicileEndDate: '',
  permitExpiryDate: '',
  programChoice: '',
  educationLevel: '',
  gradeApplied: '',
  studentName: '',
  studentGender: 'MALE',
  studentBirthDate: '',
  lastEducationLocation: '',
  nisn: '',
};

/**
 * Shared form state across pre-register steps (1–4).
 * Steps 1–3 populate the form; Step 4 reads and submits.
 */
export default function PreRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const methods = useForm<PreRegisterPayload>({
    defaultValues,
    mode: 'onTouched',
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}
