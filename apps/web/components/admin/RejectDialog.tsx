'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface RejectDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  applicationId: string;
}

/**
 * Dialog for rejecting an application with decision reason.
 */
export function RejectDialog({ open, onClose, onConfirm, applicationId }: RejectDialogProps) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleConfirm = async () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setError('Alasan penolakan wajib diisi.');
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await onConfirm(trimmed);
      setReason('');
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan.');
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = () => {
    setReason('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCancel}>
      <div
        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Tolak Aplikasi</h2>
        {error && (
          <p className="mb-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <label htmlFor="reject-reason" className="mb-1 block text-sm font-medium text-gray-700">
          Alasan Penolakan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="reject-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Wajib diisi untuk menolak aplikasi."
          rows={4}
          className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          disabled={busy}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={busy}>
            Batal
          </Button>
          <Button onClick={handleConfirm} disabled={busy || !reason.trim()} className="bg-red-600 hover:bg-red-700">
            {busy ? 'Memproses...' : 'Konfirmasi Tolak'}
          </Button>
        </div>
      </div>
    </div>
  );
}
