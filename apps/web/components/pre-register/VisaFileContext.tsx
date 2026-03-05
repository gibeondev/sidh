'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface VisaFileContextValue {
  file: File | null;
  setFile: (file: File | null) => void;
}

const VisaFileContext = createContext<VisaFileContextValue | null>(null);

export function VisaFileProvider({ children }: { children: ReactNode }) {
  const [file, setFileState] = useState<File | null>(null);
  const setFile = useCallback((f: File | null) => setFileState(f), []);
  return (
    <VisaFileContext.Provider value={{ file, setFile }}>
      {children}
    </VisaFileContext.Provider>
  );
}

export function useVisaFile() {
  const ctx = useContext(VisaFileContext);
  if (!ctx) throw new Error('useVisaFile must be used within VisaFileProvider');
  return ctx;
}
