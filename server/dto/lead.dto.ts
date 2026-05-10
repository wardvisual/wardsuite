import { Lead } from "../types/models";

export interface CreateLeadDto {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status?: Lead['status'];
  assignedUserId?: string;
  notes?: string;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {}

export interface LeadResponseDto extends Lead {
  createdAt: string;
  updatedAt: string;
}
