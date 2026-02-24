'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';
import { validateStep1 } from '@/lib/full-registration-validation';
import { updateApplication, buildDraftPayload, ApiError } from '@/lib/api/fullRegistration';
import { FullRegistrationHeader, WizardStepActions } from '@/components/full-registration';
import { StudentDataStep } from '@/components/full-registration/steps/StudentDataStep';
import { useWizardReadOnly } from '../WizardContext';

const STEP = 1 as const;

export default function WizardStep1Page() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.applicationId as string | undefined;
  const readOnly = useWizardReadOnly();
  const { watch, setValue } = useFormContext<FullRegistrationPayload>();
  const form = watch();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saveDraftLoading, setSaveDraftLoading] = useState(false);

  const update = (field: keyof FullRegistrationPayload, value: string) => {
    setValue(field, value, { shouldValidate: true });
    setError(null);
    setSuccess(null);
  };

  const handleSaveDraft = async () => {
    if (!applicationId) return;
    setSaveDraftLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = buildDraftPayload(form);
      await updateApplication(applicationId, payload);
      setSuccess('Draft berhasil disimpan.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal menyimpan draft.');
    } finally {
      setSaveDraftLoading(false);
    }
  };

  const handleNext = async () => {
    const errors = validateStep1(form);
    if (errors.length > 0) {
      setError(errors.join(' '));
      return;
    }
    setError(null);
    try {
      if (applicationId) {
        await updateApplication(applicationId, buildDraftPayload(form));
        router.push(`/parent/applications/${applicationId}/wizard/step-2`);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal menyimpan data. Silakan coba lagi.');
    }
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <FullRegistrationHeader currentStep={STEP} />

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
        >
          {success && (
            <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-800" role="status">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <StudentDataStep
            data={{
              studentName: form.studentName ?? '',
              programChoice: form.programChoice ?? 'PJJ',
              gradeApplied: form.gradeApplied ?? '',
              studentGender: form.studentGender ?? 'MALE',
              studentBirthDate: form.studentBirthDate ?? '',
              birthPlace: form.birthPlace ?? '',
              nik: form.nik ?? '',
              religion: form.religion ?? '',
              heightCm: form.heightCm ?? '',
              weightKg: form.weightKg ?? '',
              nisn: form.nisn ?? '',
              lastSchoolIndonesia: form.lastSchoolIndonesia ?? '',
              currentSchoolName: form.currentSchoolName ?? '',
              currentSchoolCountry: form.currentSchoolCountry ?? '',
              childOrder: form.childOrder ?? '',
              siblingCount: form.siblingCount ?? '',
              lastDiplomaSerialNumber: form.lastDiplomaSerialNumber ?? '',
              hasSpecialNeeds: form.hasSpecialNeeds ?? 'NO',
              addressIndonesia: form.addressIndonesia ?? '',
              domicileRegion: form.domicileRegion ?? '',
              phoneCountryCode: form.phoneCountryCode ?? '+62',
              phoneNumber: form.phoneNumber ?? '',
            }}
            onChange={update}
            readOnly={readOnly}
          />

          <WizardStepActions
            currentStep={STEP}
            nextLabel="Lanjut"
            onNextClick={handleNext}
            onSaveDraft={handleSaveDraft}
            saveDraftLoading={saveDraftLoading}
            readOnly={readOnly}
          />
        </form>
      </div>
    </main>
  );
}
