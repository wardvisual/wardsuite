import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Shield, Zap, Layout, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f1f1f1]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="text-xl font-bold tracking-tight">WisedCRM</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[#6b7280] hover:text-black transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-[#6b7280] hover:text-black transition-colors">Pricing</a>
            <a href="#company" className="text-sm font-medium text-[#6b7280] hover:text-black transition-colors">Company</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold hover:opacity-70 transition-opacity">Login</Link>
            <Link to="/login" className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
              Start Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto">
              The Operating System for <br />
              <span className="text-[#6b7280]">High-Growth</span> Sales
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[#6b7280] max-w-2xl mx-auto font-medium"
          >
            Streamline your pipeline, automate workflows, and unlock actionable insights with the next generation of sales intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login" className="px-8 py-4 bg-black text-white rounded-full text-base font-bold hover:opacity-90 shadow-xl shadow-black/10 transition-all flex items-center gap-2">
              Get Started For Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 bg-white border border-[#e5e7eb] text-black rounded-full text-base font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
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
          className="max-w-6xl mx-auto glass-card overflow-hidden shadow-2xl shadow-black/5"
        >
          {/* Mock Dashboard UI */}
          <div className="flex h-[600px] bg-white">
            <aside className="w-64 border-r border-[#f1f1f1] p-6 space-y-8 hidden md:block bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                   <span className="text-white font-bold text-xs">W</span>
                </div>
                <div>
                   <p className="text-sm font-bold text-black">WisedCRM</p>
                   <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest">Enterprise</p>
                </div>
              </div>
              <nav className="space-y-1">
                {['Intelligence', 'Pipelines', 'Analytics', 'Resources'].map((item, i) => (
                  <div key={item} className={i === 0 ? "bg-gray-50 border border-[#f1f1f1] p-3 rounded-xl flex items-center justify-between" : "p-3 rounded-xl flex items-center justify-between text-[#6b7280]"}>
                    <div className="flex items-center gap-3">
                       <Layout className="w-4 h-4" />
                       <span className="text-sm font-bold">{item}</span>
                    </div>
                    {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.5)]" />}
                  </div>
                ))}
              </nav>
            </aside>
            <main className="flex-1 p-10 bg-[#fafafa]">
              <div className="flex justify-between items-center mb-12">
                <div className="space-y-1">
                   <h2 className="text-[32px] font-bold tracking-tight text-[#111111]">Intelligence Report</h2>
                   <p className="text-sm text-[#6b7280] font-medium">Monitoring real-time acquisition performance.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 border border-[#f1f1f1] rounded-full text-[10px] font-black uppercase tracking-widest text-[#6b7280] shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                    LIVE Sync active
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { label: 'Forecast', value: '$840k', change: '+22%', trend: 'up' },
                  { label: 'Conversion', value: '18.4%', change: '+5.2%', trend: 'up' },
                  { label: 'Efficiency', value: '94%', change: '+3%', trend: 'up' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-[#f1f1f1] shadow-sm relative overflow-hidden group">
                    <p className="text-[9px] font-black uppercase text-[#6b7280] tracking-[0.2em] mb-4">{stat.label}</p>
                    <div className="flex items-baseline justify-between relative z-10">
                      <h3 className="text-4xl font-light tracking-tight">{stat.value}</h3>
                      <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded uppercase tracking-tighter">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white border border-[#f1f1f1] rounded-3xl p-8 relative overflow-hidden shadow-sm h-56 flex items-end gap-1">
                 {[30, 45, 35, 60, 50, 80, 55, 95, 70, 40, 85, 65, 75, 45, 90, 60, 80, 50, 70].map((h, j) => (
                    <motion.div 
                      key={j} 
                      initial={{ height: 0 }}
                      whileInView={{ height: h + '%' }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.05, duration: 0.8, ease: "easeOut" }}
                      className="flex-1 bg-[#111111] rounded-t-lg transition-all hover:bg-[#6b7280]" 
                    />
                 ))}
              </div>
            </main>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6b7280]"
            >
              Enterprise Capabilities
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[42px] font-bold tracking-tight text-[#111111]"
            >
              Everything you need to <span className="text-[#6b7280]">scale.</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                className="p-10 bg-white rounded-[32px] border border-[#f1f1f1] hover:shadow-2xl hover:shadow-black/5 transition-all group"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 border border-[#f1f1f1] group-hover:bg-black group-hover:text-white transition-all group-hover:scale-110">
                   <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-[#6b7280] font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 border-t border-[#f1f1f1]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-black text-[#6b7280] uppercase tracking-[0.2em] mb-16"
          >
            Engineering Excellence &middot; Certified Ops &middot; Global Trust
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30 grayscale items-center">
            {['STRIKE', 'NEBULA', 'ORION', 'VERTEX'].map((brand, i) => (
              <motion.span 
                 key={brand}
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="text-3xl font-black italic tracking-tighter"
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
