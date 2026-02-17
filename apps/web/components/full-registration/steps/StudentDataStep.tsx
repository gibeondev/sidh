'use client';

import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { FormRow } from '@/components/pre-register';
import type { FullRegistrationPayload } from '@/lib/api/fullRegistration';

const PROGRAM_OPTIONS = [
  { value: 'PJJ', label: 'PJJ' },
  { value: 'PTM', label: 'PTM' },
];

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Laki-laki' },
  { value: 'FEMALE', label: 'Perempuan' },
];

const SPECIAL_NEEDS_OPTIONS = [
  { value: 'YES', label: 'Ya' },
  { value: 'NO', label: 'Tidak' },
];

export interface StudentDataStepProps {
  data: Pick<
    FullRegistrationPayload,
    | 'studentName'
    | 'programChoice'
    | 'gradeApplied'
    | 'studentGender'
    | 'studentBirthDate'
    | 'birthPlace'
    | 'nik'
    | 'religion'
    | 'heightCm'
    | 'weightKg'
    | 'nisn'
    | 'lastSchoolIndonesia'
    | 'currentSchoolName'
    | 'currentSchoolCountry'
    | 'childOrder'
    | 'siblingCount'
    | 'lastDiplomaSerialNumber'
    | 'hasSpecialNeeds'
    | 'addressIndonesia'
    | 'domicileRegion'
    | 'phoneCountryCode'
    | 'phoneNumber'
  >;
  onChange: (field: keyof FullRegistrationPayload, value: string) => void;
}

/**
 * Step 1 — Data Siswa. Form fields per Figma Full Registration design.
 * Uses FormRow 2-column layout; reuses pre-register FormRow.
 */
