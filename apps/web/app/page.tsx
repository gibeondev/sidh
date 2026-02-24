'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authApi, type UserResponse } from '@/lib/api/auth';

export default function Home() {
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    authApi.getMe().then(setUser).catch(() => setUser(null));
  }, []);

  const isParent = user?.role === 'PARENT';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">SIDH</h1>
        <p className="text-lg text-gray-600 mb-8">Student Information and Document Hub</p>
        {isParent ? (
          <Link
            href="/parent"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Pendaftaran
          </Link>
        ) : (
          <Link
            href="/pre-register"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Pre-register
          </Link>
        )}
      </div>
    </main>
  );
}
