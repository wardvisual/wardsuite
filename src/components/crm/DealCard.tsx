import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Deal } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface Props {
  deal: Deal;
  onClick: (deal: Deal) => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  draggableProps?: React.HTMLAttributes<HTMLDivElement>;
  innerRef?: React.Ref<HTMLDivElement>;
}

export function DealCard({ deal, onClick, isDragging, dragHandleProps, draggableProps, innerRef }: Props) {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      onClick={() => onClick(deal)}
      className={cn(
        'p-6 floating-card cursor-grab active:cursor-grabbing group',
        isDragging && 'shadow-[0_40px_80px_rgba(0,0,0,0.1)] scale-105 rotate-1',
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-[0.2em] truncate pr-2">
          {deal.customerId}
        </p>
        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-30 transition-opacity shrink-0" />
      </div>
      <h4 className="text-base font-black text-black leading-tight mb-2">{deal.title}</h4>
      <div className="flex items-end justify-between mt-6">
        <div>
          <p className="text-[10px] text-[#bbbbbb] font-black uppercase tracking-widest leading-none mb-1">Close</p>
          <p className="text-xs font-bold text-black">{deal.expectedCloseDate}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-black">${(deal.amount / 1000).toFixed(1)}k</p>
        </div>
      </div>
    </div>
  );
}
