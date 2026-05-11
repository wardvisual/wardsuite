import React from 'react';
import { Clock, CheckCircle2, History, PlayCircle, User, Search, Filter, ArrowRight, Activity, Terminal, Plus, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const MOCK_LOGS = [
  { id: '1', action: 'Supplier created', entity: 'Global Tech Solutions', user: 'Jerome Bell', time: '2 mins ago', type: 'create', detail: 'Onboarded as primary logistics partner for SEA region.' },
  { id: '2', action: 'Lead status changed', entity: 'Cooper Corp', user: 'Jerome Bell', time: '15 mins ago', type: 'update', detail: 'Moved from Prospecting to Negotiation stage.' },
  { id: '3', action: 'Product updated', entity: 'MacBook Pro M2', user: 'Admin System', time: '1 hour ago', type: 'system', detail: 'Automated stock sync performed via Warehouse Integration API.' },
  { id: '4', action: 'Client Liquidation', entity: 'Old Stack Inc', user: 'Sarah Connor', time: '4 hours ago', type: 'delete', detail: 'Customer record and historical data archived.' },
];

export default function ActivityLogs() {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Audit Trails</h2>
          <p className="text-[#6b7280] text-lg font-medium">Capture every significant event across your organizational lifecycle.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
             <Filter className="w-4 h-4 mr-2" />
             Events
          </button>
          <button className="btn-primary">
             <Terminal className="w-4 h-4 mr-2" />
             Export Audit
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#f1f1f1] rounded-[32px] shadow-card overflow-hidden">
        <div className="p-8 border-b border-[#f1f1f1] flex items-center justify-between bg-gray-50/50">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
                 <History className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-sm font-bold text-black">System Chronology</p>
                 <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest leading-none mt-1">Live updates active</p>
              </div>
           </div>
           <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
              <input 
                className="pl-10 pr-4 py-2 border border-[#f1f1f1] rounded-xl text-xs font-medium focus:outline-none focus:border-black transition-all bg-white"
                placeholder="Search event detail..."
              />
           </div>
        </div>

        <div className="p-10">
           <div className="space-y-0 relative">
              <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-gray-100" />
              
              {MOCK_LOGS.map((log, i) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-12 pb-16 last:pb-0 relative group"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl border-4 border-white shadow-md flex items-center justify-center relative z-10 transition-all group-hover:scale-110",
                    log.type === 'create' ? "bg-green-50 text-green-600" :
                    log.type === 'update' ? "bg-blue-50 text-blue-600" :
                    log.type === 'delete' ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
                  )}>
                    {log.type === 'create' ? <Plus className="w-5 h-5" /> :
                     log.type === 'update' ? <Activity className="w-5 h-5" /> :
                     log.type === 'delete' ? <AlertCircle className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-[#111111]">{log.action}</h3>
                        <p className="text-sm font-medium text-[#6b7280] mt-1 italic">
                          Target Entity: <span className="text-black not-italic font-bold">{log.entity}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">{log.time}</span>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-2xl border border-[#f1f1f1] relative group-hover:bg-white transition-colors">
                       <p className="text-sm text-[#111111] leading-relaxed">
                          {log.detail}
                       </p>
                       <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-6 h-6 rounded-full bg-white border border-[#f1f1f1] flex items-center justify-center">
                                 <User className="w-3 h-3 text-black" />
                             </div>
                             <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wide">{log.user}</span>
                          </div>
                          <button className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             Inspector <ArrowRight className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
