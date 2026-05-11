import React from 'react';
import { Phone, Users, StickyNote, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { Activity, ActivityType } from '@/src/types';
import { cn } from '@/src/lib/utils';

const TYPE_CONFIG: Record<ActivityType, { icon: React.ElementType; color: string; label: string }> = {
  call:    { icon: Phone,       color: 'text-blue-500 bg-blue-50',   label: 'Call' },
  meeting: { icon: Users,       color: 'text-purple-500 bg-purple-50', label: 'Meeting' },
  note:    { icon: StickyNote,  color: 'text-yellow-500 bg-yellow-50', label: 'Note' },
  email:   { icon: Mail,        color: 'text-green-500 bg-green-50',  label: 'Email' },
  audit:   { icon: ShieldCheck, color: 'text-gray-400 bg-gray-50',   label: 'Audit' },
};

interface Props {
  activities: Activity[];
  loading: boolean;
  emptyText?: string;
}

export function ActivityList({ activities, loading, emptyText = 'No activities yet.' }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-[#6b7280]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading activities…
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="text-center py-16 text-[#6b7280] text-sm font-medium">{emptyText}</div>
    );
  }

  return (
    <ol className="relative border-l border-[#f1f1f1] ml-4 space-y-6">
      {activities.map(activity => {
        const cfg = TYPE_CONFIG[activity.type] ?? TYPE_CONFIG.note;
        const Icon = cfg.icon;
        const date = new Date(activity.createdAt);
        return (
          <li key={activity.id} className="ml-6">
            <span className={cn(
              'absolute -left-3.5 w-7 h-7 rounded-full flex items-center justify-center',
              cfg.color,
            )}>
              <Icon className="w-3.5 h-3.5" />
            </span>
            <div className="floating-card p-4 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                  {cfg.label}
                </span>
                <time className="text-[10px] text-[#6b7280]">
                  {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
              <p className="text-sm text-[#111111] leading-relaxed">{activity.description}</p>
              <p className="text-[10px] text-[#6b7280]">by {activity.createdBy}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
