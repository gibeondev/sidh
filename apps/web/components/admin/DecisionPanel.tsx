'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ApplicationStatus } from '@/lib/api/admin-applications';

type Decision = 'approve' | 'reject';

export interface DecisionPanelProps {
  applicationId: string;
  status: ApplicationStatus;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, note: string) => Promise<void>;
  onRequestChanges: (id: string, note: string) => Promise<void>;
  onSuccess?: () => void;
  /** When true, no section box, no "Keputusan" header, no separator — for inline use below form. */
  inline?: boolean;
}

export function DecisionPanel({
  applicationId,
  status,
  onApprove,
  onReject,
  onRequestChanges,
  onSuccess,
  inline = false,
}: DecisionPanelProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [activeDecision, setActiveDecision] = useState<Decision | null>(null);

  const canDecide = status !== 'APPROVED' && status !== 'REJECTED';

  const submit = async (decision: Decision) => {
    if (decision === 'reject') {
      const trimmed = note.trim();
      if (!trimmed) {
        setError('Catatan wajib diisi untuk Menolak.');
        return;
      }
    }
    setError(null);
    setBusy(true);
    try {
      if (decision === 'approve') {
        await onApprove(applicationId);
      } else {
        await onReject(applicationId, note.trim());
      }
      setActiveDecision(null);
      setNote('');
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan.');
    } finally {
      setBusy(false);
    }
  };

  if (!canDecide) {
    if (inline) {
      return (
        <span className="text-sm text-gray-500">
          Keputusan sudah dibuat (status: {status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}).
        </span>
      );
    }
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        Keputusan sudah dibuat (status: {status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}).
      </div>
    );
  }

  const content = (
    <>
      {!inline && <h3 className="mb-3 text-sm font-semibold text-gray-900">Keputusan</h3>}
      {error && (
        <p className="mb-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {activeDecision === 'reject' && (
        <div className="mb-3">
          <label htmlFor="decision-note" className="mb-1 block text-sm font-medium text-gray-700">
            Catatan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="decision-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Wajib diisi untuk menolak."
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            disabled={busy}
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {activeDecision === null ? (
          <>
            <Button
              onClick={() => {
                setActiveDecision('reject');
                setError(null);
              }}
              disabled={busy}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              Tolak
            </Button>
            <Button
              onClick={() => {
                setActiveDecision('approve');
                setError(null);
                setNote('');
              }}
              disabled={busy}
              variant="outline"
            >
              Setujui
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              setActiveDecision(null);
              setError(null);
              setNote('');
            }}
            disabled={busy}
            variant="outline"
          >
            Batalkan
          </Button>
        )}
        {activeDecision === 'reject' && (
          <Button
            onClick={() => submit('reject')}
            disabled={busy || !note.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            {busy ? 'Memproses...' : 'Konfirmasi Tolak'}
          </Button>
        )}
        {activeDecision === 'approve' && (
          <Button
            onClick={() => submit('approve')}
            disabled={busy}
          >
            {busy ? 'Memproses...' : 'Konfirmasi Setujui'}
          </Button>
        )}
      </div>
    </>
  );

  if (inline) {
    return <div>{content}</div>;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {content}
    </div>
  );
}
