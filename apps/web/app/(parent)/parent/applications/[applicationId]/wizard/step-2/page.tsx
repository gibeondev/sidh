'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';
import { validateStep2 } from '@/lib/full-registration-validation';
import { updateApplication, ApiError } from '@/lib/api/fullRegistration';
import { FullRegistrationHeader, WizardStepActions } from '@/components/full-registration';
import { ParentGuardianStep2 } from '@/components/full-registration/steps';

const STEP = 2 as const;

export default function WizardStep2Page() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.applicationId as string | undefined;
  const { watch, setValue } = useFormContext<FullRegistrationPayload>();
  const form = watch();
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof FullRegistrationPayload, value: string) => {
    setValue(field, value, { shouldValidate: true });
    setError(null);
  };

  const handleNext = async () => {
    const errors = validateStep2(form);
    if (errors.length > 0) {
      setError(errors.join(' '));
      return;
    }
    setError(null);
    
    // Save Step 2 data as draft
    try {
      if (applicationId) {
        await updateApplication(applicationId, {
          contacts: [
            {
              relationship: 'Father' as const,
              fullName: form.fatherFullName,
              birthPlace: form.fatherBirthPlace,
              birthDate: form.fatherBirthDate,
              nik: form.fatherNik,
              educationLevel: form.fatherEducationLevel,
              occupation: form.fatherOccupation,
              incomeRange: form.fatherIncomeRange,
              phone: form.fatherPhone,
              email: form.fatherEmail,
            },
            {
              relationship: 'Mother' as const,
              fullName: form.motherFullName,
              birthPlace: form.motherBirthPlace,
              birthDate: form.motherBirthDate,
              nik: form.motherNik,
              educationLevel: form.motherEducationLevel,
              occupation: form.motherOccupation,
              incomeRange: form.motherIncomeRange,
              phone: form.motherPhone,
              email: form.motherEmail,
            },
            ...(form.guardianFullName
              ? [
                  {
                    relationship: 'Guardian' as const,
                    fullName: form.guardianFullName,
                    birthPlace: form.guardianBirthPlace,
                    birthDate: form.guardianBirthDate,
                    nik: form.guardianNik,
                    educationLevel: form.guardianEducationLevel,
                    occupation: form.guardianOccupation,
                    incomeRange: form.guardianIncomeRange,
                    phone: form.guardianPhone,
                    email: form.guardianEmail,
                  },
                ]
              : []),
          ],
        });
        router.push(`/parent/applications/${applicationId}/wizard/step-3`);
      }
    } catch (err) {
      const message =
        err instanceof ApiError && err.message
          ? err.message
          : 'Gagal menyimpan data. Silakan coba lagi.';
      setError(message);
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
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <ParentGuardianStep2
            data={{
              fatherFullName: form.fatherFullName ?? '',
              fatherBirthPlace: form.fatherBirthPlace ?? '',
              fatherBirthDate: form.fatherBirthDate ?? '',
              fatherNik: form.fatherNik ?? '',
              fatherEducationLevel: form.fatherEducationLevel ?? '',
              fatherOccupation: form.fatherOccupation ?? '',
              fatherIncomeRange: form.fatherIncomeRange ?? '',
              fatherPhone: form.fatherPhone ?? '',
              fatherEmail: form.fatherEmail ?? '',
              motherFullName: form.motherFullName ?? '',
              motherBirthPlace: form.motherBirthPlace ?? '',
              motherBirthDate: form.motherBirthDate ?? '',
              motherNik: form.motherNik ?? '',
              motherEducationLevel: form.motherEducationLevel ?? '',
              motherOccupation: form.motherOccupation ?? '',
              motherIncomeRange: form.motherIncomeRange ?? '',
              motherPhone: form.motherPhone ?? '',
              motherEmail: form.motherEmail ?? '',
              guardianFullName: form.guardianFullName ?? '',
              guardianBirthPlace: form.guardianBirthPlace ?? '',
              guardianBirthDate: form.guardianBirthDate ?? '',
              guardianNik: form.guardianNik ?? '',
              guardianEducationLevel: form.guardianEducationLevel ?? '',
              guardianOccupation: form.guardianOccupation ?? '',
              guardianIncomeRange: form.guardianIncomeRange ?? '',
              guardianPhone: form.guardianPhone ?? '',
              guardianEmail: form.guardianEmail ?? '',
            }}
            onChange={update}
          />

          <WizardStepActions currentStep={STEP} nextLabel="Lanjut" onNextClick={handleNext} />
        </form>
      </div>
    </main>
  );
}
