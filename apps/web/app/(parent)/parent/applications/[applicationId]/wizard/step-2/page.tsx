'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';
import { validateStep2 } from '@/lib/full-registration-validation';
import { FullRegistrationHeader, WizardStepActions } from '@/components/full-registration';
import { ParentGuardianStep } from '@/components/full-registration/steps';

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

  const handleNext = () => {
    const errors = validateStep2(form);
    if (errors.length > 0) {
      setError(errors.join(' '));
      return;
    }
    setError(null);
    if (applicationId) router.push(`/parent/applications/${applicationId}/wizard/step-3`);
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

          <ParentGuardianStep
            data={{
              applicantName: form.applicantName ?? '',
              applicantEmail: form.applicantEmail ?? '',
              applicantRelationship: form.applicantRelationship ?? '',
              assignmentCity: form.assignmentCity ?? '',
              assignmentCountry: form.assignmentCountry ?? '',
            }}
            onChange={update}
          />

          <WizardStepActions currentStep={STEP} nextLabel="Lanjut" onNextClick={handleNext} />
        </form>
      </div>
    </main>
  );
}
