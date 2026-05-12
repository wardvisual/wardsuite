import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { History, Search, Filter, Download, Radio } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { activitiesApi } from '@/src/services/crm/activities.api';
import { Activity } from '@/src/types';
import { AuditItem } from '@/src/components/crm/AuditItem';

type ActionFilter = '' | 'created' | 'updated' | 'deleted' | 'converted' | 'stage_changed';

const PAGE_SIZE = 25;
const MAX_DOM = 75;
const ITEM_H = 220;

const FILTER_OPTIONS: { value: ActionFilter; label: string }[] = [
  { value: '',              label: 'All Events'    },
  { value: 'created',      label: 'Created'       },
  { value: 'updated',      label: 'Updated'       },
  { value: 'deleted',      label: 'Deleted'       },
  { value: 'converted',    label: 'Converted'     },
  { value: 'stage_changed', label: 'Stage Changed' },
];

function exportCSV(activities: Activity[]) {
  const headers = ['ID', 'Entity', 'Action', 'Description', 'Actor', 'IP Address', 'Date/Time'];
  const rows = activities.map(a => [
    a.id,
    a.relatedEntity,
    a.action ?? '',
    `"${(a.description ?? '').replace(/"/g, '""')}"`,
    a.createdByName ?? a.createdBy,
    a.ipAddress ?? 'unknown',
    new Date(a.createdAt).toLocaleString(),
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'wardsuite_audit_trail.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function ActivityLogs() {
  const [allItems, setAllItems] = useState<Activity[]>([]);
  const [windowStart, setWindowStart] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<ActionFilter>('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const offsetRef = useRef(0);
  const loadingRef = useRef(false);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let r = allItems;
    if (actionFilter) r = r.filter(a => a.action === actionFilter);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(a =>
        a.description.toLowerCase().includes(q) ||
        a.relatedEntity.toLowerCase().includes(q) ||
        (a.createdByName ?? a.createdBy ?? '').toLowerCase().includes(q) ||
        (a.ipAddress ?? '').includes(q),
      );
    }
    return r;
  }, [allItems, actionFilter, search]);

  // Reset window when filter changes
  useEffect(() => { setWindowStart(0); }, [actionFilter, search]);

  const displayItems = filtered.slice(windowStart, windowStart + MAX_DOM);
  const paddingTop = windowStart * ITEM_H;
  const paddingBottom = Math.max(0, filtered.length - windowStart - MAX_DOM) * ITEM_H;

  const loadPage = useCallback(async (isFirst = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    isFirst ? setLoading(true) : setLoadingMore(true);
    try {
      const res = await activitiesApi.list({ type: 'audit', limit: PAGE_SIZE, offset: offsetRef.current });
      const items: Activity[] = res.data ?? [];
      offsetRef.current += items.length;
      setAllItems(prev => [...prev, ...items]);
      setHasMore(items.length === PAGE_SIZE);
    } finally {
      loadingRef.current = false;
      isFirst ? setLoading(false) : setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => { loadPage(true); }, [loadPage]);

  // Bottom sentinel — load more or advance window
  useEffect(() => {
    const el = bottomSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      const atFilteredEnd = windowStart + MAX_DOM >= filtered.length;
      if (atFilteredEnd && hasMore && !loadingRef.current) {
        loadPage(false);
      } else if (!atFilteredEnd) {
        setWindowStart(s => Math.min(s + PAGE_SIZE, filtered.length - 1));
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadPage, hasMore, filtered.length, windowStart]);

  // Top sentinel — retreat window to show older-rendered items
  useEffect(() => {
    const el = topSentinelRef.current;
    if (!el || windowStart === 0) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && windowStart > 0) {
        setWindowStart(s => Math.max(0, s - PAGE_SIZE));
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [windowStart]);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl sm:text-[48px] font-bold tracking-tight text-[#111111] leading-none">
              System Chronology
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                Live Updates Active
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          {/* Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterMenu(v => !v)}
              className="btn-secondary flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {actionFilter ? FILTER_OPTIONS.find(f => f.value === actionFilter)?.label : 'Filter'}
            </button>
            <AnimatePresence>
              {showFilterMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#f1f1f1] rounded-2xl shadow-lg z-20 overflow-hidden py-1"
                >
                  {FILTER_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setActionFilter(opt.value); setShowFilterMenu(false); }}
                      className={cn(
                        'w-full text-left px-4 py-3 text-sm font-bold transition-colors',
                        actionFilter === opt.value ? 'bg-black text-white' : 'text-[#111111] hover:bg-[#f5f5f5]',
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Export */}
          <button
            type="button"
            onClick={() => exportCSV(filtered)}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Search + count bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/80 border border-[#f1f1f1] rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
            <History className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#111111]">Audit Events</p>
            <p className="text-[11px] text-[#6b7280] font-bold uppercase tracking-widest leading-none mt-0.5">
              {loading ? 'Loading…' : `${filtered.length} event${filtered.length !== 1 ? 's' : ''}${allItems.length !== filtered.length ? ` (${allItems.length} total)` : ''}`}
            </p>
          </div>
        </div>
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input
            className="pl-10 pr-4 py-2.5 border border-[#f1f1f1] rounded-xl text-sm font-medium focus:outline-none focus:border-black transition-all bg-white w-full"
            placeholder="Search events, actors, IP…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-[#6b7280]">Loading audit trail…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <History className="w-12 h-12 text-[#e0e0e0] mx-auto mb-4" />
            <p className="text-base font-bold text-[#6b7280]">No events found</p>
            <p className="text-sm text-[#bbbbbb] mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <>
            {/* Top padding for removed items + sentinel */}
            <div style={{ height: paddingTop }} />
            {windowStart > 0 && <div ref={topSentinelRef} className="h-1" />}

            <div className="space-y-0">
              {displayItems.map((log, i) => (
                <AuditItem
                  key={log.id}
                  log={log}
                  index={i}
                  isLast={i === displayItems.length - 1 && !hasMore}
                />
              ))}
            </div>

            {/* Bottom sentinel */}
            <div ref={bottomSentinelRef} className="h-4" />
            <div style={{ height: paddingBottom }} />

            {/* Load more indicator */}
            {loadingMore && (
              <div className="flex items-center justify-center py-6 gap-3">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-[#6b7280]">Loading more…</span>
              </div>
            )}
            {!hasMore && allItems.length > 0 && (
              <p className="text-center text-xs font-bold text-[#bbbbbb] uppercase tracking-widest py-6">
                End of audit trail
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
