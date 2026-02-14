'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Pre-registration success page (after step-4 submit).
 * Matches Figma: confirmation graphic, thank-you message, button to start/login page.
 */
export default function PreRegisterSuccessPage() {
  const searchParams = useSearchParams();
  const applicationNo = searchParams.get('applicationNo') ?? '';

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12">
      <div className="mx-auto max-w-md text-center">
        {/* Central graphic: document + shield with check + clock */}
        <div className="flex justify-center items-center gap-2 mb-8 relative" aria-hidden>
          <div className="relative">
            {/* Document */}
            <div className="w-16 h-20 bg-white border-2 border-gray-200 rounded shadow-sm flex flex-col justify-center items-center gap-1 p-2">
              <div className="w-full h-1 bg-teal-200 rounded" />
              <div className="w-full h-1 bg-teal-200 rounded" />
              <div className="w-3/4 h-1 bg-teal-200 rounded" />
            </div>
            {/* Shield with check - overlapping left */}
            <div
              className="absolute -left-2 -top-1 w-12 h-14 bg-teal-700 rounded-b-lg flex items-center justify-center shadow-md"
              style={{ clipPath: 'polygon(50% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)' }}
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* Clock - right */}
            <div className="absolute -right-2 top-2 w-11 h-11 rounded-full bg-teal-800 border-2 border-teal-700 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Confirmation message */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Terima kasih telah mendaftar.
        </h1>
        <p className="text-gray-700 mb-1">
          Kami akan meninjau pendaftaran Anda dan
        </p>
        <p className="text-gray-700 mb-6">
          menghubungi Anda melalui email.
        </p>

        {applicationNo && (
          <p className="text-sm text-gray-500 mb-6">
            Nomor pendaftaran: <span className="font-mono font-medium text-gray-700">{applicationNo}</span>
          </p>
        )}

        {/* Button: goes to start page (later will be login) */}
        <Link
          href="/"
          className="inline-block rounded-lg bg-teal-700 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
        >
          Buka Halaman Login
        </Link>
      </div>
    </main>
  );
}
