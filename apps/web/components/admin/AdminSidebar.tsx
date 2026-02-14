'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api/auth';
import type { UserResponse } from '@/lib/api/auth';

const navItems = [
  { href: '/admin/applications', label: 'Pra-Registrasi', icon: 'document-check' },
  { href: '/admin/registration-periods', label: 'Registrasi Lengkap', icon: 'clipboard-clock' },
  { href: '/admin/students', label: 'Daftar Siswa', icon: 'person' },
  { href: '/admin/settings', label: 'Pengaturan', icon: 'gear' },
];

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const c = active ? 'text-white' : 'text-gray-400';
  const size = 20;
  switch (name) {
    case 'document-check':
      return (
        <svg className={`shrink-0 ${c}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="m9 15 2 2 4-4" />
        </svg>
      );
    case 'clipboard-clock':
      return (
        <svg className={`shrink-0 ${c}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect width={8} height={4} x={8} y={2} rx={1} ry={1} />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M12 11v4l2 2" />
        </svg>
      );
    case 'person':
      return (
        <svg className={`shrink-0 ${c}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={12} cy={8} r={4} />
          <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
      );
    case 'gear':
      return (
        <svg className={`shrink-0 ${c}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={12} cy={12} r={3} />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    default:
      return null;
  }
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    authApi.getMe().then(setUser);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <aside className="flex w-64 flex-col bg-slate-800">
      <div className="flex flex-col items-center border-b border-slate-700 px-4 py-6">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={70}
          height={28}
          className="h-auto w-[70px]"
        />
      </div>

      <div className="mx-3 mt-4 rounded-lg bg-slate-700/50 px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-600 text-slate-300">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={12} cy={8} r={4} />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.email ?? '–'}</p>
            <p className="truncate text-xs text-slate-400">{user?.role === 'ADMIN' ? 'Admin' : user?.role ?? '–'}</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-0.5 px-3 py-2">
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <NavIcon name={icon} active={isActive} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1={21} x2={9} y1={12} y2={12} />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  );
}
