import { leadsService } from '@server/modules/crm/leads/leads.service';
import { customersService } from '@server/modules/crm/customers/customers.service';
import { dealsService } from '@server/modules/crm/deals/deals.service';
import { activitiesService } from '@server/modules/crm/activities/activities.service';
import { suppliersService } from '@server/modules/scm/suppliers/suppliers.service';
import { productsService } from '@server/modules/scm/products/products.service';
import { purchaseRequestsService } from '@server/modules/scm/purchase-requests/purchase-requests.service';

export interface DashboardStats {
  totalSuppliers: number;
  totalProducts: number;
  lowStockItems: number;
  openPurchaseRequests: number;
  totalLeads: number;
  totalCustomers: number;
  openDeals: number;
  recentActivities: number;
  pipelineRevenue: number;
  wonRevenue: number;
  monthlyRevenue: number[];
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
      pipelineRevenue,
      wonRevenue,
      monthlyRevenue,
    ] = await Promise.all([
      suppliersService.count(),
      productsService.count(),
      productsService.getLowStockCount(),
      purchaseRequestsService.countOpen(),
      leadsService.count(),
      customersService.count(),
      dealsService.countOpen(),
      activitiesService.recentCount(),
      dealsService.pipelineRevenue(),
      dealsService.wonRevenue(),
      dealsService.monthlyRevenue(),
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
      pipelineRevenue,
      wonRevenue,
      monthlyRevenue,
    };
  }
}

export const dashboardService = new DashboardService();
