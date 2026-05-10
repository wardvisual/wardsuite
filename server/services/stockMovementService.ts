import { StockMovement } from '../types/models';
import { CreateStockMovementDto } from '../dto/stockMovement.dto';
import { productService } from './productService';

class StockMovementService {
  private movements: StockMovement[] = [
    { id: '1', productId: '1', quantity: 50, type: 'in', reference: 'PR-0001', date: '2025-03-10T08:00:00Z', notes: 'Initial stock receipt', createdAt: '2025-03-10T08:00:00Z' },
    { id: '2', productId: '2', quantity: 200, type: 'in', reference: 'PR-0001', date: '2025-03-10T08:00:00Z', createdAt: '2025-03-10T08:00:00Z' },
    { id: '3', productId: '1', quantity: 5, type: 'out', reference: 'SO-001', date: '2025-04-01T08:00:00Z', notes: 'Sales order fulfillment', createdAt: '2025-04-01T08:00:00Z' },
  ];

  async getAll(productId?: string): Promise<StockMovement[]> {
    if (productId) return this.movements.filter(m => m.productId === productId);
    return this.movements;
  }

  async create(dto: CreateStockMovementDto): Promise<StockMovement> {
    const now = new Date().toISOString();
    const item: StockMovement = {
      id: Math.random().toString(36).substring(2, 11),
      productId: dto.productId,
      quantity: dto.quantity,
      type: dto.type,
      reference: dto.reference,
      date: dto.date ?? now,
      notes: dto.notes,
      createdAt: now,
    };
    this.movements.push(item);

    // adjust product stock
    const delta = dto.type === 'in' ? dto.quantity : dto.type === 'out' ? -dto.quantity : 0;
    if (delta !== 0) productService.adjustStock(dto.productId, delta);

    return item;
  }
}

export const stockMovementService = new StockMovementService();
