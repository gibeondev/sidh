'use client';

import { useState } from 'react';

export interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  compact?: boolean; // For Step 2: smaller font and banner height
}

/**
 * Collapsible section component matching Step 1 styling.
 * Uses same border/divider/radius patterns as Step 1 grouped blocks.
 */
export function CollapsibleSection({ title, defaultOpen = false, children, compact = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between bg-[#0F4C5C] px-4 text-left transition-colors hover:bg-[#0d3d4a] ${compact ? 'py-2' : 'py-3'}`}
        aria-expanded={isOpen}
      >
        <span className={`font-bold text-white ${compact ? 'text-base' : 'text-lg'}`}>{title}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div className="border-t border-gray-200 px-4 py-5">
          <div className="space-y-5">{children}</div>
        </div>
      )}
    </div>
  );
}
