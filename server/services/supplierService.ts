import { Supplier } from '../types/models';
import { CreateSupplierDto, UpdateSupplierDto } from '../dto/supplier.dto';

let counter = 3;

function nextCode() {
  return `SUP-${String(counter++).padStart(3, '0')}`;
}

class SupplierService {
  private suppliers: Supplier[] = [
    { id: '1', code: 'SUP-001', name: 'TechFlow Systems', contactPerson: 'John Smith', email: 'john@techflow.com', phone: '+1 234 567 8900', address: 'San Francisco, CA', status: 'active', createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-10T08:00:00Z' },
    { id: '2', code: 'SUP-002', name: 'Prime Logistics', contactPerson: 'Jane Doe', email: 'jane@prime.com', phone: '+1 234 567 8901', address: 'Chicago, IL', status: 'active', createdAt: '2025-02-05T08:00:00Z', updatedAt: '2025-02-05T08:00:00Z' },
    { id: '3', code: 'SUP-003', name: 'Global Parts Co.', contactPerson: 'Mike Lee', email: 'mike@globalparts.com', phone: '+1 234 567 8902', address: 'Houston, TX', status: 'inactive', notes: 'On hold pending review', createdAt: '2025-03-01T08:00:00Z', updatedAt: '2025-03-15T08:00:00Z' },
  ];

  async getAll(search?: string): Promise<Supplier[]> {
    if (!search) return this.suppliers;
    const q = search.toLowerCase();
    return this.suppliers.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.contactPerson.toLowerCase().includes(q)
    );
  }

  async getById(id: string): Promise<Supplier | undefined> {
    return this.suppliers.find(s => s.id === id);
  }

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    const now = new Date().toISOString();
    const item: Supplier = {
      id: Math.random().toString(36).substring(2, 11),
      code: dto.code ?? nextCode(),
      name: dto.name,
      contactPerson: dto.contactPerson,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      status: dto.status ?? 'active',
      notes: dto.notes,
      createdAt: now,
      updatedAt: now,
    };
    this.suppliers.push(item);
    return item;
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier | undefined> {
    const index = this.suppliers.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    this.suppliers[index] = { ...this.suppliers[index], ...dto, updatedAt: new Date().toISOString() };
    return this.suppliers[index];
  }

  async delete(id: string): Promise<boolean> {
    const initial = this.suppliers.length;
    this.suppliers = this.suppliers.filter(s => s.id !== id);
    return this.suppliers.length < initial;
  }

  count(): number {
    return this.suppliers.length;
  }
}

export const supplierService = new SupplierService();
