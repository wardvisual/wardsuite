import { apiClient } from '../api.client';
import { Customer, ApiResponse } from '@/src/types';

export interface CreateCustomerPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  accountManagerId?: string;
  status?: Customer['status'];
}

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

const BASE = '/crm/customers';

export const customersApi = {
  list(search?: string): Promise<ApiResponse<Customer[]>> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiClient.get<Customer[]>(`${BASE}${qs}`);
  },

  get(id: string): Promise<ApiResponse<Customer>> {
    return apiClient.get<Customer>(`${BASE}/${id}`);
  },

  create(payload: CreateCustomerPayload): Promise<ApiResponse<Customer>> {
    return apiClient.post<Customer>(BASE, payload);
  },

  update(id: string, payload: UpdateCustomerPayload): Promise<ApiResponse<Customer>> {
    return apiClient.put<Customer>(`${BASE}/${id}`, payload);
  },

  remove(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`${BASE}/${id}`);
  },
};
