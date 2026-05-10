import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getCountFromServer } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';

export interface DashboardStats {
  totalSuppliers: number;
  totalProducts: number;
  lowStockItems: number;
  totalLeads: number;
  totalCustomers: number;
  openDeals: number;
  revenue: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSuppliers: 0,
    totalProducts: 0,
    lowStockItems: 0,
    totalLeads: 0,
    totalCustomers: 0,
    openDeals: 0,
    revenue: 102456 // Placeholder fixed value for revenue in this PoC
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple way to get counts for PoC. 
    // In production, you'd use a Firestore summary document updated by Cloud Functions.
    const collections = ['suppliers', 'products', 'leads', 'customers', 'deals'];
    
    const unsubscribes = collections.map(col => {
      return onSnapshot(collection(db, col), (snapshot) => {
        setStats(prev => {
           const newStats = { ...prev };
           if (col === 'suppliers') newStats.totalSuppliers = snapshot.size;
           if (col === 'products') {
              newStats.totalProducts = snapshot.size;
              newStats.lowStockItems = snapshot.docs.filter(d => {
                const data = d.data();
                return data.currentStock <= (data.reorderLevel || 10);
              }).length;
           }
           if (col === 'leads') newStats.totalLeads = snapshot.size;
           if (col === 'customers') newStats.totalCustomers = snapshot.size;
           if (col === 'deals') newStats.openDeals = snapshot.size;
           return newStats;
        });
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, col);
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  return { stats, loading };
}
