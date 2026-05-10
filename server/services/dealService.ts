import { Deal } from '../types/models';
import { CreateDealDto, UpdateDealDto, UpdateDealStageDto } from '../dto/deal.dto';

let counter = 4;

function nextCode() {
  return `DEAL-${String(counter++).padStart(3, '0')}`;
}

class DealService {
  private deals: Deal[] = [
    { id: '1', code: 'DEAL-001', title: 'Enterprise License Q2', customerId: '1', leadId: '2', amount: 48000, stage: 'negotiation', ownerId: 'u2', expectedCloseDate: '2025-06-30', notes: 'Multi-year contract discussion', createdAt: '2025-03-10T08:00:00Z', updatedAt: '2025-04-15T08:00:00Z' },
    { id: '2', code: 'DEAL-002', title: 'Hardware Supply Agreement', customerId: '2', amount: 22500, stage: 'proposal', ownerId: 'u2', expectedCloseDate: '2025-05-31', createdAt: '2025-04-01T08:00:00Z', updatedAt: '2025-04-01T08:00:00Z' },
    { id: '3', code: 'DEAL-003', title: 'Cloud Migration Services', customerId: '3', leadId: '3', amount: 75000, stage: 'open', ownerId: 'u3', expectedCloseDate: '2025-07-15', createdAt: '2025-04-20T08:00:00Z', updatedAt: '2025-04-20T08:00:00Z' },
  ];

  async getAll(stage?: string): Promise<Deal[]> {
    if (stage) return this.deals.filter(d => d.stage === stage);
    return this.deals;
  }

  async getById(id: string): Promise<Deal | undefined> {
    return this.deals.find(d => d.id === id);
  }

  async create(dto: CreateDealDto): Promise<Deal> {
    const now = new Date().toISOString();
    const item: Deal = {
      id: Math.random().toString(36).substring(2, 11),
      code: nextCode(),
      title: dto.title,
      customerId: dto.customerId,
      leadId: dto.leadId,
      amount: dto.amount,
      stage: dto.stage ?? 'open',
      ownerId: dto.ownerId,
      expectedCloseDate: dto.expectedCloseDate,
      notes: dto.notes,
      createdAt: now,
      updatedAt: now,
    };
    this.deals.push(item);
    return item;
  }

  async update(id: string, dto: UpdateDealDto): Promise<Deal | undefined> {
    const index = this.deals.findIndex(d => d.id === id);
    if (index === -1) return undefined;
    this.deals[index] = { ...this.deals[index], ...dto, updatedAt: new Date().toISOString() };
    return this.deals[index];
  }

  async updateStage(id: string, dto: UpdateDealStageDto): Promise<Deal | undefined> {
    const index = this.deals.findIndex(d => d.id === id);
    if (index === -1) return undefined;
    this.deals[index] = { ...this.deals[index], stage: dto.stage, updatedAt: new Date().toISOString() };
    return this.deals[index];
  }

  async delete(id: string): Promise<boolean> {
    const initial = this.deals.length;
    this.deals = this.deals.filter(d => d.id !== id);
    return this.deals.length < initial;
  }

  countOpen(): number {
    return this.deals.filter(d => !['won', 'lost'].includes(d.stage)).length;
  }
}

export const dealService = new DealService();
