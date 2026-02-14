'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getAdminApplicationById,
  approveApplication,
  rejectApplication,
  requestChangesApplication,
  ApiError,
  type ApplicationDetail,
} from '@/lib/api/admin-applications';
import { AdminPageHeader, StatusBadge, DecisionPanel } from '@/components/admin';
import { Button } from '@/components/ui/button';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">{title}</h2>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value ?? '–'}</dd>
    </>
  );
}

export default function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);
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
    let cancelled = false;
    params.then((p) => {
      if (!cancelled) {
        setId(p.id);
        fetchDetail(p.id);
      }
    });
    return () => { cancelled = true; };
  }, [params, fetchDetail]);

  const handleApprove = async (applicationId: string) => {
    await approveApplication(applicationId);
    if (id === applicationId) fetchDetail(applicationId);
  };

  const handleReject = async (applicationId: string, note: string) => {
    await rejectApplication(applicationId, note);
    if (id === applicationId) fetchDetail(applicationId);
  };

  const handleRequestChanges = async (applicationId: string, note: string) => {
    await requestChangesApplication(applicationId, note);
    if (id === applicationId) fetchDetail(applicationId);
  };

  if (id === null || loading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Detail Aplikasi" />
        <div className="py-12 text-center text-gray-500">Memuat...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Detail Aplikasi" />
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
          <Link href="/admin/applications" className="ml-2 underline">
            Kembali ke daftar
          </Link>
        </div>
      </div>
    );
  }

  const pr = data.preRegistration;
  if (!pr) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Detail Aplikasi" />
        <p className="text-gray-600">Data pra-registrasi tidak ditemukan.</p>
        <Link href="/admin/applications">
          <Button variant="outline">Kembali ke daftar</Button>
        </Link>
      </div>
    );
  }

  const isApproved = data.status === 'APPROVED';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminPageHeader
          label="PRA-REGISTRASI"
          title="Detail Aplikasi"
        />
        <div className="flex items-center gap-2">
          <StatusBadge status={data.status} />
          <Link href="/admin/applications">
            <Button variant="outline">Kembali ke daftar</Button>
          </Link>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        No. Aplikasi: <strong>{data.applicationNo}</strong>
        {data.registrationPeriod?.name && (
          <> · Periode: {data.registrationPeriod.name}</>
        )}
      </p>

      {isApproved && (
        <div
          className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800"
          role="status"
        >
          <strong>Langkah berikut:</strong> Invitation onboarding (belum diimplementasi).
        </div>
      )}

      <DetailSection title="Data Siswa">
        <DetailRow label="Nama lengkap" value={pr.studentName} />
        <DetailRow label="Jenis kelamin" value={pr.studentGender} />
        <DetailRow label="Tanggal lahir" value={pr.studentBirthDate ? formatDate(pr.studentBirthDate) : undefined} />
        <DetailRow label="Lokasi pendidikan terakhir" value={pr.lastEducationLocation} />
        <DetailRow label="NISN" value={pr.nisn ?? undefined} />
      </DetailSection>

      <DetailSection title="Data Orang Tua / Wali">
        <DetailRow label="Nama pemohon" value={pr.applicantName} />
        <DetailRow label="Hubungan" value={pr.applicantRelationship} />
      </DetailSection>

      <DetailSection title="Alasan & Penempatan">
        <DetailRow label="Alasan tinggal di luar negeri" value={pr.reasonLivingAbroad} />
        <DetailRow label="Alasan mendaftar" value={pr.reasonToApply} />
        <DetailRow label="Kota penempatan" value={pr.assignmentCity} />
        <DetailRow label="Negara penempatan" value={pr.assignmentCountry} />
        <DetailRow label="Tanggal mulai domisili" value={pr.domicileStartDate ? formatDate(pr.domicileStartDate) : undefined} />
        <DetailRow label="Tanggal akhir domisili" value={pr.domicileEndDate ? formatDate(pr.domicileEndDate) : undefined} />
        <DetailRow label="Tanggal berakhir izin tinggal" value={pr.permitExpiryDate ? formatDate(pr.permitExpiryDate) : undefined} />
      </DetailSection>

      <DetailSection title="Program">
        <DetailRow label="Pilihan program" value={pr.programChoice} />
        <DetailRow label="Jenjang pendidikan" value={pr.educationLevel} />
        <DetailRow label="Kelas yang dilamar" value={pr.gradeApplied} />
      </DetailSection>

      {data.decisionReason && (
        <DetailSection title="Catatan keputusan">
          <p className="col-span-2 text-gray-700">{data.decisionReason}</p>
        </DetailSection>
      )}

      <DecisionPanel
        applicationId={data.id}
        status={data.status}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestChanges={handleRequestChanges}
        onSuccess={() => fetchDetail(data.id)}
      />
    </div>
  );
}
