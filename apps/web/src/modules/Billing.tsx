import React from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Zap, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  History, 
  Layout, 
  Wallet,
  Download,
  AlertCircle
} from 'lucide-react';

const TRANSACTION_HISTORY = [
  { id: 'tx_1', date: 'May 01, 2026', amount: '$499.00', status: 'completed', plan: 'Enterprise OS' },
  { id: 'tx_2', date: 'Apr 01, 2026', amount: '$499.00', status: 'completed', plan: 'Enterprise OS' },
  { id: 'tx_3', date: 'Mar 01, 2026', amount: '$499.00', status: 'completed', plan: 'Enterprise OS' },
];

export default function Billing() {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-[42px] font-black tracking-tight text-black leading-tight">Financial Protocol</h2>
          <p className="text-[#6b7280] text-lg font-medium">Manage your enterprise subscription and fiscal history.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Active Plan Card */}
        <div className="col-span-12 lg:col-span-8 p-10 floating-card bg-black text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-64 h-64 text-white fill-white" />
          </div>
          
          <div className="relative z-10 space-y-12">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-black fill-black" />
                  </div>
                  <span className="text-xl font-black tracking-tight italic">ENTERPRISE OS</span>
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">Current Active Cycle</p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-black tracking-tighter">$499<span className="text-2xl text-gray-400 font-medium tracking-tight">/mo</span></p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {[
                { label: 'Next Billing', value: 'June 01, 2026' },
                { label: 'Payment Method', value: '•••• 4242' },
                { label: 'Seat Count', value: 'Uncapped' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</p>
                  <p className="text-lg font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button className="px-8 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 transition-all">
                Manage Protocol
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 h-14 bg-gray-900 border border-gray-800 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-gray-800 transition-all">
                View Policy
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="p-8 floating-card border-blue-50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                   <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                   <p className="text-base font-black text-black">Security Vault</p>
                   <p className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-widest italic">Military Grade</p>
                </div>
              </div>
              <p className="text-sm font-medium text-[#6b7280] leading-relaxed">
                Your payment data is fully encrypted and stored in an isolated vault environment.
              </p>
           </div>
           
           <div className="p-8 floating-card">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f5f5] flex items-center justify-center">
                   <Wallet className="w-6 h-6 text-black" />
                </div>
                <div>
                   <p className="text-base font-black text-black">Ledger Balance</p>
                   <p className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-widest">Available Credits</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-black text-black">$0.00</p>
                <button className="text-[10px] font-black uppercase tracking-widest text-black hover:underline underline-offset-4">Top Up Account</button>
              </div>
           </div>
        </div>

        {/* Transaction History */}
        <div className="col-span-12 p-10 floating-card">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <History className="w-6 h-6 text-black" />
                 <h3 className="text-xl font-black tracking-tight">Ledger Archives</h3>
              </div>
              <button className="text-[10px] font-black border border-[#eeeeee] px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
                 <Download className="w-3.5 h-3.5" />
                 Export Data
              </button>
           </div>

           <div className="overflow-hidden">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-[#f1f1f1]">
                       <th className="pb-6 text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Transaction ID</th>
                       <th className="pb-6 text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Lifecycle Point</th>
                       <th className="pb-6 text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Protocol Tier</th>
                       <th className="pb-6 text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Fiscal Amount</th>
                       <th className="pb-6 text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Validation</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#f8f8f8]">
                    {TRANSACTION_HISTORY.map((tx) => (
                      <tr key={tx.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-6 text-sm font-black text-black">{tx.id}</td>
                        <td className="py-6 text-sm font-medium text-[#6b7280]">{tx.date}</td>
                        <td className="py-6 text-sm font-bold text-black italic">{tx.plan}</td>
                        <td className="py-6 text-sm font-black text-black">{tx.amount}</td>
                        <td className="py-6">
                           <div className="flex items-center gap-2 text-green-600">
                             <CheckCircle2 className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest italic">Authorized</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}
