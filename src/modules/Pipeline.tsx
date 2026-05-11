import React, { useState } from 'react';
import { Target, Loader2, RefreshCw } from 'lucide-react';
import { Deal } from '@/src/types';
import { CreateDealPayload } from '@/src/services/crm/deals.api';
import { useDeals } from '@/src/hooks/crm/useDeals';
import { useCustomers } from '@/src/hooks/crm/useCustomers';
import { DealCard } from '@/src/components/crm/DealCard';
import { DealForm } from '@/src/components/crm/DealForm';
import { Drawer, ConfirmDialog } from '@/src/components/ui/Modals';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '@/src/lib/utils';

const STAGES: { id: Deal['stage']; name: string; color: string }[] = [
  { id: 'open',         name: 'Open',         color: 'bg-blue-500' },
  { id: 'proposal',    name: 'Proposal',     color: 'bg-orange-500' },
  { id: 'negotiation', name: 'Negotiation',  color: 'bg-indigo-500' },
  { id: 'won',         name: 'Won',          color: 'bg-green-500' },
  { id: 'lost',        name: 'Lost',         color: 'bg-red-400' },
];

const EMPTY_FORM: Partial<CreateDealPayload> = {
  title: '', customerId: '', amount: 0, ownerId: 'system',
  expectedCloseDate: '', stage: 'open', notes: '',
};

export default function Pipeline() {
  const { deals, loading, saving, error, fetch, create, update, updateStage, remove } = useDeals();
  const { customers } = useCustomers();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Deal | null>(null);
  const [formData, setFormData] = useState<Partial<CreateDealPayload>>(EMPTY_FORM);

  const openCreate = () => {
    setSelected(null);
    setFormData(EMPTY_FORM);
    setIsDrawerOpen(true);
  };

  const openEdit = (deal: Deal) => {
    setSelected(deal);
    setFormData({
      title: deal.title,
      customerId: deal.customerId,
      amount: deal.amount,
      ownerId: deal.ownerId,
      expectedCloseDate: deal.expectedCloseDate,
      stage: deal.stage,
      notes: deal.notes ?? '',
    });
    setIsDrawerOpen(true);
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
        await update(selected.id, formData as CreateDealPayload);
      } else {
        await create(formData as CreateDealPayload);
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
      closeDrawer();
    } catch {
      // error surfaced via hook
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    await updateStage(draggableId, destination.droppableId as Deal['stage']);
  };

  const getStageDeals = (id: Deal['stage']) => deals.filter(d => d.stage === id);
  const getStageTotal = (id: Deal['stage']) => getStageDeals(id).reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Revenue Pipeline</h2>
          <p className="text-[#6b7280] text-lg font-medium">Strategize and monitor the lifecycle of complex sales transactions.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => fetch()} className="btn-secondary px-4" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openCreate} className="btn-primary">
            <Target className="w-4 h-4" />
            New Deal
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-[#6b7280]">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />Loading pipeline…
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px]">
            {STAGES.map(stage => {
              const stageDeals = getStageDeals(stage.id);
              return (
                <div key={stage.id} className="flex-1 min-w-[300px] flex flex-col gap-6">
                  <div className="flex items-center justify-between px-2 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-2 h-2 rounded-full', stage.color)} />
                      <h3 className="font-bold text-[#111111]">{stage.name}</h3>
                      <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full font-bold text-[#6b7280]">
                        {stageDeals.length}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#6b7280] tabular-nums">
                      ${(getStageTotal(stage.id) / 1000).toFixed(1)}k
                    </p>
                  </div>

                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={cn(
                          'flex-1 space-y-4 rounded-[32px] transition-colors p-2',
                          snapshot.isDraggingOver ? 'bg-gray-50/50' : 'bg-transparent',
                        )}
                      >
                        {stageDeals.map((deal, index) => (
                          <React.Fragment key={deal.id}>
                            <Draggable draggableId={deal.id} index={index}>
                              {(provided, snapshot) => (
                                <DealCard
                                  deal={deal}
                                  onClick={openEdit}
                                  isDragging={snapshot.isDragging}
                                  innerRef={provided.innerRef}
                                  draggableProps={provided.draggableProps}
                                  dragHandleProps={provided.dragHandleProps}
                                />
                              )}
                            </Draggable>
                          </React.Fragment>
                        ))}
                        {provided.placeholder}
                        {stageDeals.length === 0 && !snapshot.isDraggingOver && (
                          <div className="h-32 rounded-[32px] border-2 border-dashed border-[#f1f1f1] flex items-center justify-center">
                            <p className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.3em]">No Deals</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={selected ? 'Edit Deal' : 'New Deal'}
        footer={
          <div className="flex gap-3">
            <button onClick={closeDrawer} disabled={saving} className="btn-secondary flex-1">Cancel</button>
            <button form="deal-form" type="submit" disabled={saving} className="btn-primary flex-1">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {selected ? 'Save Changes' : 'Create Deal'}
            </button>
          </div>
        }
      >
        <DealForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onDelete={selected ? () => setIsConfirmOpen(true) : undefined}
          customers={customers}
          isEditing={!!selected}
          saving={saving}
        />
      </Drawer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Deal"
        description="This will permanently delete the deal and all associated metadata."
        confirmText="Remove Deal"
        variant="danger"
      />
    </div>
  );
}
