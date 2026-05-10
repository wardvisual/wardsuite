export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  VIEWER = 'VIEWER',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  passwordHash?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  code: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  assignedUserId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  accountManagerId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  code: string;
  title: string;
  customerId: string;
  leadId?: string;
  amount: number;
  stage: 'open' | 'negotiation' | 'proposal' | 'won' | 'lost';
  ownerId: string;
  expectedCloseDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  relatedEntity: string;
  relatedEntityId: string;
  type: 'call' | 'meeting' | 'note' | 'email' | 'audit';
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  reorderLevel: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseRequest {
  id: string;
  requestNumber: string;
  requestDate: string;
  supplierId: string;
  requestedById: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'ordered' | 'received';
  notes?: string;
  items: PurchaseRequestItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseRequestItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

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

export interface DashboardStats {
  totalSuppliers: number;
  totalProducts: number;
  lowStockItems: number;
  openPurchaseRequests: number;
  totalLeads: number;
  totalCustomers: number;
  openDeals: number;
  recentActivities: number;
}
