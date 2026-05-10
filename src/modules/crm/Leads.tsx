import React, { useState, useCallback, useEffect } from 'react';
import {
  Plus, Search, Mail, Phone, Edit2, Trash2, Loader2,
  UserPlus, Link2, Building, LayoutGrid, List,
  Download, Upload, Printer, FileText, RefreshCw,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Lead, LeadStatus } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { DataTable } from '@/src/components/ui/DataTable';
import { Drawer, ConfirmDialog } from '@/src/components/ui/Modals';
import { ColumnDef } from '@tanstack/react-table';
import { LeadKanban } from '@/src/components/crm/LeadKanban';
import { ColumnMapper } from '@/src/components/crm/ColumnMapper';
import { leadsApi, CreateLeadPayload, UpdateLeadPayload } from '@/src/services/crm/leads.api';

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-blue-50 text-blue-600 border-blue-100',
  contacted: 'bg-sky-50 text-sky-600 border-sky-100',
  qualified: 'bg-purple-50 text-purple-600 border-purple-100',
  proposal: 'bg-orange-50 text-orange-600 border-orange-100',
  won: 'bg-green-50 text-green-600 border-green-100',
  lost: 'bg-red-50 text-red-400 border-red-100',
};

const LEAD_SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Call', 'Event', 'Partner'];
const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

