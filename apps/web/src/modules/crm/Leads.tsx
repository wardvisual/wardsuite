import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Loader2, List, LayoutGrid,
  Download, Upload, Printer, RefreshCw,
} from 'lucide-react';
import { Lead, LeadStatus } from '@/src/types';
import { CreateLeadPayload } from '@/src/services/crm/leads.api';
import { useLeads } from '@/src/hooks/crm/useLeads';
import { LeadForm } from '@/src/components/crm/leads/LeadForm';
import { buildLeadColumns } from '@/src/components/crm/leads/LeadColumns';
import { LeadImportDrawer } from '@/src/components/crm/leads/LeadImportDrawer';
import { LeadKanban } from '@/src/components/crm/LeadKanban';
import { ColumnMapper } from '@/src/components/crm/ColumnMapper';
import { DataTable } from '@/src/components/ui/DataTable';
import { Drawer, ConfirmDialog } from '@/src/components/ui/Modals';
import { cn } from '@/src/lib/utils';

const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

const EMPTY_FORM: CreateLeadPayload = {
  fullName: '', company: '', email: '', phone: '', source: '', status: 'new', notes: '',
};

export default function Leads() {
  const { leads, loading, saving, error, fetch, create, update, remove, updateStatus, importBatch } = useLeads();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isImportDrawerOpen, setIsImportDrawerOpen] = useState(false);
  const [isMapperOpen, setIsMapperOpen] = useState(false);

  const [csvData, setCsvData] = useState<{ headers: string[]; rows: string[][] }>({ headers: [], rows: [] });
  const [selected, setSelected] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<CreateLeadPayload>(EMPTY_FORM);

  useEffect(() => {
    fetch({ status: statusFilter || undefined, search: searchTerm || undefined });
  }, [statusFilter, searchTerm, fetch]);

  const openCreate = () => {
    setSelected(null);
    setFormData(EMPTY_FORM);
    setIsDrawerOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setSelected(lead);
    setFormData({ fullName: lead.fullName, company: lead.company, email: lead.email, phone: lead.phone, source: lead.source, status: lead.status, notes: lead.notes ?? '' });
    setIsDrawerOpen(true);
  };

  const openDelete = (lead: Lead) => {
    setSelected(lead);
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
        await update(selected.id, formData);
      } else {
        await create(formData);
      }
      closeDrawer();
    } catch {
      // error surfaced via hook
    }
  };

  const handleConfirmDelete = async () => {
    if (!selected) return;
    try {
      await remove(selected.id);
      setIsConfirmOpen(false);
      setSelected(null);
    } catch {
      // error surfaced via hook
    }
  };

  const exportCSV = () => {
    const headers = ['Code', 'Full Name', 'Company', 'Email', 'Phone', 'Source', 'Status'];
    const rows = leads.map(l => [l.code, l.fullName, l.company, l.email, l.phone, l.source, l.status]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'wardsuite_leads.csv'; link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFinalized = async (mappedData: Record<string, string>[]) => {
    await importBatch(mappedData.map(d => ({
      fullName: d.fullName ?? d.name ?? '',
      company: d.company ?? '',
      email: d.email ?? '',
      phone: d.phone ?? '',
      source: d.source ?? 'Import',
      status: 'new',
    })));
    setIsMapperOpen(false);
  };

  const tableColumns = buildLeadColumns(openEdit, openDelete);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <h2 className="text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Leads</h2>
          <p className="text-[#6b7280] text-lg font-medium">Convert potential opportunities into valuable customers.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex bg-gray-50 p-1 rounded-xl border border-[#f1f1f1]">
            <button onClick={() => setViewMode('table')} className={cn('p-2 rounded-lg transition-all', viewMode === 'table' ? 'bg-white text-black shadow-sm' : 'text-[#6b7280] hover:text-black')}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('kanban')} className={cn('p-2 rounded-lg transition-all', viewMode === 'kanban' ? 'bg-white text-black shadow-sm' : 'text-[#6b7280] hover:text-black')}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => fetch({ status: statusFilter || undefined, search: searchTerm || undefined })} className="btn-secondary px-4"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => window.print()} className="btn-secondary px-4"><Printer className="w-4 h-4" /></button>
          <button onClick={exportCSV} className="btn-secondary px-4"><Download className="w-4 h-4" /></button>
          <button onClick={() => setIsImportDrawerOpen(true)} className="btn-secondary px-4"><Upload className="w-4 h-4" /></button>
          <button onClick={openCreate} className="btn-primary"><Plus className="w-5 h-5" />Capture Lead</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input className="input-theme pl-11 w-full" placeholder="Search by name, company or email…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="input-theme w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value as LeadStatus | '')}>
          <option value="">All Statuses</option>
          {LEAD_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-[#6b7280]">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />Loading leads…
        </div>
      ) : viewMode === 'table' ? (
        <DataTable columns={tableColumns} data={leads} searchTerm="" onRowClick={openEdit} />
      ) : (
        <LeadKanban leads={leads} onLeadClick={openEdit} onStatusChange={updateStatus} />
      )}

      {/* Create / Edit Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={selected ? 'Edit Lead' : 'New Lead'}
        footer={
          <div className="flex gap-3">
            <button onClick={closeDrawer} disabled={saving} className="btn-secondary flex-1">Cancel</button>
            <button form="lead-form" type="submit" disabled={saving} className="btn-primary flex-1">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {selected ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        }
      >
        <LeadForm formData={formData} onChange={setFormData} onSubmit={handleSubmit} isEditing={!!selected} />
      </Drawer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => { setIsConfirmOpen(false); setSelected(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Lead"
        description={`Delete ${selected?.fullName}? This action cannot be undone.`}
        confirmText="Delete Lead"
        variant="danger"
      />

      <ColumnMapper
        isOpen={isMapperOpen}
        onClose={() => setIsMapperOpen(false)}
        csvHeaders={csvData.headers}
        csvRows={csvData.rows}
        onImport={handleImportFinalized}
      />

      <LeadImportDrawer
        isOpen={isImportDrawerOpen}
        onClose={() => setIsImportDrawerOpen(false)}
        onFileProcess={(headers, rows) => {
          setCsvData({ headers, rows });
          setIsImportDrawerOpen(false);
          setIsMapperOpen(true);
        }}
      />
    </div>
  );
}
