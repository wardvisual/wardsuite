import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Shield, Zap, Layout, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="top-0 right-0 left-0 z-50 fixed border-[#f1f1f1] bg-white/80 backdrop-blur-md border-b">
        <div className="flex justify-between items-center mx-auto px-6 max-w-7xl h-20">
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center bg-black rounded w-8 h-8">
              <span className="font-bold text-white text-xs">W</span>
            </div>
            <span className="font-bold text-xl tracking-tight">WardSuiteCRM</span>
          </div>
          <div className="md:flex items-center gap-8 hidden">
            <a href="#features" className="font-medium text-[#6b7280] text-sm hover:text-black transition-colors">Features</a>
            <a href="#pricing" className="font-medium text-[#6b7280] text-sm hover:text-black transition-colors">Pricing</a>
            <a href="#company" className="font-medium text-[#6b7280] text-sm hover:text-black transition-colors">Company</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:opacity-70 font-semibold text-sm transition-opacity">Login</Link>
            <Link to="/login" className="bg-black hover:opacity-90 px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-opacity">
              Start Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-32 pb-20">
        <div className="space-y-8 mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mx-auto max-w-4xl font-bold text-5xl md:text-7xl leading-[1.1] tracking-tight">
              The Operating System for <br />
              <span className="text-[#6b7280]">High-Growth</span> Sales
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl font-medium text-[#6b7280] text-lg md:text-xl"
          >
            Streamline your pipeline, automate workflows, and unlock actionable insights with the next generation of sales intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex sm:flex-row flex-col justify-center items-center gap-4"
          >
            <Link to="/login" className="flex items-center gap-2 bg-black hover:opacity-90 shadow-black/10 shadow-xl px-8 py-4 rounded-full font-bold text-base text-white transition-all">
              Get Started For Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="flex items-center gap-2 border-[#e5e7eb] bg-white hover:bg-gray-50 px-8 py-4 border rounded-full font-bold text-base text-black transition-all">
              <PlayCircle className="w-5 h-5" />
              Request Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview (Image 2 style) */}
      <section className="px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="shadow-2xl shadow-black/5 mx-auto max-w-6xl overflow-hidden glass-card"
        >
          {/* Mock Dashboard UI */}
          <div className="flex bg-white h-[600px]">
            <aside className="md:block space-y-8 border-[#f1f1f1] hidden bg-white p-6 border-r w-64">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-black rounded w-8 h-8">
                   <span className="font-bold text-white text-xs">W</span>
                </div>
                <div>
                   <p className="font-bold text-black text-sm">WardSuiteCRM</p>
                   <p className="font-bold text-[#6b7280] text-[10px] uppercase tracking-widest">Enterprise</p>
                </div>
              </div>
              <nav className="space-y-1">
                {['Intelligence', 'Pipelines', 'Analytics', 'Resources'].map((item, i) => (
                  <div key={item} className={i === 0 ? "bg-gray-50 border border-[#f1f1f1] p-3 rounded-xl flex items-center justify-between" : "p-3 rounded-xl flex items-center justify-between text-[#6b7280]"}>
                    <div className="flex items-center gap-3">
                       <Layout className="w-4 h-4" />
                       <span className="font-bold text-sm">{item}</span>
                    </div>
                    {i === 0 && <div className="bg-black shadow-[0_0_8px_rgba(0,0,0,0.5)] rounded-full w-1.5 h-1.5" />}
                  </div>
                ))}
              </nav>
            </aside>
            <main className="flex-1 bg-[#fafafa] p-10">
              <div className="flex justify-between items-center mb-12">
                <div className="space-y-1">
                   <h2 className="font-bold text-[#111111] text-[32px] tracking-tight">Intelligence Report</h2>
                   <p className="font-medium text-[#6b7280] text-sm">Monitoring real-time acquisition performance.</p>
                </div>
                <div className="flex items-center gap-2 border-[#f1f1f1] bg-white shadow-sm px-4 py-2 border rounded-full font-black text-[#6b7280] text-[10px] uppercase tracking-widest">
                    <div className="bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] rounded-full w-2 h-2 animate-pulse" />
                    LIVE Sync active
                </div>
              </div>

              <div className="gap-6 grid grid-cols-3 mb-8">
                {[
                  { label: 'Forecast', value: '$840k', change: '+22%', trend: 'up' },
                  { label: 'Conversion', value: '18.4%', change: '+5.2%', trend: 'up' },
                  { label: 'Efficiency', value: '94%', change: '+3%', trend: 'up' },
                ].map((stat, i) => (
                  <div key={i} className="relative border-[#f1f1f1] bg-white shadow-sm p-6 border rounded-2xl overflow-hidden group">
                    <p className="mb-4 font-black text-[#6b7280] text-[9px] uppercase tracking-[0.2em]">{stat.label}</p>
                    <div className="relative z-10 flex justify-between items-baseline">
                      <h3 className="font-light text-4xl tracking-tight">{stat.value}</h3>
                      <span className="bg-black px-2 py-0.5 rounded font-black text-[10px] text-white uppercase tracking-tighter">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="relative flex items-end gap-1 border-[#f1f1f1] bg-white shadow-sm p-8 border rounded-3xl h-56 overflow-hidden">
                 {[30, 45, 35, 60, 50, 80, 55, 95, 70, 40, 85, 65, 75, 45, 90, 60, 80, 50, 70].map((h, j) => (
                    <motion.div 
                      key={j} 
                      initial={{ height: 0 }}
                      whileInView={{ height: h + '%' }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.05, duration: 0.8, ease: "easeOut" }}
                      className="flex-1 bg-[#111111] hover:bg-[#6b7280] rounded-t-lg transition-all" 
                    />
                 ))}
              </div>
            </main>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-[#fafafa] px-6 py-32">
        <div className="space-y-20 mx-auto max-w-7xl">
          <div className="space-y-4 text-center">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-black text-[#6b7280] text-[10px] uppercase tracking-[0.4em]"
            >
              Enterprise Capabilities
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-bold text-[#111111] text-[42px] tracking-tight"
            >
              Everything you need to <span className="text-[#6b7280]">scale.</span>
            </motion.h2>
          </div>

          <div className="gap-8 grid md:grid-cols-3">
            {[
              { title: 'Global SCM', desc: 'Manage vendors and inventory across multiple regions with real-time stock sync.', icon: Layout },
              { title: 'Predictive CRM', desc: 'AI-driven lead scoring and automated pipeline management for sales teams.', icon: Zap },
              { title: 'Ironclad Security', desc: 'Enterprise-grade encryption and comprehensive audit trails for all events.', icon: Shield },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-50px" }}
                transition={{ delay: i * 0.2 }}
                className="border-[#f1f1f1] bg-white hover:shadow-2xl hover:shadow-black/5 p-10 border rounded-[32px] transition-all group"
              >
                <div className="group-hover:bg-black group-hover:text-white group-hover:scale-110 flex justify-center items-center border-[#f1f1f1] bg-gray-50 mb-8 border rounded-2xl w-14 h-14 transition-all">
                   <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="mb-4 font-bold text-2xl">{feature.title}</h3>
                <p className="font-medium text-[#6b7280] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-[#f1f1f1] py-24 border-t">
        <div className="mx-auto px-6 max-w-7xl text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-16 font-black text-[#6b7280] text-[10px] uppercase tracking-[0.2em]"
          >
            Engineering Excellence &middot; Certified Ops &middot; Global Trust
          </motion.p>
          <div className="items-center gap-12 grid grid-cols-2 md:grid-cols-4 opacity-30 grayscale">
            {['STRIKE', 'NEBULA', 'ORION', 'VERTEX'].map((brand, i) => (
              <motion.span 
                 key={brand}
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="font-black text-3xl italic tracking-tighter"
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
