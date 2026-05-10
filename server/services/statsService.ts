import { DashboardStats } from '../types/models';
import { supplierService } from './supplierService';
import { productService } from './productService';
import { purchaseRequestService } from './purchaseRequestService';
import { leadService } from './leadService';
import { customerService } from './customerService';
import { dealService } from './dealService';
import { activityService } from './activityService';

class StatsService {
  async getStats(): Promise<DashboardStats> {
    return {
      totalSuppliers: supplierService.count(),
      totalProducts: productService.count(),
      lowStockItems: productService.getLowStockCount(),
      openPurchaseRequests: purchaseRequestService.countOpen(),
      totalLeads: leadService.count(),
      totalCustomers: customerService.count(),
      openDeals: dealService.countOpen(),
      recentActivities: activityService.recentCount(),
    };
  }
}

export const statsService = new StatsService();
