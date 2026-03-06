'use client';

import { Input } from '@/components/ui/input';
import { FormRow } from '@/components/pre-register';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';

export interface AddressStepProps {
  data: Pick<FullRegistrationPayload, 'addressIndonesia' | 'domicileRegion'>;
  onChange: (field: keyof FullRegistrationPayload, value: string) => void;
}

/**
 * Step 3 — Alamat & Domisili. Per Figma Full Registration.
 * Maps to addressIndonesia (alamat lengkap) and domicileRegion (wilayah/kode pos).
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
            id="addressIndonesia"
            value={data.addressIndonesia ?? ''}
            onChange={(e) => onChange('addressIndonesia', e.target.value)}
            placeholder="Jalan, nomor, RT/RW, kelurahan, kecamatan"
            className="w-full"
          />
        </FormRow>
        <FormRow label="Wilayah domisili / Kode pos" required>
          <Input
            id="domicileRegion"
            value={data.domicileRegion ?? ''}
            onChange={(e) => onChange('domicileRegion', e.target.value)}
            placeholder="Wilayah domisili atau kode pos"
            className="w-full"
          />
        </FormRow>
      </div>
    </section>
  );
}
