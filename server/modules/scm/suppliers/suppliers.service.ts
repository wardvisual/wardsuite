import { db } from '@server/core/database/firestore.client';
import { Supplier, CreateSupplierDto, UpdateSupplierDto } from './suppliers.dto';

const COLLECTION = 'scm_suppliers';
const COUNTERS_COL = '_counters';

async function nextCode(): Promise<string> {
  const counterRef = db.collection(COUNTERS_COL).doc(COLLECTION);
  const next = await db.runTransaction(async t => {
    const snap = await t.get(counterRef);
    const count = snap.exists ? (snap.data()?.count as number ?? 0) : 0;
    t.set(counterRef, { count: count + 1 });
    return count + 1;
  });
  return `SUP-${String(next).padStart(3, '0')}`;
}

function toSupplier(id: string, data: FirebaseFirestore.DocumentData): Supplier {
  return { id, ...data } as Supplier;
}

class SuppliersService {
  private col = db.collection(COLLECTION);

  async getAll(search?: string): Promise<Supplier[]> {
    const snap = await this.col.orderBy('createdAt', 'desc').get();
    let items = snap.docs.map(d => toSupplier(d.id, d.data()));
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q),
      );
    }
    return items;
  }

  async getById(id: string): Promise<Supplier | undefined> {
    const doc = await this.col.doc(id).get();
    if (!doc.exists) return undefined;
    return toSupplier(doc.id, doc.data()!);
  }

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    const now = new Date().toISOString();
    const code = dto.code ?? await nextCode();
    const data = {
      code,
      name: dto.name,
      contactPerson: dto.contactPerson,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      status: dto.status ?? 'active',
      notes: dto.notes ?? '',
      createdAt: now,
      updatedAt: now,
    };
    const ref = await this.col.add(data);
    return { id: ref.id, ...data };
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier | undefined> {
    const ref = this.col.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return undefined;
    const updates = { ...dto, updatedAt: new Date().toISOString() };
    await ref.update(updates);
    return toSupplier(id, { ...existing.data()!, ...updates });
  }

  async delete(id: string): Promise<boolean> {
    const ref = this.col.doc(id);
    if (!(await ref.get()).exists) return false;
    await ref.delete();
    return true;
  }

  async count(): Promise<number> {
    const snap = await this.col.count().get();
    return snap.data().count;
  }
}

export const suppliersService = new SuppliersService();
