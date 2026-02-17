'use client';

import { useState } from 'react';
import { FormRow } from '@/components/pre-register';
import { FileUpload } from '@/components/ui/file-upload';

export interface DocumentFile {
  file: File | null;
}

export interface DocumentsStep5Props {
  documents: {
    reportCard: DocumentFile;
    lastDiploma: DocumentFile;
    nisnCard: DocumentFile;
    transferLetter: DocumentFile;
    birthCertificate: DocumentFile;
    familyCard: DocumentFile;
    studentResidencePermit: DocumentFile;
    studentPassport: DocumentFile;
    studentPhoto: DocumentFile;
    parentResidencePermit: DocumentFile;
    parentPassport: DocumentFile;
    schoolCertificate: DocumentFile;
    atdikbudCertificate: DocumentFile;
    equivalencyLetter: DocumentFile;
    studentPermitLetter: DocumentFile;
    parentStatement: DocumentFile;
  };
  onChange: (field: string, file: File | null) => void;
}

/**
 * Step 5 — Dokumen. All 16 document upload fields per design.
 */
export function DocumentsStep5({ documents, onChange }: DocumentsStep5Props) {
  return (
    <section aria-labelledby="dokumen-heading" className="space-y-5">
      <div className="flex items-center justify-between mb-6">
        <h2
          id="dokumen-heading"
          className="text-xl font-bold uppercase tracking-wide text-gray-900"
        >
          DOKUMEN
        </h2>
      </div>

      <p className="text-xs text-gray-600 mb-6 text-center">
        UKURAN FILE MAKSIMUM <span className="font-bold">1MB</span> | JENIS FILE YANG DIDUKUNG <span className="font-bold">PDF/JPG/PNG</span>
      </p>

      <div className="space-y-5">
        {/* Required Documents */}
        <FormRow label="Dokumen raport siswa dari sekolah lama" required>
          <FileUpload
            id="reportCard"
            value={documents.reportCard.file}
            onChange={(file) => onChange('reportCard', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Dokumen raport siswa dari sekolah lama"
          />
        </FormRow>

        <FormRow label="Scan ijazah terakhir (SD, SMP)" required>
          <FileUpload
            id="lastDiploma"
            value={documents.lastDiploma.file}
            onChange={(file) => onChange('lastDiploma', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Scan ijazah terakhir"
          />
        </FormRow>

        <FormRow label="Scan/copy kartu NISN" required>
          <FileUpload
            id="nisnCard"
            value={documents.nisnCard.file}
            onChange={(file) => onChange('nisnCard', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Scan/copy kartu NISN"
          />
        </FormRow>

        <FormRow label="Surat pindah dari sekolah lama" required>
          <FileUpload
            id="transferLetter"
            value={documents.transferLetter.file}
            onChange={(file) => onChange('transferLetter', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Surat pindah dari sekolah lama"
          />
        </FormRow>

        <FormRow label="Akte kelahiran siswa" required>
          <FileUpload
            id="birthCertificate"
            value={documents.birthCertificate.file}
            onChange={(file) => onChange('birthCertificate', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Akte kelahiran siswa"
          />
        </FormRow>

        <FormRow label="Kartu keluarga" required>
          <FileUpload
            id="familyCard"
            value={documents.familyCard.file}
            onChange={(file) => onChange('familyCard', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Kartu keluarga"
          />
        </FormRow>

        <FormRow label="Ijin tinggal Eropa/Afrika siswa" required>
          <FileUpload
            id="studentResidencePermit"
            value={documents.studentResidencePermit.file}
            onChange={(file) => onChange('studentResidencePermit', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Ijin tinggal Eropa/Afrika siswa"
          />
        </FormRow>

        <FormRow label="Paspor siswa" required>
          <FileUpload
            id="studentPassport"
            value={documents.studentPassport.file}
            onChange={(file) => onChange('studentPassport', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Paspor siswa"
          />
        </FormRow>

        <FormRow label="Pas foto siswa" required>
          <FileUpload
            id="studentPhoto"
            value={documents.studentPhoto.file}
            onChange={(file) => onChange('studentPhoto', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Pas foto siswa"
          />
        </FormRow>

        <FormRow label="Ijin tinggal Eropa/Afrika orang tua" required>
          <FileUpload
            id="parentResidencePermit"
            value={documents.parentResidencePermit.file}
            onChange={(file) => onChange('parentResidencePermit', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Ijin tinggal Eropa/Afrika orang tua"
          />
        </FormRow>

        <FormRow label="Paspor orang tua" required>
          <FileUpload
            id="parentPassport"
            value={documents.parentPassport.file}
            onChange={(file) => onChange('parentPassport', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Paspor orang tua"
          />
        </FormRow>

        {/* Optional Documents */}
        <FormRow label="Surat keterangan bersekolah/terdaftar di sekolah lokal di negara domisili penugasan orang tua">
          <FileUpload
            id="schoolCertificate"
            value={documents.schoolCertificate.file}
            onChange={(file) => onChange('schoolCertificate', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Surat keterangan bersekolah/terdaftar di sekolah lokal"
          />
        </FormRow>

        <FormRow label="Surat keterangan dari Atdikbud KBRI negara domisili siswa (Bagi siswa berasal dari sekolah lokal di negara domisili penugasan orang tua)">
          <FileUpload
            id="atdikbudCertificate"
            value={documents.atdikbudCertificate.file}
            onChange={(file) => onChange('atdikbudCertificate', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Surat keterangan dari Atdikbud KBRI"
          />
        </FormRow>

        <FormRow label="Surat E-Layanan penyetaraan ijazah (bagi lulusan SD, SMP di luar negeri)">
          <FileUpload
            id="equivalencyLetter"
            value={documents.equivalencyLetter.file}
            onChange={(file) => onChange('equivalencyLetter', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Surat E-Layanan penyetaraan ijazah"
          />
        </FormRow>

        <FormRow label="Surat E-Layanan perijinan siswa (bagi siswa berasal dari sekolah lokal di negara domisili penugasan orangtua)">
          <FileUpload
            id="studentPermitLetter"
            value={documents.studentPermitLetter.file}
            onChange={(file) => onChange('studentPermitLetter', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Surat E-Layanan perijinan siswa"
          />
        </FormRow>

        <FormRow label="Surat pernyataan orang tua dengan template yang sudah ada dari SIDH">
          <FileUpload
            id="parentStatement"
            value={documents.parentStatement.file}
            onChange={(file) => onChange('parentStatement', file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={1}
            aria-label="Surat pernyataan orang tua"
          />
        </FormRow>
      </div>
    </section>
  );
}
