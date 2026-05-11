import { Lead, CreateLeadDto, UpdateLeadDto, LeadStatus } from '@wardsuite/crm/domain';

export interface ILeadRepository {
  findAll(): Promise<Lead[]>;
  findById(id: string): Promise<Lead | null>;
  create(dto: CreateLeadDto, actorId?: string): Promise<Lead>;
  update(id: string, dto: UpdateLeadDto, actorId?: string): Promise<Lead>;
  updateStatus(id: string, status: LeadStatus, actorId?: string): Promise<Lead>;
  batchCreate(dtos: CreateLeadDto[], actorId?: string): Promise<Lead[]>;
  remove(id: string): Promise<void>;
}
