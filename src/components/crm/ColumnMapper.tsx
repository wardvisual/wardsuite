import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, ChevronRight, Hash, User, Mail, Phone, Building, Link2 } from 'lucide-react';
import { Modal } from '@/src/components/ui/Modals';
import { cn } from '@/src/lib/utils';

interface ColumnMapperProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (mappedData: any[]) => void;
  csvHeaders: string[];
  csvRows: string[][];
}

const LEAD_FIELDS = [
  { key: 'fullName', label: 'Full Name', icon: User, required: true },
  { key: 'company', label: 'Company', icon: Building, required: true },
  { key: 'email', label: 'Email', icon: Mail, required: true },
  { key: 'phone', label: 'Phone', icon: Phone, required: false },
  { key: 'source', label: 'Source', icon: Link2, required: false },
  { key: 'notes', label: 'Notes', icon: Hash, required: false },
];

export function ColumnMapper({ isOpen, onClose, onImport, csvHeaders, csvRows }: ColumnMapperProps) {
  const [mappings, setMappings] = useState<Record<string, string>>({});

  // Auto-map based on similar names
  useEffect(() => {
    const initialMappings: Record<string, string> = {};
    csvHeaders.forEach(header => {
      const lowerHeader = header.toLowerCase().replace(/[^a-z]/g, '');
      const field = LEAD_FIELDS.find(f => 
        f.key.toLowerCase() === lowerHeader || 
        f.label.toLowerCase().replace(/[^a-z]/g, '') === lowerHeader
      );
      if (field) {
        initialMappings[field.key] = header;
      }
    });
    setMappings(initialMappings);
  }, [csvHeaders]);

  const handleImport = () => {
    const mappedData = csvRows.map(row => {
      const item: any = {};
      Object.entries(mappings).forEach(([fieldKey, csvHeader]) => {
        const headerIndex = csvHeaders.indexOf(csvHeader);
        if (headerIndex !== -1) {
          item[fieldKey] = row[headerIndex];
        }
      });
      return item;
    });
    onImport(mappedData);
  };

  const isComplete = LEAD_FIELDS.filter(f => f.required).every(f => !!mappings[f.key]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Intelligence Mapping"
      className="max-w-4xl"
    >
      <div className="space-y-8">
        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex gap-4">
           <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
           </div>
           <div>
              <h4 className="text-blue-900 font-bold">Align Data Columns</h4>
              <p className="text-blue-700 text-sm font-medium mt-1">
                 Ensure your spreadsheet headers correspond to WisedCRM data fields for perfect integration.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
           {LEAD_FIELDS.map((field) => (
             <div key={field.key} className="space-y-3">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <field.icon className="w-4 h-4 text-[#6b7280]" />
                      <span className="text-sm font-bold text-[#111111]">{field.label}</span>
                      {field.required && <span className="text-red-500 text-[10px] uppercase font-black">Required</span>}
                   </div>
                </div>
                <select 
                  className={cn(
                    "w-full h-12 px-4 rounded-xl border appearance-none transition-all outline-none font-medium text-sm",
                    mappings[field.key] 
                      ? "border-green-200 bg-green-50/20 text-green-700" 
                      : "border-[#f1f1f1] bg-gray-50 text-[#6b7280]"
                  )}
                  value={mappings[field.key] || ''}
                  onChange={(e) => setMappings({ ...mappings, [field.key]: e.target.value })}
                >
                   <option value="">Select CSV Column...</option>
                   {csvHeaders.map(h => (
                     <option key={h} value={h}>{h}</option>
                   ))}
                </select>
             </div>
           ))}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-[#f1f1f1]">
           <button onClick={onClose} className="btn-secondary">Cancel</button>
           <button 
             disabled={!isComplete}
             onClick={handleImport}
             className={cn("btn-primary", !isComplete && "opacity-50 cursor-not-allowed")}
           >
              Finalize Integration
           </button>
        </div>
      </div>
    </Modal>
  );
}
