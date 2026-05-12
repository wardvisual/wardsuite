import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, Users, DollarSign, Target,
  ArrowUpRight, ArrowDownRight, Activity, Calendar, Loader2,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { useDashboardStats } from '@/src/hooks/useDashboardStats';

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const SOURCE_DATA = [
  { name: 'Direct',   value: 400, fill: '#000000', dot: 'bg-black'        },
  { name: 'Referral', value: 300, fill: '#444444', dot: 'bg-[#444444]'    },
  { name: 'Social',   value: 300, fill: '#888888', dot: 'bg-[#888888]'    },
  { name: 'Email',    value: 200, fill: '#bbbbbb', dot: 'bg-[#bbbbbb]'    },
];

const fmtK = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;

export default function Analytics() {
  const { stats, loading } = useDashboardStats();
  const now = new Date();

  const revenueData = useMemo(() =>
    stats.monthlyRevenue.map((value, i) => ({
      name: MONTH_LABELS[(now.getMonth() - 11 + i + 12) % 12],
      value,
    })),
    [stats.monthlyRevenue]
  );

  const conversionRate = stats.totalLeads > 0
    ? ((stats.totalCustomers / stats.totalLeads) * 100).toFixed(1)
    : '0.0';

  const avgDealSize = stats.openDeals > 0
    ? Math.round(stats.pipelineRevenue / stats.openDeals)
    : 0;

  const cur = stats.monthlyRevenue[11] ?? 0;
  const prev = stats.monthlyRevenue[10] ?? 0;
  const momGrowth = prev > 0 ? (((cur - prev) / prev) * 100).toFixed(1) : '0.0';
  const momUp = cur >= prev;

  const statCards = [
    { label: 'Conversion Rate',  value: `${conversionRate}%`,           change: `${stats.totalLeads} leads tracked`,    icon: Target,   up: true   },
    { label: 'Avg Deal Size',    value: fmtK(avgDealSize),               change: `${stats.openDeals} active deals`,      icon: DollarSign, up: true },
    { label: 'MoM Revenue',      value: `${momGrowth}%`,                 change: 'vs previous month',                    icon: Activity, up: momUp  },
    { label: 'Active Accounts',  value: stats.totalCustomers.toString(), change: `${stats.totalLeads} total leads`,      icon: Users,    up: true   },
  ];

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Analytics</h2>
          <p className="text-[#6b7280] text-sm sm:text-lg font-medium">Deep dive into your organization's performance metrics.</p>
        </div>
        <button type="button" className="btn-secondary shrink-0 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Last 12 Months
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 lg:p-6 floating-card space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#bbbbbb] uppercase tracking-[0.2em] leading-tight">{stat.label}</span>
              <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center border border-white shrink-0">
                <stat.icon className="w-4 h-4 text-black" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl lg:text-[40px] font-bold tracking-tight leading-tight mb-2">{stat.value}</h3>
              <div className={cn('flex items-center gap-1 text-[10px] font-bold', stat.up ? 'text-green-600' : 'text-red-500')}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-8 p-6 lg:p-10 floating-card">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-xl font-bold tracking-tight">Revenue Trajectory</h3>
              </div>
              <p className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-[0.2em]">12-month gross volume</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live</span>
            </div>
          </div>
          <div className="h-[300px] lg:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#000000" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#bbbbbb', fontSize: 10, fontWeight: 700 }}
                  dy={12}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#bbbbbb', fontSize: 10, fontWeight: 700 }}
                  tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
                  width={45}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '12px' }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#000000"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#000' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Pie */}
        <div className="lg:col-span-4 p-6 lg:p-10 floating-card flex flex-col">
          <div className="space-y-1 mb-6">
            <h3 className="text-xl font-bold tracking-tight">Channel Distribution</h3>
            <p className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-[0.2em]">Lead origination sources</p>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SOURCE_DATA} innerRadius={65} outerRadius={105} paddingAngle={4} dataKey="value">
                  {SOURCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', fontWeight: 700, fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {SOURCE_DATA.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', item.dot)} />
                <div>
                  <p className="text-[11px] font-bold text-black leading-tight">{item.name}</p>
                  <p className="text-[9px] font-bold text-[#bbbbbb] uppercase tracking-widest">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {[
          { label: 'Pipeline Revenue', value: fmtK(stats.pipelineRevenue), sub: 'All active deals',   dark: true  },
          { label: 'Won Revenue',      value: fmtK(stats.wonRevenue),      sub: 'Closed & won',       dark: false },
          { label: 'Open Deals',       value: stats.openDeals.toString(),  sub: 'Across all stages',  dark: false },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className={cn('p-6 lg:p-8 rounded-[28px]', item.dark ? 'bg-black text-white' : 'floating-card')}
          >
            <p className={cn('text-[10px] font-bold uppercase tracking-[0.2em] mb-4', item.dark ? 'text-gray-500' : 'text-[#bbbbbb]')}>
              {item.label}
            </p>
            <h3 className="text-4xl lg:text-[48px] font-bold tracking-tight leading-none">{item.value}</h3>
            <p className={cn('text-[11px] font-bold mt-3 uppercase tracking-widest', item.dark ? 'text-gray-600' : 'text-[#bbbbbb]')}>
              {item.sub}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
