import { apiClient } from '../api.client';
import { Lead, Activity, Customer, ApiResponse } from '@/src/types';

export interface CreateLeadPayload {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status?: Lead['status'];
  assignedUserId?: string;
  notes?: string;
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export interface ConvertLeadResponse {
  customer: Customer;
  lead: Lead;
}

const BASE = '/crm/leads';

export const leadsApi = {
  list(params?: { status?: string; search?: string }): Promise<ApiResponse<Lead[]>> {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.search) qs.set('search', params.search);
    const query = qs.toString() ? `?${qs}` : '';
    return apiClient.get<Lead[]>(`${BASE}${query}`);
  },

  get(id: string): Promise<ApiResponse<Lead>> {
    return apiClient.get<Lead>(`${BASE}/${id}`);
  },

  create(payload: CreateLeadPayload): Promise<ApiResponse<Lead>> {
    return apiClient.post<Lead>(BASE, payload);
  },

  update(id: string, payload: UpdateLeadPayload): Promise<ApiResponse<Lead>> {
    return apiClient.put<Lead>(`${BASE}/${id}`, payload);
  },

  remove(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`${BASE}/${id}`);
  },

  convert(id: string, address?: string): Promise<ApiResponse<ConvertLeadResponse>> {
    return apiClient.post<ConvertLeadResponse>(`${BASE}/${id}/convert`, { address });
  },

  activities(id: string): Promise<ApiResponse<Activity[]>> {
    return apiClient.get<Activity[]>(`/crm/activities?relatedEntity=lead&relatedEntityId=${id}`);
  },
};
