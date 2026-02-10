import React from 'react';

export type StepId = 1 | 2 | 3;

const STEPS: { id: StepId; label: string }[] = [
  { id: 1, label: 'PROSEDUR PENDAFTARAN' },
  { id: 2, label: 'DATA ORANG TUA/ WALI SISWA' },
  { id: 3, label: 'IDENTITAS SISWA' },
];

export interface StepperProps {
  currentStep: StepId;
}

/**
 * Pill-style stepper: inactive light gray pill, active black pill.
 * Triangular arrow separators between steps.
 */
export function Stepper({ currentStep }: StepperProps) {
  return (
    <nav aria-label="Registration steps" className="flex flex-wrap items-center justify-center gap-3 py-6">
      {STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isLast = index === STEPS.length - 1;

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
              <span className="text-sm font-medium whitespace-nowrap">{step.label}</span>
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

export { STEPS };
