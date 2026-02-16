'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';
import { submitFullRegistration, ApiError } from '@/lib/api/fullRegistration';
import { validateStep1, validateStep2, validateStep3 } from '@/lib/full-registration-validation';
import { FullRegistrationHeader, WizardStepActions } from '@/components/full-registration';
import { DocumentsStep } from '@/components/full-registration/steps';

const STEP = 5 as const;

export default function WizardStep5Page() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.applicationId as string | undefined;
  const { getValues } = useFormContext<FullRegistrationPayload>();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!applicationId) return;
    setSubmitError(null);
    const payload = getValues();
    const allErrors = [
      ...validateStep1(payload),
      ...validateStep2(payload),
      ...validateStep3(payload),
    ];
    if (allErrors.length > 0) {
      setSubmitError(allErrors.join(' '));
      return;
    }
    setSubmitting(true);
    try {
      await submitFullRegistration(applicationId, payload);
      router.push(`/parent/applications/${applicationId}/wizard/success`);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Pengiriman gagal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <FullRegistrationHeader currentStep={STEP} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
        >
          {submitError && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
              {submitError}
            </div>
          )}

          <DocumentsStep />

          <WizardStepActions
            currentStep={STEP}
            nextLabel={submitting ? 'Mengirim…' : 'Kirim Pendaftaran'}
            nextAsSubmit
            nextDisabled={submitting}
          />
        </form>
      </div>
    </main>
  );
}
