'use client';

import { Input } from '@/components/ui/input';
import { FormRow } from '@/components/pre-register';
import { CollapsibleSection } from '../CollapsibleSection';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';

export interface ParentGuardianStep2Props {
  data: Pick<
    FullRegistrationPayload,
    | 'fatherFullName'
    | 'fatherBirthPlace'
    | 'fatherBirthDate'
    | 'fatherNik'
    | 'fatherEducationLevel'
    | 'fatherOccupation'
    | 'fatherIncomeRange'
    | 'fatherPhone'
    | 'fatherEmail'
    | 'motherFullName'
    | 'motherBirthPlace'
    | 'motherBirthDate'
    | 'motherNik'
    | 'motherEducationLevel'
    | 'motherOccupation'
    | 'motherIncomeRange'
    | 'motherPhone'
    | 'motherEmail'
    | 'guardianFullName'
    | 'guardianBirthPlace'
    | 'guardianBirthDate'
    | 'guardianNik'
    | 'guardianEducationLevel'
    | 'guardianOccupation'
    | 'guardianIncomeRange'
    | 'guardianPhone'
    | 'guardianEmail'
  >;
  onChange: (field: keyof FullRegistrationPayload, value: string) => void;
}

/**
 * Step 2 — Data Orang Tua/Wali. Form fields per data dictionary section 7.
 * Uses collapsible sections: Data Ayah, Data Ibu, Data Wali.
 * Matches Step 1 styling and layout patterns.
 */
