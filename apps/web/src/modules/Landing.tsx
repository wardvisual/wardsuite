import { motion } from 'motion/react';
import {
  ArrowRight, CheckCircle, Shield, Zap, BarChart3, PlayCircle,
  Target, DollarSign, Users, TrendingUp, Calendar, ArrowUpRight,
  Github, ExternalLink, LayoutGrid, BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/src/components/ui/Logo';

const DUMMY_BARS = [18, 32, 26, 48, 38, 62, 50, 74, 58, 70, 82, 91];
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CHART_HEIGHT = 120;

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
    <div className="flex border-[#f1f1f1] bg-[#fafafa] border rounded-[28px] h-[580px] overflow-hidden">
      <aside className="md:flex flex-col gap-8 border-[#f1f1f1] hidden bg-white p-6 border-r w-56 shrink-0">
        <Logo size="xs" className="px-1" />
        <nav className="space-y-1">
          {[
            { label: 'Dashboard', active: true },
            { label: 'CRM Pipeline', active: false },
            { label: 'Supply Chain', active: false },
            { label: 'Analytics', active: false },
            { label: 'Settings', active: false },
          ].map((item) => (
            <div key={item.label} className={`px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-bold ${item.active ? 'bg-[#f5f5f5] text-black' : 'text-[#6b7280]'}`}>
              <span>{item.label}</span>
              {item.active && <div className="bg-black rounded-full w-1.5 h-1.5" />}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex flex-col flex-1 gap-5 p-8 overflow-hidden">
        <div className="flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-bold text-[#111111] text-xl tracking-tight">Dashboard Summary</h2>
            <p className="mt-1 font-medium text-[#6b7280] text-xs">Real-time overview of performance metrics.</p>
          </div>
          <div className="flex items-center gap-2 border-[#f1f1f1] bg-white shadow-sm px-4 py-2 border rounded-full">
            <div className="bg-green-500 rounded-full w-2 h-2 animate-pulse" />
            <span className="font-black text-[#6b7280] text-[10px] uppercase tracking-widest">Live</span>
          </div>
        </div>

        <div className="gap-3 grid grid-cols-2 sm:grid-cols-4 shrink-0">
          {DUMMY_STATS.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="floating-card space-y-2 p-4">
              <div className="flex justify-between items-start">
                <span className="font-bold text-[#bbbbbb] text-[8px] uppercase leading-tight tracking-[0.15em]">{stat.label}</span>
                <div className="flex justify-center items-center bg-[#f5f5f5] rounded-full w-7 h-7 shrink-0">
                  <stat.icon className="w-3.5 h-3.5 text-black" />
                </div>
              </div>
              <h3 className="font-bold text-[#111111] text-xl tracking-tight">{stat.value}</h3>
              <span className="inline-flex items-center gap-1 bg-[#f5f5f5] px-2 py-0.5 rounded-full font-bold text-[#111111] text-[9px]">
                <TrendingUp className="w-2 h-2" />{stat.change}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex-1 gap-4 hidden sm:grid grid-cols-12 min-h-0">
          <div className="floating-card flex flex-col col-span-8 p-5">
            <div className="flex justify-between items-center mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <h3 className="font-bold text-xs">Revenue Dynamics</h3>
              </div>
              <span className="font-bold text-[#6b7280] text-[9px] uppercase tracking-widest">12-Month</span>
            </div>
            <div className="flex flex-col flex-1 justify-end">
              <div className="flex items-end gap-1" style={{ height: CHART_HEIGHT }}>
                {DUMMY_BARS.map((h, i) => {
                  const barH = Math.round((h / 100) * CHART_HEIGHT);
                  return (
                    <div key={i} className="flex flex-col flex-1 justify-end items-center gap-1">
                      <motion.div
                        className="bg-black/[0.07] hover:bg-black/[0.14] rounded-t-sm w-full transition-colors"
                        initial={{ height: 0 }}
                        whileInView={{ height: barH }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04, duration: 0.55, ease: 'easeOut' }}
                      />
                      <span className="font-bold text-[#cccccc] text-[7px] uppercase">{MONTH_LABELS[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="floating-card flex flex-col col-span-4 p-5">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              <h3 className="font-bold text-xs">Recent Flow</h3>
            </div>
            <div className="flex-1 space-y-3">
              {DUMMY_FLOW.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex justify-center items-center border-[#f8f8f8] bg-gray-50 border rounded-xl w-8 h-8 font-bold text-[#6b7280] text-xs shrink-0">{item.initial}</div>
                    <div>
                      <p className="font-bold text-[#111111] text-[11px]">{item.name}</p>
                      <p className="font-bold text-[#9ca3af] text-[8px] uppercase tracking-widest">{item.handle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[11px]">{item.amount}</p>
                    <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full ${item.status === 'WON' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-[#6b7280]'}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="flex justify-center items-center gap-1 border-[#f1f1f1] bg-gray-50 hover:bg-gray-100 mt-4 py-2 border rounded-xl w-full font-black text-[8px] uppercase tracking-[0.2em] transition-colors">
              Full Pipeline <ArrowUpRight className="opacity-50 w-3 h-3" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function LandingFooter() {
  return (
    <footer className="border-[#f1f1f1] bg-white border-t">
      <div className="mx-auto px-6 py-16 max-w-7xl">
        <div className="gap-12 grid grid-cols-1 sm:grid-cols-12">
          <div className="space-y-6 sm:col-span-4">
            <Logo size="sm" />
            <p className="max-w-xs font-medium text-[#6b7280] text-sm leading-relaxed">
              A personal ERP vision — built in public. CRM, SCM, and beyond, crafted for real operational complexity.
            </p>
            <a href="https://github.com/wardvisual/wardsuite" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:opacity-70 font-bold text-[#111111] text-sm transition-opacity">
              <Github className="w-4 h-4" /> wardvisual
            </a>
          </div>
          <div className="space-y-4 sm:col-span-2 sm:col-start-6">
            <p className="font-black text-[#111111] text-[10px] uppercase tracking-[0.2em]">Platform</p>
            {['CRM Pipeline', 'Supply Chain', 'Analytics', 'Dashboard', 'Settings'].map(l => (
              <p key={l} className="font-medium text-[#6b7280] text-sm hover:text-black transition-colors cursor-pointer">{l}</p>
            ))}
          </div>
          <div className="space-y-4 sm:col-span-2">
            <p className="font-black text-[#111111] text-[10px] uppercase tracking-[0.2em]">Developer</p>
            <Link to="/case-study" className="block font-medium text-[#6b7280] text-sm hover:text-black transition-colors">Case Study</Link>
            {['GitHub', 'Roadmap', 'Changelog'].map(l => (
              <p key={l} className="font-medium text-[#6b7280] text-sm hover:text-black transition-colors cursor-pointer">{l}</p>
            ))}
          </div>
          <div className="space-y-4 sm:col-span-2">
            <p className="font-black text-[#111111] text-[10px] uppercase tracking-[0.2em]">Legal</p>
            {['MIT License', 'Privacy Policy', 'Terms of Use'].map(l => (
              <p key={l} className="font-medium text-[#6b7280] text-sm hover:text-black transition-colors cursor-pointer">{l}</p>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-[#f5f5f5] mt-16 pt-8 border-t">
          <p className="font-bold text-[#bbbbbb] text-[11px] uppercase tracking-widest">
            © {new Date().getFullYear()} Eduardo. — Built as a personal ERP vision.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/wardvisual/wardsuite" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-bold text-[#bbbbbb] text-[11px] hover:text-black uppercase tracking-widest transition-colors">
              <ExternalLink className="w-3 h-3" /> Open Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <nav className="top-0 right-0 left-0 z-50 floating-card fixed bg-white/80 backdrop-blur-md border-b">
        <div className="flex justify-between items-center mx-auto px-6 max-w-7xl h-20">
          <Logo size="xs" />

          <div className="md:flex items-center gap-1 hidden">
            <a href="#features" className="flex items-center gap-1.5 hover:bg-[#f5f5f5] px-4 py-2 rounded-full font-medium text-[#6b7280] text-sm hover:text-black transition-all">
              <LayoutGrid className="w-3.5 h-3.5" />Platform
            </a>
            <Link to="/case-study" className="flex items-center gap-1.5 hover:bg-[#f5f5f5] px-4 py-2 rounded-full font-medium text-[#6b7280] text-sm hover:text-black transition-all">
              <BookOpen className="w-3.5 h-3.5" />Case Study
            </Link>
            <a href="https://github.com/wardvisual/wardsuite" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:bg-[#f5f5f5] px-4 py-2 rounded-full font-medium text-[#6b7280] text-sm hover:text-black transition-all">
              <Github className="w-3.5 h-3.5" />GitHub
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hover:bg-[#f5f5f5] px-4 py-2 rounded-full font-semibold text-sm transition-all">Sign In</Link>
            <Link to="/login" className="flex items-center gap-1.5 bg-black hover:opacity-90 px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-opacity">
              Get Access <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="px-6 pt-32 pb-20">
      <div className="space-y-8 mx-auto max-w-7xl text-center">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="space-y-7"
  >
    <div className="flex justify-center items-center gap-3">
      <div className="bg-[#d1d5db] w-10 h-px" />
      <span className="font-black text-[#6b7280] text-[11px] uppercase tracking-[0.25em]">
        Revenue Operations Platform
      </span>
      <div className="bg-[#d1d5db] w-10 h-px" />
    </div>

    <h1 className="mx-auto max-w-5xl font-bold text-5xl text-black md:text-7xl leading-[1.08] tracking-tight">
      Close deals without
      <br />
      <span className="text-[#6b7280]">losing operational context.</span>
    </h1>
  </motion.div>

  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="mx-auto max-w-3xl font-medium text-[#6b7280] text-lg md:text-xl leading-relaxed"
  >
    WardSuite brings leads, customer records, stock visibility, supply chain coordination, and audit tracking into one workflow so revenue teams and operations teams stay aligned from quote to delivery.
  </motion.p>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="flex sm:flex-row flex-col justify-center items-center gap-4"
  >
    <Link
      to="/login"
      className="flex items-center gap-2 bg-black hover:opacity-90 shadow-black/10 shadow-xl px-8 py-4 rounded-full font-bold text-base text-white transition-all"
    >
      Start for Free
      <ArrowRight className="w-5 h-5" />
    </Link>

    <button
      type="button"
      className="flex items-center gap-2 border-[#e5e7eb] bg-white hover:bg-gray-50 px-8 py-4 border rounded-full font-bold text-base text-black transition-all"
    >
      <PlayCircle className="w-5 h-5" />
      Watch Demo
    </button>
  </motion.div>

  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.8 }}
    className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 pt-4"
  >
   {['Full Audit Trail', 'One Shared Source of Truth', 'Open Source'].map((b) => (
      <div
        key={b}
        className="flex items-center gap-2 font-bold text-[#6b7280] text-[11px] uppercase tracking-widest"
      >
        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
        {b}
      </div>
    ))}
  </motion.div>
</div>
      </section>

      <section className="px-6 pb-28">
        <motion.div initial={{ opacity: 0, scale: 0.97, y: 40 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="shadow-[0_40px_120px_-20px_rgba(0,0,0,0.08)] mx-auto rounded-[32px] max-w-6xl">
          <DashboardPreview />
        </motion.div>
      </section>

      <section id="features" className="bg-[#fafafa] px-6 py-28">
        <div className="space-y-20 mx-auto max-w-7xl">
          <div className="space-y-4 text-center">
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-black text-[#6b7280] text-[10px] uppercase tracking-[0.4em]">Platform Capabilities</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-bold text-[#111111] text-[42px] tracking-tight">Infrastructure for <span className="text-[#6b7280]">serious operators.</span></motion.h2>
          </div>
          <div className="gap-8 grid md:grid-cols-3">
            {[
              { title: 'Unified CRM Intelligence', desc: 'Manage the full revenue lifecycle — from lead capture through pipeline stages, deal closure, and customer retention — with a full audit trail on every action.', icon: BarChart3 },
              { title: 'Supply Chain Command', desc: 'Real-time supplier management, inventory tracking, purchase request approvals, and stock movement visibility across your entire supply network.', icon: Zap },
              { title: 'Repository-Pattern Architecture', desc: 'Every data layer is database-agnostic. Swap Firestore for Postgres with one line. Services code against interfaces — no vendor lock-in.', icon: Shield },
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: i * 0.15 }} className="floating-card p-10 group">
                <div className="group-hover:bg-black group-hover:text-white group-hover:scale-110 flex justify-center items-center border-[#f1f1f1] bg-gray-50 mb-8 border rounded-2xl w-14 h-14 transition-all">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="mb-4 font-bold text-2xl tracking-tight">{feature.title}</h3>
                <p className="font-medium text-[#6b7280] text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-[#f1f1f1] py-24 border-t">
        <div className="mx-auto px-6 max-w-7xl text-center">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16 font-black text-[#6b7280] text-[10px] uppercase tracking-[0.3em]">Built for operators across logistics · finance · professional services</motion.p>
          <div className="items-center gap-12 grid grid-cols-2 md:grid-cols-4 opacity-20 grayscale">
            {['MERIDIAN', 'AXIOM', 'CRESTLINE', 'HELIX'].map((brand, i) => (
              <motion.span key={brand} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="font-black text-3xl italic tracking-tighter">{brand}</motion.span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-28">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-4xl">
          <div className="relative space-y-8 bg-gradient-to-br from-black via-[#111111] to-[#1a1a1a] p-16 rounded-[40px] text-center cursor-default overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tl from-[#2a2a2a] via-[#111111] to-black opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out" />
            <div className="group-hover:bg-white/[0.06] -top-24 -right-24 absolute bg-white/[0.03] blur-3xl rounded-full w-80 h-80 transition-all duration-700" />
            <div className="group-hover:scale-125 -bottom-16 -left-16 absolute bg-gray-400/[0.04] blur-3xl rounded-full w-64 h-64 transition-all duration-700" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)' }} />
            <div className="relative z-10 space-y-6 text-white">
              <p className="font-black text-[10px] text-white/40 uppercase tracking-[0.4em]">Ready to Deploy</p>
              <h2 className="font-bold text-4xl md:text-5xl leading-tight tracking-tight">Bring your operations<br />into one command center.</h2>
              <p className="mx-auto max-w-md font-medium text-base text-white/50 leading-relaxed">Start with CRM, expand into SCM and HR. WardSuite scales with your organization's operational complexity.</p>
              <div className="flex justify-center gap-4 pt-2">
                <Link to="/login" className="flex items-center gap-2 bg-white hover:bg-gray-100 shadow-black/20 shadow-xl px-8 py-4 rounded-full font-bold text-black text-sm transition-all">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="https://github.com/wardvisual/wardsuite" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border-white/20 hover:bg-white/10 px-8 py-4 border rounded-full font-bold text-sm text-white transition-all">
                  <Github className="w-4 h-4" /> View on GitHub
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <LandingFooter />
    </div>
  );
}
