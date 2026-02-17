'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';
import { validateStep3 } from '@/lib/full-registration-validation';
import { updateApplication, ApiError } from '@/lib/api/fullRegistration';
import { FullRegistrationHeader, WizardStepActions } from '@/components/full-registration';
import { AddressStep3 } from '@/components/full-registration/steps/AddressStep3';

const STEP = 3 as const;

export default function WizardStep3Page() {
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
    const errors = validateStep3(form);
    if (errors.length > 0) {
      setError(errors.join(' '));
      return;
    }
    setError(null);
    
    // Save Step 3 data as draft
    try {
      if (applicationId) {
        await updateApplication(applicationId, {
          parentServiceCountry: form.parentServiceCountry,
          domicilePeriodStart: form.domicilePeriodStart,
          domicilePeriodEnd: form.domicilePeriodEnd,
          parentVisaType: form.parentVisaType,
        });
        router.push(`/parent/applications/${applicationId}/wizard/step-4`);
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

          <AddressStep3
            data={{
              parentServiceCountry: form.parentServiceCountry ?? '',
              domicilePeriodStart: form.domicilePeriodStart ?? '',
              domicilePeriodEnd: form.domicilePeriodEnd ?? '',
              parentVisaType: (form.parentVisaType as 'Diplomat' | 'Student' | 'Diaspora') ?? 'Diplomat',
            }}
            onChange={update}
          />

          <WizardStepActions currentStep={STEP} nextLabel="Lanjut" onNextClick={handleNext} />
        </form>
      </div>
    </main>
  );
}
