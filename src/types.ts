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
  status: 'active' | 'discontinued';
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
}

export interface DashboardStats {
  totalSuppliers: number;
  totalProducts: number;
  lowStockItems: number;
  totalLeads: number;
  totalCustomers: number;
  openDeals: number;
  revenue: number;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'login';
  userId: string;
  userName: string;
  timestamp: any;
  details: string;
}
