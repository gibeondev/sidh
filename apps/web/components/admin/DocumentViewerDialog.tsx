'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export interface DocumentViewerDialogProps {
  open: boolean;
  onClose: () => void;
  documentUrl: string;
  fileName: string;
  mimeType?: string;
}

/**
 * Dialog for viewing documents/images. Supports images and PDFs.
 */
export function DocumentViewerDialog({
  open,
  onClose,
  documentUrl,
  fileName,
  mimeType,
}: DocumentViewerDialogProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const isImage = mimeType?.startsWith('image/') ?? false;
  const isPdf = mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75" onClick={onClose}>
      <div
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg border border-gray-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{fileName}</h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : isImage ? (
            <div className="flex items-center justify-center">
              <img
                src={documentUrl}
                alt={fileName}
                className="max-h-[70vh] max-w-full object-contain"
                onError={() => setError('Gagal memuat gambar.')}
              />
            </div>
          ) : isPdf ? (
            <div className="flex h-[70vh] items-center justify-center">
              <iframe
                src={documentUrl}
                title={fileName}
                className="h-full w-full rounded border border-gray-200"
                onError={() => setError('Gagal memuat PDF.')}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-500">
                Format tidak didukung untuk pratinjau. Silakan unduh file untuk melihat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
