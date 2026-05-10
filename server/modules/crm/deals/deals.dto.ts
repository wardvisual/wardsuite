// ─── Entity ──────────────────────────────────────────────────────────────────

export interface Deal {
  id: string;
  code: string;
  title: string;
  customerId: string;
  leadId?: string;
  amount: number;
  stage: DealStage;
  ownerId: string;
  expectedCloseDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DealStage = 'open' | 'negotiation' | 'proposal' | 'won' | 'lost';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateDealDto {
  title: string;
  customerId: string;
  leadId?: string;
  amount: number;
  stage?: DealStage;
  ownerId: string;
  expectedCloseDate: string;
  notes?: string;
}

export type UpdateDealDto = Partial<CreateDealDto>;

export interface UpdateDealStageDto {
  stage: DealStage;
}
