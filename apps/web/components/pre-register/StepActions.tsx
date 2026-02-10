import Link from 'next/link';
import { Button } from '@/components/ui/button';

export interface StepActionsProps {
  step: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  backHref?: string;
  /** When true, the next button submits the form (use on last step) */
  nextAsSubmit?: boolean;
}

/**
 * StepActions component matching Figma design:
 * - Pill-shaped buttons
 * - Wide horizontal separation between Back and Next buttons
 * - Dark teal/blue background matching stepper active state
 */
export function StepActions({
  step,
  totalSteps,
  onBack,
  onNext,
  nextLabel = 'Lanjut',
  nextDisabled = false,
  backHref = '/pre-register',
  nextAsSubmit = false,
}: StepActionsProps) {
  const isFirst = step <= 1;
  const isLast = step >= totalSteps;

  return (
    <div className="flex items-center justify-center gap-12 pt-8">
      <div>
        {isFirst ? (
          <Link href={backHref === '/pre-register' ? '/' : backHref} className="inline-block">
            <button
              type="button"
              className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Kembali
            </button>
          </Link>
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Kembali
          </button>
        )}
      </div>
      <div>
        {isLast ? (
          nextAsSubmit ? (
            <button
              type="submit"
              disabled={nextDisabled}
              className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {nextLabel}
            </button>
          ) : null
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
