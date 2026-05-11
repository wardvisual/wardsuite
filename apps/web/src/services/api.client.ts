import { ApiResponse } from '@/src/types';
import { getStoredToken } from '@/src/store/auth.store';

const BASE_URL = '/api';

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = getStoredToken();

  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.headers) {
    new Headers(options.headers).forEach((v, k) => headers.set(k, v));
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('wardsuite-auth');
      window.location.href = '/login';
    }
    throw new Error(json.message ?? `Request failed: ${res.status}`);
  }

  return json;
}

export const apiClient = {
  get<T>(path: string) {
    return request<T>(path);
  },
  post<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
  },
  put<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
  },
  patch<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
  },
  delete<T>(path: string) {
    return request<T>(path, { method: 'DELETE' });
  },
};
