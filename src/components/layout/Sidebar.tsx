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
  Target
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
    <aside className="w-[280px] border-r border-[#f1f1f1] flex flex-col h-screen fixed left-0 top-0 bg-white z-20">
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded flex items-center justify-center">
            <span className="text-white font-black text-xs">W</span>
          </div>
          <span className="text-lg font-bold tracking-tight">WisedCRM</span>
        </div>
        <button className="p-1 hover:bg-gray-50 rounded-lg transition-colors border border-[#f1f1f1]">
           <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
        </button>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 group relative",
                isActive 
                  ? "bg-[#f9fafb] text-[#111111]" 
                  : "text-[#6b7280] hover:text-[#111111]"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-black rounded-r-full" 
                  />
                )}
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-black" : "text-[#6b7280] group-hover:text-black")} />
                <span className={cn("text-[15px] font-medium transition-colors", isActive ? "font-bold" : "")}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-[#f1f1f1] space-y-1">
        <NavLink 
          to="/settings"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl text-[#6b7280] hover:text-[#111111] transition-all",
            isActive && "bg-[#f9fafb] text-[#111111]"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[15px] font-medium">Settings</span>
        </NavLink>
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-[#6b7280] hover:text-red-500 transition-all text-left">
          <LogOut className="w-5 h-5" />
          <span className="text-[15px] font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
