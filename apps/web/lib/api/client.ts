/**
 * Centralized API client for direct calls to the backend.
 * Base URL: http://localhost:4000 (or NEXT_PUBLIC_API_URL).
 * No Next.js proxy; web app calls API directly.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiErrorBody {
  message?: string | string[];
  statusCode?: number;
  error?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public body?: ApiErrorBody
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestOptions {
  method?: string;
  headers?: HeadersInit;
  body?: object;
  /** Set to 'include' for admin/auth routes to send cookies */
  credentials?: RequestCredentials;
}

/**
 * Performs a typed JSON request. Throws ApiError on non-2xx.
 */
export async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers: optHeaders, body, credentials } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...optHeaders,
  };
  
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: credentials ?? 'same-origin',
    });
  } catch (error) {
    // Network error (server not running, CORS, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        `Tidak dapat terhubung ke server. Pastikan backend API berjalan di ${BASE_URL}`,
        0,
        { message: 'Network error: Backend server may not be running' }
      );
    }
    throw error;
  }

  const data = await response.json().catch(() => ({})) as ApiErrorBody & T;

  if (!response.ok) {
    const msg =
      typeof data.message === 'string'
        ? data.message
        : Array.isArray(data.message)
          ? data.message.join(' ')
          : response.status === 403
            ? 'Registrasi saat ini ditutup.'
            : 'Pre-registrasi gagal. Periksa data Anda dan coba lagi.';
    throw new ApiError(msg, response.status, data);
  }

  return data as T;
}
