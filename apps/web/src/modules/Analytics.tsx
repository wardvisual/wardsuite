import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const REVENUE_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const SOURCE_DATA = [
  { name: 'Direct', value: 400 },
  { name: 'Referral', value: 300 },
  { name: 'Social', value: 300 },
  { name: 'Email', value: 200 },
];

const COLORS = ['#000000', '#333333', '#666666', '#999999'];

export default function Analytics() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-[42px] font-black tracking-tight text-black leading-tight">Data Intelligence</h2>
          <p className="text-[#6b7280] text-sm sm:text-lg font-medium">Deep dive into your organization's performance metrics.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="flex items-center gap-2 px-6 h-14 bg-gray-50 border border-[#f1f1f1] rounded-[20px] text-sm font-black uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-8">
        {[
          { label: 'Conversion Rate', value: '4.2%', change: '+12%', icon: Target, up: true },
          { label: 'Avg Deal Size', value: '$12.4k', change: '+8%', icon: DollarSign, up: true },
          { label: 'Pipeline Velocity', value: '18 Days', change: '-2 Days', icon: Activity, up: true },
          { label: 'Active Leads', value: '1,240', change: '+5%', icon: Users, up: true },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 floating-card space-y-6"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">{stat.label}</span>
              <div className="w-12 h-12 rounded-2xl bg-[#f5f5f5] flex items-center justify-center border border-white">
                <stat.icon className="w-6 h-6 text-black" />
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-black tracking-tight">{stat.value}</h3>
              <div className={cn("flex items-center gap-1 mt-3 text-xs font-black", stat.up ? "text-green-600" : "text-red-600")}>
                {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
                <span className="text-[#bbbbbb] ml-1 uppercase tracking-widest">Growth</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 p-6 lg:p-10 floating-card">
          <div className="flex justify-between items-center mb-10">
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tight">Revenue Trajectory</h3>
              <p className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Gross volume forecast</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-black rounded-lg">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Live</span>
              </div>
            </div>
          </div>
          <div className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#bbbbbb', fontSize: 10, fontWeight: 900 }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#bbbbbb', fontSize: 10, fontWeight: 900 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                      fontWeight: 900,
                      fontSize: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#000000" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 p-6 lg:p-10 floating-card flex flex-col">
          <div className="space-y-1 mb-10">
            <h3 className="text-xl font-black tracking-tight">Channel Distribution</h3>
            <p className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Lead origination sources</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SOURCE_DATA}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SOURCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
             {SOURCE_DATA.map((item, i) => (
               <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <div>
                    <p className="text-[10px] font-black text-black leading-tight">{item.name}</p>
                    <p className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-widest">{item.value} units</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
