import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF' | 'VIEWER';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'wardsuite-auth' },
  ),
);

export function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem('wardsuite-auth');
    if (!raw) return null;
    return (JSON.parse(raw) as { state: AuthState })?.state?.token ?? null;
  } catch {
    return null;
  }
}
