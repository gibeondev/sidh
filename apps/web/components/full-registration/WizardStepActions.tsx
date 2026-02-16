'use client';

import { useRouter, useParams } from 'next/navigation';
import type { WizardStepId } from './WizardStepper';

const TOTAL_STEPS: WizardStepId = 5;

export interface WizardStepActionsProps {
  currentStep: WizardStepId;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextAsSubmit?: boolean;
  onNextClick?: () => void;
  className?: string;
}

function getStepPath(applicationId: string, step: WizardStepId): string {
  return `/parent/applications/${applicationId}/wizard/step-${step}`;
}

/**
 * Back/Next buttons for full registration wizard. Same style as pre-register StepActions.
 */
export function WizardStepActions({
  currentStep,
  nextLabel = 'Lanjut',
  nextDisabled = false,
  nextAsSubmit = false,
  onNextClick,
  className = '',
}: WizardStepActionsProps) {
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.applicationId as string | undefined;

  const showBack = currentStep > 1;
  const showNext = currentStep < TOTAL_STEPS || (currentStep === TOTAL_STEPS && nextAsSubmit);

  const handleBack = () => {
    if (!applicationId) return;
    const prev = (currentStep - 1) as WizardStepId;
    router.push(getStepPath(applicationId, prev));
  };

  const handleNext = () => {
    if (onNextClick) {
      onNextClick();
      return;
    }
    if (!applicationId) return;
    const next = (currentStep + 1) as WizardStepId;
    router.push(getStepPath(applicationId, next));
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

export { TOTAL_STEPS };
