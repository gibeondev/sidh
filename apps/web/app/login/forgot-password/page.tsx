'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Forgot password: enter email. Backend returns message (parent = generic success;
 * admin = contact administrator). Email sending is TODO on backend.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Permintaan gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold uppercase tracking-tight text-gray-900">
          Lupa kata sandi
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Masukkan email yang terdaftar. Anda akan menerima instruksi jika akun Anda adalah akun orang tua/wali.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-md bg-teal-50 px-3 py-2 text-sm text-teal-800" role="status">
              {message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Memproses...' : 'Kirim instruksi'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/login" className="text-teal-600 hover:text-teal-700 hover:underline">
            Kembali ke login
          </Link>
        </p>
      </div>
    </div>
  );
}
