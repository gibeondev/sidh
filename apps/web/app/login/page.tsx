'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Login page — neutral for admin and parent. Two-column layout in a centered card:
 * left illustration, right form. Logo above header. Forgot password for parents only (backend).
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user } = await authApi.login({ email: email.trim(), password });
      if (user.role === 'PARENT') {
        router.push('/parent');
      } else {
        router.push('/admin/applications');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {/* Left: login image */}
        <div className="relative hidden lg:block lg:w-1/2 min-h-[28rem] bg-gray-100">
          <Image
            src="/images/login.png"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 0px, 50vw"
            priority
          />
        </div>

        {/* Right: form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12">
          <div className="mx-auto w-full max-w-sm">
            {/* Logo above header */}
            <div className="mb-4 flex justify-center">
              <Image
                src="/images/logo.png"
                alt="SIDH"
                width={120}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </div>
            <h1 className="text-center text-2xl font-bold uppercase tracking-tight text-gray-900">
              LOGIN TO SIDH
            </h1>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Kata sandi</Label>
                  <Link
                    href="/login/forgot-password"
                    className="text-sm text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.558 5.032m-6.276-1.451a3 3 0 105.561-5.561 3 3 0 00-5.561 5.561z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              <Link href="/" className="text-teal-600 hover:text-teal-700 hover:underline">
                Kembali ke beranda
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
