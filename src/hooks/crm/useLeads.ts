import { useState, useCallback } from 'react';
import { Lead, LeadStatus } from '@/src/types';
import { leadsApi, CreateLeadPayload, UpdateLeadPayload } from '@/src/services/crm/leads.api';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (filters?: { status?: string; search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await leadsApi.list(filters);
      setLeads(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (payload: CreateLeadPayload): Promise<Lead> => {
    setSaving(true);
    setError(null);
    try {
      const res = await leadsApi.create(payload);
      setLeads(prev => [res.data, ...prev]);
      return res.data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to create lead';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: string, payload: UpdateLeadPayload): Promise<Lead> => {
    setSaving(true);
    setError(null);
    try {
      const res = await leadsApi.update(id, payload);
      setLeads(prev => prev.map(l => l.id === id ? res.data : l));
      return res.data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to update lead';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string): Promise<void> => {
    setSaving(true);
    setError(null);
    try {
      await leadsApi.remove(id);
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to delete lead';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, status: LeadStatus): Promise<void> => {
    try {
      const res = await leadsApi.update(id, { status });
      setLeads(prev => prev.map(l => l.id === id ? res.data : l));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update status');
    }
  };

  const importBatch = async (rows: CreateLeadPayload[]): Promise<void> => {
    setSaving(true);
    setError(null);
    try {
      const results = await Promise.all(rows.map(r => leadsApi.create(r)));
      setLeads(prev => [...results.map(r => r.data), ...prev]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Import failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  };

  const clearError = () => setError(null);

  return { leads, loading, saving, error, fetch, create, update, remove, updateStatus, importBatch, clearError };
}
