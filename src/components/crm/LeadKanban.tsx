import React from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { Lead } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { Phone, Mail, Building, User, Target } from 'lucide-react';

interface LeadKanbanProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onStatusChange: (leadId: string, newStatus: Lead['status']) => void;
}

const STAGES: { id: Lead['status']; label: string; color: string }[] = [
  { id: 'new', label: 'New', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-purple-500' },
  { id: 'qualified', label: 'Qualified', color: 'bg-orange-500' },
  { id: 'proposal', label: 'Proposal', color: 'bg-indigo-500' },
  { id: 'won', label: 'Won', color: 'bg-green-500' },
  { id: 'lost', label: 'Lost', color: 'bg-red-500' }
];

export function LeadKanban({ leads, onLeadClick, onStatusChange }: LeadKanbanProps) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px]">
      {STAGES.map((stage) => {
        const stageLeads = leads.filter(l => l.status === stage.id);
        
        return (
          <div key={stage.id} className="flex-1 min-w-[320px] space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                <h3 className="font-bold text-[#111111]">{stage.label}</h3>
                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full font-bold text-[#6b7280]">
                  {stageLeads.length}
                </span>
              </div>
            </div>

            <div className="space-y-4 min-h-[100px]">
              <AnimatePresence mode="popLayout">
                {stageLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    layoutId={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => onLeadClick(lead)}
                    className="p-5 bg-white border border-[#f8f8f8] rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black text-[#6b7280] uppercase tracking-[0.2em]">
                          {lead.code}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-[#f1f1f1] group-hover:bg-black group-hover:text-white transition-colors">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-[#111111] leading-tight">{lead.fullName}</h4>
                        <p className="text-xs text-[#6b7280] font-medium mt-1">{lead.company}</p>
                      </div>

                      <div className="pt-4 border-t border-[#f1f1f1] flex flex-wrap gap-2">
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6b7280] bg-gray-50 px-2 py-0.5 rounded-md">
                            <Mail className="w-2.5 h-2.5" />
                            {lead.email.split('@')[0]}
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6b7280] bg-gray-50 px-2 py-0.5 rounded-md">
                            <Target className="w-2.5 h-2.5" />
                            {lead.source}
                         </div>
                      </div>

                      <div className="pt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {STAGES.filter(s => s.id !== lead.status).slice(0, 3).map(s => (
                          <button
                            key={s.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(lead.id, s.id as Lead['status']);
                            }}
                            className="text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded bg-gray-50 hover:bg-black hover:text-white transition-colors"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {stageLeads.length === 0 && (
                <div className="h-24 rounded-[24px] border border-dashed border-[#f1f1f1] flex items-center justify-center">
                  <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Drop here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
