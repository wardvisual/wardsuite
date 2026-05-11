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
const CHART_H = 200; // px — bar area height

function RevenueChart({ monthlyRevenue }: { monthlyRevenue: number[] }) {
  const now = new Date();
  const maxVal = Math.max(...monthlyRevenue, 1);
  const topLabel = maxVal >= 1000 ? `$${(maxVal / 1000).toFixed(1)}k` : `$${maxVal}`;
  const midLabel = maxVal >= 1000 ? `$${(maxVal / 2000).toFixed(1)}k` : `$${Math.round(maxVal / 2)}`;

  return (
    <div className="w-full mt-8 relative pl-10" style={{ height: CHART_H + 28 }}>
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 flex flex-col justify-between py-0.5" style={{ height: CHART_H }}>
        <span className="text-[9px] font-bold text-[#9ca3af]">{topLabel}</span>
        <span className="text-[9px] font-bold text-[#9ca3af]">{midLabel}</span>
        <span className="text-[9px] font-bold text-[#9ca3af]">$0</span>
      </div>
      {/* Bars */}
      <div className="absolute inset-x-0 left-10 flex items-end gap-1" style={{ height: CHART_H }}>
        {monthlyRevenue.map((v, i) => {
          const monthIdx = (now.getMonth() - 11 + i + 12) % 12;
          const barH = Math.max(Math.round((v / maxVal) * CHART_H), 3);
          const label = v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
              <div
                className="w-full bg-black/[0.07] hover:bg-black/[0.18] rounded-t-md cursor-default group relative transition-colors"
                style={{ height: barH }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white text-[9px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {label}
                </div>
              </div>
              <span className="text-[8px] font-bold text-[#cccccc] uppercase">{MONTH_LABELS[monthIdx]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PERIOD_OPTIONS = [
  { label: 'Last 7 days',   value: '7d' },
  { label: 'Last 30 days',  value: '30d' },
  { label: 'Last 3 months', value: '3m' },
  { label: 'Last 12 months',value: '12m' },
];

const Dashboard = () => {
  const { stats, loading } = useDashboardStats();
  const [period, setPeriod] = useState('30d');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1] mb-2">Dashboard Summary</h1>
          <p className="text-[#6b7280] text-sm sm:text-lg max-w-2xl font-medium leading-relaxed">
            Real-time overview of your organizational performance and pipeline metrics.
          </p>
        </div>
        {/* Performance period picker */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowPeriodMenu(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#f1f1f1] rounded-xl text-sm font-bold bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            {PERIOD_OPTIONS.find(p => p.value === period)?.label ?? 'Last 30 days'}
          </button>
          {showPeriodMenu && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#f1f1f1] rounded-2xl shadow-lg z-20 overflow-hidden">
              {PERIOD_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setPeriod(opt.value); setShowPeriodMenu(false); }}
                  className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${period === opt.value ? 'bg-black text-white' : 'hover:bg-[#f5f5f5] text-[#111111]'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 lg:p-6 floating-card space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#bbbbbb] uppercase tracking-[0.2em] leading-tight">{stat.label}</span>
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-[#f5f5f5] flex items-center justify-center border border-white shrink-0">
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl lg:text-[44px] font-bold tracking-tight leading-tight mb-2">{stat.value}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#111111] bg-[#f5f5f5] px-2.5 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 floating-card p-6 lg:p-8 space-y-6 lg:space-y-8">
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

        <div className="lg:col-span-4 flex flex-col">
          <div className="floating-card p-6 lg:p-8 flex-1 relative overflow-hidden">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
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
