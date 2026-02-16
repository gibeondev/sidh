'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Parent settings. Placeholder until settings UI is implemented.
 */
export default function ParentSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Pengaturan</h1>
      <p className="text-gray-600">
        Pengaturan akun orang tua. (Fitur pengaturan dapat ditambahkan di sini.)
      </p>
      <Link href="/parent/applications">
        <Button variant="outline">Kembali ke Pendaftaran</Button>
      </Link>
    </div>
  );
}