export function StudentDataStep({ data, onChange }: StudentDataStepProps) {
  return (
    <section aria-labelledby="data-siswa-heading" className="space-y-5">
      <h2
        id="data-siswa-heading"
        className="text-center text-xl font-bold uppercase tracking-wide text-gray-900 mb-6"
      >
        DATA SISWA
      </h2>

      <div className="space-y-5">
        <FormRow label="Nama lengkap" required>
          <Input
            id="studentName"
            value={data.studentName}
            onChange={(e) => onChange('studentName', e.target.value)}
            placeholder="nama lengkap"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Mendaftar untuk program
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0">
            <RadioGroup
              name="programChoice"
              value={data.programChoice}
              onChange={(v) => onChange('programChoice', v)}
              options={PROGRAM_OPTIONS}
              aria-label="Mendaftar untuk program"
            />
          </div>
        </div>

        <FormRow label="Kelas yang didaftarkan" required>
          <Input
            id="gradeApplied"
            value={data.gradeApplied}
            onChange={(e) => onChange('gradeApplied', e.target.value)}
            placeholder="kelas yang didaftarkan"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Jenis kelamin
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0">
            <RadioGroup
              name="studentGender"
              value={data.studentGender}
              onChange={(v) => onChange('studentGender', v)}
              options={GENDER_OPTIONS}
              aria-label="Jenis kelamin"
            />
          </div>
        </div>

        <FormRow label="TTL (tanggal lahir)" required>
          <Input
            id="studentBirthDate"
            type="date"
            value={data.studentBirthDate}
            onChange={(e) => onChange('studentBirthDate', e.target.value)}
            placeholder="TTL (tanggal lahir)"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400 !text-gray-400"
          />
        </FormRow>

        <FormRow label="TTL (tempat lahir)" required>
          <Input
            id="birthPlace"
            value={data.birthPlace}
            onChange={(e) => onChange('birthPlace', e.target.value)}
            placeholder="TTL (tempat lahir)"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="NIK" required>
          <Input
            id="nik"
            value={data.nik}
            onChange={(e) => onChange('nik', e.target.value)}
            placeholder="NIK"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="Agama" required>
          <Input
            id="religion"
            value={data.religion}
            onChange={(e) => onChange('religion', e.target.value)}
            placeholder="Agama"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="Tinggi badan (cm)" required>
          <Input
            id="heightCm"
            type="text"
            inputMode="numeric"
            value={data.heightCm}
            onChange={(e) => onChange('heightCm', e.target.value)}
            placeholder="Tinggi badan (cm)"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="Berat badan (kg)" required>
          <Input
            id="weightKg"
            type="text"
            inputMode="numeric"
            value={data.weightKg}
            onChange={(e) => onChange('weightKg', e.target.value)}
            placeholder="Berat badan (kg)"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="NISN (Nomor Induk Siswa Nasional)" required>
          <Input
            id="nisn"
            value={data.nisn}
            onChange={(e) => onChange('nisn', e.target.value)}
            placeholder="NISN (Nomor Induk Siswa Nasional)"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="Informasi sekolah terakhir di Indonesia" required>
          <Input
            id="lastSchoolIndonesia"
            value={data.lastSchoolIndonesia}
            onChange={(e) => onChange('lastSchoolIndonesia', e.target.value)}
            placeholder="Tahun terakhir bersekolah di Indonesia"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="Nama sekolah (informasi sekolah saat ini)" required>
          <Input
            id="currentSchoolName"
            value={data.currentSchoolName}
            onChange={(e) => onChange('currentSchoolName', e.target.value)}
            placeholder="Nama sekolah"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="Negara (sekolah saat ini)" required>
          <Input
            id="currentSchoolCountry"
            value={data.currentSchoolCountry}
            onChange={(e) => onChange('currentSchoolCountry', e.target.value)}
            placeholder="Negara"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="Anak ke berapa" required>
          <Input
            id="childOrder"
            value={data.childOrder}
            onChange={(e) => onChange('childOrder', e.target.value)}
            placeholder="Anak ke berapa"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="Jumlah saudara kandung" required>
          <Input
            id="siblingCount"
            value={data.siblingCount}
            onChange={(e) => onChange('siblingCount', e.target.value)}
            placeholder="Jumlah saudara kandung"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="Nomor seri ijazah terakhir" required>
          <Input
            id="lastDiplomaSerialNumber"
            value={data.lastDiplomaSerialNumber}
            onChange={(e) => onChange('lastDiplomaSerialNumber', e.target.value)}
            placeholder="Nomor seri ijazah terakhir"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Informasi berkebutuhan khusus
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0">
            <RadioGroup
              name="hasSpecialNeeds"
              value={data.hasSpecialNeeds}
              onChange={(v) => onChange('hasSpecialNeeds', v)}
              options={SPECIAL_NEEDS_OPTIONS}
              aria-label="Informasi berkebutuhan khusus"
            />
          </div>
        </div>

        <FormRow label="Alamat tinggal Indonesia" required>
          <Input
            id="addressIndonesia"
            value={data.addressIndonesia}
            onChange={(e) => onChange('addressIndonesia', e.target.value)}
            placeholder="Alamat tinggal Indonesia"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <FormRow label="Alamat tinggal domisili penugasan orang tua" required>
          <Input
            id="domicileRegion"
            value={data.domicileRegion}
            onChange={(e) => onChange('domicileRegion', e.target.value)}
            placeholder="Alamat tinggal domisili penugasan orang tua"
            className="w-full !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
          />
        </FormRow>

        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Nomor telepon rumah
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0 flex gap-2">
            <Input
              id="phoneCountryCode"
              value={data.phoneCountryCode}
              onChange={(e) => onChange('phoneCountryCode', e.target.value)}
              placeholder="+62"
              className="w-20 !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
            <Input
              id="phoneNumber"
              value={data.phoneNumber}
              onChange={(e) => onChange('phoneNumber', e.target.value)}
              placeholder="Nomor telepon"
              className="flex-1 !border-gray-200 focus-visible:!border-gray-200 focus-visible:!ring-gray-200 placeholder:!text-gray-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
