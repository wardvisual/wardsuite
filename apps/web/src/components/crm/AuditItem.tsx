import React from 'react';
import {
  Plus, Pencil, Trash2, ArrowLeftRight, GitBranch,
  Terminal, User, Globe, Clock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Activity } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface AuditConfig {
  label: string;
  Icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  titleColor: string;
}

const ACTION_MAP: Record<string, AuditConfig> = {
  created: {
    label: 'Created',
    Icon: Plus,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    cardBorder: 'border-l-4 border-emerald-300',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    titleColor: 'text-emerald-700',
  },
  updated: {
    label: 'Updated',
    Icon: Pencil,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    cardBorder: 'border-l-4 border-sky-300',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    titleColor: 'text-sky-700',
  },
  deleted: {
    label: 'Deleted',
    Icon: Trash2,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    cardBorder: 'border-l-4 border-rose-300',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    titleColor: 'text-rose-700',
  },
  converted: {
    label: 'Converted',
    Icon: ArrowLeftRight,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    cardBorder: 'border-l-4 border-violet-300',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    titleColor: 'text-violet-700',
  },
  stage_changed: {
    label: 'Stage Changed',
    Icon: GitBranch,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    cardBorder: 'border-l-4 border-amber-300',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    titleColor: 'text-amber-700',
  },
  default: {
    label: 'System',
    Icon: Terminal,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    cardBorder: 'border-l-4 border-slate-200',
    badgeBg: 'bg-slate-50',
    badgeText: 'text-slate-600',
    titleColor: 'text-slate-600',
  },
};

const ENTITY_LABEL: Record<string, string> = {
  lead: 'Lead',
  customer: 'Customer',
  deal: 'Deal',
  supplier: 'Supplier',
  product: 'Product',
  user: 'Profile',
  system: 'System',
};

function extractEntityName(description: string): string {
  const match = description.match(/"([^"]+)"/);
  return match?.[1] ?? '';
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString();
}

function formatAbsolute(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

interface Props {
  log: Activity;
  index: number;
  isLast: boolean;
}

export function AuditItem({ log, index, isLast }: Props) {
  const cfg = ACTION_MAP[log.action ?? 'default'] ?? ACTION_MAP.default;
  const { Icon } = cfg;
  const entityType = ENTITY_LABEL[log.relatedEntity] ?? log.relatedEntity;
  const entityName = extractEntityName(log.description);
  const title = `${entityType} ${cfg.label}`;
  const displayName = log.createdByName ?? log.createdBy ?? 'System';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.35), duration: 0.3 }}
      className="flex gap-5 sm:gap-8 relative"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-gray-200 to-transparent" />
      )}

      {/* Icon */}
      <div className={cn(
        'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white/80 mt-1',
        cfg.iconBg,
      )}>
        <Icon className={cn('w-5 h-5', cfg.iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-10">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
          <div>
            <h3 className={cn('text-lg sm:text-xl font-bold leading-tight', cfg.titleColor)}>
              {title}
            </h3>
            {entityName && (
              <p className="text-sm text-[#6b7280] mt-0.5">
                Target Entity: <span className="font-bold text-[#111111]">{entityName}</span>
              </p>
            )}
          </div>
          <span className={cn(
            'text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0',
            cfg.badgeBg, cfg.badgeText,
          )}>
            {formatRelative(log.createdAt)}
          </span>
        </div>

        {/* Description card */}
        <div className={cn(
          'mt-3 p-4 sm:p-5 bg-white rounded-2xl border border-[#f1f1f1] shadow-[0_2px_12px_rgba(0,0,0,0.04)]',
          cfg.cardBorder,
        )}>
          <p className="text-sm sm:text-base text-[#374151] leading-relaxed">{log.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span className="text-[#6b7280]">{displayName}</span>
            </div>
            {log.ipAddress && log.ipAddress !== 'unknown' && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span className="font-mono normal-case tracking-normal text-[#9ca3af] text-xs">
                  {log.ipAddress}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              <span className="normal-case tracking-normal font-medium text-[#9ca3af]">
                {formatAbsolute(log.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
