'use client';

import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { Select } from '@/components/ui/select';
import { FormRow } from './FormRow';

export interface ParentGuardianData {
  applicantEmail: string;
  reasonLivingAbroad: string;
  reasonToApply: string;
  applicantRelationship: string;
  applicantName: string;
  assignmentCity: string;
  assignmentCountry: string;
  domicileStartDate: string;
  domicileEndDate: string;
  permitExpiryDate: string;
}

const RELATIONSHIP_OPTIONS = [
  { value: 'Ayah', label: 'Ayah' },
  { value: 'Ibu', label: 'Ibu' },
  { value: 'Wali', label: 'Wali' },
];

const COUNTRY_OPTIONS = [
  { value: 'NL', label: 'Netherlands' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'DE', label: 'Germany' },
  { value: 'BE', label: 'Belgium' },
  { value: 'OTHER', label: 'Other' },
];

export interface ParentGuardianStepProps {
  data: ParentGuardianData;
  onChange: (field: keyof ParentGuardianData, value: string) => void;
}

/**
 * Parent/Guardian form step: 2-column grid, FormRow for standard rows.
 * Exceptions: radio group row (relationship), date range row (start/end).
 * Field names aligned with PreRegisterRequest.
 */
export function ParentGuardianStep({ data, onChange }: ParentGuardianStepProps) {
  return (
    <section aria-labelledby="parent-guardian-heading" className="space-y-6">
      <h2
        id="parent-guardian-heading"
        className="text-center text-xl font-bold uppercase tracking-wide text-gray-900 mb-6"
      >
        DATA ORANG TUA/WALI SISWA
      </h2>

      <div className="space-y-5">
        <FormRow label="Email pendaftar" required>
          <Input
            id="applicantEmail"
            type="email"
            autoComplete="email"
            placeholder="Email pendaftar"
            value={data.applicantEmail}
            onChange={(e) => onChange('applicantEmail', e.target.value)}
          />
        </FormRow>

        <FormRow label="Jenis penugasan/alasan tinggal di luar negeri" required>
          <Input
            id="reasonLivingAbroad"
            type="text"
            placeholder="Jenis penugasan/alasan tinggal di luar negeri"
            value={data.reasonLivingAbroad}
            onChange={(e) => onChange('reasonLivingAbroad', e.target.value)}
          />
        </FormRow>

        <FormRow label="Alasan mendaftar ke SIDH" required>
          <Input
            id="reasonToApply"
            type="text"
            placeholder="Alasan mendaftar ke SIDH"
            value={data.reasonToApply}
            onChange={(e) => onChange('reasonToApply', e.target.value)}
          />
        </FormRow>

        {/* Radio group row (exception) */}
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Hubungan pendaftar dengan calon siswa
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0">
            <RadioGroup
              name="applicantRelationship"
              value={data.applicantRelationship}
              onChange={(value) => onChange('applicantRelationship', value)}
              options={RELATIONSHIP_OPTIONS}
              aria-label="Hubungan pendaftar dengan calon siswa"
            />
          </div>
        </div>

        <FormRow label="Nama orang tua pendaftar" required>
          <Input
            id="applicantName"
            type="text"
            autoComplete="name"
            placeholder="Nama orang tua pendaftar"
            value={data.applicantName}
            onChange={(e) => onChange('applicantName', e.target.value)}
          />
        </FormRow>

        <FormRow label="Alamat domisili" required>
          <Input
            id="assignmentCity"
            type="text"
            autoComplete="street-address"
            placeholder="Alamat domisili"
            value={data.assignmentCity}
            onChange={(e) => onChange('assignmentCity', e.target.value)}
          />
        </FormRow>

        <FormRow label="Negara domisili" required>
          <Select
            id="assignmentCountry"
            placeholder="Negara domisili"
            options={COUNTRY_OPTIONS}
            value={data.assignmentCountry}
            onChange={(e) => onChange('assignmentCountry', e.currentTarget.value)}
            aria-label="Negara domisili"
          />
        </FormRow>

        {/* Date range row (exception): Mulai – Akhir */}
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Rencana periode domisili
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <div className="flex-1 min-w-[120px]">
              <Input
                id="domicileStartDate"
                type="date"
                value={data.domicileStartDate}
                onChange={(e) => onChange('domicileStartDate', e.target.value)}
                aria-label="Mulai"
              />
            </div>
            <span className="text-gray-400" aria-hidden="true">–</span>
            <div className="flex-1 min-w-[120px]">
              <Input
                id="domicileEndDate"
                type="date"
                value={data.domicileEndDate}
                onChange={(e) => onChange('domicileEndDate', e.target.value)}
                aria-label="Akhir"
              />
            </div>
          </div>
        </div>

        <FormRow label="Tanggal masa berlaku visa/izin tinggal" required>
          <Input
            id="permitExpiryDate"
            type="date"
            value={data.permitExpiryDate}
            onChange={(e) => onChange('permitExpiryDate', e.target.value)}
            aria-label="Tanggal masa berlaku visa/izin tinggal"
          />
        </FormRow>
      </div>
    </section>
  );
}
