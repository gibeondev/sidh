import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'baru' | 'ditinjau' | 'disetujui' | 'ditolak';
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-gray-100 text-gray-800 border border-gray-200',
  secondary: 'bg-gray-100 text-gray-600 border border-gray-200',
  baru: 'bg-blue-500 text-white border border-blue-600',
  ditinjau: 'bg-amber-500 text-white border border-amber-600',
  disetujui: 'bg-green-600 text-white border border-green-700',
  ditolak: 'bg-red-600 text-white border border-red-700',
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';

export { Badge };
