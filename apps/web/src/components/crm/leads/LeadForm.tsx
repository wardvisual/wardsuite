import React from 'react';
import { UserPlus, Building, Mail, Phone, Link2 } from 'lucide-react';
import { Lead, LeadStatus } from '@/src/types';
import { CreateLeadPayload } from '@/src/services/crm/leads.api';

const LEAD_SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Call', 'Event', 'Partner'];
const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

interface Props {
  formData: CreateLeadPayload;
  onChange: (data: CreateLeadPayload) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

export function LeadForm({ formData, onChange, onSubmit, isEditing }: Props) {
  const set = (patch: Partial<CreateLeadPayload>) => onChange({ ...formData, ...patch });

  return (
    <form id="lead-form" onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Contact Profile</label>
        <div className="relative">
          <UserPlus className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            required
            className="input-theme pl-12"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={e => set({ fullName: e.target.value })}
          />
        </div>
        <div className="relative">
          <Building className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            required
            className="input-theme pl-12"
            placeholder="Company / Organization"
            value={formData.company}
            onChange={e => set({ company: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Communications</label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            required
            type="email"
            className="input-theme pl-12"
            placeholder="Email Address"
            value={formData.email}
            onChange={e => set({ email: e.target.value })}
          />
        </div>
        <div className="relative">
          <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            required
            className="input-theme pl-12"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={e => set({ phone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Acquisition</label>
        <div className="relative">
          <Link2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <select
            required
            className="input-theme pl-12 appearance-none"
            value={formData.source}
            onChange={e => set({ source: e.target.value })}
          >
            <option value="">Select Source</option>
            {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {isEditing && (
          <select
            className="input-theme appearance-none"
            value={formData.status}
            onChange={e => set({ status: e.target.value as LeadStatus })}
          >
            {LEAD_STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Notes</label>
        <textarea
          className="input-theme min-h-[80px] resize-none"
          placeholder="Additional notes…"
          value={formData.notes ?? ''}
          onChange={e => set({ notes: e.target.value })}
        />
      </div>
    </form>
  );
}
