import React from 'react';
import { User, Building2, Mail, Phone, MapPin } from 'lucide-react';
import { Customer } from '@/src/types';
import { CreateCustomerPayload } from '@/src/services/crm/customers.api';

interface Props {
  formData: Partial<CreateCustomerPayload>;
  onChange: (data: Partial<CreateCustomerPayload>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CustomerForm({ formData, onChange, onSubmit }: Props) {
  const set = (patch: Partial<CreateCustomerPayload>) => onChange({ ...formData, ...patch });

  return (
    <form id="customer-form" onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Contact Information</label>
        <div className="relative">
          <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            required
            className="input-theme pl-12"
            placeholder="Primary Contact"
            value={formData.name ?? ''}
            onChange={e => set({ name: e.target.value })}
          />
        </div>
        <div className="relative">
          <Building2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            required
            className="input-theme pl-12"
            placeholder="Entity Name"
            value={formData.company ?? ''}
            onChange={e => set({ company: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Reachability</label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            required
            type="email"
            className="input-theme pl-12"
            placeholder="Direct Email Address"
            value={formData.email ?? ''}
            onChange={e => set({ email: e.target.value })}
          />
        </div>
        <div className="relative">
          <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            required
            className="input-theme pl-12"
            placeholder="International Format Phone"
            value={formData.phone ?? ''}
            onChange={e => set({ phone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Address</label>
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-4 top-5 text-[#6b7280]" />
          <textarea
            className="input-theme pl-12 min-h-24 py-4"
            placeholder="Physical Location"
            value={formData.address ?? ''}
            onChange={e => set({ address: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Status</label>
        <select
          className="input-theme appearance-none"
          value={formData.status ?? 'active'}
          onChange={e => set({ status: e.target.value as Customer['status'] })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </form>
  );
}
