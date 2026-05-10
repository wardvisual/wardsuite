import React from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, ChevronDown } from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-[#fcfcfc] flex">
      <Sidebar />
      
      <main className="flex-1 ml-[280px] flex flex-col h-screen overflow-hidden bg-[#fcfcfc]">
        <header className="h-24 px-12 flex items-center justify-between bg-white/50 backdrop-blur-xl shrink-0 sticky top-0 z-10">
          <div className="flex-1 max-w-2xl">
            <div className="relative group">
              <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-[#bbbbbb]" />
              <input 
                type="text" 
                placeholder="Search leads, deals, or contacts..." 
                className="w-full pl-16 pr-6 h-14 bg-[#f5f5f5] border border-transparent rounded-[20px] text-base font-medium focus:outline-none focus:bg-white focus:border-[#eeeeee] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-10">
            <button className="relative p-3 hover:bg-white hover:shadow-sm rounded-2xl transition-all border border-transparent hover:border-[#f1f1f1]">
              <Bell className="w-6 h-6 text-[#bbbbbb]" />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-black rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-6">
               <div className="text-right hidden xl:block">
                  <p className="text-base font-black text-black">Eduardo Manlangit</p>
                  <p className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Administrator</p>
               </div>
               <div className="w-14 h-14 rounded-2xl bg-[#f5f5f5] border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Eduardo" 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
               </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-12 pb-12 pt-6">
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
