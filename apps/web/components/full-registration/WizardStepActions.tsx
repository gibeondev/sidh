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
  onSaveDraft?: () => void | Promise<void>;
  saveDraftLoading?: boolean;
  /** When true, hide save/next and show only "Kembali ke Daftar" (read-only view). */
  readOnly?: boolean;
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
  onSaveDraft,
  saveDraftLoading = false,
  readOnly = false,
  className = '',
}: WizardStepActionsProps) {
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.applicationId as string | undefined;

  const showBack = currentStep > 1;
  const showNext = !readOnly && (currentStep < TOTAL_STEPS || (currentStep === TOTAL_STEPS && nextAsSubmit));
  const showSaveDraft = !readOnly && onSaveDraft;

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      void Promise.resolve(onSaveDraft()).catch(() => {});
    }
  };

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

  if (readOnly) {
    const showNextReadOnly = currentStep < TOTAL_STEPS;
    const handleNextReadOnly = () => {
      if (!applicationId) return;
      const next = (currentStep + 1) as WizardStepId;
      router.push(getStepPath(applicationId, next));
    };
    return (
      <div className={`flex flex-wrap items-center justify-center gap-6 pt-8 ${className}`}>
        {showBack && (
          <button
            type="button"
            onClick={() => applicationId && router.push(getStepPath(applicationId, (currentStep - 1) as WizardStepId))}
            className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          >
            Kembali
          </button>
        )}
        {showNextReadOnly && (
          <button
            type="button"
            onClick={handleNextReadOnly}
            className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          >
            Lanjut
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 pt-8 ${className}`}>
      {showSaveDraft && (
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={saveDraftLoading}
          className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {saveDraftLoading ? 'Menyimpan...' : 'Simpan draft'}
        </button>
      )}
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
