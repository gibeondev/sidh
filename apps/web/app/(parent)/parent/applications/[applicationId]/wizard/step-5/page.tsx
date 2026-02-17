'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FullRegistrationHeader, WizardStepActions } from '@/components/full-registration';
import { DocumentsStep5, type DocumentFile } from '@/components/full-registration/steps/DocumentsStep5';

const STEP = 5 as const;

const createEmptyDocument = (): DocumentFile => ({ file: null });

export default function WizardStep5Page() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.applicationId as string | undefined;
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState({
    reportCard: createEmptyDocument(),
    lastDiploma: createEmptyDocument(),
    nisnCard: createEmptyDocument(),
    transferLetter: createEmptyDocument(),
    birthCertificate: createEmptyDocument(),
    familyCard: createEmptyDocument(),
    studentResidencePermit: createEmptyDocument(),
    studentPassport: createEmptyDocument(),
    studentPhoto: createEmptyDocument(),
    parentResidencePermit: createEmptyDocument(),
    parentPassport: createEmptyDocument(),
    schoolCertificate: createEmptyDocument(),
    atdikbudCertificate: createEmptyDocument(),
    equivalencyLetter: createEmptyDocument(),
    studentPermitLetter: createEmptyDocument(),
    parentStatement: createEmptyDocument(),
  });

  const handleDocumentChange = (field: string, file: File | null) => {
    setDocuments((prev) => ({
      ...prev,
      [field]: { file },
    }));
    setError(null);
  };

  const validateRequiredDocuments = (): string[] => {
    const errors: string[] = [];
    const requiredFields = [
      { key: 'reportCard', label: 'Dokumen raport siswa dari sekolah lama' },
      { key: 'lastDiploma', label: 'Scan ijazah terakhir (SD, SMP)' },
      { key: 'nisnCard', label: 'Scan/copy kartu NISN' },
      { key: 'transferLetter', label: 'Surat pindah dari sekolah lama' },
      { key: 'birthCertificate', label: 'Akte kelahiran siswa' },
      { key: 'familyCard', label: 'Kartu keluarga' },
      { key: 'studentResidencePermit', label: 'Ijin tinggal Eropa/Afrika siswa' },
      { key: 'studentPassport', label: 'Paspor siswa' },
      { key: 'studentPhoto', label: 'Pas foto siswa' },
      { key: 'parentResidencePermit', label: 'Ijin tinggal Eropa/Afrika orang tua' },
      { key: 'parentPassport', label: 'Paspor orang tua' },
    ];

    requiredFields.forEach(({ key, label }) => {
      if (!documents[key as keyof typeof documents].file) {
        errors.push(`${label} wajib diunggah.`);
      }
    });

    return errors;
  };

  const handleNext = async () => {
    const errors = validateRequiredDocuments();
    if (errors.length > 0) {
      setError(errors.join(' '));
      return;
    }
    setError(null);

    // TODO: Upload documents via API when backend is ready
    // For now, just navigate to completion/submit page
    // When document upload API is ready:
    // 1. Upload each document file via POST /parent/applications/:id/documents
    // 2. Handle upload errors
    // 3. Only navigate on success

    // Placeholder: navigate to a completion page or submit
    // router.push(`/parent/applications/${applicationId}/wizard/complete`);
    
    // For now, just show success message
    alert('Dokumen berhasil diunggah. (Upload API integration pending)');
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <FullRegistrationHeader currentStep={STEP} />

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
        >
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <DocumentsStep5 documents={documents} onChange={handleDocumentChange} />

          <div className="flex items-center justify-center gap-12 pt-8">
            <div>
              <button
                type="button"
                onClick={() => router.push(`/parent/applications/${applicationId}/wizard/step-4`)}
                className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Kembali
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Kirim
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
