'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import type { PreRegisterPayload } from '@/lib/api/preRegistration';
import { validateStep2 } from '@/lib/pre-register-validation';
import {
  PreRegisterHeader,
  Stepper,
  Banner,
  ParentGuardianStep,
  StepActions,
} from '@/components/pre-register';

const STEP = 2 as const;

/**
 * Pre-register Step 2: Parent/Guardian Data.
 * Reads/writes shared form state from layout FormProvider. No DB save until Step 4.
 */
export default function PreRegisterStep2Page() {
  const router = useRouter();
  const { watch, setValue } = useFormContext<PreRegisterPayload>();
  const form = watch();
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof PreRegisterPayload, value: string) => {
    setValue(field, value, { shouldValidate: true });
    setError(null);
  };

  const handleNext = () => {
    const step2Errors = validateStep2(form);
    if (step2Errors.length > 0) {
      setError(step2Errors.map((e) => e.message).join(' '));
      return;
    }
    setError(null);
    router.push('/pre-register/step-3');
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <PreRegisterHeader />
        <Stepper currentStep={STEP} />
        <Banner />

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
              applicantEmail: form.applicantEmail ?? '',
              applicantName: form.applicantName ?? '',
              applicantRelationship: form.applicantRelationship ?? '',
              reasonLivingAbroad: form.reasonLivingAbroad ?? '',
              reasonToApply: form.reasonToApply ?? '',
              assignmentCity: form.assignmentCity ?? '',
              assignmentCountry: form.assignmentCountry ?? '',
              domicileStartDate: form.domicileStartDate ?? '',
              domicileEndDate: form.domicileEndDate ?? '',
              permitExpiryDate: form.permitExpiryDate ?? '',
            }}
            onChange={update}
          />

          <StepActions
            currentStep={STEP}
            nextLabel="Lanjut"
            onNextClick={handleNext}
          />
        </form>
      </div>
    </main>
  );
}
