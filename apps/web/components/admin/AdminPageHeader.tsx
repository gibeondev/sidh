'use client';

interface AdminPageHeaderProps {
  label?: string;
  title: string;
  children?: React.ReactNode;
}

export function AdminPageHeader({ label, title, children }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {label && (
          <p className="text-xs font-medium uppercase tracking-wider text-sky-600">
            {label}
          </p>
        )}
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      </div>
      {children && <div className="mt-2 sm:mt-0">{children}</div>}
    </div>
  );
}
