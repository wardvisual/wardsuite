import { useState, useEffect } from 'react';
import { apiClient } from '@/src/services/api.client';
import { DashboardStats } from '../types';

const DEFAULTS: DashboardStats = {
  totalSuppliers: 0,
  totalProducts: 0,
  lowStockItems: 0,
  openPurchaseRequests: 0,
  totalLeads: 0,
  totalCustomers: 0,
  openDeals: 0,
  recentActivities: 0,
  pipelineRevenue: 0,
  wonRevenue: 0,
  monthlyRevenue: new Array(12).fill(0),
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<DashboardStats>('/dashboard/stats')
      .then(res => {
        const d = res.data;
        setStats({
          ...DEFAULTS,
          ...d,
          pipelineRevenue: Number(d.pipelineRevenue ?? 0),
          wonRevenue: Number(d.wonRevenue ?? 0),
          monthlyRevenue: Array.isArray(d.monthlyRevenue) ? d.monthlyRevenue.map(Number) : DEFAULTS.monthlyRevenue,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
