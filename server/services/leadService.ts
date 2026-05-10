import { Lead } from "../types/models";
import { CreateLeadDto, UpdateLeadDto } from "../dto/lead.dto";

class LeadService {
  private leads: Lead[] = [
    { id: '1', code: 'LD-001', fullName: 'Alice Cooper', company: 'Cooper Corp', email: 'alice@cooper.com', phone: '+1 987 654 3210', source: 'Website', status: 'new', assignedUserId: 'u1' },
    { id: '2', code: 'LD-002', fullName: 'Bob Martin', company: 'Martin & Sons', email: 'bob@martin.com', phone: '+1 987 654 3211', source: 'Referral', status: 'qualified', assignedUserId: 'u2' },
    { id: '3', code: 'LD-003', fullName: 'Charlie Day', company: 'Paddy\'s Pub', email: 'charlie@paddys.com', phone: '+1 987 654 3212', source: 'LinkedIn', status: 'proposal', assignedUserId: 'u1' },
    { id: '4', code: 'LD-004', fullName: 'Diana Prince', company: 'Themyscira Inc', email: 'diana@amazon.com', phone: '+1 987 654 3213', source: 'Cold Call', status: 'lost', assignedUserId: 'u3' },
  ];

  async getAllLeads(): Promise<Lead[]> {
    return this.leads;
  }

  async createLead(dto: CreateLeadDto): Promise<Lead> {
    const newLead: Lead = {
      ...dto,
      id: Math.random().toString(36).substr(2, 9),
      code: `LD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: dto.status || 'new',
      assignedUserId: dto.assignedUserId || 'u1'
    };
    this.leads.push(newLead);
    return newLead;
  }

  async updateLead(id: string, dto: UpdateLeadDto): Promise<Lead | undefined> {
    const index = this.leads.findIndex(l => l.id === id);
    if (index === -1) return undefined;
    this.leads[index] = { ...this.leads[index], ...dto };
    return this.leads[index];
  }

  async deleteLead(id: string): Promise<boolean> {
    const initialLength = this.leads.length;
    this.leads = this.leads.filter(l => l.id !== id);
    return this.leads.length < initialLength;
  }
}

export const leadService = new LeadService();
