import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layout, Filter, ArrowUpRight, Search, Target, DollarSign, Calendar, ChevronRight, Edit2, Trash2, User, Building, Hash } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Drawer, ConfirmDialog } from '@/src/components/ui/Modals';

interface Deal {
  id: string;
  title: string;
  customer: string;
  amount: number;
  stage: string;
  owner: string;
}

const STAGES = [
  { id: 'discovery', name: 'Discovery', color: 'bg-blue-500' },
  { id: 'qualified', name: 'Qualified', color: 'bg-purple-500' },
  { id: 'proposal', name: 'Proposal', color: 'bg-orange-500' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-indigo-500' },
  { id: 'closed', name: 'Closed Won', color: 'bg-green-500' }
];

const MOCK_DEALS: Deal[] = [
  { id: 'd1', title: 'Enterprise Migration', customer: 'Global SCM', amount: 45000, stage: 'discovery', owner: 'Eduardo' },
  { id: 'd2', title: 'API Integration', customer: 'Vertex Ltd', amount: 12000, stage: 'qualified', owner: 'Sarah' },
  { id: 'd3', title: 'Consultancy Retainer', customer: 'Strike Corp', amount: 8500, stage: 'discovery', owner: 'Eduardo' },
  { id: 'd4', title: 'Storage Expansion', customer: 'Nebula', amount: 25000, stage: 'proposal', owner: 'Mike' },
  { id: 'd5', title: 'Full Suite Setup', customer: 'Orion', amount: 95000, stage: 'negotiation', owner: 'Eduardo' },
];

export default function Pipeline() {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState<Partial<Deal>>({
    stage: 'discovery'
  });

  const getStageDeals = (stageId: string) => deals.filter(d => d.stage === stageId);
  const getStageTotal = (stageId: string) => getStageDeals(stageId).reduce((acc, d) => acc + d.amount, 0);

  const handleEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setFormData(deal);
    setIsDrawerOpen(true);
  };

  const handleDelete = () => {
    if (selectedDeal) {
      setDeals(deals.filter(d => d.id !== selectedDeal.id));
      setIsConfirmOpen(false);
      setIsDrawerOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDeal) {
      setDeals(deals.map(d => d.id === selectedDeal.id ? { ...d, ...formData } as Deal : d));
    } else {
      const newDeal: Deal = {
        ...formData as Deal,
        id: Math.random().toString(36).substr(2, 9),
        owner: 'Eduardo (Self)'
      };
      setDeals([...deals, newDeal]);
    }
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Revenue Pipeline</h2>
          <p className="text-[#6b7280] text-lg font-medium">Strategize and monitor the lifecycle of complex sales transactions.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
             <Filter className="w-4 h-4 mr-2" />
             Filters
          </button>
          <button 
            onClick={() => { setSelectedDeal(null); setFormData({ stage: 'discovery', amount: 0 }); setIsDrawerOpen(true); }}
            className="btn-primary"
          >
             <Target className="w-4 h-4 mr-2" />
             New Deal Flow
          </button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px]">
        {STAGES.map((stage, i) => (
          <div key={stage.id} className="flex-1 min-w-[320px] space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                <h3 className="font-bold text-[#111111]">{stage.name}</h3>
                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full font-bold text-[#6b7280]">
                  {getStageDeals(stage.id).length}
                </span>
              </div>
              <p className="text-xs font-bold text-[#6b7280] tabular-nums">${(getStageTotal(stage.id) / 1000).toFixed(1)}k</p>
            </div>

            <div className="space-y-4">
              {getStageDeals(stage.id).map((deal, j) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + j * 0.05 }}
                  onClick={() => handleEdit(deal)}
                  className="p-5 bg-white border border-[#f1f1f1] rounded-[24px] shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">{deal.customer}</p>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-30 transition-opacity" />
                  </div>
                  <h4 className="text-base font-bold text-[#111111] leading-tight mb-2">{deal.title}</h4>
                  <div className="flex items-end justify-between mt-6">
                    <div>
                      <p className="text-xs text-[#6b7280] font-medium">Owner</p>
                      <p className="text-xs font-bold text-black">{deal.owner}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-black">${(deal.amount / 1000).toFixed(1)}k</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {getStageDeals(stage.id).length === 0 && (
                <div className="h-32 rounded-[24px] border border-dashed border-[#f1f1f1] flex items-center justify-center">
                  <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">No Active Deals</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedDeal ? 'Refine Prospectus' : 'Initialize Deal Flow'}
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-8 h-full flex flex-col">
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-[#6b7280] uppercase tracking-widest">Deal Intelligence</label>
              <div className="relative">
                <Hash className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  required
                  className="input-field pl-12"
                  placeholder="Deal Title (e.g. Q3 Server Expansion)"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-[#6b7280] uppercase tracking-widest">Stakeholder</label>
              <div className="relative">
                <Building className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  required
                  className="input-field pl-12"
                  placeholder="Customer / Company Name"
                  value={formData.customer || ''}
                  onChange={e => setFormData({ ...formData, customer: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-[#6b7280] uppercase tracking-widest">Valuation ($)</label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                  <input
                    type="number"
                    required
                    className="input-field pl-12"
                    placeholder="0.00"
                    value={formData.amount || ''}
                    onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-[#6b7280] uppercase tracking-widest">Pipeline Stage</label>
                <select
                  className="input-field italic"
                  value={formData.stage || 'discovery'}
                  onChange={e => setFormData({ ...formData, stage: e.target.value })}
                >
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-8 border-t border-[#f1f1f1]">
            {selectedDeal && (
              <button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                className="btn-secondary border-red-100 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button type="submit" className="flex-1 btn-primary">
              {selectedDeal ? 'Synchronize Updates' : 'Commit to Pipeline'}
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Extract from Pipeline?"
        description="This will permanently delete the deal and all associated metadata."
        confirmText="Remove Deal"
        variant="danger"
      />
    </div>
  );
}

