import React from 'react';
import { User, Bell, Shield, Globe, CreditCard, ChevronRight, Moon, Sun, Monitor, Save } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export default function Settings() {
  const settingsGroups = [
    {
      title: 'Identity & Access',
      items: [
        { icon: User, label: 'Profile Intelligence', desc: 'Manage your public identity and credentials.' },
        { icon: Shield, label: 'Security Protocols', desc: 'Two-factor auth and active sessions.' },
      ]
    },
    {
      title: 'System Preferences',
      items: [
        { icon: Bell, label: 'Alert Parameters', desc: 'Configure notification thresholds and channels.' },
        { icon: Globe, label: 'Regional Settings', desc: 'Timezones, currency formats, and localization.' },
      ]
    },
    {
      title: 'Commercials',
      items: [
        { icon: CreditCard, label: 'Subscription Plan', desc: 'Scaling parameters and billing cycles.' },
      ]
    }
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">System Console</h2>
          <p className="text-[#6b7280] text-lg font-medium">Fine-tune your environment and security parameters.</p>
        </div>
        <button className="btn-primary">
          <Save className="w-5 h-5 mr-2" />
          Apply Changes
        </button>
      </div>

      <div className="grid grid-cols-12 gap-12">
         <div className="col-span-8 space-y-12">
            {settingsGroups.map((group, i) => (
               <div key={i} className="space-y-6">
                  <h3 className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.3em] ml-2">{group.title}</h3>
                  <div className="bg-white border border-[#f1f1f1] rounded-[32px] overflow-hidden shadow-sm">
                     {group.items.map((item, j) => (
                        <button 
                          key={j} 
                          className={cn(
                            "w-full flex items-center justify-between p-8 hover:bg-gray-50 transition-colors group text-left",
                            j !== group.items.length - 1 && "border-b border-[#f1f1f1]"
                          )}
                        >
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-[#f1f1f1] group-hover:bg-black group-hover:text-white transition-all group-hover:scale-105">
                                 <item.icon className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className="text-lg font-bold text-[#111111]">{item.label}</p>
                                 <p className="text-sm text-[#6b7280] font-medium">{item.desc}</p>
                              </div>
                           </div>
                           <ChevronRight className="w-5 h-5 text-[#6b7280] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                     ))}
                  </div>
               </div>
            ))}
         </div>

         <div className="col-span-4 space-y-8">
            <div className="bg-black text-white p-10 rounded-[32px] space-y-8 relative overflow-hidden shadow-2xl">
               <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                     <Monitor className="w-8 h-8 text-white" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold tracking-tight">Active Node</h3>
                     <p className="text-white/50 text-sm font-medium mt-1 uppercase tracking-widest">WisedCRM Cloud Instance</p>
                  </div>
                  <div className="pt-6 border-t border-white/10 space-y-4">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-white/50 font-bold uppercase tracking-widest">Environment</span>
                        <span className="font-mono bg-white/10 px-2 py-1 rounded">Production</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-white/50 font-bold uppercase tracking-widest">Sync Latency</span>
                        <span className="font-mono text-green-400">12ms</span>
                     </div>
                  </div>
               </div>
               {/* Abstract background decorative element */}
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="p-8 border border-[#f1f1f1] rounded-[32px] space-y-6 bg-white shadow-sm font-medium text-sm text-[#6b7280]">
               <div className="flex items-center justify-between">
                  <span>Interface Mode</span>
                  <div className="flex bg-gray-50 p-1 rounded-xl border border-[#f1f1f1]">
                     {[Sun, Moon].map((Icon, i) => (
                        <button key={i} className={cn(
                           "p-2 rounded-lg transition-all",
                           i === 0 ? "bg-white text-black shadow-sm" : "hover:text-black"
                        )}>
                           <Icon className="w-4 h-4" />
                        </button>
                     ))}
                  </div>
               </div>
               <div className="pt-6 border-t border-[#f1f1f1]">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-4">Version Control</p>
                  <p className="text-xs font-mono bg-gray-50 p-3 rounded-xl border border-[#f1f1f1] text-black">
                     v1.2.0-stable_build_99
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
