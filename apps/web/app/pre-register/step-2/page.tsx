'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import type { PreRegisterPayload } from '@/lib/api/preRegistration';
import { validateStep2 } from '@/lib/pre-register-validation';
import type { ParentGuardianFieldErrors } from '@/components/pre-register';
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
  const [fieldErrors, setFieldErrors] = useState<ParentGuardianFieldErrors>({});
  const [pageError, setPageError] = useState<string | null>(null);

  const update = (field: keyof PreRegisterPayload, value: string) => {
    setValue(field, value, { shouldValidate: true });
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field as keyof ParentGuardianFieldErrors];
      return next;
    });
    setPageError(null);
  };

  const handleNext = () => {
    const step2Errors = validateStep2(form);
    if (step2Errors.length > 0) {
      const byField: ParentGuardianFieldErrors = {};
      step2Errors.forEach((e) => {
        byField[e.field as keyof ParentGuardianFieldErrors] = e.message;
      });
      setFieldErrors(byField);
      setPageError('Periksa kolom yang ditandai di bawah.');
      return;
    }
    setFieldErrors({});
    setPageError(null);
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
          {pageError && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
              {pageError}
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
            fieldErrors={fieldErrors}
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
