'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import type { PreRegisterPayload } from '@/lib/api/preRegistration';
import { validateStep3 } from '@/lib/pre-register-validation';
import {
  PreRegisterHeader,
  Stepper,
  Banner,
  StudentIdentityStep,
  StepActions,
} from '@/components/pre-register';

const STEP = 3 as const;

/**
 * Pre-register Step 3: Student Identity.
 * Reads/writes shared form state from layout FormProvider.
 * Validates step-3 fields before allowing navigation to step-4.
 */
export default function PreRegisterStep3Page() {
  const router = useRouter();
  const { watch, setValue } = useFormContext<PreRegisterPayload>();
  const form = watch();
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof PreRegisterPayload, value: string) => {
    setValue(field, value, { shouldValidate: true });
    setError(null);
  };

  const handleNext = () => {
    const step3Errors = validateStep3(form);
    if (step3Errors.length > 0) {
      setError(step3Errors.map((e) => e.message).join(' '));
      return;
    }
    setError(null);
    router.push('/pre-register/step-4');
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

          <StudentIdentityStep
            data={{
              programChoice: form.programChoice ?? '',
              educationLevel: form.educationLevel ?? '',
              gradeApplied: form.gradeApplied ?? '',
              studentName: form.studentName ?? '',
              studentGender: form.studentGender ?? 'MALE',
              lastEducationLocation: form.lastEducationLocation ?? '',
              studentBirthDate: form.studentBirthDate ?? '',
              nisn: form.nisn ?? '',
            }}
            onChange={update}
          />

          <StepActions currentStep={STEP} nextLabel="Lanjut" onNextClick={handleNext} />
        </form>
      </div>
    </main>
  );
}
