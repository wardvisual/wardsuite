import { useState, useEffect, useCallback } from 'react';
import { Customer } from '@/src/types';
import { customersApi, CreateCustomerPayload, UpdateCustomerPayload } from '@/src/services/crm/customers.api';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await customersApi.list(search);
      setCustomers(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (payload: CreateCustomerPayload): Promise<Customer> => {
    setSaving(true);
    setError(null);
    try {
      const res = await customersApi.create(payload);
      setCustomers(prev => [res.data, ...prev]);
      return res.data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to create customer';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  };

  const update = async (id: string, payload: UpdateCustomerPayload): Promise<Customer> => {
    setSaving(true);
    setError(null);
    try {
      const res = await customersApi.update(id, payload);
      setCustomers(prev => prev.map(c => c.id === id ? res.data : c));
      return res.data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to update customer';
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
      await customersApi.remove(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to delete customer';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  };

  const clearError = () => setError(null);

  return { customers, loading, saving, error, fetch, create, update, remove, clearError };
}
