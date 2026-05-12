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
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Activity[]>> {
    const qs = new URLSearchParams();
    if (params?.relatedEntity) qs.set('relatedEntity', params.relatedEntity);
    if (params?.relatedEntityId) qs.set('relatedEntityId', params.relatedEntityId);
    if (params?.type) qs.set('type', params.type);
    if (params?.limit != null) qs.set('limit', String(params.limit));
    if (params?.offset != null) qs.set('offset', String(params.offset));
    const query = qs.toString() ? `?${qs}` : '';
    return apiClient.get<Activity[]>(`${BASE}${query}`);
  },

  create(payload: CreateActivityPayload): Promise<ApiResponse<Activity>> {
    return apiClient.post<Activity>(BASE, payload);
  },
};
