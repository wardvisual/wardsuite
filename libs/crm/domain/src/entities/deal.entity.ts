export type DealStage = 'open' | 'proposal' | 'negotiation' | 'won' | 'lost';

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

export interface CreateDealDto {
  title: string;
  customerId: string;
  amount: number;
  ownerId: string;
  expectedCloseDate: string;
  stage?: DealStage;
  leadId?: string;
  notes?: string;
}

export interface UpdateDealDto extends Partial<CreateDealDto> {}
