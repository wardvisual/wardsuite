import React from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, ChevronDown } from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      <Sidebar />
      
      <main className="flex-1 ml-[280px] flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-[#f1f1f1] px-8 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0 sticky top-0 z-10">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
              <input 
                type="text" 
                placeholder="Search leads, deals, or contacts..." 
                className="w-full pl-12 pr-4 py-2.5 bg-[#f9fafb] border border-[#f1f1f1] rounded-xl text-sm focus:outline-none focus:border-black transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-[#f1f1f1]">
              <Bell className="w-5 h-5 text-[#6b7280]" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-black rounded-full border border-white" />
            </button>
            <div className="h-8 w-px bg-[#f1f1f1]" />
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-[#111111]">Eduardo Manlangit</p>
                  <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Administrator</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-[#f9fafb] border border-[#f1f1f1] flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Eduardo" 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
               </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
