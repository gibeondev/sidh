'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { FormRow } from './FormRow';

export interface StudentIdentityData {
  programChoice: string;
  educationLevel: string;
  gradeApplied: string;
  studentName: string;
  studentGender: 'MALE' | 'FEMALE';
  lastEducationLocation: string;
  studentBirthDate: string;
  nisn?: string;
}

const PROGRAM_OPTIONS = [
  { value: 'PJJ', label: 'PJJ' },
  { value: 'PTM', label: 'PTM' },
];

const EDUCATION_LEVEL_OPTIONS = [
  { value: 'SD', label: 'SD' },
  { value: 'SMP', label: 'SMP' },
  { value: 'SMA', label: 'SMA' },
];

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Laki-laki' },
  { value: 'FEMALE', label: 'Perempuan' },
];

const EDUCATION_LOCATION_OPTIONS = [
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Luar negeri', label: 'Luar negeri' },
];

export interface StudentIdentityStepProps {
  data: StudentIdentityData;
  onChange: (field: keyof StudentIdentityData, value: string) => void;
}

/**
 * Student Identity form step: 2-column grid, FormRow for standard rows.
 * Exceptions: radio group rows (program, education level, gender, education location).
 * Field names aligned with PreRegisterRequest.
 */
export function StudentIdentityStep({ data, onChange }: StudentIdentityStepProps) {
  const [selectedFileName, setSelectedFileName] = useState<string>('Tidak ada file yang dipilih');

  return (
    <section aria-labelledby="student-identity-heading" className="space-y-6">
      <h2
        id="student-identity-heading"
        className="text-center text-xl font-bold uppercase tracking-wide text-gray-900 mb-6"
      >
        IDENTITAS SISWA
      </h2>

      <div className="space-y-5">
        {/* Radio group row (exception): Program */}
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Mendaftar untuk program
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0">
            <RadioGroup
              name="programChoice"
              value={data.programChoice}
              onChange={(value) => onChange('programChoice', value)}
              options={PROGRAM_OPTIONS}
              aria-label="Mendaftar untuk program"
            />
          </div>
        </div>

        {/* Radio group row (exception): Education level */}
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Jenjang pendidikan
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0">
            <RadioGroup
              name="educationLevel"
              value={data.educationLevel}
              onChange={(value) => onChange('educationLevel', value)}
              options={EDUCATION_LEVEL_OPTIONS}
              aria-label="Jenjang pendidikan"
            />
          </div>
        </div>

        <FormRow label="Kelas" required>
          <Input
            id="gradeApplied"
            type="text"
            placeholder="Kelas"
            value={data.gradeApplied}
            onChange={(e) => onChange('gradeApplied', e.target.value)}
          />
        </FormRow>

        <FormRow label="Nama calon siswa" required>
          <Input
            id="studentName"
            type="text"
            autoComplete="name"
            placeholder="Nama calon siswa"
            value={data.studentName}
            onChange={(e) => onChange('studentName', e.target.value)}
          />
        </FormRow>

        {/* Radio group row (exception): Gender */}
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Jenis kelamin
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0">
            <RadioGroup
              name="studentGender"
              value={data.studentGender}
              onChange={(value) => onChange('studentGender', value as 'MALE' | 'FEMALE')}
              options={GENDER_OPTIONS}
              aria-label="Jenis kelamin"
            />
          </div>
        </div>

        {/* Radio group row (exception): Last education location */}
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Riwayat pendidikan terakhir
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0">
            <RadioGroup
              name="lastEducationLocation"
              value={data.lastEducationLocation}
              onChange={(value) => onChange('lastEducationLocation', value)}
              options={EDUCATION_LOCATION_OPTIONS}
              aria-label="Riwayat pendidikan terakhir"
            />
          </div>
        </div>

        <FormRow label="Tanggal lahir" required>
          <Input
            id="studentBirthDate"
            type="date"
            value={data.studentBirthDate}
            onChange={(e) => onChange('studentBirthDate', e.target.value)}
            aria-label="Tanggal lahir"
          />
        </FormRow>

        <FormRow label="Informasi memiliki NISN atau tidak">
          <Input
            id="nisn"
            type="text"
            placeholder="Informasi memiliki NISN atau tidak"
            value={data.nisn || ''}
            onChange={(e) => onChange('nisn', e.target.value)}
          />
        </FormRow>

        {/* File upload row */}
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Upload scan visa/izin tinggal (jika tersedia)
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Input
                  id="visaDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="flex-1"
                  aria-label="Upload scan visa/izin tinggal"
                  onChange={(e) => {
                    // File selection handled here (UI only, no API integration)
                    const file = e.target.files?.[0];
                    setSelectedFileName(file ? file.name : 'Tidak ada file yang dipilih');
                  }}
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">{selectedFileName}</span>
              </div>
              <p className="text-xs text-gray-500">
                (Ukuran file maksimum: 1MB. Jenis file yang didukung: PDF/JPG/PNG)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
