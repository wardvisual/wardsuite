import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Filter } from 'lucide-react';
import { ActivityType } from '@/src/types';
import { CreateActivityPayload } from '@/src/services/crm/activities.api';
import { useActivities } from '@/src/hooks/crm/useActivities';
import { ActivityList } from '@/src/components/crm/ActivityList';
import { Drawer } from '@/src/components/ui/Modals';
import { ActivityForm } from '@/src/components/crm/ActivityForm';

const ACTIVITY_TYPES: { value: ActivityType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'call',    label: 'Call' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'note',    label: 'Note' },
  { value: 'email',   label: 'Email' },
];

const EMPTY_FORM: CreateActivityPayload = {
  relatedEntity: 'lead',
  relatedEntityId: '',
  type: 'note',
  description: '',
};

export default function Activities() {
  const { activities, loading, saving, error, fetch, log } = useActivities();

  const [typeFilter, setTypeFilter] = useState<ActivityType | ''>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<CreateActivityPayload>(EMPTY_FORM);

  useEffect(() => {
    fetch({ type: typeFilter || undefined });
  }, [typeFilter, fetch]);

  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await log(formData);
      setIsDrawerOpen(false);
      setFormData(EMPTY_FORM);
    } catch {
      // error surfaced via hook
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Activities</h2>
          <p className="text-[#6b7280] text-lg font-medium">Track every interaction across your CRM pipeline.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => fetch({ type: typeFilter || undefined })} className="btn-secondary px-4">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-5 h-5" />
            Log Activity
          </button>
        </div>
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-[#6b7280]" />
        <div className="flex gap-2 flex-wrap">
          {ACTIVITY_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value as ActivityType | '')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border ${
                typeFilter === t.value
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-[#6b7280] border-[#f1f1f1] hover:border-[#ddd]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700">{error}</div>
      )}

      <ActivityList activities={activities} loading={loading} emptyText="No activities logged yet. Log your first interaction above." />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Log Activity"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setIsDrawerOpen(false)} disabled={saving} className="btn-secondary flex-1">Cancel</button>
            <button form="activity-form" type="submit" disabled={saving} className="btn-primary flex-1">
              Log Activity
            </button>
          </div>
        }
      >
        <ActivityForm formData={formData} onChange={setFormData} onSubmit={handleSubmit} />
      </Drawer>
    </div>
  );
}
