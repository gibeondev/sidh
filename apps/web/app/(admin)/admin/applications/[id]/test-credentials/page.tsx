'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminApplicationById, ApiError, type ApplicationDetail } from '@/lib/api/admin-applications';
import { AdminPageHeader } from '@/components/admin';

/** Fixed test password for parent login (temporary; matches backend PARENT_TEST_PASSWORD) */
const PARENT_TEST_PASSWORD = 'Test1234567!';

export default function AdminTestCredentialsPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [data, setData] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (applicationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminApplicationById(applicationId);
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof ApiError ? e.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchDetail(id);
  }, [id, fetchDetail]);

  if (!id || loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 bg-gray-100 px-4 py-8">
        <AdminPageHeader title="Kredensial tes orang tua" />
        <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-sm">
          Memuat...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 bg-gray-100 px-4 py-8">
        <AdminPageHeader title="Kredensial tes orang tua" />
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <p className="text-red-600">{error ?? 'Data tidak ditemukan.'}</p>
          <Link href={`/admin/applications/${id}`} className="mt-4 inline-block text-sm text-teal-600 hover:underline">
            Kembali ke detail aplikasi
          </Link>
        </div>
      </div>
    );
  }

  const preRegApproved = data.preRegistration?.status === 'APPROVED';
  const applicantName = data.preRegistration?.applicantName ?? '–';
  /** Backend creates User with email normalized to lowercase; login is case-sensitive */
  const loginEmail = (data.applicantEmail ?? '').trim().toLowerCase() || '–';

  return (
    <div className="mx-auto max-w-2xl space-y-6 bg-gray-100 px-4 py-8">
      <AdminPageHeader title="Kredensial tes orang tua" />

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="mb-4 text-sm text-gray-600">
          Halaman ini untuk keperluan pengujian saja. Gunakan kredensial di bawah untuk masuk sebagai orang tua dan mengisi formulir registrasi lengkap atau melanjutkan draft.
        </p>

        {preRegApproved ? (
          <>
            <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-amber-800">
                Login orang tua (sementara)
              </p>
              <div className="grid gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Nama:</span>{' '}
                  <span className="text-gray-900">{applicantName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email (username):</span>{' '}
                  <code className="rounded bg-gray-200 px-1.5 py-0.5 text-gray-900">{loginEmail}</code>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Kata sandi:</span>{' '}
                  <code className="rounded bg-gray-200 px-1.5 py-0.5 text-gray-900">{PARENT_TEST_PASSWORD}</code>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
              >
                Buka halaman login
              </Link>
              <Link
                href={`/parent/applications/${id}/wizard/step-1`}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Registrasi lengkap (setelah login)
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            <p className="font-medium">Pre-registration belum disetujui.</p>
            <p className="mt-1">
              Setujui pre-registration terlebih dahulu agar kredensial tes (email + kata sandi) dibuat untuk orang tua ini.
            </p>
            <Link href={`/admin/applications/${id}`} className="mt-3 inline-block text-teal-600 hover:underline">
              Kembali ke detail aplikasi
            </Link>
          </div>
        )}

        <p className="mt-6 text-xs text-gray-500">
          <Link href={`/admin/applications/${id}`} className="hover:underline">
            &larr; Kembali ke detail aplikasi
          </Link>
        </p>
      </div>
    </div>
  );
}
