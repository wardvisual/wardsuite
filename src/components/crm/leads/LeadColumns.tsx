import React from 'react';
import { Edit2, Trash2, Mail, Phone } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Lead, LeadStatus } from '@/src/types';
import { cn } from '@/src/lib/utils';

const STATUS_STYLES: Record<LeadStatus, string> = {
  new:       'bg-blue-50 text-blue-600 border-blue-100',
  contacted: 'bg-sky-50 text-sky-600 border-sky-100',
  qualified: 'bg-purple-50 text-purple-600 border-purple-100',
  proposal:  'bg-orange-50 text-orange-600 border-orange-100',
  won:       'bg-green-50 text-green-600 border-green-100',
  lost:      'bg-red-50 text-red-400 border-red-100',
};

export function buildLeadColumns(
  onEdit: (lead: Lead) => void,
  onDelete: (lead: Lead) => void,
): ColumnDef<Lead>[] {
  return [
    {
      accessorKey: 'fullName',
      header: 'Lead Name',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-[#111111]">{row.original.fullName}</p>
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
            <Mail className="w-3 h-3" />
            <span className="text-[12px]">{row.original.email}</span>
          </div>
          <div className="flex items-center gap-2 text-[#6b7280]">
            <Phone className="w-3 h-3" />
            <span className="text-[12px]">{row.original.phone}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => (
        <span className="text-[12px] font-medium text-[#6b7280]">{row.original.source}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={cn(
          'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
          STATUS_STYLES[row.original.status],
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
}
