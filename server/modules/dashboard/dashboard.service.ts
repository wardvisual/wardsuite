import { leadsService } from '../crm/leads/leads.service';
import { customersService } from '../crm/customers/customers.service';
import { dealsService } from '../crm/deals/deals.service';
import { activitiesService } from '../crm/activities/activities.service';
import { suppliersService } from '../scm/suppliers/suppliers.service';
import { productsService } from '../scm/products/products.service';
import { purchaseRequestsService } from '../scm/purchase-requests/purchase-requests.service';

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

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const [
      totalSuppliers,
      totalProducts,
      lowStockItems,
      openPurchaseRequests,
      totalLeads,
      totalCustomers,
      openDeals,
      recentActivities,
    ] = await Promise.all([
      suppliersService.count(),
      productsService.count(),
      productsService.getLowStockCount(),
      purchaseRequestsService.countOpen(),
      leadsService.count(),
      customersService.count(),
      dealsService.countOpen(),
      activitiesService.recentCount(),
    ]);

    return {
      totalSuppliers,
      totalProducts,
      lowStockItems,
      openPurchaseRequests,
      totalLeads,
      totalCustomers,
      openDeals,
      recentActivities,
    };
  }
}

export const dashboardService = new DashboardService();
