import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Phone, Users, StickyNote, Mail, Activity as ActivityIcon } from 'lucide-react';
import { ActivityType } from '@/src/types';
import { CreateActivityPayload } from '@/src/services/crm/activities.api';
import { useActivities } from '@/src/hooks/crm/useActivities';
import { Drawer } from '@/src/components/ui/Modals';
import { ActivityForm } from '@/src/components/crm/ActivityForm';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

const TYPE_CONFIG: Record<string, {
  label: string;
  Icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  cardBorder: string;
  titleColor: string;
}> = {
  call: {
    label: 'Call',
    Icon: Phone,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    cardBorder: 'border-l-4 border-sky-300',
    titleColor: 'text-sky-700',
  },
  meeting: {
    label: 'Meeting',
    Icon: Users,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    cardBorder: 'border-l-4 border-violet-300',
    titleColor: 'text-violet-700',
  },
  note: {
    label: 'Note',
    Icon: StickyNote,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    cardBorder: 'border-l-4 border-amber-300',
    titleColor: 'text-amber-700',
  },
  email: {
    label: 'Email',
    Icon: Mail,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    cardBorder: 'border-l-4 border-emerald-300',
    titleColor: 'text-emerald-700',
  },
};

const ACTIVITY_FILTERS: { value: ActivityType | ''; label: string }[] = [
  { value: '',        label: 'All'     },
  { value: 'call',    label: 'Calls'   },
  { value: 'meeting', label: 'Meetings'},
  { value: 'note',    label: 'Notes'   },
  { value: 'email',   label: 'Emails'  },
];

const EMPTY_FORM: CreateActivityPayload = {
  relatedEntity: 'lead',
  relatedEntityId: '',
  type: 'note',
  description: '',
};

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs !== 1 ? 's' : ''} ago`;
  return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) !== 1 ? 's' : ''} ago`;
}

function formatAbsolute(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export default function Activities() {
  const { activities, loading, saving, error, fetch, log } = useActivities();
  const [typeFilter, setTypeFilter] = useState<ActivityType | ''>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<CreateActivityPayload>(EMPTY_FORM);

  useEffect(() => {
    fetch({ type: typeFilter || undefined });
  }, [typeFilter, fetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await log(formData);
      setIsDrawerOpen(false);
      setFormData(EMPTY_FORM);
    } catch { /* surfaced via hook */ }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl sm:text-[48px] font-bold tracking-tight text-[#111111] leading-none">
            Activities
          </h2>
          <p className="text-[#6b7280] text-sm sm:text-base font-medium">
            Track every interaction across your CRM pipeline.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => fetch({ type: typeFilter || undefined })}
            className="btn-secondary px-4"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setIsDrawerOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Log Activity
          </button>
        </div>
      </div>

      {/* Type filter pills */}
      <div className="flex gap-2 flex-wrap">
        {ACTIVITY_FILTERS.map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTypeFilter(t.value as ActivityType | '')}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border',
              typeFilter === t.value
                ? 'bg-black text-white border-black'
                : 'bg-white text-[#6b7280] border-[#f1f1f1] hover:border-[#ddd]',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Timeline */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-[#6b7280]">Loading activities…</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-24">
          <ActivityIcon className="w-12 h-12 text-[#e0e0e0] mx-auto mb-4" />
          <p className="text-base font-bold text-[#6b7280]">No activities yet</p>
          <p className="text-sm text-[#bbbbbb] mt-1">Log your first interaction above.</p>
        </div>
      ) : (
        <div className="space-y-0">
          <AnimatePresence>
            {activities.map((activity, i) => {
              const cfg = TYPE_CONFIG[activity.type] ?? TYPE_CONFIG.note;
              const { Icon } = cfg;
              const isLast = i === activities.length - 1;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.035, 0.35), duration: 0.3 }}
                  className="flex gap-5 sm:gap-8 relative"
                >
                  {!isLast && (
                    <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-gray-200 to-transparent" />
                  )}

                  <div className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white/80 mt-1',
                    cfg.iconBg,
                  )}>
                    <Icon className={cn('w-5 h-5', cfg.iconColor)} />
                  </div>

                  <div className="flex-1 min-w-0 pb-10">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className={cn('text-lg sm:text-xl font-bold leading-tight', cfg.titleColor)}>
                          {cfg.label} Logged
                        </h3>
                        <p className="text-sm text-[#6b7280] mt-0.5">
                          Entity: <span className="font-bold text-[#111111] capitalize">{activity.relatedEntity}</span>
                        </p>
                      </div>
                      <span className={cn(
                        'text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0',
                        cfg.iconBg, cfg.iconColor,
                      )}>
                        {formatRelative(activity.createdAt)}
                      </span>
                    </div>

                    <div className={cn(
                      'mt-3 p-4 sm:p-5 bg-white rounded-2xl border border-[#f1f1f1] shadow-[0_2px_12px_rgba(0,0,0,0.04)]',
                      cfg.cardBorder,
                    )}>
                      <p className="text-sm sm:text-base text-[#374151] leading-relaxed">
                        {activity.description}
                      </p>
                      <p className="mt-3 text-xs font-bold text-[#9ca3af] uppercase tracking-widest">
                        {formatAbsolute(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Log Activity"
        footer={
          <div className="flex gap-3">
            <button type="button" onClick={() => setIsDrawerOpen(false)} disabled={saving} className="btn-secondary flex-1">
              Cancel
            </button>
            <button form="activity-form" type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving…' : 'Log Activity'}
            </button>
          </div>
        }
      >
        <ActivityForm formData={formData} onChange={setFormData} onSubmit={handleSubmit} />
      </Drawer>
    </div>
  );
}
