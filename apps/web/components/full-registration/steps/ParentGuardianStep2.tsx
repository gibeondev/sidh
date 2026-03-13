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
  readOnly?: boolean;
}

/**
 * Step 2 — Data Orang Tua/Wali. Form fields per data dictionary section 7.
 * Uses collapsible sections: Data Ayah, Data Ibu, Data Wali.
 * Matches Step 1 styling and layout patterns.
 */
export function ParentGuardianStep2({ data, onChange, readOnly = false }: ParentGuardianStep2Props) {
  const handleChange = readOnly ? () => {} : onChange;
  const disabled = readOnly;
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
              onChange={(e) => handleChange('fatherFullName', e.target.value)}
              disabled={disabled}
              placeholder="Nama lengkap"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Tempat lahir" required>
            <Input
              id="fatherBirthPlace"
              value={data.fatherBirthPlace ?? ''}
              onChange={(e) => handleChange('fatherBirthPlace', e.target.value)}
              disabled={disabled}
              placeholder="Tempat lahir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Tanggal lahir" required>
            <Input
              id="fatherBirthDate"
              type="date"
              value={data.fatherBirthDate ?? ''}
              onChange={(e) => handleChange('fatherBirthDate', e.target.value)}
              disabled={disabled}
              placeholder="Tanggal lahir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400 !text-gray-400"
            />
          </FormRow>

          <FormRow label="NIK" required>
            <Input
              id="fatherNik"
              value={data.fatherNik ?? ''}
              onChange={(e) => handleChange('fatherNik', e.target.value)}
              disabled={disabled}
              placeholder="NIK"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Pendidikan terakhir" required>
            <Input
              id="fatherEducationLevel"
              value={data.fatherEducationLevel ?? ''}
              onChange={(e) => handleChange('fatherEducationLevel', e.target.value)}
              disabled={disabled}
              placeholder="Pendidikan terakhir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Pekerjaan" required>
            <Input
              id="fatherOccupation"
              value={data.fatherOccupation ?? ''}
              onChange={(e) => handleChange('fatherOccupation', e.target.value)}
              disabled={disabled}
              placeholder="Pekerjaan"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Kisaran pendapatan" required>
            <Input
              id="fatherIncomeRange"
              value={data.fatherIncomeRange ?? ''}
              onChange={(e) => handleChange('fatherIncomeRange', e.target.value)}
              disabled={disabled}
              placeholder="Kisaran pendapatan"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Nomor telepon" required>
            <Input
              id="fatherPhone"
              value={data.fatherPhone ?? ''}
              onChange={(e) => handleChange('fatherPhone', e.target.value)}
              disabled={disabled}
              placeholder="Nomor telepon"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Email" required>
            <Input
              id="fatherEmail"
              type="email"
              value={data.fatherEmail ?? ''}
              onChange={(e) => handleChange('fatherEmail', e.target.value)}
              disabled={disabled}
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
              onChange={(e) => handleChange('motherFullName', e.target.value)}
              disabled={disabled}
              placeholder="Nama lengkap"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Tempat lahir" required>
            <Input
              id="motherBirthPlace"
              value={data.motherBirthPlace ?? ''}
              onChange={(e) => handleChange('motherBirthPlace', e.target.value)}
              disabled={disabled}
              placeholder="Tempat lahir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Tanggal lahir" required>
            <Input
              id="motherBirthDate"
              type="date"
              value={data.motherBirthDate ?? ''}
              onChange={(e) => handleChange('motherBirthDate', e.target.value)}
              placeholder="Tanggal lahir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400 !text-gray-400"
            />
          </FormRow>

          <FormRow label="NIK" required>
            <Input
              id="motherNik"
              value={data.motherNik ?? ''}
              onChange={(e) => handleChange('motherNik', e.target.value)}
              disabled={disabled}
              placeholder="NIK"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Pendidikan terakhir" required>
            <Input
              id="motherEducationLevel"
              value={data.motherEducationLevel ?? ''}
              onChange={(e) => handleChange('motherEducationLevel', e.target.value)}
              disabled={disabled}
              placeholder="Pendidikan terakhir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Pekerjaan" required>
            <Input
              id="motherOccupation"
              value={data.motherOccupation ?? ''}
              onChange={(e) => handleChange('motherOccupation', e.target.value)}
              disabled={disabled}
              placeholder="Pekerjaan"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Kisaran pendapatan" required>
            <Input
              id="motherIncomeRange"
              value={data.motherIncomeRange ?? ''}
              onChange={(e) => handleChange('motherIncomeRange', e.target.value)}
              placeholder="Kisaran pendapatan"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Nomor telepon" required>
            <Input
              id="motherPhone"
              value={data.motherPhone ?? ''}
              onChange={(e) => handleChange('motherPhone', e.target.value)}
              disabled={disabled}
              placeholder="Nomor telepon"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Email" required>
            <Input
              id="motherEmail"
              type="email"
              value={data.motherEmail ?? ''}
              onChange={(e) => handleChange('motherEmail', e.target.value)}
              disabled={disabled}
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
              onChange={(e) => handleChange('guardianFullName', e.target.value)}
              disabled={disabled}
              placeholder="Nama lengkap"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Tempat lahir">
            <Input
              id="guardianBirthPlace"
              value={data.guardianBirthPlace ?? ''}
              onChange={(e) => handleChange('guardianBirthPlace', e.target.value)}
              disabled={disabled}
              placeholder="Tempat lahir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Tanggal lahir">
            <Input
              id="guardianBirthDate"
              type="date"
              value={data.guardianBirthDate ?? ''}
              onChange={(e) => handleChange('guardianBirthDate', e.target.value)}
              disabled={disabled}
              placeholder="Tanggal lahir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400 !text-gray-400"
            />
          </FormRow>

          <FormRow label="NIK">
            <Input
              id="guardianNik"
              value={data.guardianNik ?? ''}
              onChange={(e) => handleChange('guardianNik', e.target.value)}
              disabled={disabled}
              placeholder="NIK"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Pendidikan terakhir">
            <Input
              id="guardianEducationLevel"
              value={data.guardianEducationLevel ?? ''}
              onChange={(e) => handleChange('guardianEducationLevel', e.target.value)}
              placeholder="Pendidikan terakhir"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Pekerjaan">
            <Input
              id="guardianOccupation"
              value={data.guardianOccupation ?? ''}
              onChange={(e) => handleChange('guardianOccupation', e.target.value)}
              disabled={disabled}
              placeholder="Pekerjaan"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Kisaran pendapatan">
            <Input
              id="guardianIncomeRange"
              value={data.guardianIncomeRange ?? ''}
              onChange={(e) => handleChange('guardianIncomeRange', e.target.value)}
              disabled={disabled}
              placeholder="Kisaran pendapatan"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Nomor telepon">
            <Input
              id="guardianPhone"
              value={data.guardianPhone ?? ''}
              onChange={(e) => handleChange('guardianPhone', e.target.value)}
              placeholder="Nomor telepon"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>

          <FormRow label="Email">
            <Input
              id="guardianEmail"
              type="email"
              value={data.guardianEmail ?? ''}
              onChange={(e) => handleChange('guardianEmail', e.target.value)}
              disabled={disabled}
              placeholder="email@contoh.com"
              className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </FormRow>
        </CollapsibleSection>
      </div>
    </section>
  );
}
