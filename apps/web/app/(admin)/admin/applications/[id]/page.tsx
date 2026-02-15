'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  getAdminApplicationById,
  approveApplication,
  rejectApplication,
  requestChangesApplication,
  ApiError,
  type ApplicationDetail,
} from '@/lib/api/admin-applications';
import { AdminCardSection, AdminPageHeader, StatusBadge, DecisionPanel } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function formatDateShort(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '–';
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatGender(g: string | undefined): string {
  if (!g) return '–';
  if (g === 'MALE') return 'Laki-laki';
  if (g === 'FEMALE') return 'Perempuan';
  return g;
}

const LABEL_COL_WIDTH = 280;

/** Read-only value cell: soft muted background, subtle border, no focus ring, cursor-default. */
const READONLY_VALUE_CLASS =
  'min-h-9 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 cursor-default outline-none focus:ring-0';

/**
 * Read-only form row: fixed label column, right-aligned label, value vertically centered.
 */
function FormReadOnlyRow({
  label,
  value,
  required,
}: {
  label: string;
  value: string | null | undefined;
  required?: boolean;
}) {
  return (
    <div
      className="grid items-center gap-4 py-1"
      style={{ gridTemplateColumns: `${LABEL_COL_WIDTH}px 1fr` }}
    >
      <label className="text-right text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      <div className={READONLY_VALUE_CLASS}>{value ?? '–'}</div>
    </div>
  );
}

/**
 * Date range row: two disabled inputs with dash separator.
 */
function FormDateRangeRow({
  label,
  start,
  end,
  required,
}: {
  label: string;
  start: string | null | undefined;
  end: string | null | undefined;
  required?: boolean;
}) {
  return (
    <div
      className="grid items-center gap-4 py-1"
      style={{ gridTemplateColumns: `${LABEL_COL_WIDTH}px 1fr` }}
    >
      <label className="text-right text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={start ?? '–'}
          className={`flex-1 ${READONLY_VALUE_CLASS}`}
          aria-label={`${label} mulai`}
          tabIndex={-1}
        />
        <span className="text-gray-400 font-medium">–</span>
        <input
          type="text"
          readOnly
          value={end ?? '–'}
          className={`flex-1 ${READONLY_VALUE_CLASS}`}
          aria-label={`${label} selesai`}
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

/**
 * Upload row: filename as blue link + compact Tolak/Setujui buttons (for document review).
 */
function FormUploadRow({
  label,
  fileName,
  required,
  onReject,
  onApprove,
  disabled,
}: {
  label: string;
  fileName: string | null;
  required?: boolean;
  onReject?: () => void;
  onApprove?: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="grid items-center gap-4 py-1"
      style={{ gridTemplateColumns: `${LABEL_COL_WIDTH}px 1fr` }}
    >
      <label className="text-right text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      <div className="flex items-center gap-3 flex-wrap">
        {fileName ? (
          <a
            href="#"
            className="text-sm text-blue-600 hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            {fileName}
          </a>
        ) : (
          <span className="text-sm text-gray-500">–</span>
        )}
        {fileName && (
          <span className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-red-200 text-red-700 hover:bg-red-50"
              disabled={disabled}
              onClick={onReject}
            >
              Tolak
            </Button>
            <Button type="button" size="sm" className="h-8" disabled={disabled} onClick={onApprove}>
              Setujui
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}

export default function AdminApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [data, setData] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('formulir');
  const decisionPanelRef = useRef<HTMLDivElement>(null);

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

  const scrollToDecisionPanel = () => {
    decisionPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!id || loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 bg-gray-100 px-4 py-8">
        <AdminPageHeader title="Detail Aplikasi" />
        <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-sm">
          Memuat...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 bg-gray-100 px-4 py-8">
        <AdminPageHeader title="Detail Aplikasi" />
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
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
      <div className="mx-auto max-w-4xl space-y-6 bg-gray-100 px-4 py-8">
        <AdminPageHeader title="Detail Aplikasi" />
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-gray-600">Data pra-registrasi tidak ditemukan.</p>
          <Link href="/admin/applications" className="mt-4 inline-block">
            <Button variant="outline">Kembali ke daftar</Button>
          </Link>
        </div>
      </div>
    );
  }

  const submittedAt = data.submittedAt ?? data.createdAt;
  const isApproved = data.status === 'APPROVED';
  const canDecide = data.status !== 'APPROVED' && data.status !== 'REJECTED';

  return (
    <div className="mx-auto max-w-4xl space-y-6 bg-gray-100 px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link href="/admin/applications" className="hover:text-teal-600 hover:underline">
          PRA-REGISTRASI
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-gray-900">INFORMASI DETAIL</span>
      </nav>

      {/* Header card: 3-column grid, compact, same baseline */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-4">
          {/* Left: meta + reference */}
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Aplikasi ({formatDateTime(submittedAt)})</p>
            <p className="text-lg font-bold text-gray-900">#{data.applicationNo}</p>
          </div>
          {/* Middle: Status label + dropdown-like badge with caret */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-500">Status</span>
            <div className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1">
              <StatusBadge status={data.status} />
              <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
          {/* Right: actions + icon buttons */}
          <div className="flex items-center justify-end gap-2">
            {canDecide && (
              <>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  onClick={scrollToDecisionPanel}
                >
                  Tolak
                </Button>
                <Button variant="outline" onClick={scrollToDecisionPanel}>
                  Setujui
                </Button>
              </>
            )}
            <Link
              href="/admin/applications"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Kembali ke daftar"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Download"
              title="Download (belum diimplementasi)"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: 3 separate pill buttons with gaps, outline inactive / filled dark active */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-center gap-2">
          <TabsList className="inline-flex h-10 items-center gap-2 rounded-none border-0 bg-transparent p-0 shadow-none">
            <TabsTrigger
              value="formulir"
              className="rounded-full border px-5 py-2 text-sm font-medium data-[state=active]:!border-transparent data-[state=active]:!bg-gray-900 data-[state=active]:!text-white data-[state=inactive]:border-gray-300 data-[state=inactive]:!bg-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:!bg-gray-50"
            >
              Formulir
            </TabsTrigger>
            <TabsTrigger
              value="catatan"
              className="rounded-full border px-5 py-2 text-sm font-medium data-[state=active]:!border-transparent data-[state=active]:!bg-gray-900 data-[state=active]:!text-white data-[state=inactive]:border-gray-300 data-[state=inactive]:!bg-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:!bg-gray-50"
            >
              Catatan Internal
            </TabsTrigger>
            <TabsTrigger
              value="riwayat"
              className="rounded-full border px-5 py-2 text-sm font-medium data-[state=active]:!border-transparent data-[state=active]:!bg-gray-900 data-[state=active]:!text-white data-[state=inactive]:border-gray-300 data-[state=inactive]:!bg-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:!bg-gray-50"
            >
              Riwayat Aktivitas
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab: Formulir */}
        <TabsContent value="formulir" className="mt-6">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            {/* Section 1: DATA ORANG TUA / WALI SISWA */}
            <AdminCardSection title="Data Orang Tua / Wali Siswa" className="mb-14">
              <div className="space-y-0">
                <FormReadOnlyRow label="Email pendaftar" value={data.applicantEmail} required />
                <FormReadOnlyRow
                  label="Jenis penugasan/alasan tinggal di luar negeri"
                  value={pr.reasonLivingAbroad}
                  required
                />
                <FormReadOnlyRow label="Alasan mendaftar ke SIDH" value={pr.reasonToApply} required />
                <FormReadOnlyRow
                  label="Hubungan pendaftar dengan calon siswa"
                  value={pr.applicantRelationship}
                  required
                />
                <FormReadOnlyRow label="Nama orang tua pendaftar" value={pr.applicantName} required />
                <FormReadOnlyRow label="Alamat domisili" value={pr.assignmentCity} required />
                <FormReadOnlyRow label="Negara domisili" value={pr.assignmentCountry} required />
                <FormDateRangeRow
                  label="Rencana periode domisili"
                  start={pr.domicileStartDate ? formatDateShort(pr.domicileStartDate) : null}
                  end={pr.domicileEndDate ? formatDateShort(pr.domicileEndDate) : null}
                  required
                />
                <FormReadOnlyRow
                  label="Tanggal masa berlaku visa/izin tinggal"
                  value={pr.permitExpiryDate ? formatDateShort(pr.permitExpiryDate) : undefined}
                  required
                />
              </div>
            </AdminCardSection>

            {/* Section 2: IDENTITAS SISWA */}
            <AdminCardSection title="Identitas Siswa">
              <div className="space-y-0">
                <FormReadOnlyRow label="Mendaftar untuk program" value={pr.programChoice} required />
                <FormReadOnlyRow label="Jenjang pendidikan" value={pr.educationLevel} required />
                <FormReadOnlyRow label="Nama calon siswa" value={pr.studentName} required />
                <FormReadOnlyRow label="Jenis kelamin" value={formatGender(pr.studentGender)} required />
                <FormReadOnlyRow
                  label="Riwayat pendidikan terakhir"
                  value={pr.lastEducationLocation}
                  required
                />
                <FormReadOnlyRow
                  label="Tanggal lahir"
                  value={pr.studentBirthDate ? formatDateShort(pr.studentBirthDate) : undefined}
                  required
                />
                <FormReadOnlyRow label="Informasi memiliki NISN atau tidak" value={pr.nisn ?? '–'} />
                <FormUploadRow
                  label="Upload scan visa/izin tinggal (jika tersedia)"
                  fileName={null}
                  required
                  disabled
                />
              </div>
            </AdminCardSection>

            {/* Decision panel */}
            <div ref={decisionPanelRef} className="mt-12 border-t border-gray-200 pt-8">
              <DecisionPanel
                applicationId={data.id}
                status={data.status}
                onApprove={handleApprove}
                onReject={handleReject}
                onRequestChanges={handleRequestChanges}
                onSuccess={() => fetchDetail(data.id)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="catatan" className="mt-6">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">Catatan internal (belum diimplementasi).</p>
          </div>
        </TabsContent>

        <TabsContent value="riwayat" className="mt-6">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">Riwayat aktivitas (belum diimplementasi).</p>
          </div>
        </TabsContent>
      </Tabs>

      {isApproved && (
        <div
          className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800"
          role="status"
        >
          <strong>Langkah berikut:</strong> Invitation onboarding (belum diimplementasi).
        </div>
      )}
    </div>
  );
}
