import { apiClient } from '../api.client';
import { Activity, ActivityType, ApiResponse } from '@/src/types';

export interface CreateActivityPayload {
  relatedEntity: string;
  relatedEntityId: string;
  type: ActivityType;
  description: string;
  createdBy?: string;
}

const BASE = '/crm/activities';

export const activitiesApi = {
  list(params?: {
    relatedEntity?: string;
    relatedEntityId?: string;
    type?: string;
  }): Promise<ApiResponse<Activity[]>> {
    const qs = new URLSearchParams();
    if (params?.relatedEntity) qs.set('relatedEntity', params.relatedEntity);
    if (params?.relatedEntityId) qs.set('relatedEntityId', params.relatedEntityId);
    if (params?.type) qs.set('type', params.type);
    const query = qs.toString() ? `?${qs}` : '';
    return apiClient.get<Activity[]>(`${BASE}${query}`);
  },

  create(payload: CreateActivityPayload): Promise<ApiResponse<Activity>> {
    return apiClient.post<Activity>(BASE, payload);
  },
};
