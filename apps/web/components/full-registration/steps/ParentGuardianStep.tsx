'use client';

import { Input } from '@/components/ui/input';
import { FormRow } from '@/components/pre-register';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';

export interface ParentGuardianStepProps {
  data: Pick<
    FullRegistrationPayload,
    'applicantName' | 'applicantRelationship' | 'applicantEmail' | 'assignmentCity' | 'assignmentCountry'
  >;
  onChange: (field: keyof FullRegistrationPayload, value: string) => void;
}

/**
 * Step 2 — Data Orang Tua/Wali. Per Figma Full Registration.
 */
export function ParentGuardianStep({ data, onChange }: ParentGuardianStepProps) {
  return (
    <section aria-labelledby="data-orang-tua-heading" className="space-y-5">
      <h2
        id="data-orang-tua-heading"
        className="mb-6 text-center text-xl font-bold uppercase tracking-wide text-gray-900"
      >
        DATA ORANG TUA/WALI
      </h2>
      <div className="space-y-5">
        <FormRow label="Nama orang tua/wali" required>
          <Input
            id="applicantName"
            value={data.applicantName}
            onChange={(e) => onChange('applicantName', e.target.value)}
            placeholder="Nama lengkap"
            className="w-full"
          />
        </FormRow>
        <FormRow label="Email" required>
          <Input
            id="applicantEmail"
            type="email"
            value={data.applicantEmail}
            onChange={(e) => onChange('applicantEmail', e.target.value)}
            placeholder="email@contoh.com"
            className="w-full"
          />
        </FormRow>
        <FormRow label="Hubungan dengan siswa" required>
          <Input
            id="applicantRelationship"
            value={data.applicantRelationship}
            onChange={(e) => onChange('applicantRelationship', e.target.value)}
            placeholder="Contoh: Ayah, Ibu, Wali"
            className="w-full"
          />
        </FormRow>
        <FormRow label="Kota domisili" required>
          <Input
            id="assignmentCity"
            value={data.assignmentCity}
            onChange={(e) => onChange('assignmentCity', e.target.value)}
            placeholder="Kota"
            className="w-full"
          />
        </FormRow>
        <FormRow label="Negara domisili" required>
          <Input
            id="assignmentCountry"
            value={data.assignmentCountry}
            onChange={(e) => onChange('assignmentCountry', e.target.value)}
            placeholder="Negara"
            className="w-full"
          />
        </FormRow>
      </div>
    </section>
  );
}
