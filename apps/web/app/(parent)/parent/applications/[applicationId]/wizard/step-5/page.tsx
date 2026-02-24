'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FullRegistrationHeader } from '@/components/full-registration';
import { DocumentsStep5, type DocumentFile } from '@/components/full-registration/steps/DocumentsStep5';
import { uploadDocument, listDocuments, DocumentType, ApiError } from '@/lib/api/documents';
import { submitFullRegistration } from '@/lib/api/fullRegistration';
import { useWizardReadOnly } from '../WizardContext';
import { Button } from '@/components/ui/button';

const STEP = 5 as const;

const createEmptyDocument = (): DocumentFile => ({ file: null });

// Map field names to DocumentType enum
const FIELD_TO_DOCUMENT_TYPE: Record<string, DocumentType> = {
  reportCard: DocumentType.REPORT_CARD,
  lastDiploma: DocumentType.LAST_DIPLOMA,
  nisnCard: DocumentType.NISN_CARD,
  transferLetter: DocumentType.TRANSFER_LETTER,
  birthCertificate: DocumentType.BIRTH_CERTIFICATE,
  familyCard: DocumentType.FAMILY_CARD,
  studentResidencePermit: DocumentType.STUDENT_RESIDENCE_PERMIT,
  studentPassport: DocumentType.STUDENT_PASSPORT,
  studentPhoto: DocumentType.STUDENT_PHOTO,
  parentResidencePermit: DocumentType.PARENT_RESIDENCE_PERMIT,
  parentPassport: DocumentType.PARENT_PASSPORT,
  schoolCertificate: DocumentType.SCHOOL_CERTIFICATE,
  atdikbudCertificate: DocumentType.ATDIKBUD_CERTIFICATE,
  equivalencyLetter: DocumentType.EQUIVALENCY_LETTER,
  studentPermitLetter: DocumentType.STUDENT_PERMIT_LETTER,
  parentStatement: DocumentType.PARENT_STATEMENT,
};

// Reverse map: DocumentType to field name
const DOCUMENT_TYPE_TO_FIELD: Record<DocumentType, string> = {
  [DocumentType.REPORT_CARD]: 'reportCard',
  [DocumentType.LAST_DIPLOMA]: 'lastDiploma',
  [DocumentType.NISN_CARD]: 'nisnCard',
  [DocumentType.TRANSFER_LETTER]: 'transferLetter',
  [DocumentType.BIRTH_CERTIFICATE]: 'birthCertificate',
  [DocumentType.FAMILY_CARD]: 'familyCard',
  [DocumentType.STUDENT_RESIDENCE_PERMIT]: 'studentResidencePermit',
  [DocumentType.STUDENT_PASSPORT]: 'studentPassport',
  [DocumentType.STUDENT_PHOTO]: 'studentPhoto',
  [DocumentType.PARENT_RESIDENCE_PERMIT]: 'parentResidencePermit',
  [DocumentType.PARENT_PASSPORT]: 'parentPassport',
  [DocumentType.SCHOOL_CERTIFICATE]: 'schoolCertificate',
  [DocumentType.ATDIKBUD_CERTIFICATE]: 'atdikbudCertificate',
  [DocumentType.EQUIVALENCY_LETTER]: 'equivalencyLetter',
  [DocumentType.STUDENT_PERMIT_LETTER]: 'studentPermitLetter',
  [DocumentType.PARENT_STATEMENT]: 'parentStatement',
};

