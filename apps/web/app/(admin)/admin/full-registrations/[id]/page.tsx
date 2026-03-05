'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getAdminApplicationById,
  updateApplicationStatus,
  ApiError,
  type ApplicationDetail,
  type ApplicationStatus,
} from '@/lib/api/admin-applications';
import { AdminCardSection, AdminPageHeader, StatusBadge, RejectDialog } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getDownloadUrl } from '@/lib/api/documents';

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

function documentStatusLabel(s: string | undefined): string {
  if (!s) return '–';
  const map: Record<string, string> = {
    OPEN: 'Belum ditinjau',
    POSTPONED: 'Ditunda',
    APPROVED: 'Disetujui',
    REJECTED: 'Ditolak',
  };
  return map[s] ?? s;
}

function relationshipLabel(r: string | undefined): string {
  if (!r) return '–';
  const map: Record<string, string> = {
    Father: 'Ayah',
    Mother: 'Ibu',
    Guardian: 'Wali',
  };
  return map[r] ?? r;
}

const COUNTRY_LABELS: Record<string, string> = {
  NL: 'Netherlands',
  ID: 'Indonesia',
  DE: 'Germany',
  BE: 'Belgium',
  FR: 'France',
  UK: 'United Kingdom',
  US: 'United States',
  OTHER: 'Other',
};

const LABEL_COL_WIDTH = 280;

const READONLY_VALUE_CLASS =
  'min-h-9 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 cursor-default outline-none focus:ring-0';

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

