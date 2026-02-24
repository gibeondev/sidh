'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect to parent main page (Pendaftaran list).
 */
export default function ParentApplicationsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/parent');
  }, [router]);

  return (
    <div className="space-y-6">
      <p className="text-gray-500">Mengalihkan...</p>
    </div>
  );
}
