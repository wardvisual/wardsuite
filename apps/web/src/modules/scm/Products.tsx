import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, ArrowUpDown, Loader2, Package, Tag, DollarSign, Database, Hash, TrendingUp } from 'lucide-react';
import { Product } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { useProducts } from '@/src/hooks/useProducts';
import { DataTable } from '@/src/components/ui/DataTable';
import { Drawer, ConfirmDialog } from '@/src/components/ui/Modals';
import { ColumnDef } from '@tanstack/react-table';

export default function Products() {
  const { products, loading, addProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    status: 'active'
  });

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => <span className="font-mono font-medium text-[#111111]">{row.original.sku}</span>
    },
    {
      accessorKey: 'name',
      header: 'Product Details',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-[#111111]">{row.original.name}</p>
          <p className="text-[11px] text-[#6b7280] font-medium uppercase tracking-widest">{row.original.category}</p>
        </div>
      )
    },
    {
      accessorKey: 'sellingPrice',
      header: 'Price Info',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-[#111111]">${row.original.sellingPrice}</p>
          <p className="text-[11px] text-[#6b7280] font-bold uppercase tracking-widest">Cost: ${row.original.costPrice}</p>
        </div>
      )
    },
    {
      accessorKey: 'currentStock',
      header: 'Inventory',
      cell: ({ row }) => (
        <div>
          <p className={cn(
            "font-bold",
            row.original.currentStock <= row.original.reorderLevel ? "text-red-500" : "text-[#111111]"
          )}>
            {row.original.currentStock} {row.original.unit}s
          </p>
          <p className="text-[11px] text-[#6b7280] font-bold uppercase tracking-widest">Level: {row.original.reorderLevel}</p>
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

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setIsDrawerOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
       // Mock update
    } else {
       await addProduct(formData as Omit<Product, 'id' | 'createdAt'>);
    }
    setIsDrawerOpen(false);
    setSelectedProduct(null);
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
          <h2 className="text-2xl sm:text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Products</h2>
          <p className="text-[#6b7280] text-sm sm:text-lg font-medium">Manage your inventory, pricing, and stock levels.</p>
        </div>
        <button
          onClick={() => { setSelectedProduct(null); setFormData({ status: 'active' }); setIsDrawerOpen(true); }}
          className="btn-primary shrink-0"
        >
          <Plus className="w-5 h-5" />
          New Asset
        </button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        showSearch
        onRowClick={handleEdit}
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedProduct ? 'Modify Asset' : 'New Asset'}
        footer={
          <div className="flex gap-3">
             <button onClick={() => setIsDrawerOpen(false)} className="btn-secondary flex-1">Cancel</button>
             <button onClick={handleSubmit} className="btn-primary flex-1">Apply Changes</button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-8">
           <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Asset Identity</label>
              <div className="relative">
                 <Hash className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <input 
                   disabled={!!selectedProduct}
                   className="input-theme pl-12 font-mono" 
                   placeholder="SKU-XXXX" 
                   value={formData.sku || ''}
                   onChange={e => setFormData({...formData, sku: e.target.value.toUpperCase()})}
                 />
              </div>
              <div className="relative">
                 <Package className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <input 
                   className="input-theme pl-12" 
                   placeholder="Product Name" 
                   value={formData.name || ''}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                 />
              </div>
              <div className="relative">
                 <Tag className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                 <select 
                   className="input-theme pl-12 appearance-none"
                   value={formData.category || ''}
                   onChange={e => setFormData({...formData, category: e.target.value})}
                 >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Wholesale">Wholesale</option>
                 </select>
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Commercials</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                   <DollarSign className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                   <input 
                     type="number"
                     className="input-theme pl-12" 
                     placeholder="Cost Price" 
                     value={formData.costPrice || ''}
                     onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})}
                   />
                </div>
                <div className="relative">
                   <DollarSign className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                   <input 
                     type="number"
                     className="input-theme pl-12" 
                     placeholder="Selling Price" 
                     value={formData.sellingPrice || ''}
                     onChange={e => setFormData({...formData, sellingPrice: Number(e.target.value)})}
                   />
                </div>
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Stock Control</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                   <Database className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                   <input 
                     type="number"
                     className="input-theme pl-12" 
                     placeholder="Starting Stock" 
                     value={formData.currentStock || ''}
                     onChange={e => setFormData({...formData, currentStock: Number(e.target.value)})}
                   />
                </div>
                <div className="relative">
                   <TrendingUp className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                   <input 
                     type="number"
                     className="input-theme pl-12" 
                     placeholder="Reorder Level" 
                     value={formData.reorderLevel || ''}
                     onChange={e => setFormData({...formData, reorderLevel: Number(e.target.value)})}
                   />
                </div>
              </div>
           </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => selectedProduct && deleteProduct(selectedProduct.id)}
        title="Liquidate Asset Record"
        description={`Are you sure you want to delete ${selectedProduct?.name}? Historical transaction data using this SKU may be archived.`}
        confirmText="Confirm Deletion"
        variant="danger"
      />
    </div>
  );
}
