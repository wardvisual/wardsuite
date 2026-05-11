import { Deal, CreateDealDto, UpdateDealDto, DealStage } from '@wardsuite/crm/domain';

export interface IDealRepository {
  findAll(): Promise<Deal[]>;
  findById(id: string): Promise<Deal | null>;
  create(dto: CreateDealDto, actorId?: string): Promise<Deal>;
  update(id: string, dto: UpdateDealDto, actorId?: string): Promise<Deal>;
  updateStage(id: string, stage: DealStage, actorId?: string): Promise<Deal>;
  remove(id: string): Promise<void>;
}
