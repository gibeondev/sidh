'use client';

import { createContext, useContext } from 'react';

export interface WizardContextValue {
  /** When true, form is read-only (submitted / under review / approved / rejected). */
  isReadOnly: boolean;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizardReadOnly(): boolean {
  const ctx = useContext(WizardContext);
  return ctx?.isReadOnly ?? false;
}

export const WizardContextProvider = WizardContext.Provider;
