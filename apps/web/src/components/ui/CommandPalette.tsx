import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, User, Target, Layers,
  MessageSquare, BarChart3, CreditCard, Settings, Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/dashboard',       group: 'Pages' },
  { icon: Briefcase,       label: 'Leads',        path: '/crm/leads',       group: 'CRM' },
  { icon: User,            label: 'Contacts',     path: '/crm/customers',   group: 'CRM' },
  { icon: Target,          label: 'Pipeline',     path: '/pipeline',        group: 'CRM' },
  { icon: Layers,          label: 'Deals',        path: '/category',        group: 'CRM' },
  { icon: MessageSquare,   label: 'Activities',   path: '/activity',        group: 'CRM' },
  { icon: BarChart3,       label: 'Analytics',    path: '/analytics',       group: 'Reports' },
  { icon: CreditCard,      label: 'Billing',      path: '/billing',         group: 'Reports' },
  { icon: Settings,        label: 'Settings',     path: '/settings',        group: 'System' },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = query.trim()
    ? NAV_ITEMS.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.group.toLowerCase().includes(query.toLowerCase())
      )
    : NAV_ITEMS;

  const go = useCallback((path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  }, [navigate, onClose]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setActiveIdx(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && filtered[activeIdx]) { go(filtered[activeIdx].path); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, filtered, activeIdx, go, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-lg bg-white rounded-[24px] shadow-2xl shadow-black/20 overflow-hidden z-50"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f1f1f1]">
              <Search className="w-5 h-5 text-[#9ca3af] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search pages..."
                className="flex-1 text-base font-medium text-black placeholder-[#bbbbbb] outline-none bg-transparent"
              />
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-[#f5f5f5] rounded-md text-[10px] font-black text-[#9ca3af] uppercase tracking-widest">
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-center text-sm font-medium text-[#9ca3af] py-8">No pages found</p>
              ) : (
                (() => {
                  const groups = [...new Set(filtered.map(i => i.group))];
                  return groups.map(group => (
                    <div key={group}>
                      <p className="px-5 py-2 text-[9px] font-black text-[#bbbbbb] uppercase tracking-[0.3em]">{group}</p>
                      {filtered.filter(item => item.group === group).map(item => {
                        const idx = filtered.indexOf(item);
                        return (
                          <button
                            key={item.path}
                            type="button"
                            onClick={() => go(item.path)}
                            onMouseEnter={() => setActiveIdx(idx)}
                            className={cn(
                              'w-full flex items-center gap-4 px-5 py-3 text-left transition-colors',
                              activeIdx === idx ? 'bg-[#f5f5f5]' : 'hover:bg-[#fafafa]'
                            )}
                          >
                            <div className={cn(
                              'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                              activeIdx === idx ? 'bg-black text-white' : 'bg-[#f5f5f5] text-[#6b7280]'
                            )}>
                              <item.icon className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm text-[#111111]">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ));
                })()
              )}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 border-t border-[#f5f5f5] flex items-center gap-4">
              <span className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-widest">
                <kbd className="bg-[#f5f5f5] px-1.5 py-0.5 rounded text-[9px]">↑↓</kbd> Navigate
              </span>
              <span className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-widest">
                <kbd className="bg-[#f5f5f5] px-1.5 py-0.5 rounded text-[9px]">↵</kbd> Open
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
