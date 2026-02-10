'use client';

import { useState } from 'react';
import {
  PreRegisterHeader,
  Stepper,
  type StepId,
  Banner,
  StepActions,
} from '@/components/pre-register';

const TOTAL_STEPS = 3;

/**
 * Pre-register Step 1: Registration Procedure (placeholder)
 * TODO: Implement Step 1 content
 */
export default function PreRegisterStep1Page() {
  const [step] = useState<StepId>(1);

  const handleNext = () => {
    // TODO: Navigate to step 2
  };

  const handleBack = () => {
    // TODO: Navigate back
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <PreRegisterHeader />
        <Stepper currentStep={step} />
        <Banner />

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <section aria-labelledby="step1-heading" className="space-y-4">
            <h2 id="step1-heading" className="text-base font-bold uppercase tracking-wide text-gray-900">
              TODO Step 1
            </h2>
            <p className="text-sm text-gray-600">
              Registration procedure step — content to be implemented.
            </p>
          </section>

          <StepActions
            step={step}
            totalSteps={TOTAL_STEPS}
            onBack={handleBack}
            onNext={handleNext}
            nextLabel="Lanjut"
          />
        </div>
      </div>
    </main>
  );
}
