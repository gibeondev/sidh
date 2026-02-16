'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Parent home. Minimal landing for authenticated parent.
 */
export default function ParentHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Beranda Orang Tua</h1>
      <p className="text-gray-600">
        Selamat datang. Gunakan menu di sebelah kiri untuk mengakses Pendaftaran atau Pengaturan.
      </p>
      <Link href="/parent/applications">
        <Button>Pendaftaran</Button>
      </Link>
    </div>
  );
}
