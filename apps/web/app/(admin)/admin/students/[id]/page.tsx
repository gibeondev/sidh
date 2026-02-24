'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminStudentById, ApiError, type AdminStudentDetail } from '@/lib/api/admin-students';
import { AdminPageHeader, AdminCardSection } from '@/components/admin';

const LABEL_COL_WIDTH = 280;
const READONLY_VALUE_CLASS =
  'min-h-9 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 cursor-default outline-none focus:ring-0';

function FormReadOnlyRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div
      className="grid items-center gap-4 py-1"
      style={{ gridTemplateColumns: `${LABEL_COL_WIDTH}px 1fr` }}
    >
      <label className="text-right text-sm font-medium text-gray-900">{label}</label>
      <div className={READONLY_VALUE_CLASS}>{value ?? '–'}</div>
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return '–';
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '–';
  }
}

function formatGender(g: string): string {
  if (g === 'MALE') return 'Laki-laki';
  if (g === 'FEMALE') return 'Perempuan';
  return g;
}

function relationshipLabel(r: string): string {
  const map: Record<string, string> = {
    Father: 'Ayah',
    Mother: 'Ibu',
    Guardian: 'Wali',
  };
  return map[r] ?? r;
}

export default function AdminStudentDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [data, setData] = useState<AdminStudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (studentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminStudentById(studentId);
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof ApiError ? e.message : 'Gagal memuat data siswa.');
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
      <div className="mx-auto max-w-4xl space-y-6 bg-gray-100 px-4 py-8">
        <AdminPageHeader title="Detail Siswa" />
        <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-sm">
          Memuat...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 bg-gray-100 px-4 py-8">
        <AdminPageHeader title="Detail Siswa" />
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <p className="text-red-600">{error ?? 'Data tidak ditemukan.'}</p>
          <Link href="/admin/students" className="mt-4 inline-block text-teal-600 hover:underline">
            Kembali ke Daftar Siswa
          </Link>
        </div>
      </div>
    );
  }

  const app = data.application;

  return (
    <div className="mx-auto max-w-4xl space-y-6 bg-gray-100 px-4 py-8">
      <nav className="text-sm text-gray-600">
        <Link href="/admin/students" className="hover:text-teal-600 hover:underline">
          DAFTAR SISWA
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-gray-900">DETAIL SISWA</span>
      </nav>

      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">Profil siswa</p>
            <p className="text-lg font-bold text-gray-900">{data.studentFullName}</p>
            {app && (
              <Link
                href={`/admin/applications/${data.applicationId}`}
                className="mt-1 text-sm text-teal-600 hover:underline"
              >
                No. Aplikasi #{app.applicationNo}
              </Link>
            )}
          </div>
          <Link
            href="/admin/students"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
            aria-label="Kembali ke daftar"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <AdminCardSection title="Identitas Siswa" className="mb-10">
          <div className="space-y-0">
            <FormReadOnlyRow label="Nama lengkap" value={data.studentFullName} />
            <FormReadOnlyRow label="Program" value={data.programChoice} />
            <FormReadOnlyRow label="Kelas yang didaftarkan" value={data.gradeApplied} />
            <FormReadOnlyRow label="Jenis kelamin" value={formatGender(data.studentGender)} />
            <FormReadOnlyRow label="Tanggal lahir" value={formatDate(data.studentBirthDate)} />
            <FormReadOnlyRow label="Tempat lahir" value={data.birthPlace} />
            <FormReadOnlyRow label="NIK" value={data.nik} />
            <FormReadOnlyRow label="NISN" value={data.nisn} />
            <FormReadOnlyRow label="Agama" value={data.religion} />
          </div>
        </AdminCardSection>

        <AdminCardSection title="Data Fisik" className="mb-10">
          <div className="space-y-0">
            <FormReadOnlyRow label="Tinggi badan (cm)" value={data.heightCm} />
            <FormReadOnlyRow label="Berat badan (kg)" value={data.weightKg} />
          </div>
        </AdminCardSection>

        <AdminCardSection title="Riwayat Pendidikan" className="mb-10">
          <div className="space-y-0">
            <FormReadOnlyRow label="Sekolah terakhir di Indonesia" value={data.lastSchoolIndonesia} />
            <FormReadOnlyRow label="Nama sekolah saat ini" value={data.currentSchoolName} />
            <FormReadOnlyRow label="Negara sekolah saat ini" value={data.currentSchoolCountry} />
            <FormReadOnlyRow label="Nomor seri ijazah terakhir" value={data.lastDiplomaSerialNumber} />
          </div>
        </AdminCardSection>

        <AdminCardSection title="Data Keluarga" className="mb-10">
          <div className="space-y-0">
            <FormReadOnlyRow label="Anak ke" value={data.childOrder} />
            <FormReadOnlyRow label="Jumlah saudara kandung" value={data.siblingsCount} />
            <FormReadOnlyRow label="Kebutuhan khusus" value={data.hasSpecialNeeds} />
          </div>
        </AdminCardSection>

        <AdminCardSection title="Alamat & Kontak" className="mb-10">
          <div className="space-y-0">
            <FormReadOnlyRow label="Alamat di Indonesia" value={data.addressIndonesia} />
            <FormReadOnlyRow label="Wilayah domisili" value={data.domicileRegion} />
            <FormReadOnlyRow label="Telepon" value={`${data.phoneCountryCode} ${data.phoneNumber}`} />
          </div>
        </AdminCardSection>

        {app?.contacts && app.contacts.length > 0 && (
          <AdminCardSection title="Data Orang Tua / Wali">
            <div className="space-y-6">
              {app.contacts.map((c, idx) => (
                <div key={idx} className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-gray-700">
                    {relationshipLabel(c.relationship)}
                  </h4>
                  <div className="space-y-0">
                    <FormReadOnlyRow label="Nama lengkap" value={c.fullName} />
                    <FormReadOnlyRow label="Pekerjaan" value={c.occupation} />
                    {c.educationLevel != null && (
                      <FormReadOnlyRow label="Pendidikan terakhir" value={c.educationLevel} />
                    )}
                    {c.phone != null && <FormReadOnlyRow label="Telepon" value={c.phone} />}
                    {c.email != null && <FormReadOnlyRow label="Email" value={c.email} />}
                  </div>
                </div>
              ))}
            </div>
          </AdminCardSection>
        )}
      </div>
    </div>
  );
}
