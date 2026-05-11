import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/src/store/auth.store';
import { authApi } from '@/src/services/auth.api';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, token, setAuth, clearAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!token) return;
    authApi.me(token).catch(() => clearAuth());
  }, [token, setAuth, clearAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
