export interface PurchaseRequestItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseRequest {
  id: string;
  requestNumber: string;
  requestDate: string;
  supplierId: string;
  requestedById: string;
  status: PurchaseRequestStatus;
  notes?: string;
  items: PurchaseRequestItem[];
  createdAt: string;
  updatedAt: string;
}

export type PurchaseRequestStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'ordered' | 'received';

export interface CreatePurchaseRequestDto {
  supplierId: string;
  requestedById: string;
  notes?: string;
  items: PurchaseRequestItem[];
}

export interface UpdatePurchaseRequestDto {
  supplierId?: string;
  notes?: string;
  items?: PurchaseRequestItem[];
}

export interface UpdatePurchaseRequestStatusDto {
  status: PurchaseRequestStatus;
}
