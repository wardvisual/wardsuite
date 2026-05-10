export interface StockMovement {
  id: string;
  productId: string;
  quantity: number;
  type: 'in' | 'out' | 'adjustment';
  reference: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface CreateStockMovementDto {
  productId: string;
  quantity: number;
  type: 'in' | 'out' | 'adjustment';
  reference: string;
  date?: string;
  notes?: string;
}
