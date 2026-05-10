import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings, 
  LogOut, 
  Home,
  Briefcase,
  Layers,
  Grid,
  Clock,
  BarChart3,
  MessageSquare,
  User,
  ChevronLeft,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Briefcase, label: 'Leads', path: '/crm/leads' },
  { icon: User, label: 'Contacts', path: '/crm/customers' },
  { icon: Target, label: 'Pipeline', path: '/pipeline' },
  { icon: Layers, label: 'Deals', path: '/category' },
  { icon: MessageSquare, label: 'Activities', path: '/activity' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: Grid, label: 'Billing', path: '/dashboard/billing' },
];

export function Sidebar() {
  return (
    <aside className="w-[280px] flex flex-col h-screen fixed left-0 top-0 bg-white z-20 overflow-hidden">
      <div className="h-24 px-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black">WISED</span>
        </div>
      </div>

      <nav className="flex-1 px-6 mt-8 space-y-2 overflow-y-auto">
        <div className="px-4 mb-4">
           <p className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.3em]">Organization</p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-4 h-14 rounded-[20px] cursor-pointer transition-all duration-300 group relative",
                isActive 
                  ? "bg-[#f5f5f5] text-[#111111]" 
                  : "text-[#bbbbbb] hover:text-black hover:bg-[#fafafa]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5 transition-all", isActive ? "text-black scale-110" : "text-[#bbbbbb] group-hover:text-black")} />
                <span className={cn("text-base font-bold transition-colors", isActive ? "text-black" : "")}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-4 w-1.5 h-1.5 bg-black rounded-full" 
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-8 mt-auto space-y-2">
        <NavLink 
          to="/settings"
          className={({ isActive }) => cn(
            "flex items-center gap-4 px-4 h-14 rounded-[20px] text-[#bbbbbb] hover:text-black transition-all",
            isActive && "bg-[#f5f5f5] text-black"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="text-base font-bold">Settings</span>
        </NavLink>
        <button className="flex items-center gap-4 px-4 h-14 w-full rounded-[20px] text-[#bbbbbb] hover:text-red-500 transition-all text-left group">
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-base font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
