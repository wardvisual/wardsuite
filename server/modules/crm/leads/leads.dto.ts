// ─── Entity ──────────────────────────────────────────────────────────────────

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

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateLeadDto {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status?: LeadStatus;
  assignedUserId?: string;
  notes?: string;
}

export type UpdateLeadDto = Partial<CreateLeadDto>;
