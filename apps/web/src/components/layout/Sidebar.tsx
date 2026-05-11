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
    <aside className="top-0 left-0 z-20 fixed flex flex-col bg-white w-[280px] h-screen overflow-hidden">
      <div className="flex justify-between items-center px-10 h-24 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex justify-center items-center bg-black shadow-black/10 shadow-lg rounded-2xl w-10 h-10">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="font-bold text-black text-xl tracking-tight">WardSuite</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 mt-8 px-6 overflow-y-auto">
        <div className="mb-4 px-4">
           <p className="font-black text-[#bbbbbb] text-[10px] uppercase tracking-[0.3em]">Organization</p>
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
                    className="right-4 absolute bg-black rounded-full w-1.5 h-1.5" 
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-2 mt-auto p-8">
        <NavLink 
          to="/settings"
          className={({ isActive }) => cn(
            "flex items-center gap-4 px-4 h-14 rounded-[20px] text-[#bbbbbb] hover:text-black transition-all",
            isActive && "bg-[#f5f5f5] text-black"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="font-bold text-base">Settings</span>
        </NavLink>
        <button className="flex items-center gap-4 px-4 rounded-[20px] w-full h-14 text-[#bbbbbb] text-left hover:text-red-500 transition-all group">
          <LogOut className="group-hover:scale-110 w-5 h-5 transition-transform" />
          <span className="font-bold text-base">Logout</span>
        </button>
      </div>
    </aside>
  );
}
