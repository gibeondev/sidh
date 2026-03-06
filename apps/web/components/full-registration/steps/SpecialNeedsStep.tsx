'use client';

import { FormRow } from '@/components/pre-register';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';

export interface SpecialNeedsStepProps {
  data: Pick<FullRegistrationPayload, 'description' | 'additionalInfo'>;
  onChange: (field: keyof FullRegistrationPayload, value: string) => void;
}

/**
 * Step 4 — Kebutuhan Khusus & Informasi Tambahan. Alias for SpecialNeedsStep4; uses description & additionalInfo.
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
        <FormRow label="Keterangan kebutuhan khusus">
          <input
            type="text"
            className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={data.description ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Keterangan kebutuhan khusus"
          />
        </FormRow>
        <FormRow label="Informasi tambahan yang dibutuhkan oleh sekolah">
          <input
            type="text"
            className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={data.additionalInfo ?? ''}
            onChange={(e) => onChange('additionalInfo', e.target.value)}
            placeholder="Informasi tambahan"
          />
        </FormRow>
      </div>
    </section>
  );
}
