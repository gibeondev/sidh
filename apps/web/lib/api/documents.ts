/**
 * Document upload API client.
 * POST /parent/applications/:id/documents — upload document (multipart/form-data).
 * GET /parent/applications/:id/documents — list documents (metadata only).
 * GET /admin/documents/:id/download — get signed download URL (admin only).
 */

import { request, ApiError } from './client';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const credentials = 'include' as RequestCredentials;

export enum DocumentType {
  REPORT_CARD = 'REPORT_CARD',
  LAST_DIPLOMA = 'LAST_DIPLOMA',
  NISN_CARD = 'NISN_CARD',
  TRANSFER_LETTER = 'TRANSFER_LETTER',
  BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
  FAMILY_CARD = 'FAMILY_CARD',
  STUDENT_RESIDENCE_PERMIT = 'STUDENT_RESIDENCE_PERMIT',
  STUDENT_PASSPORT = 'STUDENT_PASSPORT',
  STUDENT_PHOTO = 'STUDENT_PHOTO',
  PARENT_RESIDENCE_PERMIT = 'PARENT_RESIDENCE_PERMIT',
  PARENT_PASSPORT = 'PARENT_PASSPORT',
  SCHOOL_CERTIFICATE = 'SCHOOL_CERTIFICATE',
  ATDIKBUD_CERTIFICATE = 'ATDIKBUD_CERTIFICATE',
  EQUIVALENCY_LETTER = 'EQUIVALENCY_LETTER',
  STUDENT_PERMIT_LETTER = 'STUDENT_PERMIT_LETTER',
  PARENT_STATEMENT = 'PARENT_STATEMENT',
}

export interface DocumentMetadata {
  id: string;
  applicationId: string;
  documentType: DocumentType;
  status: 'OPEN' | 'POSTPONED' | 'APPROVED' | 'REJECTED';
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

/**
 * Upload document to application
 */
export async function uploadDocument(
  applicationId: string,
  documentType: DocumentType,
  file: File
): Promise<DocumentMetadata> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);

  const response = await fetch(
    `${BASE_URL}/parent/applications/${applicationId}/documents`,
    {
      method: 'POST',
      body: formData,
      credentials,
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const serverMsg =
      typeof data.message === 'string'
        ? data.message
        : Array.isArray(data.message)
          ? data.message.join(' ')
          : '';
    const msg =
      serverMsg ||
      (response.status === 403
        ? 'Akses ditolak. Pastikan Anda masuk dengan akun yang benar.'
        : 'Gagal mengunggah dokumen. Silakan coba lagi.');
    throw new ApiError(msg, response.status, data);
  }

  return data as DocumentMetadata;
}

/**
 * List documents for application (parent - metadata only)
 */
export async function listDocuments(
  applicationId: string
): Promise<DocumentMetadata[]> {
  return request<DocumentMetadata[]>(
    `/parent/applications/${applicationId}/documents`,
    {
      credentials,
    }
  );
}

/**
 * List documents for application (admin - metadata only)
 */
export async function listDocumentsByAdmin(
  applicationId: string
): Promise<DocumentMetadata[]> {
  return request<DocumentMetadata[]>(
    `/admin/applications/${applicationId}/documents`,
    {
      credentials,
    }
  );
}

/**
 * Get download URL for document (parent - view own application's document)
 */
export async function getParentDocumentDownloadUrl(
  applicationId: string,
  documentId: string
): Promise<{ url: string; fileName: string; mimeType: string }> {
  return request<{ url: string; fileName: string; mimeType: string }>(
    `/parent/applications/${applicationId}/documents/${documentId}/download`,
    { credentials }
  );
}

/**
 * Get download URL for document (admin only)
 */
export async function getDownloadUrl(documentId: string): Promise<{
  url: string;
  fileName: string;
  mimeType: string;
}> {
  return request<{ url: string; fileName: string; mimeType: string }>(
    `/admin/documents/${documentId}/download`,
    {
      credentials,
    }
  );
}

export { ApiError };
