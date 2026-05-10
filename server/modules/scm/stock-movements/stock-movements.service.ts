import { db } from '../../../core/database/firestore.client';
import { StockMovement, CreateStockMovementDto } from './stock-movements.dto';
import { productsService } from '../products/products.service';

const COLLECTION = 'scm_stock_movements';

function toMovement(id: string, data: FirebaseFirestore.DocumentData): StockMovement {
  return { id, ...data } as StockMovement;
}

class StockMovementsService {
  private col = db.collection(COLLECTION);

  async getAll(productId?: string): Promise<StockMovement[]> {
    let query: FirebaseFirestore.Query = this.col.orderBy('createdAt', 'desc');
    if (productId) query = query.where('productId', '==', productId);
    const snap = await query.get();
    return snap.docs.map(d => toMovement(d.id, d.data()));
  }

  async create(dto: CreateStockMovementDto): Promise<StockMovement> {
    const now = new Date().toISOString();
    const data = {
      productId: dto.productId,
      quantity: dto.quantity,
      type: dto.type,
      reference: dto.reference,
      date: dto.date ?? now,
      notes: dto.notes ?? '',
      createdAt: now,
    };
    const ref = await this.col.add(data);

    // Adjust product stock atomically
    const delta = dto.type === 'in' ? dto.quantity : dto.type === 'out' ? -dto.quantity : 0;
    if (delta !== 0) await productsService.adjustStock(dto.productId, delta);

    return { id: ref.id, ...data };
  }
}

export const stockMovementsService = new StockMovementsService();
