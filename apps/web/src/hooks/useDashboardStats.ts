import { useState, useEffect } from 'react';
import { DashboardStats } from '../types';

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSuppliers: 24,
    totalProducts: 142,
    lowStockItems: 5,
    totalLeads: 89,
    totalCustomers: 56,
    openDeals: 12,
    revenue: 102456
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}
