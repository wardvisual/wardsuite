import { Customer } from '../types/models';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';

let counter = 5;

function nextCode() {
  return `CUST-${String(counter++).padStart(3, '0')}`;
}

class CustomerService {
  private customers: Customer[] = [
    { id: '1', code: 'CUST-001', name: 'Anna Schmidt', company: 'Schmidt GmbH', email: 'anna@schmidt.de', phone: '+49 89 1234567', address: 'Munich, Germany', accountManagerId: 'u2', status: 'active', createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z' },
    { id: '2', code: 'CUST-002', name: 'Carlos Rivera', company: 'Rivera Enterprises', email: 'carlos@rivera.mx', phone: '+52 55 9876543', address: 'Mexico City, MX', accountManagerId: 'u2', status: 'active', createdAt: '2025-02-14T08:00:00Z', updatedAt: '2025-02-14T08:00:00Z' },
    { id: '3', code: 'CUST-003', name: 'Emily Zhang', company: 'Zhang Consulting', email: 'emily@zhang.cn', phone: '+86 21 5555 0100', address: 'Shanghai, China', accountManagerId: 'u3', status: 'active', createdAt: '2025-03-03T08:00:00Z', updatedAt: '2025-03-03T08:00:00Z' },
    { id: '4', code: 'CUST-004', name: 'David Osei', company: 'Osei Holdings', email: 'david@osei.gh', phone: '+233 30 2760000', address: 'Accra, Ghana', accountManagerId: 'u3', status: 'inactive', createdAt: '2025-03-20T08:00:00Z', updatedAt: '2025-04-01T08:00:00Z' },
  ];

  async getAll(search?: string): Promise<Customer[]> {
    if (!search) return this.customers;
    const q = search.toLowerCase();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }

  async getById(id: string): Promise<Customer | undefined> {
    return this.customers.find(c => c.id === id);
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const now = new Date().toISOString();
    const item: Customer = {
      id: Math.random().toString(36).substring(2, 11),
      code: dto.code ?? nextCode(),
      name: dto.name,
      company: dto.company,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      accountManagerId: dto.accountManagerId ?? 'u1',
      status: dto.status ?? 'active',
      createdAt: now,
      updatedAt: now,
    };
    this.customers.push(item);
    return item;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer | undefined> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.customers[index] = { ...this.customers[index], ...dto, updatedAt: new Date().toISOString() };
    return this.customers[index];
  }

  async delete(id: string): Promise<boolean> {
    const initial = this.customers.length;
    this.customers = this.customers.filter(c => c.id !== id);
    return this.customers.length < initial;
  }

  count(): number {
    return this.customers.length;
  }
}

export const customerService = new CustomerService();
