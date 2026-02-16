'use client';

import { FormRow } from '@/components/pre-register';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';

export interface SpecialNeedsStepProps {
  data: Pick<FullRegistrationPayload, 'educationLevel' | 'lastEducationLocation'>;
  onChange: (field: keyof FullRegistrationPayload, value: string) => void;
}

/**
 * Step 4 — Kebutuhan Khusus & Informasi Tambahan. Placeholder; extend per Figma.
 */
export function SpecialNeedsStep({ data, onChange }: SpecialNeedsStepProps) {
  return (
    <section aria-labelledby="kebutuhan-heading" className="space-y-5">
      <h2
        id="kebutuhan-heading"
        className="mb-6 text-center text-xl font-bold uppercase tracking-wide text-gray-900"
      >
        KEBUTUHAN KHUSUS & INFORMASI TAMBAHAN
      </h2>
      <div className="space-y-5">
        <FormRow label="Jenjang pendidikan">
          <input
            type="text"
            className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={data.educationLevel}
            onChange={(e) => onChange('educationLevel', e.target.value)}
            placeholder="Contoh: SD, SMP, SMA"
          />
        </FormRow>
        <FormRow label="Riwayat pendidikan terakhir">
          <input
            type="text"
            className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={data.lastEducationLocation}
            onChange={(e) => onChange('lastEducationLocation', e.target.value)}
            placeholder="Contoh: Indonesia / Luar negeri"
          />
        </FormRow>
      </div>
    </section>
  );
}
