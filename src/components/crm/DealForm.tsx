import React from 'react';
import { Hash, DollarSign, Calendar, Trash2 } from 'lucide-react';
import { Deal, Customer } from '@/src/types';
import { CreateDealPayload } from '@/src/services/crm/deals.api';

const STAGES: { id: Deal['stage']; name: string }[] = [
  { id: 'open',        name: 'Open' },
  { id: 'proposal',   name: 'Proposal' },
  { id: 'negotiation',name: 'Negotiation' },
  { id: 'won',        name: 'Won' },
  { id: 'lost',       name: 'Lost' },
];

interface Props {
  formData: Partial<CreateDealPayload>;
  onChange: (data: Partial<CreateDealPayload>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  customers: Customer[];
  isEditing: boolean;
  saving: boolean;
}

export function DealForm({ formData, onChange, onSubmit, onDelete, customers, isEditing, saving }: Props) {
  const set = (patch: Partial<CreateDealPayload>) => onChange({ ...formData, ...patch });

  return (
    <form id="deal-form" onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Deal Title</label>
        <div className="relative">
          <Hash className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            required
            className="input-theme pl-12"
            placeholder="e.g. Q3 Enterprise Expansion"
            value={formData.title ?? ''}
            onChange={e => set({ title: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Customer</label>
        <select
          required
          className="input-theme appearance-none"
          value={formData.customerId ?? ''}
          onChange={e => set({ customerId: e.target.value })}
        >
          <option value="">Select Customer</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name} — {c.company}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Value ($)</label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
            <input
              required
              type="number"
              min="0"
              className="input-theme pl-12"
              placeholder="0.00"
              value={formData.amount ?? ''}
              onChange={e => set({ amount: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Stage</label>
          <select
            className="input-theme appearance-none"
            value={formData.stage ?? 'open'}
            onChange={e => set({ stage: e.target.value as Deal['stage'] })}
          >
            {STAGES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Expected Close Date</label>
        <div className="relative">
          <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            required
            type="date"
            className="input-theme pl-12"
            value={formData.expectedCloseDate ?? ''}
            onChange={e => set({ expectedCloseDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Notes</label>
        <textarea
          className="input-theme min-h-[80px] resize-none"
          placeholder="Additional context…"
          value={formData.notes ?? ''}
          onChange={e => set({ notes: e.target.value })}
        />
      </div>

      {isEditing && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={saving}
          className="w-full btn-secondary border-red-100 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Remove Deal
        </button>
      )}
    </form>
  );
}
