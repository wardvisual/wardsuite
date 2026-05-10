import { PurchaseRequest, PurchaseRequestItem } from '../types/models';
import { CreatePurchaseRequestDto, UpdatePurchaseRequestDto, UpdatePurchaseRequestStatusDto } from '../dto/purchaseRequest.dto';

let reqCounter = 3;

function nextReqNumber() {
  return `PR-${String(reqCounter++).padStart(4, '0')}`;
}

class PurchaseRequestService {
  private requests: PurchaseRequest[] = [
    {
      id: '1',
      requestNumber: 'PR-0001',
      requestDate: '2025-03-01T08:00:00Z',
      supplierId: '1',
      requestedById: 'u2',
      status: 'approved',
      notes: 'Urgent restock needed',
      items: [{ id: 'i1', productId: '3', quantity: 20, unitPrice: 18 }],
      createdAt: '2025-03-01T08:00:00Z',
      updatedAt: '2025-03-05T08:00:00Z',
    },
    {
      id: '2',
      requestNumber: 'PR-0002',
      requestDate: '2025-04-10T08:00:00Z',
      supplierId: '2',
      requestedById: 'u3',
      status: 'submitted',
      items: [
        { id: 'i2', productId: '4', quantity: 5, unitPrice: 250 },
        { id: 'i3', productId: '1', quantity: 10, unitPrice: 800 },
      ],
      createdAt: '2025-04-10T08:00:00Z',
      updatedAt: '2025-04-10T08:00:00Z',
    },
  ];

  async getAll(): Promise<PurchaseRequest[]> {
    return this.requests;
  }

  async getById(id: string): Promise<PurchaseRequest | undefined> {
    return this.requests.find(r => r.id === id);
  }

  async create(dto: CreatePurchaseRequestDto): Promise<PurchaseRequest> {
    const now = new Date().toISOString();
    const items: PurchaseRequestItem[] = dto.items.map(i => ({
      id: Math.random().toString(36).substring(2, 9),
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    }));
    const item: PurchaseRequest = {
      id: Math.random().toString(36).substring(2, 11),
      requestNumber: nextReqNumber(),
      requestDate: now,
      supplierId: dto.supplierId,
      requestedById: dto.requestedById,
      status: 'draft',
      notes: dto.notes,
      items,
      createdAt: now,
      updatedAt: now,
    };
    this.requests.push(item);
    return item;
  }

  async update(id: string, dto: UpdatePurchaseRequestDto): Promise<PurchaseRequest | undefined> {
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    const existing = this.requests[index];
    const items: PurchaseRequestItem[] = dto.items
      ? dto.items.map(i => ({ id: Math.random().toString(36).substring(2, 9), productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice }))
      : existing.items;
    this.requests[index] = { ...existing, ...dto, items, updatedAt: new Date().toISOString() };
    return this.requests[index];
  }

  async updateStatus(id: string, dto: UpdatePurchaseRequestStatusDto): Promise<PurchaseRequest | undefined> {
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    this.requests[index] = { ...this.requests[index], status: dto.status, updatedAt: new Date().toISOString() };
    return this.requests[index];
  }

  countOpen(): number {
    return this.requests.filter(r => ['draft', 'submitted', 'approved', 'ordered'].includes(r.status)).length;
  }
}

export const purchaseRequestService = new PurchaseRequestService();
