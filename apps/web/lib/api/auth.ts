const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  role: 'ADMIN' | 'PARENT';
}

export interface AuthResponse {
  user: UserResponse;
}

class AuthApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      const msg = Array.isArray(error.message) ? error.message.join(' ') : (error.message || 'Login failed');
      throw new Error(msg);
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok && response.status !== 401) {
      throw new Error('Logout failed');
    }
    // 401 or success: session is cleared; always redirect on client
  }

  async getMe(): Promise<UserResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        throw new Error('Failed to get user');
      }

      return response.json();
    } catch (error) {
      return null;
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: email.trim() }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Permintaan gagal' }));
      const msg = Array.isArray(error.message) ? error.message.join(' ') : (error.message || 'Permintaan gagal');
      throw new Error(msg);
    }

    return response.json();
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/me/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Gagal mengubah kata sandi' }));
      const msg = Array.isArray(error.message) ? error.message.join(' ') : (error.message || 'Gagal mengubah kata sandi');
      throw new Error(msg);
    }
  }
}

export const authApi = new AuthApiClient();
