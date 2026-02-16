'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Full registration wizard success page. Shown after submit.
 */
export default function WizardSuccessPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-2xl font-bold text-gray-900">Pendaftaran berhasil dikirim</h1>
        <p className="mt-4 text-gray-600">
          Formulir pendaftaran lengkap Anda telah berhasil dikirim. Silakan menunggu konfirmasi dari sekolah.
        </p>
        <div className="mt-8">
          <Link href="/parent/applications">
            <Button>Kembali ke Daftar Aplikasi</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
