import React from 'react';
import { AnimatePresence } from 'motion/react';
import { Lead } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { Phone, Mail, Building, User, Target } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    onStatusChange(draggableId, destination.droppableId as Lead['status']);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px]">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter(l => l.status === stage.id);
          
          return (
            <div key={stage.id} className="flex-1 min-w-[320px] flex flex-col gap-6">
              <div className="flex items-center justify-between px-2 shrink-0">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                  <h3 className="font-bold text-[#111111]">{stage.label}</h3>
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full font-bold text-[#6b7280]">
                    {stageLeads.length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 space-y-4 rounded-[32px] transition-colors p-2",
                      snapshot.isDraggingOver ? "bg-gray-50/50" : "bg-transparent"
                    )}
                  >
                    <AnimatePresence mode="popLayout">
                      {stageLeads.map((lead, index) => (
                        <React.Fragment key={lead.id}>
                        <Draggable draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => onLeadClick(lead)}
                              className={cn(
                                "p-6 floating-card cursor-grab active:cursor-grabbing group relative overflow-hidden",
                                snapshot.isDragging ? "shadow-[0_40px_80px_rgba(0,0,0,0.1)] scale-105 rotate-2" : ""
                              )}
                            >
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <span className="text-[9px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">
                                    {lead.code}
                                  </span>
                                  <div className="w-10 h-10 rounded-2xl bg-[#f5f5f5] flex items-center justify-center border border-white group-hover:bg-black group-hover:text-white transition-colors">
                                    <User className="w-4 h-4" />
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-lg font-black text-black leading-tight">{lead.fullName}</h4>
                                  <p className="text-xs text-[#6b7280] font-bold mt-1 uppercase tracking-widest">{lead.company}</p>
                                </div>

                                <div className="pt-4 border-t border-[#f1f1f1] flex flex-wrap gap-2">
                                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#bbbbbb] bg-gray-50 px-2 py-1 rounded-lg">
                                      <Mail className="w-3 h-3" />
                                      {lead.email.split('@')[0]}
                                   </div>
                                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#bbbbbb] bg-gray-50 px-2 py-1 rounded-lg">
                                      <Target className="w-3 h-3" />
                                      {lead.source}
                                   </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                        </React.Fragment>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                    
                    {stageLeads.length === 0 && !snapshot.isDraggingOver && (
                      <div className="h-24 rounded-[32px] border-2 border-dashed border-[#f1f1f1] flex items-center justify-center">
                        <p className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.3em]">Drop Protocol</p>
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
  );
}
