import { useState, useCallback } from 'react';
import { Activity } from '@/src/types';
import { activitiesApi, CreateActivityPayload } from '@/src/services/crm/activities.api';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (params?: {
    relatedEntity?: string;
    relatedEntityId?: string;
    type?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await activitiesApi.list(params);
      setActivities(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, []);

  const log = async (payload: CreateActivityPayload): Promise<Activity> => {
    setSaving(true);
    setError(null);
    try {
      const res = await activitiesApi.create(payload);
      setActivities(prev => [res.data, ...prev]);
      return res.data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to log activity';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  };

  const clearError = () => setError(null);

  return { activities, loading, saving, error, fetch, log, clearError };
}
