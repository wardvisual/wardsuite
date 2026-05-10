export interface PurchaseRequestItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreatePurchaseRequestDto {
  supplierId: string;
  requestedById: string;
  notes?: string;
  items: PurchaseRequestItemDto[];
}

export interface UpdatePurchaseRequestDto {
  supplierId?: string;
  notes?: string;
  items?: PurchaseRequestItemDto[];
}

export interface UpdatePurchaseRequestStatusDto {
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'ordered' | 'received';
}
