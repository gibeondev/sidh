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
 * Pre-register Step 3: Student Identity (placeholder)
 * TODO: Implement Step 3 content
 */
export default function PreRegisterStep3Page() {
  const [step] = useState<StepId>(3);

  const handleNext = () => {
    // TODO: Navigate to next step or submit
  };

  const handleBack = () => {
    // TODO: Navigate back to step 2
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <PreRegisterHeader />
        <Stepper currentStep={step} />
        <Banner />

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <section aria-labelledby="step3-heading" className="space-y-4">
            <h2 id="step3-heading" className="text-base font-bold uppercase tracking-wide text-gray-900">
              TODO Step 3
            </h2>
            <p className="text-sm text-gray-600">
              Student identity step — content to be implemented.
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