export function ParentGuardianStep2({ data, onChange }: ParentGuardianStep2Props) {
  return (
    <section aria-labelledby="data-orang-tua-heading" className="space-y-5">
      <h2
        id="data-orang-tua-heading"
        className="text-center text-xl font-bold uppercase tracking-wide text-gray-900 mb-6"
      >
        DATA ORANG TUA/WALI
      </h2>

      <div className="space-y-4">
        {/* Data Ayah - Default open */}
        <CollapsibleSection title="Data Ayah" defaultOpen={true} compact={true}>
          <FormRow label="Nama lengkap" required>
            <Input
              id="fatherFullName"
              value={data.fatherFullName ?? ''}
              onChange={(e) => onChange('fatherFullName', e.target.value)}
              placeholder="Nama lengkap"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Tempat lahir" required>
            <Input
              id="fatherBirthPlace"
              value={data.fatherBirthPlace ?? ''}
              onChange={(e) => onChange('fatherBirthPlace', e.target.value)}
              placeholder="Tempat lahir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Tanggal lahir" required>
            <Input
              id="fatherBirthDate"
              type="date"
              value={data.fatherBirthDate ?? ''}
              onChange={(e) => onChange('fatherBirthDate', e.target.value)}
              placeholder="Tanggal lahir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400 !text-gray-400"
            />
          </FormRow>

          <FormRow label="NIK" required>
            <Input
              id="fatherNik"
              value={data.fatherNik ?? ''}
              onChange={(e) => onChange('fatherNik', e.target.value)}
              placeholder="NIK"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Pendidikan terakhir" required>
            <Input
              id="fatherEducationLevel"
              value={data.fatherEducationLevel ?? ''}
              onChange={(e) => onChange('fatherEducationLevel', e.target.value)}
              placeholder="Pendidikan terakhir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Pekerjaan" required>
            <Input
              id="fatherOccupation"
              value={data.fatherOccupation ?? ''}
              onChange={(e) => onChange('fatherOccupation', e.target.value)}
              placeholder="Pekerjaan"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Kisaran pendapatan" required>
            <Input
              id="fatherIncomeRange"
              value={data.fatherIncomeRange ?? ''}
              onChange={(e) => onChange('fatherIncomeRange', e.target.value)}
              placeholder="Kisaran pendapatan"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Nomor telepon" required>
            <Input
              id="fatherPhone"
              value={data.fatherPhone ?? ''}
              onChange={(e) => onChange('fatherPhone', e.target.value)}
              placeholder="Nomor telepon"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Email" required>
            <Input
              id="fatherEmail"
              type="email"
              value={data.fatherEmail ?? ''}
              onChange={(e) => onChange('fatherEmail', e.target.value)}
              placeholder="email@contoh.com"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>
        </CollapsibleSection>

        {/* Data Ibu - Default collapsed */}
        <CollapsibleSection title="Data Ibu" defaultOpen={false} compact={true}>
          <FormRow label="Nama lengkap" required>
            <Input
              id="motherFullName"
              value={data.motherFullName ?? ''}
              onChange={(e) => onChange('motherFullName', e.target.value)}
              placeholder="Nama lengkap"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Tempat lahir" required>
            <Input
              id="motherBirthPlace"
              value={data.motherBirthPlace ?? ''}
              onChange={(e) => onChange('motherBirthPlace', e.target.value)}
              placeholder="Tempat lahir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Tanggal lahir" required>
            <Input
              id="motherBirthDate"
              type="date"
              value={data.motherBirthDate ?? ''}
              onChange={(e) => onChange('motherBirthDate', e.target.value)}
              placeholder="Tanggal lahir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400 !text-gray-400"
            />
          </FormRow>

          <FormRow label="NIK" required>
            <Input
              id="motherNik"
              value={data.motherNik ?? ''}
              onChange={(e) => onChange('motherNik', e.target.value)}
              placeholder="NIK"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Pendidikan terakhir" required>
            <Input
              id="motherEducationLevel"
              value={data.motherEducationLevel ?? ''}
              onChange={(e) => onChange('motherEducationLevel', e.target.value)}
              placeholder="Pendidikan terakhir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Pekerjaan" required>
            <Input
              id="motherOccupation"
              value={data.motherOccupation ?? ''}
              onChange={(e) => onChange('motherOccupation', e.target.value)}
              placeholder="Pekerjaan"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Kisaran pendapatan" required>
            <Input
              id="motherIncomeRange"
              value={data.motherIncomeRange ?? ''}
              onChange={(e) => onChange('motherIncomeRange', e.target.value)}
              placeholder="Kisaran pendapatan"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Nomor telepon" required>
            <Input
              id="motherPhone"
              value={data.motherPhone ?? ''}
              onChange={(e) => onChange('motherPhone', e.target.value)}
              placeholder="Nomor telepon"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Email" required>
            <Input
              id="motherEmail"
              type="email"
              value={data.motherEmail ?? ''}
              onChange={(e) => onChange('motherEmail', e.target.value)}
              placeholder="email@contoh.com"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>
        </CollapsibleSection>

        {/* Data Wali - Default collapsed */}
        <CollapsibleSection title="Data Wali" defaultOpen={false} compact={true}>
          <FormRow label="Nama lengkap">
            <Input
              id="guardianFullName"
              value={data.guardianFullName ?? ''}
              onChange={(e) => onChange('guardianFullName', e.target.value)}
              placeholder="Nama lengkap"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Tempat lahir">
            <Input
              id="guardianBirthPlace"
              value={data.guardianBirthPlace ?? ''}
              onChange={(e) => onChange('guardianBirthPlace', e.target.value)}
              placeholder="Tempat lahir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Tanggal lahir">
            <Input
              id="guardianBirthDate"
              type="date"
              value={data.guardianBirthDate ?? ''}
              onChange={(e) => onChange('guardianBirthDate', e.target.value)}
              placeholder="Tanggal lahir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400 !text-gray-400"
            />
          </FormRow>

          <FormRow label="NIK">
            <Input
              id="guardianNik"
              value={data.guardianNik ?? ''}
              onChange={(e) => onChange('guardianNik', e.target.value)}
              placeholder="NIK"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Pendidikan terakhir">
            <Input
              id="guardianEducationLevel"
              value={data.guardianEducationLevel ?? ''}
              onChange={(e) => onChange('guardianEducationLevel', e.target.value)}
              placeholder="Pendidikan terakhir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Pekerjaan">
            <Input
              id="guardianOccupation"
              value={data.guardianOccupation ?? ''}
              onChange={(e) => onChange('guardianOccupation', e.target.value)}
              placeholder="Pekerjaan"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Kisaran pendapatan">
            <Input
              id="guardianIncomeRange"
              value={data.guardianIncomeRange ?? ''}
              onChange={(e) => onChange('guardianIncomeRange', e.target.value)}
              placeholder="Kisaran pendapatan"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Nomor telepon">
            <Input
              id="guardianPhone"
              value={data.guardianPhone ?? ''}
              onChange={(e) => onChange('guardianPhone', e.target.value)}
              placeholder="Nomor telepon"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Email">
            <Input
              id="guardianEmail"
              type="email"
              value={data.guardianEmail ?? ''}
              onChange={(e) => onChange('guardianEmail', e.target.value)}
              placeholder="email@contoh.com"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>
        </CollapsibleSection>
      </div>
    </section>
  );
}