export default function AdminFullRegistrationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [data, setData] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('formulir');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  useEffect(() => {
    if (data) setSelectedStatus(data.status);
  }, [data?.id, data?.status]);

  const handleSave = () => {
    if (!id || !data || selectedStatus == null) return;
    const currentStatus = data.status;
    if (selectedStatus === currentStatus) return;
    setSaveError(null);
    if (selectedStatus === 'REJECTED') {
      setRejectDialogOpen(true);
      return;
    }
    setSaving(true);
    updateApplicationStatus(id, selectedStatus, undefined, 'fullRegistration')
      .then(() => fetchDetail(id))
      .catch((e) => setSaveError(e instanceof ApiError ? e.message : 'Gagal menyimpan status.'))
      .finally(() => setSaving(false));
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!id) return;
    setSaveError(null);
    setSaving(true);
    try {
      await updateApplicationStatus(id, 'REJECTED', reason, 'fullRegistration');
      await fetchDetail(id);
      setRejectDialogOpen(false);
    } catch (e) {
      setSaveError(e instanceof ApiError ? e.message : 'Gagal menyimpan status.');
      throw e;
    } finally {
      setSaving(false);
    }
  };

  if (!id || loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 bg-gray-100 px-4 py-8">
        <AdminPageHeader title="Detail Registrasi Lengkap" />
        <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-sm">
          Memuat...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 bg-gray-100 px-4 py-8">
        <AdminPageHeader title="Detail Registrasi Lengkap" />
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
          <Link href="/admin/full-registrations" className="ml-2 underline">
            Kembali ke daftar
          </Link>
        </div>
      </div>
    );
  }

  const rs = data.registrationSubmission;
  if (!rs) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 bg-gray-100 px-4 py-8">
        <AdminPageHeader title="Detail Registrasi Lengkap" />
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-gray-600">Data registrasi lengkap tidak ditemukan.</p>
          <Link href="/admin/full-registrations" className="mt-4 inline-block">
            <Button variant="outline">Kembali ke daftar</Button>
          </Link>
        </div>
      </div>
    );
  }

  const submittedAt = data.submittedAt ?? data.createdAt;
  const fullRegStatus = data.status;
  const isApproved = fullRegStatus === 'APPROVED';
  const statusUnchanged = selectedStatus == null || selectedStatus === fullRegStatus;

  return (
    <div className="mx-auto max-w-4xl space-y-6 bg-gray-100 px-4 py-8">
      <nav className="text-sm text-gray-600">
        <Link href="/admin/full-registrations" className="hover:text-teal-600 hover:underline">
          REGISTRASI LENGKAP
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-gray-900">INFORMASI DETAIL</span>
      </nav>

      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Aplikasi ({formatDateTime(submittedAt)})</p>
            <p className="text-lg font-bold text-gray-900">#{data.applicationNo}</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <Select
                options={[
                  { value: 'DRAFT', label: 'Belum dikirim' },
                  { value: 'SUBMITTED', label: 'Dikirim' },
                  { value: 'UNDER_REVIEW', label: 'Sedang Ditinjau' },
                  { value: 'CHANGES_REQUESTED', label: 'Perubahan Diminta' },
                  { value: 'APPROVED', label: 'Disetujui' },
                  { value: 'REJECTED', label: 'Ditolak' },
                ]}
                value={selectedStatus ?? fullRegStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                disabled={saving}
                className="min-w-[150px]"
              />
            </div>
            {saveError && (
              <p className="text-xs text-red-600 ml-20">{saveError}</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={handleSave}
              disabled={statusUnchanged || saving}
              className="bg-teal-600 text-white hover:bg-teal-700"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
            <Link
              href="/admin/full-registrations"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Kembali ke daftar"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="inline-flex h-11 w-full items-end justify-center rounded-t-xl rounded-b-none border border-b-0 border-gray-200 bg-white p-0 shadow-sm">
          <TabsTrigger
            value="formulir"
            className="rounded-none border-b-2 border-transparent bg-transparent px-5 pb-3 pt-3 text-sm font-medium text-gray-500 data-[state=active]:!border-gray-900 data-[state=active]:!bg-transparent data-[state=active]:!text-gray-900 data-[state=inactive]:hover:!text-gray-700"
          >
            Formulir
          </TabsTrigger>
          <TabsTrigger
            value="kontak"
            className="rounded-none border-b-2 border-transparent bg-transparent px-5 pb-3 pt-3 text-sm font-medium text-gray-500 data-[state=active]:!border-gray-900 data-[state=active]:!bg-transparent data-[state=active]:!text-gray-900 data-[state=inactive]:hover:!text-gray-700"
          >
            Kontak
          </TabsTrigger>
          <TabsTrigger
            value="dokumen"
            className="rounded-none border-b-2 border-transparent bg-transparent px-5 pb-3 pt-3 text-sm font-medium text-gray-500 data-[state=active]:!border-gray-900 data-[state=active]:!bg-transparent data-[state=active]:!text-gray-900 data-[state=inactive]:hover:!text-gray-700"
          >
            Dokumen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formulir" className="mt-0">
          <div className="rounded-b-xl border border-t-0 border-gray-200 bg-white p-8 shadow-sm">
            <AdminCardSection title="Identitas Siswa" className="mb-10">
              <div className="space-y-0">
                <FormReadOnlyRow label="Nama lengkap siswa" value={rs.studentFullName} required />
                <FormReadOnlyRow label="Program pilihan" value={rs.programChoice} required />
                <FormReadOnlyRow label="Kelas yang didaftarkan" value={rs.gradeApplied} required />
                <FormReadOnlyRow label="Jenis kelamin" value={formatGender(rs.studentGender)} required />
                <FormReadOnlyRow
                  label="Tanggal lahir"
                  value={rs.studentBirthDate ? formatDateShort(rs.studentBirthDate) : undefined}
                  required
                />
                <FormReadOnlyRow label="Tempat lahir" value={rs.birthPlace} required />
                <FormReadOnlyRow label="NIK" value={rs.nik} required />
                <FormReadOnlyRow label="Agama" value={rs.religion} required />
                <FormReadOnlyRow label="NISN" value={rs.nisn ?? '–'} />
              </div>
            </AdminCardSection>

            <AdminCardSection title="Data Fisik" className="mb-10">
              <div className="space-y-0">
                <FormReadOnlyRow
                  label="Tinggi badan (cm)"
                  value={rs.heightCm != null ? String(rs.heightCm) : undefined}
                />
                <FormReadOnlyRow
                  label="Berat badan (kg)"
                  value={rs.weightKg != null ? String(rs.weightKg) : undefined}
                />
              </div>
            </AdminCardSection>

            <AdminCardSection title="Riwayat Pendidikan" className="mb-10">
              <div className="space-y-0">
                <FormReadOnlyRow label="Sekolah terakhir di Indonesia" value={rs.lastSchoolIndonesia ?? '–'} />
                <FormReadOnlyRow label="Nama sekolah saat ini" value={rs.currentSchoolName ?? '–'} />
                <FormReadOnlyRow label="Negara sekolah saat ini" value={rs.currentSchoolCountry ?? '–'} />
                <FormReadOnlyRow
                  label="Nomor seri ijazah terakhir"
                  value={rs.lastDiplomaSerialNumber ?? '–'}
                />
              </div>
            </AdminCardSection>

            <AdminCardSection title="Data Keluarga" className="mb-10">
              <div className="space-y-0">
                <FormReadOnlyRow
                  label="Anak ke"
                  value={rs.childOrder != null ? String(rs.childOrder) : undefined}
                />
                <FormReadOnlyRow
                  label="Jumlah saudara kandung"
                  value={rs.siblingsCount != null ? String(rs.siblingsCount) : undefined}
                />
              </div>
            </AdminCardSection>

            <AdminCardSection title="Alamat & Domisili" className="mb-10">
              <div className="space-y-0">
                <FormReadOnlyRow
                  label="Negara tempat dinas orang tua/ studi orang tua"
                  value={rs.parentServiceCountry ? (COUNTRY_LABELS[rs.parentServiceCountry] ?? rs.parentServiceCountry) : undefined}
                  required
                />
                <FormReadOnlyRow
                  label="Rencana periode domisili"
                  value={
                    rs.domicilePeriodStart && rs.domicilePeriodEnd
                      ? `${formatDateShort(rs.domicilePeriodStart)} – ${formatDateShort(rs.domicilePeriodEnd)}`
                      : rs.domicilePeriodStart
                        ? formatDateShort(rs.domicilePeriodStart)
                        : rs.domicilePeriodEnd
                          ? formatDateShort(rs.domicilePeriodEnd)
                          : undefined
                  }
                  required
                />
                <FormReadOnlyRow
                  label="Informasi visa/ijin tinggal orang tua yang digunakan"
                  value={rs.parentVisaType ?? undefined}
                  required
                />
              </div>
            </AdminCardSection>

            <AdminCardSection title="Kebutuhan Khusus" className="mb-10">
              <div className="space-y-0">
                <FormReadOnlyRow
                  label="Memiliki kebutuhan khusus"
                  value={rs.hasSpecialNeeds === 'YES' ? 'Ya' : rs.hasSpecialNeeds === 'NO' ? 'Tidak' : (rs.hasSpecialNeeds ?? '–')}
                />
                {rs.description && (
                  <FormReadOnlyRow
                    label="Keterangan kebutuhan khusus"
                    value={rs.description}
                  />
                )}
              </div>
            </AdminCardSection>

            <AdminCardSection title="Informasi Tambahan" className="mb-10">
              <div className="space-y-0">
                <FormReadOnlyRow
                  label="Informasi tambahan"
                  value={rs.additionalInfo ?? '–'}
                />
              </div>
            </AdminCardSection>

            <AdminCardSection title="Alamat & Kontak">
              <div className="space-y-0">
                <FormReadOnlyRow label="Alamat di Indonesia" value={rs.addressIndonesia ?? '–'} />
                <FormReadOnlyRow label="Wilayah domisili" value={rs.domicileRegion ?? '–'} />
                <FormReadOnlyRow label="Kode negara telepon" value={rs.phoneCountryCode ?? '–'} />
                <FormReadOnlyRow label="Nomor telepon" value={rs.phoneNumber ?? '–'} />
              </div>
            </AdminCardSection>
          </div>
        </TabsContent>

        <TabsContent value="kontak" className="mt-0">
          <div className="rounded-b-xl border border-t-0 border-gray-200 bg-white p-8 shadow-sm">
            {data.contacts && data.contacts.length > 0 ? (
              data.contacts.map((contact, idx) => (
                <AdminCardSection key={contact.id} title={relationshipLabel(contact.relationship) || `Kontak ${idx + 1}`} className={idx > 0 ? 'mt-6' : ''}>
                  <div className="space-y-0">
                    <FormReadOnlyRow label="Hubungan" value={relationshipLabel(contact.relationship)} required />
                    <FormReadOnlyRow label="Nama lengkap" value={contact.fullName} required />
                    <FormReadOnlyRow label="Tempat lahir" value={contact.birthPlace} required />
                    <FormReadOnlyRow
                      label="Tanggal lahir"
                      value={contact.birthDate ? formatDateShort(contact.birthDate) : undefined}
                      required
                    />
                    <FormReadOnlyRow label="NIK" value={contact.nik} required />
                    <FormReadOnlyRow label="Pendidikan terakhir" value={contact.educationLevel} required />
                    <FormReadOnlyRow label="Pekerjaan" value={contact.occupation} required />
                    <FormReadOnlyRow label="Kisaran pendapatan" value={contact.incomeRange} required />
                    <FormReadOnlyRow label="Telepon" value={contact.phone} required />
                    <FormReadOnlyRow label="Email" value={contact.email} required />
                  </div>
                </AdminCardSection>
              ))
            ) : (
              <p className="text-gray-500">Tidak ada data kontak.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="dokumen" className="mt-0">
          <div className="rounded-b-xl border border-t-0 border-gray-200 bg-white p-8 shadow-sm">
            {data.documents && data.documents.length > 0 ? (
              <div className="space-y-4">
                {data.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{doc.fileName}</p>
                      <p className="text-sm text-gray-500">{doc.documentType}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Status: {documentStatusLabel(doc.status)}
                        {doc.reviewNote ? ` — ${doc.reviewNote}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const { url } = await getDownloadUrl(doc.id);
                            window.open(url, '_blank', 'noopener,noreferrer');
                          } catch {
                            // Error could be shown via toast
                          }
                        }}
                      >
                        Lihat
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const { url } = await getDownloadUrl(doc.id);
                            window.open(url, '_blank', 'noopener,noreferrer');
                          } catch {
                            // Error could be shown via toast
                          }
                        }}
                      >
                        Unduh
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada dokumen.</p>
            )}
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

      <RejectDialog
        open={rejectDialogOpen}
        onClose={() => {
          setRejectDialogOpen(false);
          setSaveError(null);
        }}
        onConfirm={handleRejectConfirm}
        applicationId={id}
      />

    </div>
  );
}
