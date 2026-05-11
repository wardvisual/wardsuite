import { AuthUser } from '@/src/store/auth.store';

const BASE_URL = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? `Request failed: ${res.status}`);
  return json.data as T;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    request<LoginResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: (token: string) =>
    request<null>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { Authorization: `Bearer ${token}` },
    }),

  me: (token: string) =>
    request<AuthUser>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
