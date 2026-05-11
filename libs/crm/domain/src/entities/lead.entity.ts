export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

export interface Lead {
  id: string;
  code: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  assignedUserId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  source?: string;
  status?: LeadStatus;
  assignedUserId?: string;
  notes?: string;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {}
