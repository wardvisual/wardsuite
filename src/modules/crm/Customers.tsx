import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, Building2, ExternalLink, Edit2, Trash2, MapPin, Hash, User } from 'lucide-react';
import { Customer } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { DataTable } from '@/src/components/ui/DataTable';
import { Drawer, ConfirmDialog } from '@/src/components/ui/Modals';
import { ColumnDef } from '@tanstack/react-table';

const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', code: 'CUST-001', name: 'James Wilson', company: 'Wilson Group', email: 'james@wilson.com', phone: '+1 555 0101', address: '123 Business Way, NY', accountManagerId: 'u1', status: 'active' },
  { id: '2', code: 'CUST-002', name: 'Emma Watson', company: 'Granger Ltd', email: 'emma@granger.com', phone: '+1 555 0102', address: '456 Magic St, Lon', accountManagerId: 'u2', status: 'active' },
  { id: '3', code: 'CUST-003', name: 'Robert Downy', company: 'Stark Industries', email: 'tony@stark.com', phone: '+1 555 0103', address: '10880 Malibu Point, CA', accountManagerId: 'u1', status: 'inactive' },
];

export default function Customers() {
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    status: 'active'
  });

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: 'Customer Details',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-[#111111]">{row.original.name}</p>
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
          row.original.status === 'active' 
            ? "bg-green-50 text-green-600 border border-green-100" 
            : "bg-gray-50 text-gray-400 border border-gray-100"
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

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData(customer);
    setIsDrawerOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsConfirmOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDrawerOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Customers</h2>
          <p className="text-[#6b7280] text-lg font-medium">Manage your global accounts and enterprise partnerships.</p>
        </div>
        <button 
          onClick={() => { setSelectedCustomer(null); setFormData({ status: 'active' }); setIsDrawerOpen(true); }}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          New Customer
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={customers} 
        searchTerm={searchTerm}
        onRowClick={handleEdit}
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedCustomer ? 'Account Details' : 'Onboard Customer'}
        footer={
          <div className="flex gap-3">
             <button onClick={() => setIsDrawerOpen(false)} className="btn-secondary flex-1">Cancel</button>
             <button onClick={handleSubmit} className="btn-primary flex-1">Save Profile</button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-8">
           <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Contact Information</label>
              <div className="relative">
                 <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <input 
                   className="input-theme pl-12" 
                   placeholder="Primary Contact" 
                   value={formData.name || ''}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                 />
              </div>
              <div className="relative">
                 <Building2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <input 
                   className="input-theme pl-12" 
                   placeholder="Entity Name" 
                   value={formData.company || ''}
                   onChange={e => setFormData({...formData, company: e.target.value})}
                 />
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Reachability</label>
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
                   placeholder="International Format Phone" 
                   value={formData.phone || ''}
                   onChange={e => setFormData({...formData, phone: e.target.value})}
                 />
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Address</label>
              <div className="relative">
                 <MapPin className="w-4 h-4 absolute left-4 top-12 -translate-y-1/2 text-[#6b7280]" />
                 <textarea 
                   className="input-theme pl-12 min-h-24 py-4" 
                   placeholder="Physical Location" 
                   value={formData.address || ''}
                   onChange={e => setFormData({...formData, address: e.target.value})}
                 />
              </div>
           </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => console.log('Delete', selectedCustomer?.id)}
        title="Offboard Account"
        description={`Are you sure you want to delete ${selectedCustomer?.name}? This will archive all associated transaction history.`}
        confirmText="Remove Account"
        variant="danger"
      />
    </div>
  );
}
