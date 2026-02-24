'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listParentApplications, type ParentApplicationListItem } from '@/lib/api/fullRegistration';
import { Button } from '@/components/ui/button';

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Belum dikirim',
    SUBMITTED: 'Dikirim',
    UNDER_REVIEW: 'Sedang Ditinjau',
    CHANGES_REQUESTED: 'Perubahan Diminta',
    APPROVED: 'Disetujui',
    REJECTED: 'Ditolak',
  };
  return map[status] ?? status;
}

/**
 * Parent main page: Pendaftaran list. Shows applications with status in Indonesian.
 * Each row links to full-registration wizard.
 */
export default function ParentPage() {
  const [items, setItems] = useState<ParentApplicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listParentApplications()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setError('Gagal memuat daftar aplikasi.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Pendaftaran</h1>
        <p className="text-gray-500">Memuat daftar aplikasi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Pendaftaran</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Pendaftaran</h1>
      <p className="text-gray-600">
        Daftar aplikasi pendaftaran Anda. Klik &quot;Registrasi lengkap&quot; atau &quot;Lanjutkan&quot; untuk mengisi atau melanjutkan formulir pendaftaran lengkap.
      </p>

      {items.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
          Belum ada aplikasi. Setelah pra-registrasi disetujui, aplikasi Anda akan muncul di sini.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((app) => (
            <li
              key={app.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-900">#{app.applicationNo}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {app.preRegistration?.applicantName ?? app.preRegistration?.studentName ?? '–'}
                </p>
                <p className="mt-1 text-sm">
                  <span className="text-gray-500">Status:</span>{' '}
                  <span className="font-medium text-gray-900">{statusLabel(app.status)}</span>
                </p>
              </div>
              <Link href={`/parent/applications/${app.id}/wizard`} className="shrink-0">
                <Button>
                  {app.status === 'DRAFT' || app.status === 'CHANGES_REQUESTED' ? 'Lanjutkan' : 'Registrasi lengkap'}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
