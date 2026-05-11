import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, Edit2, Trash2, Loader2 } from 'lucide-react';
import { Customer } from '@/src/types';
import { CreateCustomerPayload } from '@/src/services/crm/customers.api';
import { useCustomers } from '@/src/hooks/crm/useCustomers';
import { CustomerForm } from '@/src/components/crm/CustomerForm';
import { DataTable } from '@/src/components/ui/DataTable';
import { Drawer, ConfirmDialog } from '@/src/components/ui/Modals';
import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/src/lib/utils';

const EMPTY_FORM: CreateCustomerPayload = {
  name: '', company: '', email: '', phone: '', address: '', status: 'active',
};

const columns = (
  onEdit: (c: Customer) => void,
  onDelete: (c: Customer) => void,
): ColumnDef<Customer>[] => [
  {
    accessorKey: 'name',
    header: 'Customer Details',
    cell: ({ row }) => (
      <div>
        <p className="font-bold text-[#111111]">{row.original.name}</p>
        <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest">{row.original.code}</p>
      </div>
    ),
  },
  {
    accessorKey: 'company',
    header: 'Organization',
    cell: ({ row }) => <span className="font-medium text-[#111111]">{row.original.company}</span>,
  },
  {
    accessorKey: 'contact',
    header: 'Contact Info',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[#6b7280]">
          <Mail className="w-3 h-3" /><span className="text-[12px]">{row.original.email}</span>
        </div>
        <div className="flex items-center gap-2 text-[#6b7280]">
          <Phone className="w-3 h-3" /><span className="text-[12px]">{row.original.phone}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span className={cn(
        'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
        row.original.status === 'active'
          ? 'bg-green-50 text-green-600 border-green-100'
          : 'bg-gray-50 text-gray-400 border-gray-100',
      )}>
        {row.original.status}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={e => { e.stopPropagation(); onEdit(row.original); }}
          className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-[#f1f1f1] text-[#6b7280] hover:text-black transition-all"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(row.original); }}
          className="p-2 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 text-[#6b7280] hover:text-red-600 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];

export default function Customers() {
  const { customers, loading, saving, error, fetch, create, update, remove } = useCustomers();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<CreateCustomerPayload>>(EMPTY_FORM);

  const openCreate = () => {
    setSelected(null);
    setFormData(EMPTY_FORM);
    setIsDrawerOpen(true);
  };

  const openEdit = (c: Customer) => {
    setSelected(c);
    setFormData({ name: c.name, company: c.company, email: c.email, phone: c.phone, address: c.address, status: c.status });
    setIsDrawerOpen(true);
  };

  const openDelete = (c: Customer) => {
    setSelected(c);
    setIsConfirmOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelected(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selected) {
        await update(selected.id, formData as CreateCustomerPayload);
      } else {
        await create(formData as CreateCustomerPayload);
      }
      closeDrawer();
    } catch {
      // error shown via hook state
    }
  };

  const handleConfirmDelete = async () => {
    if (!selected) return;
    try {
      await remove(selected.id);
      setIsConfirmOpen(false);
      setSelected(null);
    } catch {
      // error shown via hook state
    }
  };

  const filtered = customers.filter(c => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Customers</h2>
          <p className="text-[#6b7280] text-sm sm:text-lg font-medium">Manage your global accounts and enterprise partnerships.</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0">
          <Plus className="w-5 h-5" />
          New Customer
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
        <input
          className="input-theme pl-11 w-full"
          placeholder="Search by name, company or email…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-[#6b7280]">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />Loading customers…
        </div>
      ) : (
        <DataTable columns={columns(openEdit, openDelete)} data={filtered} searchTerm="" onRowClick={openEdit} />
      )}

      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={selected ? 'Account Details' : 'Onboard Customer'}
        footer={
          <div className="flex gap-3">
            <button onClick={closeDrawer} disabled={saving} className="btn-secondary flex-1">Cancel</button>
            <button form="customer-form" type="submit" disabled={saving} className="btn-primary flex-1">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {selected ? 'Save Changes' : 'Create Customer'}
            </button>
          </div>
        }
      >
        <CustomerForm formData={formData} onChange={setFormData} onSubmit={handleSubmit} />
      </Drawer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => { setIsConfirmOpen(false); setSelected(null); }}
        onConfirm={handleConfirmDelete}
        title="Offboard Account"
        description={`Remove ${selected?.name}? This will archive all associated history.`}
        confirmText="Remove Account"
        variant="danger"
      />
    </div>
  );
}
