'use client';

export interface AdminCardSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Section within an admin card: centered uppercase title and content.
 * Used for form sections (e.g. DATA ORANG TUA / WALI SISWA).
 */
export function AdminCardSection({ title, children, className = '' }: AdminCardSectionProps) {
  return (
    <section className={className}>
      <h3 className="mb-6 text-center text-lg font-bold uppercase tracking-wider text-gray-700">
        {title}
      </h3>
      {children}
    </section>
  );
}
