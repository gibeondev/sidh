'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';
import {
  getParentApplication,
  mapApplicationToFormPayload,
  type ParentApplicationDetail,
} from '@/lib/api/fullRegistration';
import { WizardContextProvider } from './WizardContext';

const emptyDefaultValues: FullRegistrationPayload = {
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

/**
 * Renders form provider with pre-filled values once application is loaded.
 */
function WizardFormProvider({
  application,
  children,
}: {
  application: ParentApplicationDetail;
  children: React.ReactNode;
}) {
  const initialValues = mapApplicationToFormPayload(application);
  const methods = useForm<FullRegistrationPayload>({
    defaultValues: initialValues,
    mode: 'onTouched',
  });
  const isReadOnly =
    application.status !== 'DRAFT' && application.status !== 'CHANGES_REQUESTED';

  return (
    <WizardContextProvider value={{ isReadOnly }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </WizardContextProvider>
  );
}

/**
 * Shared form state across full registration wizard steps. Fetches application and pre-fills form;
 * when status is not DRAFT/CHANGES_REQUESTED, wizard is read-only.
 */
export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const applicationId = params?.applicationId as string | undefined;
  const [application, setApplication] = useState<ParentApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) {
      setLoading(false);
      setError('ID aplikasi tidak valid.');
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getParentApplication(applicationId)
      .then((data) => {
        if (!cancelled) setApplication(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? 'Gagal memuat data aplikasi.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500">Memuat formulir...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <p className="text-red-600">{error ?? 'Aplikasi tidak ditemukan.'}</p>
      </div>
    );
  }

  return <WizardFormProvider application={application}>{children}</WizardFormProvider>;
}
