'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getAdminApplications,
  getAdminFilterOptions,
  ApiError,
  type ApplicationStatus,
  type ApplicationListItem,
  type AdminApplicationsListResponse,
  type AdminSortField,
  type AdminSortOrder,
} from '@/lib/api/admin-applications';
import { AdminPageHeader, StatusBadge } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const TAB_STATUS: Record<string, ApplicationStatus | ''> = {
  all: '',
  baru: 'SUBMITTED',
  ditinjau: 'UNDER_REVIEW',
  disetujui: 'APPROVED',
  ditolak: 'REJECTED',
};

const PAGE_SIZE = 10;

function SortHeader({
  label,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onSort,
}: {
  label: string;
  sortKey: AdminSortField;
  currentSortBy: AdminSortField | undefined;
  currentSortOrder: AdminSortOrder;
  onSort: (key: AdminSortField) => void;
}) {
  const isActive = currentSortBy === sortKey;
  const isAsc = currentSortOrder === 'asc';
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="inline-flex items-center gap-0.5 font-semibold uppercase tracking-wider text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
    >
      {label}
      <span className="inline-flex flex-col text-gray-400" aria-hidden>
        {isActive ? (
          isAsc ? (
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 15l-6-6-6 6" />
            </svg>
          ) : (
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          )
        ) : (
          <>
            <svg className="h-3 w-3 -mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 15l-6-6-6 6" />
            </svg>
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </>
        )}
      </span>
    </button>
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

export default function AdminApplicationsPage() {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [program, setProgram] = useState('');
  const [country, setCountry] = useState('');
  const [sortBy, setSortBy] = useState<AdminSortField | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<AdminSortOrder>('desc');
  const [filterOptions, setFilterOptions] = useState<{ programs: string[]; countries: string[] }>({ programs: [], countries: [] });
  const [data, setData] = useState<AdminApplicationsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusParam = TAB_STATUS[tab] || undefined;

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminApplications({
        status: statusParam,
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        program: program || undefined,
        country: country || undefined,
        sortBy: sortBy ?? 'createdAt',
        sortOrder: sortBy ? sortOrder : 'desc',
      });
      setData(res);
      if (res.filterOptions) {
        setFilterOptions(res.filterOptions);
      }
    } catch (e) {
      setData(null);
      setError(e instanceof ApiError ? e.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, [statusParam, page, search, program, country, sortBy, sortOrder]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    getAdminFilterOptions()
      .then(setFilterOptions)
      .catch(() => {});
  }, []);

  const handleSort = (key: AdminSortField) => {
    if (sortBy === key) {
      setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const clearFilters = async () => {
    setProgram('');
    setCountry('');
    setPage(1);
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminApplications({
        status: statusParam,
        page: 1,
        limit: PAGE_SIZE,
        search: search || undefined,
        program: undefined,
        country: undefined,
        sortBy: sortBy ?? 'createdAt',
        sortOrder: sortBy ? sortOrder : 'desc',
      });
      setData(res);
      if (res.filterOptions) setFilterOptions(res.filterOptions);
    } catch (e) {
      setData(null);
      setError(e instanceof ApiError ? e.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 0;
  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        label="PRA-REGISTRASI"
        title="Pra-Registrasi"
      />

      <Tabs value={tab} onValueChange={(v) => { setTab(v); setPage(1); }}>
        <TabsList className="mb-4">
          <TabsTrigger value="all"><span className="uppercase">Semua</span></TabsTrigger>
          <TabsTrigger value="baru"><span className="uppercase">Baru</span></TabsTrigger>
          <TabsTrigger value="ditinjau"><span className="uppercase">Sedang Ditinjau</span></TabsTrigger>
          <TabsTrigger value="disetujui"><span className="uppercase">Disetujui</span></TabsTrigger>
          <TabsTrigger value="ditolak"><span className="uppercase">Ditolak</span></TabsTrigger>
        </TabsList>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex flex-1 min-w-[240px] max-w-md">
            <span className="sr-only">Cari Nama / No.</span>
            <Input
              type="search"
              placeholder="Cari Nama / No."
              value={searchInput}
              onChange={(e) => {
                const v = e.target.value;
                setSearchInput(v);
                if (v.trim() === '') {
                  setSearch('');
                  setPage(1);
                }
              }}
              className="pr-9"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </form>
          <Button type="button" variant="outline" onClick={clearFilters} className="gap-1.5">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Hapus filter
          </Button>
          <Select
            options={[{ value: '', label: 'Semua Program' }, ...filterOptions.programs.map((p) => ({ value: p, label: p }))]}
            className="w-[130px]"
            value={program}
            onChange={(e) => { setProgram(e.target.value); setPage(1); }}
          />
          <Select
            options={[{ value: '', label: 'Semua Negara' }, ...filterOptions.countries.map((c) => ({ value: c, label: c }))]}
            className="w-[130px]"
            value={country}
            onChange={(e) => { setCountry(e.target.value); setPage(1); }}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-100">
                <TableHead className="w-10">
                  <input type="checkbox" className="rounded border-gray-300" aria-label="Pilih semua" />
                </TableHead>
                <TableHead>No.</TableHead>
                <TableHead>
                  <SortHeader label="Nama Siswa" sortKey="studentName" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                </TableHead>
                <TableHead>
                  <SortHeader label="Program" sortKey="programChoice" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                </TableHead>
                <TableHead>
                  <SortHeader label="Negara" sortKey="assignmentCountry" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                </TableHead>
                <TableHead>
                  <SortHeader label="Tanggal Submit" sortKey="submittedAt" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                </TableHead>
                <TableHead>
                  <SortHeader label="Status" sortKey="status" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                </TableHead>
                <TableHead className="w-14">
                  <span className="sr-only">Download</span>
                  <svg className="inline h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    Memuat...
                  </TableCell>
                </TableRow>
              )}
              {!loading && error && (
                <TableRow>
                  <TableCell colSpan={8} className="py-6">
                    <div className="flex flex-wrap items-center justify-center gap-2 text-red-600">
                      <span>{error}</span>
                      <Button type="button" variant="outline" size="sm" onClick={() => fetchList()}>
                        Coba lagi
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!loading && !error && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    Tidak ada data aplikasi.
                  </TableCell>
                </TableRow>
              )}
              {!loading && !error && items.length > 0 &&
                items.map((row, idx) => (
                  <ApplicationRow
                    key={row.id}
                    row={row}
                    index={((data?.page ?? 1) - 1) * (data?.limit ?? PAGE_SIZE) + idx + 1}
                  />
                ))
              }
            </TableBody>
          </Table>
          {!loading && !error && data && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 px-4 py-3">
                <span className="text-sm text-gray-600">Halaman {data?.page ?? 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage(1)}
                    disabled={page <= 1}
                    className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-transparent"
                    aria-label="Halaman pertama"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-transparent"
                    aria-label="Sebelumnya"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <span className="flex items-center gap-0.5 px-2">
                    {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                      const p = i + 1;
                      const isActive = p === page;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPage(p)}
                          className={`min-w-[28px] rounded px-1.5 py-1 text-sm font-medium ${
                            isActive ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    {totalPages > 10 && (
                      <span className="px-1 text-gray-500 text-sm">... dari {totalPages}</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-transparent"
                    aria-label="Berikutnya"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    disabled={page >= totalPages}
                    className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-transparent"
                    aria-label="Halaman terakhir"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 items-center rounded-md border border-gray-300 bg-white pl-2 pr-7 text-sm text-gray-700" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L2 4h8L6 8z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}>
                    10
                  </span>
                  <button
                    type="button"
                    onClick={() => fetchList()}
                    disabled={loading}
                    className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    aria-label="Refresh"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M23 4v6h-6M1 20v-6h6" />
                      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                    </svg>
                  </button>
                </div>
              </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}

function ApplicationRow({
  row,
  index,
}: {
  row: ApplicationListItem;
  index: number;
}) {
  const router = useRouter();
  const pr = row.preRegistration;
  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input[type="checkbox"]')) return;
    router.push(`/admin/applications/${row.id}`);
  };
  return (
    <TableRow
      className="cursor-pointer"
      onClick={handleRowClick}
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" className="rounded border-gray-300" aria-label={`Pilih ${row.applicationNo}`} />
      </TableCell>
      <TableCell>{index}</TableCell>
      <TableCell>{pr?.studentName ?? '–'}</TableCell>
      <TableCell>{pr?.programChoice ?? '–'}</TableCell>
      <TableCell>{pr?.assignmentCountry ?? '–'}</TableCell>
      <TableCell>{formatDate(row.submittedAt ?? row.createdAt)}</TableCell>
      <TableCell>
        <StatusBadge status={row.status} />
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <button type="button" className="text-gray-400 hover:text-teal-600" aria-label="Download" title="Download (belum diimplementasi)">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </TableCell>
    </TableRow>
  );
}
