import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, Mail, Phone, MapPin, User, Hash, Briefcase } from 'lucide-react';
import { Supplier } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { useSuppliers } from '@/src/hooks/useSuppliers';
import { DataTable } from '@/src/components/ui/DataTable';
import { Drawer, ConfirmDialog } from '@/src/components/ui/Modals';
import { ColumnDef } from '@tanstack/react-table';

export default function Suppliers() {
  const { suppliers, loading, addSupplier, deleteSupplier } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({
    status: 'active'
  });

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => <span className="font-mono font-medium text-[#111111]">{row.original.code}</span>
    },
    {
      accessorKey: 'name',
      header: 'Supplier Name',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-[#111111]">{row.original.name}</p>
          <p className="text-[11px] text-[#6b7280] font-medium uppercase tracking-widest">{row.original.email}</p>
        </div>
      )
    },
    {
      accessorKey: 'contactPerson',
      header: 'Contact Person',
      cell: ({ row }) => <span className="text-[#6b7280] font-medium">{row.original.contactPerson}</span>
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

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData(supplier);
    setIsDrawerOpen(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSupplier) {
      // Mock update
      console.log('Update', formData);
    } else {
      await addSupplier(formData as Omit<Supplier, 'id' | 'createdAt'>);
    }
    setIsDrawerOpen(false);
    setSelectedSupplier(null);
    setFormData({ status: 'active' });
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Suppliers</h2>
          <p className="text-[#6b7280] text-sm sm:text-lg font-medium">Manage and monitor your external supply chain partners.</p>
        </div>
        <button
          onClick={() => { setSelectedSupplier(null); setFormData({ status: 'active' }); setIsDrawerOpen(true); }}
          className="btn-primary shrink-0"
        >
          <Plus className="w-5 h-5" />
          New Partner
        </button>
      </div>

      <DataTable
        columns={columns}
        data={suppliers}
        showSearch
        onRowClick={handleEdit}
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedSupplier ? 'Edit Partner' : 'New Partner'}
        footer={
          <div className="flex gap-3">
             <button onClick={() => setIsDrawerOpen(false)} className="btn-secondary flex-1">Cancel</button>
             <button onClick={handleSubmit} className="btn-primary flex-1">Save Profile</button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Partner Identity</label>
              <div className="relative">
                 <Hash className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <input 
                   disabled={!!selectedSupplier}
                   className="input-theme pl-12" 
                   placeholder="CODE-XXXX" 
                   value={formData.code || ''}
                   onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                 />
              </div>
              <div className="relative">
                 <Briefcase className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <input 
                   className="input-theme pl-12" 
                   placeholder="Legal Entity Name" 
                   value={formData.name || ''}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Contact Details</label>
              <div className="relative">
                 <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <input 
                   className="input-theme pl-12" 
                   placeholder="Account Manager Name" 
                   value={formData.contactPerson || ''}
                   onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                 />
              </div>
              <div className="relative">
                 <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <input 
                   className="input-theme pl-12" 
                   placeholder="Primary Email Address" 
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

           <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Logistics Location</label>
              <div className="relative">
                 <MapPin className="w-4 h-4 absolute left-4 top-12 -translate-y-1/2 text-[#6b7280]" />
                 <textarea 
                   className="input-theme pl-12 min-h-24 py-4" 
                   placeholder="Full Street Address, City, Country" 
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
        onConfirm={() => selectedSupplier && deleteSupplier(selectedSupplier.id)}
        title="Confirm Deletion"
        description={`Are you sure you want to remove ${selectedSupplier?.name}? This action is irreversible and may affect linked inventory data.`}
        confirmText="Remove Partner"
        variant="danger"
      />
    </div>
  );
}
