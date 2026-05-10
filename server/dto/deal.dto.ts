export interface CreateDealDto {
  title: string;
  customerId: string;
  leadId?: string;
  amount: number;
  stage?: 'open' | 'negotiation' | 'proposal' | 'won' | 'lost';
  ownerId: string;
  expectedCloseDate: string;
  notes?: string;
}

export interface UpdateDealDto extends Partial<CreateDealDto> {}

export interface UpdateDealStageDto {
  stage: 'open' | 'negotiation' | 'proposal' | 'won' | 'lost';
}
