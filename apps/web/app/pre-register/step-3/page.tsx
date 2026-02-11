'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type PreRegisterRequest } from '@/lib/api/applications';
import {
  PreRegisterHeader,
  Stepper,
  type StepId,
  Banner,
  StudentIdentityStep,
  StepActions,
} from '@/components/pre-register';

const TOTAL_STEPS = 3;

/**
 * Pre-register Step 3: Student Identity.
 * Document-style centered page with generous whitespace; layout matches Step 2.
 */
export default function PreRegisterStep3Page() {
  const router = useRouter();
  const [step] = useState<StepId>(3);
  const [form, setForm] = useState<PreRegisterRequest>({
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
  });

  const update = (field: keyof PreRegisterRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    router.push('/pre-register/step-4');
  };

  const handleBack = () => {
    router.push('/pre-register/step-2');
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <PreRegisterHeader />
        <Stepper currentStep={step} />
        <Banner />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: Submit form when API integration is ready
          }}
          className="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
        >
          <StudentIdentityStep
            data={{
              programChoice: form.programChoice,
              educationLevel: form.educationLevel,
              gradeApplied: form.gradeApplied,
              studentName: form.studentName,
              studentGender: form.studentGender,
              lastEducationLocation: form.lastEducationLocation,
              studentBirthDate: form.studentBirthDate,
              nisn: form.nisn,
            }}
            onChange={update}
          />

          <StepActions
            step={step}
            totalSteps={TOTAL_STEPS}
            onBack={handleBack}
            onNext={handleNext}
            nextLabel="Lanjut"
          />
        </form>
      </div>
    </main>
  );
}
