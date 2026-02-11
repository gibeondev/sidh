'use client';

import { useRouter } from 'next/navigation';
import type { StepId } from './Stepper';

export interface StepActionsProps {
  currentStep: StepId;
  nextLabel?: string;
  nextDisabled?: boolean;
  /** When true, the next button submits the form (use on last step) */
  nextAsSubmit?: boolean;
  className?: string;
}

/**
 * Maps step number to route path
 */
function getStepRoute(step: StepId): string {
  switch (step) {
    case 1:
      return '/pre-register/step-1';
    case 2:
      return '/pre-register/step-2';
    case 3:
      return '/pre-register/step-3';
    case 4:
      return '/pre-register/step-4';
    default:
      return '/pre-register/step-1';
  }
}

/**
 * StepActions component matching Figma design:
 * - Pill-shaped buttons
 * - Wide horizontal separation between Back and Next buttons
 * - Dark teal/blue background matching stepper active state
 * - Handles navigation internally using Next.js router
 */
export function StepActions({
  currentStep,
  nextLabel = 'Lanjut',
  nextDisabled = false,
  nextAsSubmit = false,
  className = '',
}: StepActionsProps) {
  const router = useRouter();
  const showBack = currentStep > 1;
  const showNext = currentStep < 4;

  const handleBack = () => {
    const previousStep = (currentStep - 1) as StepId;
    router.push(getStepRoute(previousStep));
  };

  const handleNext = () => {
    const nextStep = (currentStep + 1) as StepId;
    router.push(getStepRoute(nextStep));
  };

  return (
    <div className={`flex items-center justify-center gap-12 pt-8 ${className}`}>
      {showBack && (
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Kembali
          </button>
        </div>
      )}
      {showNext && (
        <div>
          {nextAsSubmit ? (
            <button
              type="submit"
              disabled={nextDisabled}
              className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {nextLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={nextDisabled}
              className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {nextLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