export default function WizardStep5Page() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.applicationId as string | undefined;
  const readOnly = useWizardReadOnly();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, { fileName: string }>>({});
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

  // Load existing documents on mount
  useEffect(() => {
    if (applicationId) {
      loadExistingDocuments();
    }
  }, [applicationId]);

  const loadExistingDocuments = async () => {
    if (!applicationId) return;
    
    setIsLoading(true);
    try {
      const existingDocs = await listDocuments(applicationId);
      const docsMap: Record<string, { fileName: string; documentId?: string }> = {};
      existingDocs.forEach((doc) => {
        const field = DOCUMENT_TYPE_TO_FIELD[doc.documentType];
        if (field) {
          docsMap[field] = { fileName: doc.fileName, documentId: doc.id };
        }
      });
      setUploadedDocuments(docsMap);
    } catch (err) {
      // Silently fail - user might not have uploaded any documents yet
      console.error('Failed to load existing documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentChange = (field: string, file: File | null) => {
    setDocuments((prev) => ({
      ...prev,
      [field]: { file },
    }));
    setError(null);
    setSuccess(null);
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
      // Check if file is selected OR already uploaded
      if (!documents[key as keyof typeof documents].file && !uploadedDocuments[key]) {
        errors.push(`${label} wajib diunggah.`);
      }
    });

    return errors;
  };

  const uploadSelectedFiles = async (): Promise<void> => {
    if (!applicationId) {
      throw new Error('Application ID tidak ditemukan.');
    }

    // Upload all selected files (new uploads and replacements)
    const uploadPromises: Promise<void>[] = [];

    Object.entries(documents).forEach(([field, docFile]) => {
      // Upload when user has selected a file (new or replace existing)
      if (docFile.file) {
        const documentType = FIELD_TO_DOCUMENT_TYPE[field];
        if (documentType) {
          uploadPromises.push(
            uploadDocument(applicationId, documentType, docFile.file!)
              .then((uploadedDoc) => {
                // Update uploaded documents map
                setUploadedDocuments((prev) => ({
                  ...prev,
                  [field]: { fileName: uploadedDoc.fileName, documentId: uploadedDoc.id },
                }));
              })
              .catch((err) => {
                const fieldLabel = field
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase());
                throw new Error(
                  `Gagal mengunggah ${fieldLabel}: ${
                    err instanceof ApiError ? err.message : 'Terjadi kesalahan'
                  }`
                );
              })
          );
        }
      }
    });

    if (uploadPromises.length === 0) {
      // No new files to upload
      return;
    }

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
  };

  const handleSaveDraft = async () => {
    setError(null);
    setSuccess(null);

    if (!applicationId) {
      setError('Application ID tidak ditemukan.');
      return;
    }

    setIsUploading(true);

    try {
      await uploadSelectedFiles(); // Upload without validation for draft
      setSuccess('Draf berhasil disimpan. Anda dapat melanjutkan kapan saja.');
      
      // Reload existing documents to reflect new uploads
      await loadExistingDocuments();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan draf. Silakan coba lagi.';
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    const docErrors = validateRequiredDocuments();
    if (docErrors.length > 0) {
      setError(docErrors.join(' '));
      return;
    }
    setError(null);
    setSuccess(null);

    if (!applicationId) {
      setError('Application ID tidak ditemukan.');
      return;
    }

    setIsUploading(true);

    try {
      await uploadSelectedFiles();
      await submitFullRegistration(applicationId);
      setSuccess('Registrasi lengkap berhasil dikirim.');
      router.push(`/parent/applications/${applicationId}/wizard/success`);
    } catch (err) {
      let message = 'Gagal mengirim. Silakan coba lagi.';
      if (err instanceof ApiError) {
        message = err.message;
        if (err.body?.errors?.length) {
          message = err.body.errors.join(' ');
        }
      }
      setError(message);
    } finally {
      setIsUploading(false);
    }
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

          {success && (
            <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700" role="alert">
              {success}
            </div>
          )}

          {isUploading && (
            <div className="mb-6 rounded-md bg-blue-50 p-4 text-sm text-blue-700" role="alert">
              Mengunggah dokumen... Harap tunggu.
            </div>
          )}

          {isLoading && (
            <div className="mb-6 rounded-md bg-gray-50 p-4 text-sm text-gray-700" role="alert">
              Memuat dokumen yang sudah diunggah...
            </div>
          )}

          <DocumentsStep5 
            applicationId={applicationId}
            documents={documents} 
            onChange={handleDocumentChange}
            uploadedDocuments={uploadedDocuments}
            readOnly={readOnly}
          />

          <div className="flex items-center justify-between pt-8">
            {readOnly ? (
              <div className="flex flex-wrap items-center justify-center gap-6 w-full">
                <button
                  type="button"
                  onClick={() => applicationId && router.push(`/parent/applications/${applicationId}/wizard/step-4`)}
                  className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
                >
                  Kembali
                </button>
                <Link href="/parent">
                  <Button variant="outline" className="rounded-full px-8 py-3">
                    Kembali ke Daftar
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div>
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isUploading || isLoading}
                    className="rounded-md bg-gray-600 px-6 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isUploading ? 'Menyimpan...' : 'Simpan Draf'}
                  </button>
                </div>

                <div className="flex items-center gap-12">
                  <div>
                    <button
                      type="button"
                      onClick={() => router.push(`/parent/applications/${applicationId}/wizard/step-4`)}
                      disabled={isUploading}
                      className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                      Kembali
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isUploading || isLoading}
                      className="rounded-full bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {isUploading ? 'Mengunggah...' : 'Kirim'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
