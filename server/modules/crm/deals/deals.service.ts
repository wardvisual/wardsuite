import { db } from '../../../core/database/firestore.client';
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
  return { id, ...data } as Deal;
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
      amount: dto.amount,
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
}

export const dealsService = new DealsService();
