import { db } from '../../../core/database/firestore.client';
import { PurchaseRequest, CreatePurchaseRequestDto, UpdatePurchaseRequestDto, PurchaseRequestStatus } from './purchase-requests.dto';

const COLLECTION = 'scm_purchase_requests';
const COUNTERS_COL = '_counters';

async function nextNumber(): Promise<string> {
  const counterRef = db.collection(COUNTERS_COL).doc(COLLECTION);
  const next = await db.runTransaction(async t => {
    const snap = await t.get(counterRef);
    const count = snap.exists ? (snap.data()?.count as number ?? 0) : 0;
    t.set(counterRef, { count: count + 1 });
    return count + 1;
  });
  return `PR-${String(next).padStart(4, '0')}`;
}

function toPR(id: string, data: FirebaseFirestore.DocumentData): PurchaseRequest {
  return { id, ...data } as PurchaseRequest;
}

class PurchaseRequestsService {
  private col = db.collection(COLLECTION);

  async getAll(): Promise<PurchaseRequest[]> {
    const snap = await this.col.orderBy('createdAt', 'desc').get();
    return snap.docs.map(d => toPR(d.id, d.data()));
  }

  async getById(id: string): Promise<PurchaseRequest | undefined> {
    const doc = await this.col.doc(id).get();
    if (!doc.exists) return undefined;
    return toPR(doc.id, doc.data()!);
  }

  async create(dto: CreatePurchaseRequestDto): Promise<PurchaseRequest> {
    const now = new Date().toISOString();
    const data = {
      requestNumber: await nextNumber(),
      requestDate: now,
      supplierId: dto.supplierId,
      requestedById: dto.requestedById,
      status: 'draft' as PurchaseRequestStatus,
      notes: dto.notes ?? '',
      items: dto.items,
      createdAt: now,
      updatedAt: now,
    };
    const ref = await this.col.add(data);
    return { id: ref.id, ...data };
  }

  async update(id: string, dto: UpdatePurchaseRequestDto): Promise<PurchaseRequest | undefined> {
    const ref = this.col.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return undefined;
    const updates = { ...dto, updatedAt: new Date().toISOString() };
    await ref.update(updates);
    return toPR(id, { ...existing.data()!, ...updates });
  }

  async updateStatus(id: string, status: PurchaseRequestStatus): Promise<PurchaseRequest | undefined> {
    return this.update(id, { status } as any);
  }

  async countOpen(): Promise<number> {
    const snap = await this.col
      .where('status', 'in', ['draft', 'submitted', 'approved', 'ordered'])
      .count()
      .get();
    return snap.data().count;
  }
}

export const purchaseRequestsService = new PurchaseRequestsService();
