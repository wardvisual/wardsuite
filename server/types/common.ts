export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
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
