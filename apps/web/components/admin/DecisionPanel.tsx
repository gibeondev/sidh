'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ApplicationStatus } from '@/lib/api/admin-applications';

type Decision = 'approve' | 'reject' | 'request-changes';

export interface DecisionPanelProps {
  applicationId: string;
  status: ApplicationStatus;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, note: string) => Promise<void>;
  onRequestChanges: (id: string, note: string) => Promise<void>;
  onSuccess?: () => void;
}

export function DecisionPanel({
  applicationId,
  status,
  onApprove,
  onReject,
  onRequestChanges,
  onSuccess,
}: DecisionPanelProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [activeDecision, setActiveDecision] = useState<Decision | null>(null);

  const canDecide = status !== 'APPROVED' && status !== 'REJECTED';

  const submit = async (decision: Decision) => {
    if (decision === 'reject' || decision === 'request-changes') {
      const trimmed = note.trim();
      if (!trimmed) {
        setError('Catatan wajib diisi untuk Menolak atau Minta Perubahan.');
        return;
      }
    }
    setError(null);
    setBusy(true);
    try {
      if (decision === 'approve') {
        await onApprove(applicationId);
      } else if (decision === 'reject') {
        await onReject(applicationId, note.trim());
      } else {
        await onRequestChanges(applicationId, note.trim());
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
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        Keputusan sudah dibuat (status: {status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}).
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Keputusan</h3>
      {error && (
        <p className="mb-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {(activeDecision === 'reject' || activeDecision === 'request-changes') && (
        <div className="mb-3">
          <label htmlFor="decision-note" className="mb-1 block text-sm font-medium text-gray-700">
            Catatan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="decision-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Wajib diisi untuk menolak atau minta perubahan."
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            disabled={busy}
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setActiveDecision(activeDecision === 'approve' ? null : 'approve');
            setError(null);
            setNote('');
          }}
          disabled={busy}
          variant="outline"
        >
          Setujui
        </Button>
        <Button
          onClick={() => {
            setActiveDecision(activeDecision === 'reject' ? null : 'reject');
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
            setActiveDecision(activeDecision === 'request-changes' ? null : 'request-changes');
            setError(null);
          }}
          disabled={busy}
          variant="outline"
        >
          Minta Perubahan
        </Button>
        {activeDecision === 'approve' && (
          <Button
            onClick={() => submit('approve')}
            disabled={busy}
          >
            {busy ? 'Memproses...' : 'Konfirmasi Setujui'}
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
        {activeDecision === 'request-changes' && (
          <Button
            onClick={() => submit('request-changes')}
            disabled={busy || !note.trim()}
          >
            {busy ? 'Memproses...' : 'Kirim Permintaan Perubahan'}
          </Button>
        )}
      </div>
    </div>
  );
}
