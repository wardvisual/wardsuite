import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Package, Briefcase, Loader2, Target, DollarSign, Users, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { Shell } from './components/layout/Shell';
import { AuthGuard } from './components/auth/AuthGuard';
import Suppliers from './modules/scm/Suppliers';
import Products from './modules/scm/Products';
import Leads from './modules/crm/Leads';
import Customers from './modules/crm/Customers';
import Activities from './modules/crm/Activities';
import ActivityLogs from './modules/core/ActivityLogs';
import Settings from './modules/core/Settings';
import Pipeline from './modules/Pipeline';
import Analytics from './modules/Analytics';
import Billing from './modules/Billing';
import Auth from './modules/Auth';
import Landing from './modules/Landing';
import CaseStudy from './modules/CaseStudy';
import { useDashboardStats } from './hooks/useDashboardStats';
import { motion } from 'motion/react';

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function RevenueChart({ monthlyRevenue }: { monthlyRevenue: number[] }) {
  const now = new Date();
  const maxVal = Math.max(...monthlyRevenue, 1);
  const bars = monthlyRevenue.map(v => Math.max(Math.round((v / maxVal) * 85), 5));
  const topLabel = maxVal >= 1000 ? `$${(maxVal / 1000).toFixed(1)}k` : `$${maxVal}`;
  const midLabel = maxVal >= 1000 ? `$${(maxVal / 2000).toFixed(1)}k` : `$${Math.round(maxVal / 2)}`;

  return (
    <div className="h-[300px] w-full mt-10 relative">
      <div className="absolute inset-x-0 bottom-6 top-0 flex items-end justify-between px-2 gap-1">
        {bars.map((h, i) => {
          const monthIdx = (now.getMonth() - 11 + i + 12) % 12;
          const val = monthlyRevenue[i];
          const label = val >= 1000 ? `$${(val / 1000).toFixed(1)}k` : `$${val}`;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-black/5 rounded-t-lg transition-all hover:bg-black/15 group relative cursor-default"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {label}
                </div>
              </div>
              <span className="text-[9px] font-bold text-[#cccccc] uppercase">{MONTH_LABELS[monthIdx]}</span>
            </div>
          );
        })}
      </div>
      <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between py-1 text-[9px] font-bold text-[#6b7280] uppercase opacity-50">
        <span>{topLabel}</span><span>{midLabel}</span><span>$0</span>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#111111]" />
      </div>
    );
  }

  const fmtK = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;
  const conversionRate = stats.totalLeads > 0
    ? ((stats.totalCustomers / stats.totalLeads) * 100).toFixed(1) + '%'
    : '0%';

  const statCards = [
    { label: 'CONVERSION RATE', value: conversionRate, change: `${stats.totalLeads} leads`, icon: Target },
    { label: 'FORECAST REVENUE', value: fmtK(stats.pipelineRevenue), change: `${stats.openDeals} active deals`, icon: DollarSign },
    { label: 'NETWORK REACH', value: stats.totalCustomers.toString(), change: `${stats.totalLeads} total leads`, icon: Users },
    { label: 'WON REVENUE', value: fmtK(stats.wonRevenue), change: 'closed deals', icon: TrendingUp },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1] mb-4">Dashboard Summary</h1>
        <p className="text-[#6b7280] text-lg max-w-2xl font-medium leading-relaxed">
          Welcome back. Here is a real-time overview of your organizational performance and pipeline metrics.
        </p>
      </div>

      <div className="flex justify-end">
        <button type="button" className="flex items-center gap-2 px-4 py-2 border border-[#f1f1f1] rounded-xl text-sm font-bold bg-white hover:bg-gray-50 transition-colors shadow-sm">
          Performance
          <Calendar className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 floating-card space-y-4"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-[0.2em]">{stat.label}</span>
              <div className="w-14 h-14 rounded-full bg-[#f5f5f5] flex items-center justify-center border border-white">
                <stat.icon className="w-6 h-6 text-black" />
              </div>
            </div>
            <div>
              <h3 className="text-[44px] font-bold tracking-tight leading-tight mb-2">{stat.value}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#111111] bg-[#f5f5f5] px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 floating-card p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-[20px] font-bold">Revenue Dynamics</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-black" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#6b7280]">Growth</span>
            </div>
          </div>

          <RevenueChart monthlyRevenue={stats.monthlyRevenue} />
        </div>

        <div className="col-span-4 flex flex-col">
          <div className="floating-card p-8 flex-1 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="w-5 h-5" />
              <h3 className="text-[20px] font-bold">Recent Flow</h3>
            </div>
            <div className="space-y-6">
              {[
                { name: 'Edward', handle: 'EDWARDTECH', amount: '$3,999.00', status: 'NEW', initial: 'E' },
                { name: 'Sarah', handle: 'SJ_CORP', amount: '$12,400.00', status: 'PAID', initial: 'S' },
                { name: 'Orion Ltd', handle: 'ORION_SCM', amount: '$850.00', status: 'NEW', initial: 'O' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-[#f8f8f8] flex items-center justify-center font-bold text-[#6b7280]">
                      {item.initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-[10px] text-[#9ca3af] font-bold uppercase tracking-widest">{item.handle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{item.amount}</p>
                    <span className="text-[9px] font-black uppercase text-[#6b7280] tracking-tighter bg-gray-50 px-2 py-1 rounded-full">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="w-full mt-12 py-3 bg-gray-50 border border-[#f1f1f1] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
              Audit Full Pipeline
              <ArrowUpRight className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Modules = () => {
  const { stats } = useDashboardStats();
  return (
    <div className="space-y-8">
      <h1 className="text-[32px] font-bold text-gray-900">Modules</h1>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm group hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
            <Package className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Supply Chain (SCM)</h2>
          <p className="text-gray-500 font-medium">Manage suppliers, products, inventory, and purchase requests.</p>
          <div className="mt-8 flex gap-4">
            <div className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-400">{stats.totalSuppliers} Suppliers</div>
            <div className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-400">{stats.totalProducts} Products</div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] shadow-sm group hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
            <Briefcase className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Customer Relations (CRM)</h2>
          <p className="text-gray-500 font-medium">Track leads, customers, sales deals, and activities.</p>
          <div className="mt-8 flex gap-4">
            <div className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-400">{stats.totalLeads} Leads</div>
            <div className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-400">{stats.openDeals} Active Deals</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/case-study" element={<CaseStudy />} />
        <Route path="/login" element={<Auth />} />

        <Route
          path="/*"
          element={
            <AuthGuard>
              <Shell>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/scm/suppliers" element={<Suppliers />} />
                  <Route path="/scm/products" element={<Products />} />
                  <Route path="/crm/leads" element={<Leads />} />
                  <Route path="/crm/customers" element={<Customers />} />
                  <Route path="/crm/activities" element={<Activities />} />
                  <Route path="/pipeline" element={<Pipeline />} />
                  <Route path="/activity" element={<ActivityLogs />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/category" element={<Modules />} />
                  <Route path="/profile" element={<div>Profile (PoC)</div>} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Shell>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}
