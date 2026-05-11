import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Shield, Zap, BarChart3, PlayCircle, Target, DollarSign, Users, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DUMMY_BARS = [18, 32, 26, 48, 38, 62, 50, 74, 58, 70, 82, 91];
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const DUMMY_STATS = [
  { label: 'CONVERSION RATE', value: '24.3%', change: '312 leads', icon: Target },
  { label: 'FORECAST REVENUE', value: '$842k', change: '28 active deals', icon: DollarSign },
  { label: 'NETWORK REACH', value: '340', change: '312 total leads', icon: Users },
  { label: 'WON REVENUE', value: '$1.2M', change: 'closed deals', icon: TrendingUp },
];

const DUMMY_FLOW = [
  { name: 'Nexus Capital', handle: 'NEXUS_CAP', amount: '$48,000', status: 'WON', initial: 'N' },
  { name: 'Orbit Systems', handle: 'ORBIT_SCM', amount: '$12,400', status: 'OPEN', initial: 'O' },
  { name: 'Vertex Group', handle: 'VERTEX_B2B', amount: '$7,800', status: 'WON', initial: 'V' },
];

function DashboardPreview() {
  return (
    <div className="flex bg-[#fafafa] rounded-[28px] h-[600px] overflow-hidden border border-[#f1f1f1]">
      {/* Sidebar */}
      <aside className="md:flex flex-col hidden bg-white border-r border-[#f1f1f1] w-60 p-6 shrink-0 gap-8">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-black rounded-lg w-8 h-8 shrink-0">
            <span className="font-bold text-white text-xs">W</span>
          </div>
          <div>
            <p className="font-bold text-black text-sm leading-tight">WardSuite ERP</p>
            <p className="font-bold text-[#6b7280] text-[10px] uppercase tracking-widest">Enterprise</p>
          </div>
        </div>
        <nav className="space-y-1">
          {[
            { label: 'Dashboard', active: true },
            { label: 'CRM Pipeline', active: false },
            { label: 'Supply Chain', active: false },
            { label: 'Analytics', active: false },
            { label: 'Settings', active: false },
          ].map((item) => (
            <div
              key={item.label}
              className={`px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-bold transition-colors ${
                item.active ? 'bg-[#f5f5f5] text-black' : 'text-[#6b7280]'
              }`}
            >
              <span>{item.label}</span>
              {item.active && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-[#111111] text-2xl tracking-tight">Dashboard Summary</h2>
            <p className="font-medium text-[#6b7280] text-sm mt-1">Real-time overview of performance metrics.</p>
          </div>
          <div className="flex items-center gap-2 border border-[#f1f1f1] bg-white shadow-sm px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-black text-[#6b7280] text-[10px] uppercase tracking-widest">Live</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {DUMMY_STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="floating-card p-5 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-bold text-[#bbbbbb] uppercase tracking-[0.15em] leading-tight">{stat.label}</span>
                <div className="w-9 h-9 rounded-full bg-[#f5f5f5] flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-black" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-[#111111]">{stat.value}</h3>
                <span className="text-[10px] font-bold text-[#111111] bg-[#f5f5f5] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit mt-2">
                  <TrendingUp className="w-2.5 h-2.5" />
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Revenue chart + Recent flow */}
        <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
          <div className="col-span-8 floating-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <h3 className="text-sm font-bold">Revenue Dynamics</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">12-Month</span>
              </div>
            </div>
            <div className="flex-1 flex items-end gap-1 pb-5 relative">
              {DUMMY_BARS.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full bg-black/[0.06] hover:bg-black/[0.12] rounded-t-md transition-colors"
                    style={{ height: `${h}%` }}
                    initial={{ scaleY: 0, originY: 1 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
                  />
                  <span className="text-[8px] font-bold text-[#cccccc] uppercase">{MONTH_LABELS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4 floating-card p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-5 shrink-0">
              <Calendar className="w-4 h-4" />
              <h3 className="text-sm font-bold">Recent Flow</h3>
            </div>
            <div className="space-y-4 flex-1">
              {DUMMY_FLOW.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 border border-[#f8f8f8] flex items-center justify-center font-bold text-[#6b7280] text-sm">
                      {item.initial}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111111]">{item.name}</p>
                      <p className="text-[9px] text-[#9ca3af] font-bold uppercase tracking-widest">{item.handle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold">{item.amount}</p>
                    <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-full ${
                      item.status === 'WON' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-[#6b7280]'
                    }`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="w-full mt-4 py-2.5 bg-gray-50 border border-[#f1f1f1] rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors">
              Full Pipeline
              <ArrowUpRight className="w-3 h-3 opacity-50" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="top-0 right-0 left-0 z-50 fixed border-[#f1f1f1] bg-white/80 backdrop-blur-md border-b">
        <div className="flex justify-between items-center mx-auto px-6 max-w-7xl h-20">
          <div className="flex items-center gap-2.5">
            <div className="flex justify-center items-center bg-black rounded-lg w-8 h-8">
              <span className="font-bold text-white text-xs">W</span>
            </div>
            <span className="font-bold text-xl tracking-tight">WardSuite</span>
          </div>
          <div className="md:flex items-center gap-8 hidden">
            <a href="#features" className="font-medium text-[#6b7280] text-sm hover:text-black transition-colors">Platform</a>
            <a href="#pricing" className="font-medium text-[#6b7280] text-sm hover:text-black transition-colors">Pricing</a>
            <a href="#company" className="font-medium text-[#6b7280] text-sm hover:text-black transition-colors">Enterprise</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:opacity-70 font-semibold text-sm transition-opacity">Sign In</Link>
            <Link to="/login" className="bg-black hover:opacity-90 px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-opacity">
              Request Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-32 pb-20">
        <div className="space-y-8 mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 border border-[#f1f1f1] bg-[#fafafa] px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-[#6b7280]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Enterprise Business Suite
            </div>
            <h1 className="mx-auto max-w-4xl font-bold text-5xl md:text-7xl leading-[1.08] tracking-tight">
              One Platform.<br />
              <span className="text-[#6b7280]">Every Revenue Operation.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl font-medium text-[#6b7280] text-lg md:text-xl leading-relaxed"
          >
            WardSuite consolidates your CRM, supply chain, procurement, and financial reporting into a single intelligent workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex sm:flex-row flex-col justify-center items-center gap-4"
          >
            <Link to="/login" className="flex items-center gap-2 bg-black hover:opacity-90 shadow-black/10 shadow-xl px-8 py-4 rounded-full font-bold text-base text-white transition-all">
              Start for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button type="button" className="flex items-center gap-2 border-[#e5e7eb] bg-white hover:bg-gray-50 px-8 py-4 border rounded-full font-bold text-base text-black transition-all">
              <PlayCircle className="w-5 h-5" />
              Watch Platform Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center items-center gap-8 pt-4"
          >
            {['SOC 2 Certified', 'GDPR Compliant', 'Enterprise SLA'].map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-[11px] font-bold text-[#6b7280] uppercase tracking-widest">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-6xl shadow-[0_40px_120px_-20px_rgba(0,0,0,0.08)] rounded-[32px]"
        >
          <DashboardPreview />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#fafafa] px-6 py-32">
        <div className="space-y-20 mx-auto max-w-7xl">
          <div className="space-y-4 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-black text-[#6b7280] text-[10px] uppercase tracking-[0.4em]"
            >
              Platform Capabilities
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-bold text-[#111111] text-[42px] tracking-tight"
            >
              Infrastructure for <span className="text-[#6b7280]">serious operators.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-xl font-medium text-[#6b7280] text-base"
            >
              Every module is designed for enterprise-grade reliability, with role-based access, full audit trails, and a repository-pattern data layer that adapts to any database.
            </motion.p>
          </div>

          <div className="gap-8 grid md:grid-cols-3">
            {[
              {
                title: 'Unified CRM Intelligence',
                desc: 'Manage the full revenue lifecycle — from first-touch lead capture through pipeline stages, deal closure, and customer retention — in one place.',
                icon: BarChart3,
              },
              {
                title: 'Supply Chain Command',
                desc: 'Real-time supplier management, inventory tracking, purchase request approvals, and stock movement visibility across your entire supply network.',
                icon: Zap,
              },
              {
                title: 'Enterprise Audit Trail',
                desc: 'Every action across CRM, SCM, and HR is automatically logged with actor, timestamp, and delta — giving compliance teams complete traceability.',
                icon: Shield,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15 }}
                className="floating-card p-10 group"
              >
                <div className="group-hover:bg-black group-hover:text-white group-hover:scale-110 flex justify-center items-center border-[#f1f1f1] bg-gray-50 mb-8 border rounded-2xl w-14 h-14 transition-all">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="mb-4 font-bold text-2xl tracking-tight">{feature.title}</h3>
                <p className="font-medium text-[#6b7280] leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-[#f1f1f1] py-24 border-t">
        <div className="mx-auto px-6 max-w-7xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 font-black text-[#6b7280] text-[10px] uppercase tracking-[0.3em]"
          >
            Trusted by operators across logistics · finance · professional services
          </motion.p>
          <div className="items-center gap-12 grid grid-cols-2 md:grid-cols-4 opacity-20 grayscale">
            {['MERIDIAN', 'AXIOM', 'CRESTLINE', 'HELIX'].map((brand, i) => (
              <motion.span
                key={brand}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="font-black text-3xl italic tracking-tighter"
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-black text-white mx-auto max-w-4xl rounded-[40px] p-16 text-center space-y-8 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10 space-y-6">
            <p className="font-black text-white/50 text-[10px] uppercase tracking-[0.4em]">Ready to Deploy</p>
            <h2 className="font-bold text-4xl md:text-5xl tracking-tight leading-tight">
              Bring your operations<br />into one command center.
            </h2>
            <p className="font-medium text-white/60 text-base max-w-md mx-auto leading-relaxed">
              Start with CRM, expand into SCM and HR. WardSuite scales with your organization's complexity.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link
                to="/login"
                className="flex items-center gap-2 bg-white text-black hover:opacity-90 px-8 py-4 rounded-full font-bold text-sm transition-all"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button type="button" className="flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-sm transition-all">
                Schedule a Demo
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
