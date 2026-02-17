'use client';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { RadioGroup } from '@/components/ui/radio-group';
import { FormRow } from '@/components/pre-register';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';

// Country options - can be expanded later
const COUNTRY_OPTIONS = [
  { value: 'NL', label: 'Netherlands' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'DE', label: 'Germany' },
  { value: 'BE', label: 'Belgium' },
  { value: 'FR', label: 'France' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'OTHER', label: 'Other' },
];

const VISA_TYPE_OPTIONS = [
  { value: 'Diplomat', label: 'Diplomat' },
  { value: 'Student', label: 'Student' },
  { value: 'Diaspora', label: 'Diaspora' },
];

export interface AddressStep3Props {
  data: Pick<
    FullRegistrationPayload,
    | 'parentServiceCountry'
    | 'domicilePeriodStart'
    | 'domicilePeriodEnd'
    | 'parentVisaType'
  >;
  onChange: (field: keyof FullRegistrationPayload, value: string) => void;
}

/**
 * Step 3 — Alamat & Domisili. Minimal fields per design:
 * 1. Negara tempat dinas orang tua/ studi orang tua (Country dropdown)
 * 2. Rencana periode domisili (Date range: Start - End)
 * 3. Informasi visa/ijin tinggal orang tua yang digunakan (Radio: Diplomat/Student/Diaspora)
 */
export function AddressStep3({ data, onChange }: AddressStep3Props) {
  return (
    <section aria-labelledby="alamat-heading" className="space-y-5">
      <h2
        id="alamat-heading"
        className="text-center text-xl font-bold uppercase tracking-wide text-gray-900 mb-6"
      >
        ALAMAT & DOMISILI
      </h2>

      <div className="space-y-5">
        <FormRow label="Negara tempat dinas orang tua/ studi orang tua" required>
          <Select
            id="parentServiceCountry"
            placeholder="Negara tempat dinas orang tua/ studi orang tua"
            options={COUNTRY_OPTIONS}
            value={data.parentServiceCountry ?? ''}
            onChange={(e) => onChange('parentServiceCountry', e.currentTarget.value)}
            className="!border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            aria-label="Negara tempat dinas orang tua/ studi orang tua"
          />
        </FormRow>

        {/* Date range row */}
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Rencana periode domisili
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <Input
              id="domicilePeriodStart"
              type="date"
              value={data.domicilePeriodStart ?? ''}
              onChange={(e) => onChange('domicilePeriodStart', e.target.value)}
              placeholder="Mulai"
              className="flex-1 !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400 !text-gray-400"
              aria-label="Tanggal mulai domisili"
            />
            <span className="text-gray-500 shrink-0">-</span>
            <Input
              id="domicilePeriodEnd"
              type="date"
              value={data.domicilePeriodEnd ?? ''}
              onChange={(e) => onChange('domicilePeriodEnd', e.target.value)}
              placeholder="Akhir"
              className="flex-1 !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400 !text-gray-400"
              aria-label="Tanggal akhir domisili"
            />
          </div>
        </div>

        <FormRow label="Informasi visa/ijin tinggal orang tua yang digunakan" required>
          <RadioGroup
            name="parentVisaType"
            value={data.parentVisaType ?? 'Diplomat'}
            onChange={(value) => onChange('parentVisaType', value as 'Diplomat' | 'Student' | 'Diaspora')}
            options={VISA_TYPE_OPTIONS}
            aria-label="Informasi visa/ijin tinggal orang tua yang digunakan"
          />
        </FormRow>
      </div>
    </section>
  );
}
