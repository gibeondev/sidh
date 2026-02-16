'use client';

import { Input } from '@/components/ui/input';
import { FormRow } from '@/components/pre-register';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';

export interface AddressStepProps {
  data: Pick<FullRegistrationPayload, 'addressLine' | 'postalCode'>;
  onChange: (field: keyof FullRegistrationPayload, value: string) => void;
}

/**
 * Step 3 — Alamat & Domisili. Per Figma Full Registration.
 */
export function AddressStep({ data, onChange }: AddressStepProps) {
  return (
    <section aria-labelledby="alamat-heading" className="space-y-5">
      <h2
        id="alamat-heading"
        className="mb-6 text-center text-xl font-bold uppercase tracking-wide text-gray-900"
      >
        ALAMAT & DOMISILI
      </h2>
      <div className="space-y-5">
        <FormRow label="Alamat lengkap" required>
          <Input
            id="addressLine"
            value={data.addressLine}
            onChange={(e) => onChange('addressLine', e.target.value)}
            placeholder="Jalan, nomor, RT/RW, kelurahan, kecamatan"
            className="w-full"
          />
        </FormRow>
        <FormRow label="Kode pos" required>
          <Input
            id="postalCode"
            value={data.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
            placeholder="Kode pos"
            className="w-full"
          />
        </FormRow>
      </div>
    </section>
  );
}
