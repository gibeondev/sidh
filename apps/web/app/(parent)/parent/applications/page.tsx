'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Parent applications list. Placeholder until list API and UI are implemented.
 */
export default function ParentApplicationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Pendaftaran</h1>
      <p className="text-gray-600">
        Daftar aplikasi pendaftaran Anda. Untuk mengisi formulir pendaftaran lengkap, gunakan link wizard yang diberikan setelah pra-registrasi (dengan application ID).
      </p>
      <p className="text-sm text-gray-500">
        Halaman daftar aplikasi akan menampilkan link ke wizard per aplikasi ketika backend dan integrasi siap.
      </p>
      <Link href="/parent">
        <Button variant="outline">Kembali</Button>
      </Link>
    </div>
  );
}
