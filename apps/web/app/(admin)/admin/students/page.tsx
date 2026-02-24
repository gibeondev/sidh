'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getAdminStudents,
  getAdminStudentExportFilterOptions,
  downloadAdminStudentsExportCsv,
  ApiError,
  type AdminStudentListItem,
} from '@/lib/api/admin-students';
import { AdminPageHeader } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

/**
 * Admin-only: list student profiles (created when full registration is approved).
 */
export default function AdminStudentsPage() {
  const [students, setStudents] = useState<AdminStudentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<{ grades: string[]; countries: string[]; occupations: string[] } | null>(null);
  const [exportGrade, setExportGrade] = useState('');
  const [exportCountry, setExportCountry] = useState('');
  const [exportOccupation, setExportOccupation] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAdminStudents()
      .then((data) => {
        if (!cancelled) setStudents(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof ApiError ? e.message : 'Gagal memuat daftar siswa.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getAdminStudentExportFilterOptions()
      .then((data) => {
        if (!cancelled) setFilterOptions(data);
      })
      .catch(() => {
        if (!cancelled) setFilterOptions({ grades: [], countries: [], occupations: [] });
      });
    return () => { cancelled = true; };
  }, []);

  const handleExport = async () => {
    setExportError(null);
    setExporting(true);
    try {
      await downloadAdminStudentsExportCsv({
        grade: exportGrade || undefined,
        country: exportCountry || undefined,
        occupation: exportOccupation || undefined,
      });
    } catch (e) {
      setExportError(e instanceof ApiError ? e.message : 'Gagal mengunduh CSV.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        label="Profil Siswa"
        title="Daftar Siswa"
      />
      <p className="text-sm text-gray-600">
        Siswa yang muncul di sini adalah profil yang dibuat otomatis setelah registrasi lengkap disetujui.
      </p>

      {/* Export CSV */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Export Data Siswa (CSV)</h2>
        <p className="mb-4 text-sm text-gray-600">
          Filter opsional: kelas, negara domisili (negara sekolah saat ini), atau pekerjaan orang tua/wali. Format UTF-8, siap untuk Excel.
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[140px]">
            <label className="mb-1 block text-xs font-medium text-gray-700">Kelas</label>
            <Select
              options={[
                { value: '', label: 'Semua kelas' },
                ...(filterOptions?.grades ?? []).map((g) => ({ value: g, label: g })),
              ]}
              value={exportGrade}
              onChange={(e) => setExportGrade(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-gray-700">Negara domisili</label>
            <Select
              options={[
                { value: '', label: 'Semua negara' },
                ...(filterOptions?.countries ?? []).map((c) => ({ value: c, label: c })),
              ]}
              value={exportCountry}
              onChange={(e) => setExportCountry(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-gray-700">Pekerjaan orang tua</label>
            <Select
              options={[
                { value: '', label: 'Semua' },
                ...(filterOptions?.occupations ?? []).map((o) => ({ value: o, label: o })),
              ]}
              value={exportOccupation}
              onChange={(e) => setExportOccupation(e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? 'Mengunduh...' : 'Export CSV'}
          </Button>
        </div>
        {exportError && (
          <p className="mt-3 text-sm text-red-600">{exportError}</p>
        )}
      </div>

      {loading && (
        <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-sm">
          Memuat...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {students.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Belum ada profil siswa. Setelah admin menyetujui registrasi lengkap, profil siswa akan dibuat otomatis dan muncul di sini.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Nama Lengkap</TableHead>
                  <TableHead className="font-semibold text-gray-700">No. Aplikasi</TableHead>
                  <TableHead className="font-semibold text-gray-700">Program</TableHead>
                  <TableHead className="font-semibold text-gray-700">Kelas</TableHead>
                  <TableHead className="font-semibold text-gray-700">Jenis Kelamin</TableHead>
                  <TableHead className="font-semibold text-gray-700">NISN</TableHead>
                  <TableHead className="font-semibold text-gray-700">Sekolah Saat Ini</TableHead>
                  <TableHead className="font-semibold text-gray-700">Tanggal Dibuat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900">
                      <Link href={`/admin/students/${s.id}`} className="text-teal-600 hover:underline">
                        {s.studentFullName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/applications/${s.applicationId}`}
                        className="text-teal-600 hover:underline"
                      >
                        #{s.application?.applicationNo ?? s.applicationId.slice(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell>{s.programChoice}</TableCell>
                    <TableCell>{s.gradeApplied}</TableCell>
                    <TableCell>{formatGender(s.studentGender)}</TableCell>
                    <TableCell>{s.nisn}</TableCell>
                    <TableCell>{s.currentSchoolName} ({s.currentSchoolCountry})</TableCell>
                    <TableCell>{formatDate(s.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}
