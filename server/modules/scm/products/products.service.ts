import { db } from '../../../core/database/firestore.client';
import { Product, CreateProductDto, UpdateProductDto } from './products.dto';

const COLLECTION = 'scm_products';
const COUNTERS_COL = '_counters';

async function nextSku(): Promise<string> {
  const counterRef = db.collection(COUNTERS_COL).doc(COLLECTION);
  const next = await db.runTransaction(async t => {
    const snap = await t.get(counterRef);
    const count = snap.exists ? (snap.data()?.count as number ?? 0) : 0;
    t.set(counterRef, { count: count + 1 });
    return count + 1;
  });
  return `SKU-${String(next).padStart(4, '0')}`;
}

function toProduct(id: string, data: FirebaseFirestore.DocumentData): Product {
  return { id, ...data } as Product;
}

class ProductsService {
  private col = db.collection(COLLECTION);

  async getAll(search?: string): Promise<Product[]> {
    const snap = await this.col.orderBy('createdAt', 'desc').get();
    let items = snap.docs.map(d => toProduct(d.id, d.data()));
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
      );
    }
    return items;
  }

  async getById(id: string): Promise<Product | undefined> {
    const doc = await this.col.doc(id).get();
    if (!doc.exists) return undefined;
    return toProduct(doc.id, doc.data()!);
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const now = new Date().toISOString();
    const sku = dto.sku ?? await nextSku();
    const data = {
      sku,
      name: dto.name,
      category: dto.category,
      unit: dto.unit,
      costPrice: dto.costPrice,
      sellingPrice: dto.sellingPrice,
      currentStock: dto.currentStock,
      reorderLevel: dto.reorderLevel,
      status: dto.status ?? 'active',
      createdAt: now,
      updatedAt: now,
    };
    const ref = await this.col.add(data);
    return { id: ref.id, ...data };
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product | undefined> {
    const ref = this.col.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return undefined;
    const updates = { ...dto, updatedAt: new Date().toISOString() };
    await ref.update(updates);
    return toProduct(id, { ...existing.data()!, ...updates });
  }

  async delete(id: string): Promise<boolean> {
    const ref = this.col.doc(id);
    if (!(await ref.get()).exists) return false;
    await ref.delete();
    return true;
  }

  async adjustStock(id: string, delta: number): Promise<void> {
    const ref = this.col.doc(id);
    await db.runTransaction(async t => {
      const doc = await t.get(ref);
      if (!doc.exists) return;
      const current = (doc.data()?.currentStock as number) ?? 0;
      t.update(ref, { currentStock: Math.max(0, current + delta), updatedAt: new Date().toISOString() });
    });
  }

  async getLowStockCount(): Promise<number> {
    // Firestore can't compare two fields — fetch all and filter client-side
    const snap = await this.col.get();
    return snap.docs.filter(d => {
      const data = d.data();
      return (data.currentStock as number) <= (data.reorderLevel as number);
    }).length;
  }

  async count(): Promise<number> {
    const snap = await this.col.count().get();
    return snap.data().count;
  }
}

export const productsService = new ProductsService();
