import { motion } from 'motion/react';
import { ArrowLeft, Github, ExternalLink, Calendar, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/src/components/ui/Logo';
import { PublicImage } from '@/src/components/ui/PublicImage';

const PHASES = [
  { phase: 'Phase 1', title: 'CRM Completion', items: ['Lead scoring & deal probability', 'Revenue forecast view', 'In-app notifications, email integration'] },
  { phase: 'Phase 2', title: 'SCM Depth', items: ['Vendor RFQ workflow', 'Purchase order lifecycle', 'Inventory valuation & COGS tracking'] },
  { phase: 'Phase 3', title: 'Financial Layer', items: ['Invoicing tied to won deals', 'Payment tracking', 'P&L and AR aging reports'] },
  { phase: 'Phase 4', title: 'HR Module', items: ['Employee directory', 'Leave management', 'Payroll integration'] },
  { phase: 'Phase 5', title: 'AI Layer', items: ['Lead scoring via Google Gemini', 'AI-generated activity summaries', 'Deal risk detection'] },
];

const STACK = [
  { layer: 'Frontend', choice: 'React 19 + Vite 6', why: 'Latest React with concurrent features, fast HMR' },
  { layer: 'Styling', choice: 'Tailwind CSS v4', why: 'Utility-first, consistent design tokens' },
  { layer: 'Animations', choice: 'Motion (Framer Motion v12)', why: 'Page transitions, micro-interactions, drag feedback' },
  { layer: 'State', choice: 'Zustand 5', why: 'Lightweight, persisted auth store' },
  { layer: 'Backend', choice: 'Express 4 + TypeScript', why: 'Familiar, fast, easy to reason about' },
  { layer: 'Database', choice: 'Firestore', why: 'Scalable for early stage, swappable later' },
  { layer: 'Monorepo', choice: 'NX', why: 'Task caching, project graph, library boundaries' },
  { layer: 'Deployment', choice: 'Docker + PM2', why: 'VPS-ready, zero-downtime cluster mode' },
];

export default function CaseStudy() {
  return (
    <div className="bg-white min-h-screen">
      {/* Navbar */}
      <nav className="top-0 right-0 left-0 z-50 fixed border-[#f1f1f1] bg-white/80 backdrop-blur-md border-b">
        <div className="flex justify-between items-center mx-auto px-6 max-w-4xl h-20">
          <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-4 h-4 text-[#6b7280]" />
            <Logo size="xs" />
          </Link>
          <div className="flex items-center gap-4">
            <a href="https://github.com/wardvisual" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-bold text-[#6b7280] text-sm hover:text-black transition-colors">
              <Github className="w-4 h-4" /> wardvisual
            </a>
            <Link to="/login" className="flex items-center gap-1.5 bg-black hover:opacity-90 px-4 py-2 rounded-full font-bold text-sm text-white transition-opacity">
              Try It <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </nav>

      <article className="mx-auto px-6 pt-32 pb-24 max-w-4xl">
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6 mb-16">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 border-[#f1f1f1] bg-[#fafafa] px-3 py-1.5 border rounded-full font-black text-[#6b7280] text-[10px] uppercase tracking-[0.2em]">
              <BookOpen className="w-3 h-3" /> Case Study
            </span>
            <div className="flex items-center gap-4 font-bold text-[#9ca3af] text-[11px] uppercase tracking-widest">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> 2025</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 12 min read</span>
            </div>
          </div>
          <h1 className="font-bold text-[#111111] text-4xl md:text-5xl leading-tight tracking-tight">
            Building WardSuite ERP:<br />
            <span className="text-[#6b7280]">A Personal Vision for the Business Operating System I Always Wanted</span>
          </h1>
          <div className="flex items-center gap-4 pt-2">
            <div className="border-[#f1f1f1] bg-[#f5f5f5] border rounded-2xl w-12 h-12 overflow-hidden">
              <PublicImage file="me.png" alt="Eduardo." rounded={false} className="w-12 h-12" imgClassName="object-cover object-center" />
            </div>
            <div>
              <p className="font-bold text-[#111111] text-sm">Eduardo.</p>
              <p className="font-bold text-[#9ca3af] text-[11px] uppercase tracking-widest">Full-Stack Developer · @wardvisual</p>
            </div>
          </div>
        </motion.header>

        {/* Hero image */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] mb-16">
          <PublicImage file="banner.jpg" alt="WardSuite ERP homepage" className="border-[#f1f1f1] border w-full h-auto" imgClassName="object-cover w-full" />
        </motion.div>

        <div className="space-y-16 text-[#111111]">
          {/* Problem */}
          <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-6 font-bold text-2xl tracking-tight">The Problem I Was Trying to Solve</h2>
            <div className="space-y-4 font-medium text-[#4b5563] text-lg leading-relaxed">
              <p>I've worked with a lot of business software. CRMs that cost thousands per seat. ERPs that take six months to configure. Supply chain tools that don't talk to sales. Analytics dashboards that show you data but don't connect it to anything actionable.</p>
              <p>Every time I sat down with a business tool, I had the same thought: <em>this is solving the wrong problem, or solving the right problem in the wrong way.</em></p>
              <p>So I started asking myself a different question: <strong className="text-black">What would I build if I were designing a business operating system from scratch, for myself first?</strong></p>
              <p>WardSuite is the answer to that question.</p>
            </div>
          </motion.section>

          {/* Technical Vision */}
          <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-8 font-bold text-2xl tracking-tight">The Technical Vision</h2>
            <p className="mb-8 font-medium text-[#4b5563] text-lg leading-relaxed">Before writing a single line of code, I made three non-negotiable architectural decisions.</p>

            <div className="space-y-8">
              {/* Decision 1 */}
              <div className="floating-card space-y-4 p-8">
                <p className="font-black text-[#bbbbbb] text-[10px] uppercase tracking-[0.2em]">Decision 01</p>
                <h3 className="font-bold text-xl tracking-tight">Database-Agnostic by Design</h3>
                <p className="font-medium text-[#6b7280] leading-relaxed">I've seen too many codebases that are so tightly coupled to their database that a migration becomes a six-month project. WardSuite uses the repository pattern throughout — every service codes against an interface, not a concrete implementation.</p>
                <div className="border-[#f1f1f1] bg-[#fafafa] p-5 border rounded-2xl font-mono text-[#111111] text-sm overflow-x-auto">
                  <pre>{`// Today: Firestore
const repo = new FirestoreLeadRepository(db);

// Tomorrow: Postgres — one line change
const repo = new PostgresLeadRepository(pgClient);`}</pre>
                </div>
                <p className="font-medium text-[#6b7280] text-sm">Swapping the entire database layer requires changing exactly one line per service.</p>
              </div>

              {/* Decision 2 */}
              <div className="floating-card space-y-4 p-8">
                <p className="font-black text-[#bbbbbb] text-[10px] uppercase tracking-[0.2em]">Decision 02</p>
                <h3 className="font-bold text-xl tracking-tight">Monorepo with Real Library Boundaries</h3>
                <p className="font-medium text-[#6b7280] leading-relaxed">WardSuite uses an NX monorepo with genuine library separation — not just folders, but enforced boundaries between domains. Each library has a single public API. Nothing crosses boundaries except through those contracts.</p>
                <div className="border-[#f1f1f1] bg-[#fafafa] p-5 border rounded-2xl font-mono text-[#111111] text-sm overflow-x-auto">
                  <pre>{`libs/
├── crm/domain/        # Entity interfaces + DTOs
├── crm/data-access/   # Repository interfaces + Firestore adapters
├── crm/feature-leads/ # React hooks + page components
└── shared/ui/         # Design system`}</pre>
                </div>
              </div>

              {/* Decision 3 */}
              <div className="floating-card space-y-4 p-8">
                <p className="font-black text-[#bbbbbb] text-[10px] uppercase tracking-[0.2em]">Decision 03</p>
                <h3 className="font-bold text-xl tracking-tight">Complete Audit Trail on Every Mutation</h3>
                <p className="font-medium text-[#6b7280] leading-relaxed">In a real business context, you need to know who changed what, when, and why. WardSuite automatically logs an audit entry to Firestore on every CRM mutation — baked into the route layer as a convention, not bolted on.</p>
                <div className="border-[#f1f1f1] bg-[#fafafa] p-5 border rounded-2xl font-mono text-[#111111] text-sm overflow-x-auto">
                  <pre>{`Lead "Acme Corp" (LD-042) created from source: referral.
Deal "Q3 Renewal" moved from "proposal" → "won".
Customer "TechBase Ltd" updated — status "inactive" → "active".`}</pre>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Stack */}
          <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-6 font-bold text-2xl tracking-tight">The Stack</h2>
            <div className="border-[#f1f1f1] border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-[#f1f1f1] bg-[#fafafa] border-b">
                  <tr>
                    {['Layer', 'Choice', 'Why'].map(h => (
                      <th key={h} className="px-6 py-4 font-black text-[#9ca3af] text-[10px] text-left uppercase tracking-[0.2em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STACK.map((row, i) => (
                    <tr key={i} className="border-[#f5f5f5] last:border-0 border-b">
                      <td className="px-6 py-4 font-bold text-[#111111] text-sm">{row.layer}</td>
                      <td className="px-6 py-4 font-medium text-[#111111] text-sm">{row.choice}</td>
                      <td className="px-6 py-4 font-medium text-[#6b7280] text-sm">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* What I Built */}
          <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-8 font-bold text-2xl tracking-tight">What I Built</h2>

            {/* CRM Dashboard image */}
            <div className="mb-6 rounded-2xl overflow-hidden shadow-[0_16px_48px_-12px_rgba(0,0,0,0.08)] border border-[#f1f1f1]">
              <PublicImage file="crm-dashboard.png" alt="CRM Dashboard screenshot" rounded={false} className="w-full" imgClassName="w-full h-auto object-cover" />
            </div>

            <div className="space-y-6 font-medium text-[#4b5563] text-lg leading-relaxed">
              <p>The CRM is the heart of WardSuite. Every feature was designed around how sales teams actually work:</p>
              <ul className="space-y-3 pl-6 marker:text-[#cccccc] list-disc">
                <li><strong className="text-black">Lead Management</strong> — Kanban board with drag-and-drop status transitions. Bulk import via CSV with a column mapper.</li>
                <li><strong className="text-black">Revenue Pipeline</strong> — Five-stage deal Kanban. Every column shows the total value of deals in that stage. Dropping a card fires a PATCH, updates the stage, and logs an audit entry — all in a single drag.</li>
                <li><strong className="text-black">Real Analytics</strong> — Dashboard pulls live data: pipeline revenue, won revenue, conversion rate, 12-month revenue chart. No fake data. No hardcoded numbers.</li>
                <li><strong className="text-black">Activities & Audit Trail</strong> — Every action is logged automatically. Sales reps can also manually log calls, meetings, notes, and emails against any entity.</li>
              </ul>
            </div>
          </motion.section>

          {/* Lessons */}
          <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-8 font-bold text-2xl tracking-tight">What I Learned</h2>
            <div className="gap-6 grid md:grid-cols-2">
              {[
                { title: 'Repository pattern is worth the ceremony', body: 'At first it feels like extra boilerplate. But when you\'re six months in and need to add a query that Firestore doesn\'t support efficiently, you add a method to the interface, implement it, and the service doesn\'t change at all.' },
                { title: 'NX libraries enforce discipline', body: 'Without hard boundaries, everything bleeds into everything. Having @wardsuite/crm/domain as a named package — rather than a relative path — changes how you think about dependencies.' },
                { title: 'Build what you\'d use yourself', body: 'Every feature decision was filtered through: would I actually use this? The CSV import column mapper, the drag-to-convert pipeline, the audit trail — these exist because I\'ve been frustrated by their absence.' },
                { title: 'Dummy data is dishonest', body: 'Early dashboard versions had hardcoded numbers. It looked great in screenshots but was useless. Rewiring everything to pull from Firestore fixed three bugs I didn\'t know existed.' },
              ].map((card, i) => (
                <div key={i} className="floating-card space-y-3 p-6">
                  <h3 className="font-bold text-base leading-tight">{card.title}</h3>
                  <p className="font-medium text-[#6b7280] text-sm leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Roadmap */}
          <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-8 font-bold text-2xl tracking-tight">Where It's Going</h2>
            <div className="space-y-4">
              {PHASES.map((p, i) => (
                <div key={i} className="floating-card flex items-start gap-6 p-6">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="flex justify-center items-center bg-black rounded-2xl w-10 h-10 font-black text-[11px] text-white uppercase tracking-widest">{i + 1}</div>
                    {i < PHASES.length - 1 && <div className="bg-[#f1f1f1] w-px h-6" />}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-black text-[#9ca3af] text-[10px] uppercase tracking-[0.2em]">{p.phase}</p>
                    <h3 className="mb-2 font-bold text-base">{p.title}</h3>
                    <ul className="space-y-1">
                      {p.items.map((item, j) => (
                        <li key={j} className="font-medium text-[#6b7280] text-sm">· {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="relative bg-gradient-to-br from-black via-[#111111] to-[#1a1a1a] p-12 rounded-[32px] text-white overflow-hidden">
              <div className="-top-20 -right-20 absolute bg-white/[0.03] blur-3xl rounded-full w-64 h-64" />
              <div className="-bottom-12 -left-12 absolute bg-white/[0.02] blur-3xl rounded-full w-48 h-48" />
              <div className="relative z-10 space-y-6">
                <div>
                  <p className="mb-3 font-black text-[10px] text-white/40 uppercase tracking-[0.4em]">Built in Public</p>
                  <h3 className="font-bold text-3xl leading-tight tracking-tight">This is a proof of concept,<br />not a toy.</h3>
                </div>
                <p className="max-w-lg font-medium text-base text-white/60 leading-relaxed">
                  If you're a business owner thinking <em>"I could actually use this"</em> — that's exactly the reaction I was hoping for. If you're a developer thinking <em>"I want to build something like this"</em> — the code is open and every decision is documented.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link to="/login" className="flex items-center gap-2 bg-white hover:bg-gray-100 px-6 py-3 rounded-full font-bold text-black text-sm transition-all">
                    Try the Demo
                  </Link>
                  <a href="https://github.com/wardvisual" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border-white/20 hover:bg-white/10 px-6 py-3 border rounded-full font-bold text-sm text-white transition-all">
                    <Github className="w-4 h-4" /> Source Code
                  </a>
                  <Link to="/" className="flex items-center gap-2 border-white/10 hover:bg-white/5 px-6 py-3 border rounded-full font-bold text-sm text-white/60 transition-all">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-[#f1f1f1] bg-[#fafafa] border-t">
        <div className="flex justify-between items-center mx-auto px-6 py-8 max-w-4xl">
          <Logo size="xs" />
          <p className="font-bold text-[#bbbbbb] text-[11px] uppercase tracking-widest">
            © {new Date().getFullYear()} Eduardo.
          </p>
        </div>
      </footer>
    </div>
  );
}
