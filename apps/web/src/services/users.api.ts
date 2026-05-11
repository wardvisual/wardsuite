import { apiClient } from './api.client';

export interface UpdateProfilePayload {
  name?: string;
  timezone?: string;
  language?: string;
  currency?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  timezone?: string;
  language?: string;
  currency?: string;
}

export const usersApi = {
  me: () => apiClient.get<UserProfile>('/users/me'),
  updateMe: (payload: UpdateProfilePayload) => apiClient.put<UserProfile>('/users/me', payload),
};
