import { Lead } from '../types/models';
import { CreateLeadDto, UpdateLeadDto } from '../dto/lead.dto';

let counter = 5;

function nextCode() {
  return `LD-${String(counter++).padStart(3, '0')}`;
}

class LeadService {
  private leads: Lead[] = [
    { id: '1', code: 'LD-001', fullName: 'Alice Cooper', company: 'Cooper Corp', email: 'alice@cooper.com', phone: '+1 987 654 3210', source: 'Website', status: 'new', assignedUserId: 'u2', createdAt: '2025-02-10T08:00:00Z', updatedAt: '2025-02-10T08:00:00Z' },
    { id: '2', code: 'LD-002', fullName: 'Bob Martin', company: 'Martin & Sons', email: 'bob@martin.com', phone: '+1 987 654 3211', source: 'Referral', status: 'qualified', assignedUserId: 'u2', createdAt: '2025-02-20T08:00:00Z', updatedAt: '2025-03-05T08:00:00Z' },
    { id: '3', code: 'LD-003', fullName: 'Charlie Day', company: "Paddy's Pub", email: 'charlie@paddys.com', phone: '+1 987 654 3212', source: 'LinkedIn', status: 'proposal', assignedUserId: 'u2', createdAt: '2025-03-01T08:00:00Z', updatedAt: '2025-04-12T08:00:00Z' },
    { id: '4', code: 'LD-004', fullName: 'Diana Prince', company: 'Themyscira Inc', email: 'diana@amazon.com', phone: '+1 987 654 3213', source: 'Cold Call', status: 'lost', assignedUserId: 'u3', createdAt: '2025-03-15T08:00:00Z', updatedAt: '2025-04-01T08:00:00Z' },
  ];

  async getAll(status?: string, search?: string): Promise<Lead[]> {
    return this.leads.filter(l => {
      if (status && l.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        return l.fullName.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
      }
      return true;
    });
  }

  async getById(id: string): Promise<Lead | undefined> {
    return this.leads.find(l => l.id === id);
  }

  async createLead(dto: CreateLeadDto): Promise<Lead> {
    const now = new Date().toISOString();
    const newLead: Lead = {
      id: Math.random().toString(36).substring(2, 11),
      code: nextCode(),
      fullName: dto.fullName,
      company: dto.company,
      email: dto.email,
      phone: dto.phone,
      source: dto.source,
      status: dto.status ?? 'new',
      assignedUserId: dto.assignedUserId ?? 'u1',
      notes: dto.notes,
      createdAt: now,
      updatedAt: now,
    };
    this.leads.push(newLead);
    return newLead;
  }

  async updateLead(id: string, dto: UpdateLeadDto): Promise<Lead | undefined> {
    const index = this.leads.findIndex(l => l.id === id);
    if (index === -1) return undefined;
    this.leads[index] = { ...this.leads[index], ...dto, updatedAt: new Date().toISOString() };
    return this.leads[index];
  }

  async deleteLead(id: string): Promise<boolean> {
    const initial = this.leads.length;
    this.leads = this.leads.filter(l => l.id !== id);
    return this.leads.length < initial;
  }

  count(): number {
    return this.leads.length;
  }
}

export const leadService = new LeadService();
