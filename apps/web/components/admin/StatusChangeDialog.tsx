'use client';

import { Button } from '@/components/ui/button';
import type { ApplicationStatus } from '@/lib/api/admin-applications';

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: 'Belum dikirim',
  SUBMITTED: 'Dikirim',
  UNDER_REVIEW: 'Sedang Ditinjau',
  CHANGES_REQUESTED: 'Perubahan Diminta',
  APPROVED: 'Disetujui',
  REJECTED: 'Ditolak',
};

export interface StatusChangeDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  currentStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  changing: boolean;
}

/**
 * Dialog for confirming status change.
 */
export function StatusChangeDialog({
  open,
  onClose,
  onConfirm,
  currentStatus,
  newStatus,
  changing,
}: StatusChangeDialogProps) {
  if (!open) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      // Error handling is done by parent
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Konfirmasi Ubah Status</h2>
        <div className="mb-6 space-y-2">
          <p className="text-sm text-gray-700">
            Apakah Anda yakin ingin mengubah status aplikasi?
          </p>
          <div className="rounded-md bg-gray-50 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Status saat ini:</span>
              <span className="font-medium text-gray-900">{STATUS_LABELS[currentStatus]}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Status baru:</span>
              <span className="font-medium text-teal-600">{STATUS_LABELS[newStatus]}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={changing}>
            Batal
          </Button>
          <Button onClick={handleConfirm} disabled={changing}>
            {changing ? 'Menyimpan...' : 'Konfirmasi'}
          </Button>
        </div>
      </div>
    </div>
  );
}
