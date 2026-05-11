import { apiClient } from '../api.client';
import { Deal, ApiResponse } from '@/src/types';

export interface CreateDealPayload {
  title: string;
  customerId: string;
  amount: number;
  ownerId: string;
  expectedCloseDate: string;
  stage?: Deal['stage'];
  notes?: string;
  leadId?: string;
}

export type UpdateDealPayload = Partial<CreateDealPayload>;

const BASE = '/crm/deals';

export const dealsApi = {
  list(stage?: string): Promise<ApiResponse<Deal[]>> {
    const qs = stage ? `?stage=${stage}` : '';
    return apiClient.get<Deal[]>(`${BASE}${qs}`);
  },

  get(id: string): Promise<ApiResponse<Deal>> {
    return apiClient.get<Deal>(`${BASE}/${id}`);
  },

  create(payload: CreateDealPayload): Promise<ApiResponse<Deal>> {
    return apiClient.post<Deal>(BASE, payload);
  },

  update(id: string, payload: UpdateDealPayload): Promise<ApiResponse<Deal>> {
    return apiClient.put<Deal>(`${BASE}/${id}`, payload);
  },

  updateStage(id: string, stage: Deal['stage']): Promise<ApiResponse<Deal>> {
    return apiClient.patch<Deal>(`${BASE}/${id}/stage`, { stage });
  },

  remove(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`${BASE}/${id}`);
  },
};
