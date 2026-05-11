import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '@/src/store/auth.store';
import { authApi } from '@/src/services/auth.api';
import { useNavigate } from 'react-router-dom';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const { user, token, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    if (token) {
      try { await authApi.logout(token); } catch { /* swallow */ }
    }
    clearAuth();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-[280px] flex flex-col h-screen overflow-hidden bg-[#fcfcfc]">
        <header className="h-20 lg:h-24 px-4 lg:px-12 flex items-center justify-between bg-white/50 backdrop-blur-xl shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              title="Open menu"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-[#f5f5f5] text-[#bbbbbb] hover:text-black transition-all"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>

          <div className="flex-1 max-w-2xl hidden sm:block">
            <div className="relative group">
              <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-[#bbbbbb]" />
              <input
                type="text"
                placeholder="Search leads, deals, or contacts..."
                className="w-full pl-16 pr-6 h-14 bg-[#f5f5f5] border border-transparent rounded-[20px] text-base font-medium focus:outline-none focus:bg-white focus:border-[#eeeeee] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button type="button" className="relative p-3 hover:bg-white hover:shadow-sm rounded-2xl transition-all border border-transparent hover:border-[#f1f1f1]">
              <Bell className="w-6 h-6 text-[#bbbbbb]" />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-black rounded-full border-2 border-white" />
            </button>

            <div className="flex items-center gap-6">
              <div className="text-right hidden xl:block">
                <p className="text-base font-black text-black">{user?.name ?? 'User'}</p>
                <p className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">
                  {user?.role ?? 'STAFF'}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#f5f5f5] border-2 border-white shadow-sm flex items-center justify-center font-black text-[#6b7280] text-lg overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name ?? 'user')}`}
                  alt={user?.name ?? 'User'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    (e.currentTarget.parentElement as HTMLElement).textContent = initials;
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all border border-transparent hover:border-red-100 text-[#bbbbbb]"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 lg:px-12 pb-8 lg:pb-12 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
