'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getAdminRegistrationPeriods,
  openRegistrationPeriod,
  closeRegistrationPeriod,
  createRegistrationPeriod,
  updateRegistrationPeriod,
  ApiError,
  type RegistrationPeriodItem,
} from '@/lib/api/admin-registration-periods';
import { AdminPageHeader } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

/** Format ISO string to YYYY-MM-DD for date input */
function toDateInputValue(iso: string): string {
  try {
    return iso.slice(0, 10);
  } catch {
    return '';
  }
}

function PeriodFormDialog({
  open,
  onClose,
  onSuccess,
  editPeriod,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPeriod: RegistrationPeriodItem | null;
}) {
  const [name, setName] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!editPeriod;

  useEffect(() => {
    if (open) {
      if (editPeriod) {
        setName(editPeriod.name);
        setStartAt(toDateInputValue(editPeriod.startAt));
        setEndAt(toDateInputValue(editPeriod.endAt));
      } else {
        setName('');
        setStartAt('');
        setEndAt('');
      }
      setError(null);
    }
  }, [open, editPeriod]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Nama periode wajib diisi.');
      return;
    }
    if (!startAt || !endAt) {
      setError('Tanggal mulai dan selesai wajib diisi.');
      return;
    }
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (end < start) {
      setError('Tanggal selesai harus pada atau setelah tanggal mulai.');
      return;
    }
    setError(null);
    setBusy(true);
    try {
      if (isEdit) {
        await updateRegistrationPeriod(editPeriod!.id, {
          name: trimmedName,
          startAt: start.toISOString(),
          endAt: end.toISOString(),
        });
      } else {
        await createRegistrationPeriod({
          name: trimmedName,
          startAt: start.toISOString(),
          endAt: end.toISOString(),
        });
      }
      onSuccess();
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Terjadi kesalahan.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isEdit ? 'Ubah Periode Registrasi' : 'Tambah Periode Registrasi'}
        </h2>
        {error && (
          <p className="mb-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="period-name" className="mb-1 block text-sm font-medium text-gray-700">
              Nama periode <span className="text-red-500">*</span>
            </label>
            <Input
              id="period-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Periode 2025"
              disabled={busy}
            />
          </div>
          <div>
            <label htmlFor="period-start" className="mb-1 block text-sm font-medium text-gray-700">
              Tanggal mulai <span className="text-red-500">*</span>
            </label>
            <Input
              id="period-start"
              type="date"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              disabled={busy}
            />
          </div>
          <div>
            <label htmlFor="period-end" className="mb-1 block text-sm font-medium text-gray-700">
              Tanggal selesai <span className="text-red-500">*</span>
            </label>
            <Input
              id="period-end"
              type="date"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              disabled={busy}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
              Batal
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? 'Memproses...' : isEdit ? 'Simpan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Admin settings: manage registration periods (view list, create, edit, open/close).
 */
export default function AdminSettingsPage() {
  const [periods, setPeriods] = useState<RegistrationPeriodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editPeriod, setEditPeriod] = useState<RegistrationPeriodItem | null>(null);

  const fetchPeriods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminRegistrationPeriods();
      setPeriods(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal memuat periode registrasi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  const handleOpen = async (id: string) => {
    setActingId(id);
    try {
      await openRegistrationPeriod(id);
      await fetchPeriods();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal membuka periode.');
    } finally {
      setActingId(null);
    }
  };

  const handleClose = async (id: string) => {
    setActingId(id);
    try {
      await closeRegistrationPeriod(id);
      await fetchPeriods();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal menutup periode.');
    } finally {
      setActingId(null);
    }
  };

  const handleAddClick = () => {
    setEditPeriod(null);
    setFormOpen(true);
  };

  const handleEditClick = (p: RegistrationPeriodItem) => {
    setEditPeriod(p);
    setFormOpen(true);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        label="Pengaturan"
        title="Pengaturan Admin"
      />
      <p className="text-sm text-gray-600">
        Kelola periode registrasi. Hanya satu periode dapat dibuka (untuk pra-registrasi dan pendaftaran lengkap).
      </p>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-900">
            Periode Registrasi
          </h2>
          <Button type="button" size="sm" onClick={handleAddClick}>
            Tambah periode
          </Button>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Memuat...
          </div>
        ) : periods.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Belum ada periode registrasi. Klik &quot;Tambah periode&quot; untuk membuat periode baru.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {periods.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="font-medium text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(p.startAt)} – {formatDate(p.endAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.status === 'OPEN'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {p.status === 'OPEN' ? 'Dibuka' : 'Ditutup'}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(p)}
                    disabled={actingId !== null}
                  >
                    Ubah
                  </Button>
                  {p.status === 'OPEN' ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleClose(p.id)}
                      disabled={actingId !== null}
                    >
                      {actingId === p.id ? 'Memproses...' : 'Tutup'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleOpen(p.id)}
                      disabled={actingId !== null}
                    >
                      {actingId === p.id ? 'Memproses...' : 'Buka'}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PeriodFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchPeriods}
        editPeriod={editPeriod}
      />
    </div>
  );
}
