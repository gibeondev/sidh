'use client';

import React from 'react';

export type WizardStepId = 1 | 2 | 3 | 4 | 5;

const WIZARD_STEPS: { id: WizardStepId; label: string }[] = [
  { id: 1, label: 'DATA SISWA' },
  { id: 2, label: 'DATA ORANG TUA' },
  { id: 3, label: 'ALAMAT' },
  { id: 4, label: 'KEBUTUHAN KHUSUS' },
  { id: 5, label: 'DOKUMEN' },
];

export interface WizardStepperProps {
  currentStep: WizardStepId;
}

/**
 * Same visual style as pre-registration Stepper: pill-style, active dark, inactive gray.
 */
export function WizardStepper({ currentStep }: WizardStepperProps) {
  return (
    <nav aria-label="Langkah pendaftaran" className="flex items-center justify-center gap-2 py-6">
      {WIZARD_STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isLast = index === WIZARD_STEPS.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                isActive ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isActive ? 'bg-white/20' : 'bg-white'
                }`}
              >
                {step.id}
              </span>
              <span className="whitespace-nowrap text-sm font-medium">{step.label}</span>
            </div>
            {!isLast && (
              <svg
                className="h-4 w-4 shrink-0 text-gray-500"
                fill="currentColor"
                viewBox="0 0 12 12"
                aria-hidden="true"
              >
                <path d="M4 2l4 4-4 4V2z" />
              </svg>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export { WIZARD_STEPS };
