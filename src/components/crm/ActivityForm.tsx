import React from 'react';
import { ActivityType } from '@/src/types';
import { CreateActivityPayload } from '@/src/services/crm/activities.api';

const ENTITY_TYPES = ['lead', 'customer', 'deal'];
const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'call',    label: 'Call' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'note',    label: 'Note' },
  { value: 'email',   label: 'Email' },
];

interface Props {
  formData: CreateActivityPayload;
  onChange: (data: CreateActivityPayload) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ActivityForm({ formData, onChange, onSubmit }: Props) {
  const set = (patch: Partial<CreateActivityPayload>) => onChange({ ...formData, ...patch });

  return (
    <form id="activity-form" onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Activity Type</label>
        <div className="grid grid-cols-2 gap-2">
          {ACTIVITY_TYPES.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => set({ type: t.value })}
              className={`py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider border transition-all ${
                formData.type === t.value
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-[#6b7280] border-[#f1f1f1] hover:border-[#ddd]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Related To</label>
        <div className="grid grid-cols-3 gap-2">
          {ENTITY_TYPES.map(e => (
            <button
              key={e}
              type="button"
              onClick={() => set({ relatedEntity: e })}
              className={`py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-all ${
                formData.relatedEntity === e
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-[#6b7280] border-[#f1f1f1] hover:border-[#ddd]'
              }`}
            >
              {e.charAt(0).toUpperCase() + e.slice(1)}
            </button>
          ))}
        </div>
        <input
          required
          className="input-theme"
          placeholder="Entity ID (e.g. lead doc ID)"
          value={formData.relatedEntityId}
          onChange={e => set({ relatedEntityId: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Description</label>
        <textarea
          required
          className="input-theme min-h-[120px] resize-none"
          placeholder="Describe what happened…"
          value={formData.description}
          onChange={e => set({ description: e.target.value })}
        />
      </div>
    </form>
  );
}
