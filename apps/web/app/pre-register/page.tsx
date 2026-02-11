'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Pre-register landing page - redirects to Step 1.
 * Step 1 is now at /pre-register/step-1
 */
export default function PreRegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pre-register/step-1');
  }, [router]);

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Redirecting to registration form...</p>
      </div>
    </main>
  );
}
