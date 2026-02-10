export type StepId = 1 | 2 | 3;

const STEPS: { id: StepId; label: string }[] = [
  { id: 1, label: 'Registration procedure' },
  { id: 2, label: 'Student parent / guardian data' },
  { id: 3, label: 'Student identity' },
];

export interface PreRegisterStepperProps {
  currentStep: StepId;
}

export function PreRegisterStepper({ currentStep }: PreRegisterStepperProps) {
  return (
    <nav aria-label="Registration steps" className="flex flex-wrap items-center justify-center gap-2 py-2">
      {STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isPast = step.id < currentStep;
        const isLast = index === STEPS.length - 1;
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`flex h-7 min-w-[1.75rem] items-center justify-center rounded-full px-2 text-sm font-semibold ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : isPast
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-gray-100 text-gray-500'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                {step.id}
              </span>
              <span
                className={`text-sm font-medium ${
                  isActive ? 'text-gray-900' : isPast ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <span className="mx-1 text-gray-400" aria-hidden>
                →
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export { STEPS };
