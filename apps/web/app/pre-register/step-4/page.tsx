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
 * Pre-register Step 4: Additional Step (placeholder)
 * TODO: Implement Step 4 content
 */
export default function PreRegisterStep4Page() {
  const [step] = useState<StepId>(4);

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <PreRegisterHeader />
        <Stepper currentStep={step} />
        <Banner />

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <section aria-labelledby="step4-heading" className="space-y-4">
            <h2 id="step4-heading" className="text-base font-bold uppercase tracking-wide text-gray-900">
              TODO Step 4
            </h2>
            <p className="text-sm text-gray-600">
              Additional step — content to be implemented.
            </p>
          </section>

          <StepActions currentStep={step} />
        </div>
      </div>
    </main>
  );
}
