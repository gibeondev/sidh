'use client';

import * as React from 'react';
import { Label } from './label';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  label?: string;
  required?: boolean;
  className?: string;
  'aria-label'?: string;
}

const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      name,
      value,
      onChange,
      options,
      label,
      required,
      className = '',
      'aria-label': ariaLabel,
    },
    ref
  ) => (
    <fieldset ref={ref} className={`space-y-2 ${className}`} aria-label={ariaLabel ?? label}>
      {label && <Label required={required}>{label}</Label>}
      <div className="flex flex-wrap gap-4" role="radiogroup" aria-required={required}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
              aria-checked={value === opt.value}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
);
RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
