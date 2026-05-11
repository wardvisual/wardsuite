import { db } from '@server/core/database/firestore.client';
import { Lead, CreateLeadDto, UpdateLeadDto } from './leads.dto';

const COLLECTION = 'crm_leads';
const COUNTERS_COL = '_counters';

async function nextCode(): Promise<string> {
  const counterRef = db.collection(COUNTERS_COL).doc(COLLECTION);
  const next = await db.runTransaction(async t => {
    const snap = await t.get(counterRef);
    const count = snap.exists ? (snap.data()?.count as number ?? 0) : 0;
    t.set(counterRef, { count: count + 1 });
    return count + 1;
  });
  return `LD-${String(next).padStart(3, '0')}`;
}

function toLead(id: string, data: FirebaseFirestore.DocumentData): Lead {
  return { id, ...data } as Lead;
}

class LeadsService {
  private col = db.collection(COLLECTION);

  async getAll(status?: string, search?: string): Promise<Lead[]> {
    let query: FirebaseFirestore.Query = this.col.orderBy('createdAt', 'desc');
    if (status) query = query.where('status', '==', status);

    const snap = await query.get();
    let leads = snap.docs.map(d => toLead(d.id, d.data()));

    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(l =>
        l.fullName.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q),
      );
    }

    return leads;
  }

  async getById(id: string): Promise<Lead | undefined> {
    const doc = await this.col.doc(id).get();
    if (!doc.exists) return undefined;
    return toLead(doc.id, doc.data()!);
  }

  async create(dto: CreateLeadDto): Promise<Lead> {
    const now = new Date().toISOString();
    const code = await nextCode();
    const data = {
      code,
      fullName: dto.fullName,
      company: dto.company,
      email: dto.email,
      phone: dto.phone,
      source: dto.source,
      status: dto.status ?? 'new',
      assignedUserId: dto.assignedUserId ?? 'system',
      notes: dto.notes ?? '',
      createdAt: now,
      updatedAt: now,
    };
    const ref = await this.col.add(data);
    return { id: ref.id, ...data };
  }

  async update(id: string, dto: UpdateLeadDto): Promise<Lead | undefined> {
    const ref = this.col.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return undefined;
    const updates = { ...dto, updatedAt: new Date().toISOString() };
    await ref.update(updates);
    return toLead(id, { ...existing.data()!, ...updates });
  }

  async delete(id: string): Promise<boolean> {
    const ref = this.col.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return false;
    await ref.delete();
    return true;
  }

  async count(): Promise<number> {
    const snap = await this.col.count().get();
    return snap.data().count;
  }
}

export const leadsService = new LeadsService();
