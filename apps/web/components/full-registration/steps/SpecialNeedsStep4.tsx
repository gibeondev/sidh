'use client';

import { Textarea } from '@/components/ui/textarea';
import { FormRow } from '@/components/pre-register';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';

export interface SpecialNeedsStep4Props {
  data: Pick<FullRegistrationPayload, 'description' | 'additionalInfo'>;
  onChange: (field: keyof FullRegistrationPayload, value: string) => void;
}

/**
 * Step 4 — Kebutuhan Khusus & Informasi Tambahan. Fields per design:
 * 1. Deskripsi (Description) - Textarea
 * 2. Informasi tambahan yang dibutuhkan oleh sekolah (Additional information required by the school) - Textarea
 */
export function SpecialNeedsStep4({ data, onChange }: SpecialNeedsStep4Props) {
  return (
    <section aria-labelledby="kebutuhan-heading" className="space-y-5">
      <h2
        id="kebutuhan-heading"
        className="text-center text-xl font-bold uppercase tracking-wide text-gray-900 mb-6"
      >
        KEBUTUHAN KHUSUS & INFORMASI TAMBAHAN
      </h2>

      <div className="space-y-5">
        <FormRow label="Deskripsi">
          <Textarea
            id="description"
            value={data.description ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Deskripsi"
            rows={6}
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="Informasi tambahan yang dibutuhkan oleh sekolah">
          <Textarea
            id="additionalInfo"
            value={data.additionalInfo ?? ''}
            onChange={(e) => onChange('additionalInfo', e.target.value)}
            placeholder="Informasi tambahan yang dibutuhkan oleh sekolah"
            rows={6}
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>
      </div>
    </section>
  );
}
