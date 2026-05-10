import React, { useState, useCallback } from 'react';
import { Plus, Search, Filter, RefreshCw, UserPlus, Phone, Mail, Edit2, Trash2, Loader2, Link2, Building, Hash, LayoutGrid, List, Download, Upload, Printer, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Lead } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { DataTable } from '@/src/components/ui/DataTable';
import { Drawer, ConfirmDialog } from '@/src/components/ui/Modals';
import { ColumnDef } from '@tanstack/react-table';
import { LeadKanban } from '@/src/components/crm/LeadKanban';
import { ColumnMapper } from '@/src/components/crm/ColumnMapper';

const MOCK_LEADS: Lead[] = [
  { id: '1', code: 'LD-001', fullName: 'Alice Cooper', company: 'Cooper Corp', email: 'alice@cooper.com', phone: '+1 987 654 3210', source: 'Website', status: 'new', assignedUserId: 'u1' },
  { id: '2', code: 'LD-002', fullName: 'Bob Martin', company: 'Martin & Sons', email: 'bob@martin.com', phone: '+1 987 654 3211', source: 'Referral', status: 'qualified', assignedUserId: 'u2' },
  { id: '3', code: 'LD-003', fullName: 'Charlie Day', company: 'Paddy\'s Pub', email: 'charlie@paddys.com', phone: '+1 987 654 3212', source: 'LinkedIn', status: 'proposal', assignedUserId: 'u1' },
  { id: '4', code: 'LD-004', fullName: 'Diana Prince', company: 'Themyscira Inc', email: 'diana@amazon.com', phone: '+1 987 654 3213', source: 'Cold Call', status: 'lost', assignedUserId: 'u3' },
];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isImportDrawerOpen, setIsImportDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isMapperOpen, setIsMapperOpen] = useState(false);
  const [csvData, setCsvData] = useState<{ headers: string[], rows: string[][] }>({ headers: [], rows: [] });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({
    status: 'new'
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(l => l.split(',').map(c => c.trim()));
      
      setCsvData({ headers, rows });
      setIsMapperOpen(true);
    };
    reader.readAsText(file);
  };

  const handleImportFinalized = (mappedData: any[]) => {
    const newLeads: Lead[] = mappedData.map((d, i) => ({
      ...d,
      id: Math.random().toString(36).substr(2, 9),
      code: `LD-IMP-${i + 1}`,
      status: 'new',
      assignedUserId: 'u1'
    }));
    setLeads([...leads, ...newLeads]);
    setIsMapperOpen(false);
  };

  const handleStatusChange = (id: string, newStatus: Lead['status']) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const exportCSV = () => {
    const headers = ['Code', 'Full Name', 'Company', 'Email', 'Phone', 'Source', 'Status'];
    const rows = leads.map(l => [l.code, l.fullName, l.company, l.email, l.phone, l.source, l.status]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "wisedcrm_leads.csv");
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

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
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <h2 className="text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Leads</h2>
          <p className="text-[#6b7280] text-lg font-medium">Convert potential opportunities into valuable customers.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-gray-50 p-1 rounded-xl border border-[#f1f1f1] mr-4">
             <button 
               onClick={() => setViewMode('table')}
               className={cn("p-2 rounded-lg transition-all", viewMode === 'table' ? "bg-white text-black shadow-sm" : "text-[#6b7280] hover:text-black")}
             >
                <List className="w-4 h-4" />
             </button>
             <button 
               onClick={() => setViewMode('kanban')}
               className={cn("p-2 rounded-lg transition-all", viewMode === 'kanban' ? "bg-white text-black shadow-sm" : "text-[#6b7280] hover:text-black")}
             >
                <LayoutGrid className="w-4 h-4" />
             </button>
          </div>

          <button onClick={handlePrint} className="btn-secondary px-4">
             <Printer className="w-4 h-4" />
          </button>
          <button onClick={exportCSV} title="Export CSV" className="btn-secondary px-4">
             <Download className="w-4 h-4" />
          </button>
          <button onClick={() => setIsImportDrawerOpen(true)} className="btn-secondary px-4">
             <Upload className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => { setSelectedLead(null); setFormData({ status: 'new' }); setIsDrawerOpen(true); }}
            className="btn-primary"
          >
            <Plus className="w-5 h-5" />
            Capture Lead
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <DataTable 
          columns={columns} 
          data={leads} 
          searchTerm={searchTerm}
          onRowClick={handleEdit}
        />
      ) : (
        <LeadKanban 
          leads={leads} 
          onLeadClick={handleEdit} 
          onStatusChange={handleStatusChange} 
        />
      )}

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

      <ColumnMapper 
        isOpen={isMapperOpen}
        onClose={() => setIsMapperOpen(false)}
        csvHeaders={csvData.headers}
        csvRows={csvData.rows}
        onImport={handleImportFinalized}
      />

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

function ImportDrawer({ isOpen, onClose, onFileProcess }: { isOpen: boolean, onClose: () => void, onFileProcess: (h: string[], r: string[][]) => void }) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
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
    multiple: false 
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Secure Data Import"
    >
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tight text-black">Protocol Node: CSV Upload</h3>
          <p className="text-sm font-medium text-[#6b7280]">Initialize lead ingestion by providing a valid dataset.</p>
        </div>

        <div 
          {...getRootProps()} 
          className={cn(
            "h-80 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-all cursor-pointer",
            isDragActive ? "border-black bg-gray-50 bg-opacity-50" : "border-[#eeeeee] hover:border-[#bbbbbb] bg-[#fcfcfc]"
          )}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 rounded-[24px] bg-white shadow-xl shadow-black/5 border border-[#f8f8f8] flex items-center justify-center">
            <FileText className={cn("w-10 h-10 transition-all", isDragActive ? "text-black scale-110" : "text-[#bbbbbb]")} />
          </div>
          <div className="text-center space-y-1">
             <p className="text-sm font-black text-black uppercase tracking-widest leading-none">
               {isDragActive ? 'Release Payload' : 'Drag & Drop CSV'}
             </p>
             <p className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-widest">or click to browse filesystem</p>
          </div>
        </div>

        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4">
           <Loader2 className="w-5 h-5 text-blue-600 shrink-0" />
           <div className="space-y-1">
              <p className="text-xs font-black text-blue-900 uppercase tracking-widest leading-none">Data Normalization</p>
              <p className="text-xs font-medium text-blue-800 leading-relaxed">
                Our parsing engine will automatically detect column structures. You will be prompted to map fields in the next sequence.
              </p>
           </div>
        </div>
      </div>
    </Drawer>
  );
}
