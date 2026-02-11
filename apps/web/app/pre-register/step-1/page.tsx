'use client';

import { useState } from 'react';
import {
  PreRegisterHeader,
  Stepper,
  type StepId,
  Banner,
  RegistrationProcedureStep,
  StepActions,
} from '@/components/pre-register';

const TOTAL_STEPS = 4;

/**
 * Pre-register Step 1: Registration Procedure.
 * Document-style centered page with generous whitespace; layout matches Step 2.
 */
export default function PreRegisterStep1Page() {
  const [step] = useState<StepId>(1);

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <PreRegisterHeader />
        <Stepper currentStep={step} />
        <Banner />

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <RegistrationProcedureStep />

          <StepActions currentStep={step} nextLabel="Lanjut" />
        </div>
      </div>
    </main>
  );
}
