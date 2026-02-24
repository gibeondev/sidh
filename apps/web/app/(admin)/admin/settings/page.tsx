'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getAdminRegistrationPeriods,
  openRegistrationPeriod,
  closeRegistrationPeriod,
  ApiError,
  type RegistrationPeriodItem,
} from '@/lib/api/admin-registration-periods';
import { AdminPageHeader } from '@/components/admin';
import { Button } from '@/components/ui/button';

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

/**
 * Admin settings: manage registration periods (view list, open/close).
 * Optional: create/edit periods, test credentials note — for later.
 */
export default function AdminSettingsPage() {
  const [periods, setPeriods] = useState<RegistrationPeriodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

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
        <h2 className="border-b border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-900">
          Periode Registrasi
        </h2>
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Memuat...
          </div>
        ) : periods.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Belum ada periode registrasi. (Pembuatan periode dapat ditambahkan nanti.)
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
    </div>
  );
}
