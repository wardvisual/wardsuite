import React, { useState } from 'react';
import { Plus, Search, Filter, RefreshCw, UserPlus, Phone, Mail, Edit2, Trash2, Loader2, Link2, Building, Hash } from 'lucide-react';
import { Lead } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { DataTable } from '@/src/components/ui/DataTable';
import { Drawer, ConfirmDialog } from '@/src/components/ui/Modals';
import { ColumnDef } from '@tanstack/react-table';

const MOCK_LEADS: Lead[] = [
  { id: '1', code: 'LD-001', fullName: 'Alice Cooper', company: 'Cooper Corp', email: 'alice@cooper.com', phone: '+1 987 654 3210', source: 'Website', status: 'new', assignedUserId: 'u1' },
  { id: '2', code: 'LD-002', fullName: 'Bob Martin', company: 'Martin & Sons', email: 'bob@martin.com', phone: '+1 987 654 3211', source: 'Referral', status: 'qualified', assignedUserId: 'u2' },
  { id: '3', code: 'LD-003', fullName: 'Charlie Day', company: 'Paddy\'s Pub', email: 'charlie@paddys.com', phone: '+1 987 654 3212', source: 'LinkedIn', status: 'proposal', assignedUserId: 'u1' },
  { id: '4', code: 'LD-004', fullName: 'Diana Prince', company: 'Themyscira Inc', email: 'diana@amazon.com', phone: '+1 987 654 3213', source: 'Cold Call', status: 'lost', assignedUserId: 'u3' },
];

export default function Leads() {
  const [leads] = useState<Lead[]>(MOCK_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({
    status: 'new'
  });

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'fullName',
      header: 'Lead Name',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-[#111111]">{row.original.fullName}</p>
          <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest">{row.original.code}</p>
        </div>
      )
    },
    {
      accessorKey: 'company',
      header: 'Organization',
      cell: ({ row }) => <span className="font-medium text-[#111111]">{row.original.company}</span>
    },
    {
      accessorKey: 'contact',
      header: 'Contact Info',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#6b7280]">
            <Mail className="w-3 h-3" />
            <span className="text-[12px]">{row.original.email}</span>
          </div>
          <div className="flex items-center gap-2 text-[#6b7280]">
            <Phone className="w-3 h-3" />
            <span className="text-[12px]">{row.original.phone}</span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          {
            'bg-blue-50 text-blue-500 border border-blue-100': row.original.status === 'new',
            'bg-purple-50 text-purple-500 border border-purple-100': row.original.status === 'qualified',
            'bg-orange-50 text-orange-500 border border-orange-100': row.original.status === 'proposal',
            'bg-red-50 text-red-400 border border-red-100': row.original.status === 'lost',
          }
        )}>
          {row.original.status}
        </span>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button 
            onClick={(e) => { e.stopPropagation(); handleEdit(row.original); }}
            className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-[#f1f1f1] text-[#6b7280] hover:text-black transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(row.original); }}
            className="p-2 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 text-[#6b7280] hover:text-red-600 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData(lead);
    setIsDrawerOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setIsConfirmOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDrawerOpen(false);
    setSelectedLead(null);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Leads</h2>
          <p className="text-[#6b7280] text-lg font-medium">Convert potential opportunities into valuable customers.</p>
        </div>
        <button 
          onClick={() => { setSelectedLead(null); setFormData({ status: 'new' }); setIsDrawerOpen(true); }}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Capture Lead
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={leads} 
        searchTerm={searchTerm}
        onRowClick={handleEdit}
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedLead ? 'Lead Intelligence' : 'New Prospect'}
        footer={
          <div className="flex gap-3">
             <button onClick={() => setIsDrawerOpen(false)} className="btn-secondary flex-1">Cancel</button>
             <button onClick={handleSubmit} className="btn-primary flex-1">Save Lead</button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-8">
           <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Contact Profile</label>
              <div className="relative">
                 <UserPlus className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <input 
                   className="input-theme pl-12" 
                   placeholder="Full Legal Name" 
                   value={formData.fullName || ''}
                   onChange={e => setFormData({...formData, fullName: e.target.value})}
                 />
              </div>
              <div className="relative">
                 <Building className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <input 
                   className="input-theme pl-12" 
                   placeholder="Company / Organization" 
                   value={formData.company || ''}
                   onChange={e => setFormData({...formData, company: e.target.value})}
                 />
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Communications</label>
              <div className="relative">
                 <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <input 
                   className="input-theme pl-12" 
                   placeholder="Direct Email Address" 
                   value={formData.email || ''}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                 />
              </div>
              <div className="relative">
                 <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <input 
                   className="input-theme pl-12" 
                   placeholder="Primary Phone Number" 
                   value={formData.phone || ''}
                   onChange={e => setFormData({...formData, phone: e.target.value})}
                 />
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Acquisition</label>
              <div className="relative">
                 <Link2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <select 
                   className="input-theme pl-12 appearance-none"
                   value={formData.source || ''}
                   onChange={e => setFormData({...formData, source: e.target.value})}
                 >
                    <option value="">Select Inbound Source</option>
                    <option value="Website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                 </select>
              </div>
           </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => console.log('Delete', selectedLead?.id)}
        title="Discard Prospect"
        description={`Are you sure you want to delete ${selectedLead?.fullName}? All activity logs for this lead will be permanently removed.`}
        confirmText="Remove Prospect"
        variant="danger"
      />
    </div>
  );
}
