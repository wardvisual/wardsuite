import { db } from '@server/core/database/firestore.client';
import { Deal, CreateDealDto, UpdateDealDto, DealStage } from './deals.dto';

const COLLECTION = 'crm_deals';
const COUNTERS_COL = '_counters';

async function nextCode(): Promise<string> {
  const counterRef = db.collection(COUNTERS_COL).doc(COLLECTION);
  const next = await db.runTransaction(async t => {
    const snap = await t.get(counterRef);
    const count = snap.exists ? (snap.data()?.count as number ?? 0) : 0;
    t.set(counterRef, { count: count + 1 });
    return count + 1;
  });
  return `DEAL-${String(next).padStart(3, '0')}`;
}

function toDeal(id: string, data: FirebaseFirestore.DocumentData): Deal {
  return { id, ...data, amount: Number(data.amount ?? 0) } as Deal;
}

class DealsService {
  private col = db.collection(COLLECTION);

  async getAll(stage?: string): Promise<Deal[]> {
    let query: FirebaseFirestore.Query = this.col.orderBy('createdAt', 'desc');
    if (stage) query = query.where('stage', '==', stage);
    const snap = await query.get();
    return snap.docs.map(d => toDeal(d.id, d.data()));
  }

  async getById(id: string): Promise<Deal | undefined> {
    const doc = await this.col.doc(id).get();
    if (!doc.exists) return undefined;
    return toDeal(doc.id, doc.data()!);
  }

  async create(dto: CreateDealDto): Promise<Deal> {
    const now = new Date().toISOString();
    const code = await nextCode();
    const data = {
      code,
      title: dto.title,
      customerId: dto.customerId,
      leadId: dto.leadId ?? null,
      amount: Number(dto.amount ?? 0),
      stage: dto.stage ?? 'open',
      ownerId: dto.ownerId,
      expectedCloseDate: dto.expectedCloseDate,
      notes: dto.notes ?? '',
      createdAt: now,
      updatedAt: now,
    };
    const ref = await this.col.add(data);
    return { id: ref.id, ...data };
  }

  async update(id: string, dto: UpdateDealDto): Promise<Deal | undefined> {
    const ref = this.col.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return undefined;
    const updates = { ...dto, updatedAt: new Date().toISOString() };
    await ref.update(updates);
    return toDeal(id, { ...existing.data()!, ...updates });
  }

  async updateStage(id: string, stage: DealStage): Promise<Deal | undefined> {
    return this.update(id, { stage });
  }

  async delete(id: string): Promise<boolean> {
    const ref = this.col.doc(id);
    if (!(await ref.get()).exists) return false;
    await ref.delete();
    return true;
  }

  async countOpen(): Promise<number> {
    const snap = await this.col
      .where('stage', 'not-in', ['won', 'lost'])
      .count()
      .get();
    return snap.data().count;
  }

  async pipelineRevenue(): Promise<number> {
    const snap = await this.col.where('stage', 'not-in', ['lost']).get();
    return snap.docs.reduce((sum, d) => sum + Number(d.data().amount ?? 0), 0);
  }

  async wonRevenue(): Promise<number> {
    const snap = await this.col.where('stage', '==', 'won').get();
    return snap.docs.reduce((sum, d) => sum + Number(d.data().amount ?? 0), 0);
  }

  async monthlyRevenue(): Promise<number[]> {
    const now = new Date();
    const months = new Array<number>(12).fill(0);
    const cutoff = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString();
    const snap = await this.col.where('createdAt', '>=', cutoff).get();
    snap.docs.forEach(d => {
      const data = d.data();
      const date = new Date(data.createdAt as string);
      const monthsAgo = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
      const idx = 11 - monthsAgo;
      if (idx >= 0 && idx < 12) months[idx] += Number(data.amount ?? 0);
    });
    return months;
  }
}

export const dealsService = new DealsService();
