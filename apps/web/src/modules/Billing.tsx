import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CreditCard, Zap, Shield, ArrowRight, CheckCircle2,
  History, Wallet, Download, Star, Building2,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$49',
    period: '/mo',
    description: 'For small teams getting started with CRM.',
    features: ['Up to 5 seats', 'CRM (Leads + Customers)', '1,000 contacts', 'Email support'],
    current: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$149',
    period: '/mo',
    description: 'Full CRM + SCM for growing operations.',
    features: ['Up to 25 seats', 'CRM + Supply Chain', '10,000 contacts', 'Pipeline analytics', 'Priority support'],
    current: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise OS',
    price: '$499',
    period: '/mo',
    description: 'Uncapped seats, full modules, audit trail.',
    features: ['Uncapped seats', 'All modules', 'Unlimited contacts', 'Full audit trail', 'Dedicated support', 'Custom integrations'],
    current: true,
  },
];

const TRANSACTIONS = [
  { id: 'TXN-0041', date: 'May 01, 2026', amount: '$499.00', plan: 'Enterprise OS', status: 'completed' },
  { id: 'TXN-0040', date: 'Apr 01, 2026', amount: '$499.00', plan: 'Enterprise OS', status: 'completed' },
  { id: 'TXN-0039', date: 'Mar 01, 2026', amount: '$499.00', plan: 'Enterprise OS', status: 'completed' },
  { id: 'TXN-0038', date: 'Feb 01, 2026', amount: '$499.00', plan: 'Enterprise OS', status: 'completed' },
  { id: 'TXN-0037', date: 'Jan 01, 2026', amount: '$149.00', plan: 'Growth',        status: 'completed' },
];

function exportLedger() {
  const headers = ['Transaction ID', 'Date', 'Plan', 'Amount', 'Status'];
  const rows = TRANSACTIONS.map(t => [t.id, t.date, t.plan, t.amount, t.status]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'wardsuite_billing_ledger.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState('enterprise');

  const activePlan = PLANS.find(p => p.current)!;

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-[42px] font-bold tracking-tight text-[#111111] leading-[1.1]">Billing</h2>
          <p className="text-[#6b7280] text-sm sm:text-lg font-medium">Manage your subscription and payment history.</p>
        </div>
      </div>

      {/* Active plan hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        <div className="lg:col-span-8 p-8 lg:p-10 bg-black text-white rounded-[28px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Zap className="w-64 h-64 text-white fill-white" />
          </div>
          <div className="relative z-10 space-y-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-black fill-black" />
                  </div>
                  <span className="text-xl font-bold tracking-tight uppercase">{activePlan.name}</span>
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-[0.25em] text-[10px]">Active Subscription</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-5xl font-bold tracking-tight">
                  {activePlan.price}<span className="text-2xl text-gray-500 font-medium">{activePlan.period}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Next Billing',     value: 'June 01, 2026' },
                { label: 'Payment Method',   value: '•••• 4242'     },
                { label: 'Seat Count',       value: 'Uncapped'      },
              ].map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
                  <p className="text-base font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" className="flex items-center gap-2 px-6 h-12 bg-white text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all">
                Manage Plan <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" className="flex items-center gap-2 px-6 h-12 bg-white/10 border border-white/10 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                <CreditCard className="w-4 h-4" /> Update Card
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex-1 p-6 floating-card flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Security Vault</p>
                <p className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-widest">Military-grade encryption</p>
              </div>
            </div>
            <p className="text-sm font-medium text-[#6b7280] leading-relaxed">
              Payment data is fully encrypted and stored in an isolated vault environment. PCI-DSS compliant.
            </p>
          </div>

          <div className="flex-1 p-6 floating-card flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f5] flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Credit Balance</p>
                <p className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-widest">Available credits</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-black">$0.00</p>
              <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-black hover:underline underline-offset-4">
                Add Credits
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Plan comparison */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5" />
          <h3 className="text-xl font-bold tracking-tight">Available Plans</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {PLANS.map((plan, i) => (
            <motion.button
              key={plan.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                'text-left p-6 lg:p-8 rounded-[28px] border-2 transition-all cursor-pointer space-y-5 w-full',
                plan.current
                  ? 'border-black bg-[#fafafa]'
                  : selectedPlan === plan.id
                  ? 'border-[#111111] bg-white'
                  : 'border-[#f1f1f1] bg-white hover:border-[#e0e0e0]'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-lg text-[#111111]">{plan.name}</p>
                    {plan.current && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                        <Star className="w-2.5 h-2.5 fill-white" /> Current
                      </span>
                    )}
                  </div>
                  <p className="text-[#6b7280] text-sm font-medium leading-snug">{plan.description}</p>
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                <span className="text-[#6b7280] font-medium text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2.5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm font-medium text-[#6b7280]">
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {!plan.current && (
                <div className={cn(
                  'w-full py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-center transition-all',
                  selectedPlan === plan.id
                    ? 'bg-black text-white'
                    : 'bg-[#f5f5f5] text-[#6b7280]'
                )}>
                  {selectedPlan === plan.id ? 'Switch to This Plan' : 'Select Plan'}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Transaction ledger */}
      <div className="p-6 lg:p-10 floating-card overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5" />
            <h3 className="text-xl font-bold tracking-tight">Payment History</h3>
          </div>
          <button
            type="button"
            onClick={exportLedger}
            className="btn-secondary flex items-center gap-2 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <table className="w-full text-left min-w-[520px]">
          <thead>
            <tr className="border-b border-[#f1f1f1]">
              {['Transaction ID', 'Date', 'Plan', 'Amount', 'Status'].map(h => (
                <th key={h} className="pb-5 text-[10px] font-bold text-[#bbbbbb] uppercase tracking-[0.2em] pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8f8f8]">
            {TRANSACTIONS.map(tx => (
              <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-5 pr-6 text-sm font-bold text-black font-mono">{tx.id}</td>
                <td className="py-5 pr-6 text-sm font-medium text-[#6b7280]">{tx.date}</td>
                <td className="py-5 pr-6 text-sm font-bold text-[#111111]">{tx.plan}</td>
                <td className="py-5 pr-6 text-sm font-bold text-black">{tx.amount}</td>
                <td className="py-5">
                  <span className="flex items-center gap-1.5 text-green-600 w-fit">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Paid</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
