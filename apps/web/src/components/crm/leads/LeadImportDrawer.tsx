import React, { useCallback } from 'react';
import { FileText, Loader2, Download } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Drawer } from '@/src/components/ui/Modals';
import { cn } from '@/src/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFileProcess: (headers: string[], rows: string[][]) => void;
}

const TEMPLATE_HEADERS = 'fullName,company,email,phone,source,notes';
const TEMPLATE_ROWS = [
  'Jane Smith,Acme Corp,jane@acme.com,+1-555-0100,Website,Follow up next week',
  'Bob Chen,TechBase Ltd,bob@techbase.io,+44-20-7946-0100,Referral,Interested in Growth plan',
].join('\n');

function downloadTemplate() {
  const csv = `${TEMPLATE_HEADERS}\n${TEMPLATE_ROWS}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'wardsuite_leads_template.csv'; a.click();
  URL.revokeObjectURL(url);
}

export function LeadImportDrawer({ isOpen, onClose, onFileProcess }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (!lines.length) return;
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(l => l.split(',').map(c => c.trim()));
      onFileProcess(headers, rows);
    };
    reader.readAsText(file);
  }, [onFileProcess]);

  // react-dropzone v15 types conflict with strict TS in some setups
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { getRootProps, getInputProps, isDragActive } = (useDropzone as any)({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Import Leads via CSV">
      <div className="p-8 space-y-6">
        {/* Template download */}
        <div className="p-4 bg-[#fafafa] border border-[#f1f1f1] rounded-2xl flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#111111]">Don't have a file yet?</p>
            <p className="text-[11px] text-[#6b7280] mt-0.5">Download the template with the correct column headers.</p>
          </div>
          <button
            type="button"
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Template
          </button>
        </div>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={cn(
            'h-56 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-5 transition-all cursor-pointer',
            isDragActive ? 'border-black bg-gray-50' : 'border-[#eeeeee] hover:border-[#bbbbbb] bg-[#fcfcfc]',
          )}
        >
          <input {...getInputProps()} />
          <div className="w-14 h-14 rounded-[18px] bg-white shadow-lg shadow-black/5 border border-[#f8f8f8] flex items-center justify-center">
            <FileText className={cn('w-7 h-7 transition-all', isDragActive ? 'text-black scale-110' : 'text-[#bbbbbb]')} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-black text-black uppercase tracking-widest">
              {isDragActive ? 'Drop CSV here' : 'Drag & Drop CSV'}
            </p>
            <p className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-widest">or click to browse</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-3">
          <Loader2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-blue-800 leading-relaxed">
            After upload you will map CSV columns to lead fields before import.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
