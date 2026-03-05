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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PAGE_SIZE = 10;

type StatusFilterValue = ApplicationStatus | '' | 'BARU';

const STATUS_OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: '', label: 'Semua Status' },
  { value: 'BARU', label: 'Baru' },
  { value: 'UNDER_REVIEW', label: 'Sedang Ditinjau' },
  { value: 'APPROVED', label: 'Disetujui' },
  { value: 'REJECTED', label: 'Ditolak' },
];

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
      className="inline-flex items-center gap-0.5 font-extrabold uppercase tracking-wider text-gray-800 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
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
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilterValue>('');
  const [program, setProgram] = useState('');
  const [country, setCountry] = useState('');
  const [sortBy, setSortBy] = useState<AdminSortField | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<AdminSortOrder>('desc');
  const [filterOptions, setFilterOptions] = useState<{ programs: string[]; countries: string[] }>({ programs: [], countries: [] });
  const [data, setData] = useState<AdminApplicationsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // When "BARU" is selected, fetch both DRAFT and SUBMITTED
      if (status === 'BARU') {
        const [draftRes, submittedRes] = await Promise.all([
          getAdminApplications({
            status: 'DRAFT',
            page: 1,
            limit: 1000, // Fetch all to merge
            search: search || undefined,
            program: program || undefined,
            country: country || undefined,
            sortBy: sortBy ?? 'createdAt',
            sortOrder: sortBy ? sortOrder : 'desc',
          }),
          getAdminApplications({
            status: 'SUBMITTED',
            page: 1,
            limit: 1000, // Fetch all to merge
            search: search || undefined,
            program: program || undefined,
            country: country || undefined,
            sortBy: sortBy ?? 'createdAt',
            sortOrder: sortBy ? sortOrder : 'desc',
          }),
        ]);

        // Merge results
        const mergedItems = [...(draftRes.items || []), ...(submittedRes.items || [])];
        
        // Sort merged items
        const sortField = sortBy ?? 'createdAt';
        mergedItems.sort((a, b) => {
          let aVal: any;
          let bVal: any;
          
          if (sortField === 'createdAt' || sortField === 'submittedAt') {
            aVal = sortField === 'submittedAt' ? (a.submittedAt ?? a.createdAt) : a.createdAt;
            bVal = sortField === 'submittedAt' ? (b.submittedAt ?? b.createdAt) : b.createdAt;
            aVal = aVal ? new Date(aVal).getTime() : 0;
            bVal = bVal ? new Date(bVal).getTime() : 0;
          } else if (sortField === 'status') {
            aVal = a.status ?? '';
            bVal = b.status ?? '';
          } else if (sortField === 'applicationNo') {
            aVal = a.applicationNo ?? '';
            bVal = b.applicationNo ?? '';
          } else {
            const prA = a.preRegistration;
            const prB = b.preRegistration;
            if (sortField === 'studentName') {
              aVal = prA?.studentName ?? '';
              bVal = prB?.studentName ?? '';
            } else if (sortField === 'programChoice') {
              aVal = prA?.programChoice ?? '';
              bVal = prB?.programChoice ?? '';
            } else if (sortField === 'assignmentCountry') {
              aVal = prA?.assignmentCountry ?? '';
              bVal = prB?.assignmentCountry ?? '';
            } else {
              aVal = '';
              bVal = '';
            }
          }
          
          if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });

        // Paginate merged results
        const total = mergedItems.length;
        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const paginatedItems = mergedItems.slice(startIndex, endIndex);

        setData({
          items: paginatedItems,
          total,
          page,
          limit: PAGE_SIZE,
          filterOptions: draftRes.filterOptions || submittedRes.filterOptions,
        });
      } else {
        const res = await getAdminApplications({
          status: status === '' ? undefined : (status as ApplicationStatus),
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
      }
    } catch (e) {
      setData(null);
      setError(e instanceof ApiError ? e.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, [status, page, search, program, country, sortBy, sortOrder]);

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
    setStatus('');
    setProgram('');
    setCountry('');
    setPage(1);
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminApplications({
        status: undefined,
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

      <div className="mb-4 flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex w-[240px]">
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
            options={STATUS_OPTIONS}
            className="!w-auto"
            value={status}
            onChange={(e) => { setStatus(e.target.value as StatusFilterValue); setPage(1); }}
          />
          <Select
            options={[{ value: '', label: 'Semua Program' }, ...filterOptions.programs.map((p) => ({ value: p, label: p }))]}
            className="!w-auto"
            value={program}
            onChange={(e) => { setProgram(e.target.value); setPage(1); }}
          />
          <Select
            options={[{ value: '', label: 'Semua Negara' }, ...filterOptions.countries.map((c) => ({ value: c, label: c }))]}
            className="!w-auto"
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
                <TableHead className="w-[130px]">
                  <SortHeader label="Status" sortKey="status" currentSortBy={sortBy} currentSortOrder={sortOrder} onSort={handleSort} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    Memuat...
                  </TableCell>
                </TableRow>
              )}
              {!loading && error && (
                <TableRow>
                  <TableCell colSpan={7} className="py-6">
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
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
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
        <span className="inline-block w-[130px]">
          <StatusBadge status={(pr?.status ?? row.status) as ApplicationStatus} />
        </span>
      </TableCell>
    </TableRow>
  );
}
