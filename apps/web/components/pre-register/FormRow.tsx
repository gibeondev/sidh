import * as React from 'react';

export interface FormRowProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * FormRow: 2-column grid for form rows.
 * Left column = label (fixed width ~220–260px), right column = field (flex/1).
 * When error is set, shows the message in red below the field.
 */
export function FormRow({ label, required, error, children, className = '' }: FormRowProps) {
  return (
    <div className={`grid grid-cols-[240px_1fr] gap-4 items-start ${className}`}>
      <label className="pt-2 text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      <div className="flex-1 min-w-0 space-y-1">
        {children}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
