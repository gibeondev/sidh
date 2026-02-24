/**
 * Admin registration periods API. List periods and open/close status.
 * All calls use credentials: 'include'. Admin only.
 */

import { request, ApiError } from './client';

export { ApiError };

export interface RegistrationPeriodItem {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  status: string;
  createdAt: string;
}

const credentials = 'include' as RequestCredentials;

export async function getAdminRegistrationPeriods(): Promise<RegistrationPeriodItem[]> {
  return request<RegistrationPeriodItem[]>('/admin/registration-periods', { credentials });
}

export async function openRegistrationPeriod(id: string): Promise<RegistrationPeriodItem> {
  return request<RegistrationPeriodItem>(`/admin/registration-periods/${id}/open`, {
    method: 'POST',
    credentials,
  });
}

export async function closeRegistrationPeriod(id: string): Promise<RegistrationPeriodItem> {
  return request<RegistrationPeriodItem>(`/admin/registration-periods/${id}/close`, {
    method: 'POST',
    credentials,
  });
}
