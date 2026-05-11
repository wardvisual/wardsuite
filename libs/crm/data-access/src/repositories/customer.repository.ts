import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@wardsuite/crm/domain';

export interface ICustomerRepository {
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  create(dto: CreateCustomerDto, actorId?: string): Promise<Customer>;
  update(id: string, dto: UpdateCustomerDto, actorId?: string): Promise<Customer>;
  remove(id: string): Promise<void>;
}
