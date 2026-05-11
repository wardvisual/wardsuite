import { db } from '@server/core/database/firestore.client';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from './customers.dto';

const COLLECTION = 'crm_customers';
const COUNTERS_COL = '_counters';

async function nextCode(): Promise<string> {
  const counterRef = db.collection(COUNTERS_COL).doc(COLLECTION);
  const next = await db.runTransaction(async t => {
    const snap = await t.get(counterRef);
    const count = snap.exists ? (snap.data()?.count as number ?? 0) : 0;
    t.set(counterRef, { count: count + 1 });
    return count + 1;
  });
  return `CUST-${String(next).padStart(3, '0')}`;
}

function toCustomer(id: string, data: FirebaseFirestore.DocumentData): Customer {
  return { id, ...data } as Customer;
}

class CustomersService {
  private col = db.collection(COLLECTION);

  async getAll(search?: string): Promise<Customer[]> {
    const snap = await this.col.orderBy('createdAt', 'desc').get();
    let customers = snap.docs.map(d => toCustomer(d.id, d.data()));
    if (search) {
      const q = search.toLowerCase();
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
      );
    }
    return customers;
  }

  async getById(id: string): Promise<Customer | undefined> {
    const doc = await this.col.doc(id).get();
    if (!doc.exists) return undefined;
    return toCustomer(doc.id, doc.data()!);
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const now = new Date().toISOString();
    const code = dto.code ?? await nextCode();
    const data = {
      code,
      name: dto.name,
      company: dto.company,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      accountManagerId: dto.accountManagerId ?? 'system',
      status: dto.status ?? 'active',
      createdAt: now,
      updatedAt: now,
    };
    const ref = await this.col.add(data);
    return { id: ref.id, ...data };
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer | undefined> {
    const ref = this.col.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return undefined;
    const updates = { ...dto, updatedAt: new Date().toISOString() };
    await ref.update(updates);
    return toCustomer(id, { ...existing.data()!, ...updates });
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

export const customersService = new CustomersService();
