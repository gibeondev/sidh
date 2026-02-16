'use client';

import React from 'react';
import type { WizardStepId } from './WizardStepper';

const FULL_REG_STEPS: { id: WizardStepId; label: string }[] = [
  { id: 1, label: 'Data Siswa' },
  { id: 2, label: 'Data Orang Tua' },
  { id: 3, label: 'Alamat' },
  { id: 4, label: 'Kebutuhan Khusus' },
  { id: 5, label: 'Dokumen' },
];

export interface FullRegistrationHeaderProps {
  currentStep: WizardStepId;
}

/**
 * Full Registration wizard header: dark teal rounded container, centered 2-line title,
 * and 5-step stepper with dotted connectors. Active step = blue circle + white number;
 * inactive = light gray circle. Used only on full registration wizard pages.
 */
export function FullRegistrationHeader({ currentStep }: FullRegistrationHeaderProps) {
  return (
    <header
      className="rounded-2xl bg-[#0F4C5C] px-6 py-8 text-white md:px-10 md:py-10"
      role="banner"
    >
      <h1 className="text-center text-lg font-semibold leading-snug md:text-2xl">
        Formulir Pendaftaran Lengkap SPMB &amp; Pindahan
        <br />
        Semester Genap TA 2025/2026 SIDH
      </h1>

      <nav
        aria-label="Langkah pendaftaran"
        className="mt-6 md:mt-8"
      >
        {/* Row 1: circles in horizontal alignment with dotted connectors between */}
        <div className="flex items-center justify-center">
          {FULL_REG_STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isLast = index === FULL_REG_STEPS.length - 1;
            return (
              <React.Fragment key={step.id}>
                <div
                  className="flex w-20 shrink-0 justify-center"
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {step.id}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className="h-0 w-8 shrink-0 border-b-2 border-dotted border-white/50 sm:w-10 md:w-12"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
        {/* Row 2: labels below each circle */}
        <div className="flex items-start justify-center">
          {FULL_REG_STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isLast = index === FULL_REG_STEPS.length - 1;
            return (
              <React.Fragment key={`label-${step.id}`}>
                <div className="flex w-20 shrink-0 justify-center pt-1">
                  <span
                    className={`max-w-[5rem] text-center text-xs font-medium sm:text-sm ${
                      isActive ? 'text-white' : 'text-gray-200'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast && <div className="w-8 shrink-0 sm:w-10 md:w-12" aria-hidden="true" />}
              </React.Fragment>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