const EMPTY_FORM: CreateLeadPayload = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  source: '',
  status: 'new',
  notes: '',
};

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isImportDrawerOpen, setIsImportDrawerOpen] = useState(false);
  const [isMapperOpen, setIsMapperOpen] = useState(false);

  const [csvData, setCsvData] = useState<{ headers: string[]; rows: string[][] }>({ headers: [], rows: [] });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<CreateLeadPayload>(EMPTY_FORM);

  // ─── Data fetching ────────────────────────────────────────────────────────

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await leadsApi.list({
        status: statusFilter || undefined,
        search: searchTerm || undefined,
      });
      setLeads(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ─── CRUD handlers ────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (selectedLead) {
        const payload: UpdateLeadPayload = {
          fullName: formData.fullName,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          source: formData.source,
          status: formData.status,
          notes: formData.notes,
        };
        const res = await leadsApi.update(selectedLead.id, payload);
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? res.data : l));
      } else {
        const res = await leadsApi.create(formData);
        setLeads(prev => [res.data, ...prev]);
      }
      closeDrawer();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lead');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedLead) return;
    setSaving(true);
    try {
      await leadsApi.remove(selectedLead.id);
      setLeads(prev => prev.filter(l => l.id !== selectedLead.id));
      setIsConfirmOpen(false);
      setSelectedLead(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lead');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      const res = await leadsApi.update(id, { status: newStatus });
      setLeads(prev => prev.map(l => l.id === id ? res.data : l));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  // ─── UI helpers ───────────────────────────────────────────────────────────

  const openCreate = () => {
    setSelectedLead(null);
    setFormData(EMPTY_FORM);
    setIsDrawerOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      fullName: lead.fullName,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      notes: lead.notes ?? '',
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setIsConfirmOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedLead(null);
    setFormData(EMPTY_FORM);
  };

  // ─── CSV ──────────────────────────────────────────────────────────────────

  const exportCSV = () => {
    const headers = ['Code', 'Full Name', 'Company', 'Email', 'Phone', 'Source', 'Status'];
    const rows = leads.map(l => [l.code, l.fullName, l.company, l.email, l.phone, l.source, l.status]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wardsuite_leads.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFinalized = async (mappedData: Record<string, string>[]) => {
    setSaving(true);
    setError(null);
    try {
      const created = await Promise.all(
        mappedData.map(d =>
          leadsApi.create({
            fullName: d.fullName ?? d.name ?? '',
            company: d.company ?? '',
            email: d.email ?? '',
            phone: d.phone ?? '',
            source: d.source ?? 'Import',
            status: 'new',
          })
        )
      );
      setLeads(prev => [...created.map(r => r.data), ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setSaving(false);
      setIsMapperOpen(false);
    }
  };

  // ─── Table columns ────────────────────────────────────────────────────────

  const columns: ColumnDef<Lead>[] = [
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
            onClick={e => { e.stopPropagation(); handleEdit(row.original); }}
            className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-[#f1f1f1] text-[#6b7280] hover:text-black transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); handleDelete(row.original); }}
            className="p-2 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 text-[#6b7280] hover:text-red-600 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <h2 className="text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Leads</h2>
          <p className="text-[#6b7280] text-lg font-medium">Convert potential opportunities into valuable customers.</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* View toggle */}
          <div className="flex bg-gray-50 p-1 rounded-xl border border-[#f1f1f1]">
            <button
              onClick={() => setViewMode('table')}
              className={cn('p-2 rounded-lg transition-all', viewMode === 'table' ? 'bg-white text-black shadow-sm' : 'text-[#6b7280] hover:text-black')}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={cn('p-2 rounded-lg transition-all', viewMode === 'kanban' ? 'bg-white text-black shadow-sm' : 'text-[#6b7280] hover:text-black')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button onClick={fetchLeads} className="btn-secondary px-4" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => window.print()} className="btn-secondary px-4" title="Print">
            <Printer className="w-4 h-4" />
          </button>
          <button onClick={exportCSV} className="btn-secondary px-4" title="Export CSV">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={() => setIsImportDrawerOpen(true)} className="btn-secondary px-4" title="Import CSV">
            <Upload className="w-4 h-4" />
          </button>

          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-5 h-5" />
            Capture Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            className="input-theme pl-11 w-full"
            placeholder="Search by name, company or email…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="input-theme w-auto"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as LeadStatus | '')}
        >
          <option value="">All Statuses</option>
          {LEAD_STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-[#6b7280]">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />
          Loading leads…
        </div>
      ) : viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={leads}
          searchTerm=""
          onRowClick={handleEdit}
        />
      ) : (
        <LeadKanban
          leads={leads}
          onLeadClick={handleEdit}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Create / Edit Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={selectedLead ? 'Edit Lead' : 'New Lead'}
        footer={
          <div className="flex gap-3">
            <button onClick={closeDrawer} className="btn-secondary flex-1" disabled={saving}>
              Cancel
            </button>
            <button onClick={handleSubmit as any} className="btn-primary flex-1" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {selectedLead ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">Contact Profile</label>
            <div className="relative">
              <UserPlus className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
              <input
                required
                className="input-theme pl-12"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={e => setFormData(d => ({ ...d, fullName: e.target.value }))}
              />
            </div>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
              <input
                required
                className="input-theme pl-12"
                placeholder="Company / Organization"
                value={formData.company}
                onChange={e => setFormData(d => ({ ...d, company: e.target.value }))}
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
                onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
              />
            </div>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
              <input
                required
                className="input-theme pl-12"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))}
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
                onChange={e => setFormData(d => ({ ...d, source: e.target.value }))}
              >
                <option value="">Select Source</option>
                {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {selectedLead && (
              <select
                className="input-theme appearance-none"
                value={formData.status}
                onChange={e => setFormData(d => ({ ...d, status: e.target.value as LeadStatus }))}
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
              value={formData.notes}
              onChange={e => setFormData(d => ({ ...d, notes: e.target.value }))}
            />
          </div>
        </form>
      </Drawer>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => { setIsConfirmOpen(false); setSelectedLead(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Lead"
        description={`Are you sure you want to delete ${selectedLead?.fullName}? This action cannot be undone.`}
        confirmText="Delete Lead"
        variant="danger"
      />

      {/* Column Mapper */}
      <ColumnMapper
        isOpen={isMapperOpen}
        onClose={() => setIsMapperOpen(false)}
        csvHeaders={csvData.headers}
        csvRows={csvData.rows}
        onImport={handleImportFinalized}
      />

      {/* Import Drawer */}
      <ImportDrawer
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

// ─── Import Drawer ────────────────────────────────────────────────────────────

function ImportDrawer({
  isOpen,
  onClose,
  onFileProcess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onFileProcess: (headers: string[], rows: string[][]) => void;
}) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length === 0) return;
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(l => l.split(',').map(c => c.trim()));
      onFileProcess(headers, rows);
    };
    reader.readAsText(file);
  }, [onFileProcess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Import Leads via CSV">
      <div className="p-8 space-y-8">
        <div
          {...getRootProps()}
          className={cn(
            'h-72 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-all cursor-pointer',
            isDragActive
              ? 'border-black bg-gray-50'
              : 'border-[#eeeeee] hover:border-[#bbbbbb] bg-[#fcfcfc]',
          )}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 rounded-[20px] bg-white shadow-lg shadow-black/5 border border-[#f8f8f8] flex items-center justify-center">
            <FileText className={cn('w-8 h-8 transition-all', isDragActive ? 'text-black scale-110' : 'text-[#bbbbbb]')} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-black text-black uppercase tracking-widest">
              {isDragActive ? 'Drop CSV here' : 'Drag & Drop CSV'}
            </p>
            <p className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-widest">or click to browse</p>
          </div>
        </div>

        <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-3">
          <Loader2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-blue-800 leading-relaxed">
            After upload you will map CSV columns to lead fields before import.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
