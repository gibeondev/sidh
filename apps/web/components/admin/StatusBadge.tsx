'use client';

import { Badge } from '@/components/ui/badge';
import type { ApplicationStatus } from '@/lib/api/admin-applications';

const LABEL: Record<ApplicationStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Baru',
  UNDER_REVIEW: 'Sedang Ditinjau',
  CHANGES_REQUESTED: 'Perubahan Diminta',
  APPROVED: 'Disetujui',
  REJECTED: 'Ditolak',
};

const VARIANT: Record<ApplicationStatus, 'baru' | 'ditinjau' | 'disetujui' | 'ditolak' | 'default' | 'secondary'> = {
  DRAFT: 'secondary',
  SUBMITTED: 'baru',
  UNDER_REVIEW: 'ditinjau',
  CHANGES_REQUESTED: 'ditinjau',
  APPROVED: 'disetujui',
  REJECTED: 'ditolak',
};

function BaruIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <line x1={12} y1={5} x2={12} y2={19} />
      <line x1={5} y1={12} x2={19} y2={12} />
    </svg>
  );
}
function DitinjauIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
function DisetujuiIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function DitolakIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1={18} y1={6} x2={6} y2={18} />
      <line x1={6} y1={6} x2={18} y2={18} />
    </svg>
  );
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const variant = VARIANT[status];
  const label = LABEL[status];
  const icon =
    variant === 'baru' ? <BaruIcon /> :
    variant === 'ditinjau' ? <DitinjauIcon /> :
    variant === 'disetujui' ? <DisetujuiIcon /> :
    variant === 'ditolak' ? <DitolakIcon /> : null;
  return (
    <Badge variant={variant}>
      {icon}
      {label}
    </Badge>
  );
}
