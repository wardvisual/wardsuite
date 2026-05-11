import { useState, useEffect, useCallback } from 'react';
import { Deal } from '@/src/types';
import { dealsApi, CreateDealPayload, UpdateDealPayload } from '@/src/services/crm/deals.api';

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (stage?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await dealsApi.list(stage);
      setDeals(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (payload: CreateDealPayload): Promise<Deal> => {
    setSaving(true);
    setError(null);
    try {
      const res = await dealsApi.create(payload);
      setDeals(prev => [res.data, ...prev]);
      return res.data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to create deal';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: string, payload: UpdateDealPayload): Promise<Deal> => {
    setSaving(true);
    setError(null);
    try {
      const res = await dealsApi.update(id, payload);
      setDeals(prev => prev.map(d => d.id === id ? res.data : d));
      return res.data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to update deal';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  };

  const updateStage = async (id: string, stage: Deal['stage']): Promise<void> => {
    // Optimistic update
    setDeals(prev => prev.map(d => d.id === id ? { ...d, stage } : d));
    try {
      const res = await dealsApi.updateStage(id, stage);
      setDeals(prev => prev.map(d => d.id === id ? res.data : d));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to move deal');
      fetch(); // revert by re-fetching
    }
  };

  const remove = async (id: string): Promise<void> => {
    setSaving(true);
    setError(null);
    try {
      await dealsApi.remove(id);
      setDeals(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to delete deal';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  };

  const clearError = () => setError(null);

  return { deals, loading, saving, error, fetch, create, update, updateStage, remove, clearError };
}
