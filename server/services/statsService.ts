import { DashboardStats } from "../types/models";

class StatsService {
  async getDashboardStats(): Promise<DashboardStats> {
    // In a real app, this would query a database
    // For now, returning mock data to maintain existing functionality
    return {
      totalSuppliers: 24,
      totalProducts: 142,
      lowStockItems: 5,
      totalLeads: 89,
      totalCustomers: 56,
      openDeals: 12,
      revenue: 102456
    };
  }
}

export const statsService = new StatsService();
