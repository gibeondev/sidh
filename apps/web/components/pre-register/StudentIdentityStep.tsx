'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { FormRow } from './FormRow';
import { useVisaFile } from './VisaFileContext';

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

export type StudentIdentityFieldErrors = Partial<Record<keyof StudentIdentityData, string>>;

export interface StudentIdentityStepProps {
  data: StudentIdentityData;
  onChange: (field: keyof StudentIdentityData, value: string) => void;
  fieldErrors?: StudentIdentityFieldErrors;
}

const inputErrorClass = '!border-red-500';

/**
 * Student Identity form step: 2-column grid, FormRow for standard rows.
 * Exceptions: radio group rows (program, education level, gender, education location).
 * Field names aligned with PreRegisterRequest.
 */
export function StudentIdentityStep({ data, onChange, fieldErrors }: StudentIdentityStepProps) {
  const { setValue } = useFormContext();
  const { file: contextFile, setFile: setContextFile } = useVisaFile();
  const [selectedFileName, setSelectedFileName] = useState<string>('Tidak ada file yang dipilih');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileToShow = selectedFile ?? contextFile;
  const displayName = selectedFileName !== 'Tidak ada file yang dipilih' ? selectedFileName : (contextFile?.name ?? 'Tidak ada file yang dipilih');

  const handleOpenFile = () => {
    const file = fileToShow;
    if (!file) return;
    const url = URL.createObjectURL(file);
    const w = window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(url), w ? 1000 : 0);
  };

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
          <div className="flex-1 min-w-0 space-y-1">
            <RadioGroup
              name="programChoice"
              value={data.programChoice}
              onChange={(value) => onChange('programChoice', value)}
              options={PROGRAM_OPTIONS}
              aria-label="Mendaftar untuk program"
            />
            {fieldErrors?.programChoice && (
              <p className="text-sm text-red-600" role="alert">{fieldErrors.programChoice}</p>
            )}
          </div>
        </div>

        {/* Radio group row (exception): Education level */}
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Jenjang pendidikan
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0 space-y-1">
            <RadioGroup
              name="educationLevel"
              value={data.educationLevel}
              onChange={(value) => onChange('educationLevel', value)}
              options={EDUCATION_LEVEL_OPTIONS}
              aria-label="Jenjang pendidikan"
            />
            {fieldErrors?.educationLevel && (
              <p className="text-sm text-red-600" role="alert">{fieldErrors.educationLevel}</p>
            )}
          </div>
        </div>

        <FormRow label="Kelas" required error={fieldErrors?.gradeApplied}>
          <Input
            id="gradeApplied"
            type="text"
            placeholder="Kelas"
            value={data.gradeApplied}
            onChange={(e) => onChange('gradeApplied', e.target.value)}
            className={`placeholder:!text-gray-400 ${fieldErrors?.gradeApplied ? inputErrorClass : ''}`}
          />
        </FormRow>

        <FormRow label="Nama calon siswa" required error={fieldErrors?.studentName}>
          <Input
            id="studentName"
            type="text"
            autoComplete="name"
            placeholder="Nama calon siswa"
            value={data.studentName}
            onChange={(e) => onChange('studentName', e.target.value)}
            className={`placeholder:!text-gray-400 ${fieldErrors?.studentName ? inputErrorClass : ''}`}
          />
        </FormRow>

        {/* Radio group row (exception): Gender */}
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Jenis kelamin
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0 space-y-1">
            <RadioGroup
              name="studentGender"
              value={data.studentGender}
              onChange={(value) => onChange('studentGender', value as 'MALE' | 'FEMALE')}
              options={GENDER_OPTIONS}
              aria-label="Jenis kelamin"
            />
            {fieldErrors?.studentGender && (
              <p className="text-sm text-red-600" role="alert">{fieldErrors.studentGender}</p>
            )}
          </div>
        </div>

        {/* Radio group row (exception): Last education location */}
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <label className="pt-2 text-sm font-medium text-gray-900">
            Riwayat pendidikan terakhir
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="flex-1 min-w-0 space-y-1">
            <RadioGroup
              name="lastEducationLocation"
              value={data.lastEducationLocation}
              onChange={(value) => onChange('lastEducationLocation', value)}
              options={EDUCATION_LOCATION_OPTIONS}
              aria-label="Riwayat pendidikan terakhir"
            />
            {fieldErrors?.lastEducationLocation && (
              <p className="text-sm text-red-600" role="alert">{fieldErrors.lastEducationLocation}</p>
            )}
          </div>
        </div>

        <FormRow label="Tanggal lahir" required error={fieldErrors?.studentBirthDate}>
          <Input
            id="studentBirthDate"
            type="date"
            value={data.studentBirthDate}
            onChange={(e) => onChange('studentBirthDate', e.target.value)}
            aria-label="Tanggal lahir"
            className={`placeholder:!text-gray-400 ${fieldErrors?.studentBirthDate ? inputErrorClass : ''}`}
          />
        </FormRow>

        <FormRow label="Informasi memiliki NISN atau tidak">
          <Input
            id="nisn"
            type="text"
            placeholder="Informasi memiliki NISN atau tidak"
            value={data.nisn || ''}
            onChange={(e) => onChange('nisn', e.target.value)}
            className="placeholder:!text-gray-400"
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
                    const file = e.target.files?.[0];
                    const name = file ? file.name : '';
                    setSelectedFileName(name || 'Tidak ada file yang dipilih');
                    setSelectedFile(file ?? null);
                    setContextFile(file ?? null);
                    setValue('visaDocumentFileName', name, { shouldValidate: false });
                  }}
                />
                {fileToShow ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenFile();
                    }}
                    className="text-sm text-blue-600 hover:underline whitespace-nowrap cursor-pointer flex-shrink-0"
                  >
                    {displayName}
                  </button>
                ) : (
                  <span className="text-sm text-gray-500 whitespace-nowrap">{displayName}</span>
                )}
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
