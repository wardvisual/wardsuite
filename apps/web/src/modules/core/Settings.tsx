import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Globe, ChevronRight, Monitor, Save, Key, Mail, Lock, Languages, Clock, Coins, LogOut, Loader2, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/src/store/auth.store';
import { usersApi } from '@/src/services/users.api';
import { authApi } from '@/src/services/auth.api';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

type SettingsTab = 'profile' | 'security' | 'alerts' | 'regional';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const { user, token, clearAuth, setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? '');
  const [timezone, setTimezone] = useState('UTC+08:00 (Asia/Singapore)');
  const [language, setLanguage] = useState('Global English (EN-US)');
  const [currency, setCurrency] = useState('United States Dollar (USD)');

  useEffect(() => {
    usersApi.me().then(res => {
      const p = res.data;
      if (p.name) setName(p.name);
      if (p.timezone) setTimezone(p.timezone);
      if (p.language) setLanguage(p.language);
      if (p.currency) setCurrency(p.currency);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await usersApi.updateMe({ name, timezone, language, currency });
      if (user && token) {
        setAuth({ ...user, name: res.data.name ?? name }, token);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try { await authApi.logout(token); } catch { /* swallow */ }
    }
    clearAuth();
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile Intelligence', desc: 'Manage your public identity and credentials.' },
    { id: 'security', icon: Shield, label: 'Security Protocols', desc: 'Two-factor auth and active sessions.' },
    { id: 'alerts', icon: Bell, label: 'Alert Parameters', desc: 'Configure notification thresholds and channels.' },
    { id: 'regional', icon: Globe, label: 'Regional Settings', desc: 'Timezones, currency formats, and localization.' },
  ] as const;

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-[42px] font-black tracking-tight text-black leading-tight">System Console</h2>
          <p className="text-[#6b7280] text-sm sm:text-lg font-medium tracking-tight">Fine-tune your environment and security parameters.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          {saved && (
            <span className="flex items-center gap-2 text-sm text-green-600 font-bold">
              <CheckCircle className="w-4 h-4" /> Saved
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 h-14 bg-black text-white rounded-[20px] text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Synchronize
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 h-14 border border-[#f1f1f1] text-[#6b7280] rounded-[20px] text-sm font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
        <div className="lg:col-span-4 space-y-8">
          <div className="p-2 floating-card">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-[24px] transition-all text-left group',
                  activeTab === tab.id ? 'bg-black text-white shadow-lg shadow-black/10' : 'hover:bg-gray-50 text-[#6b7280] hover:text-black',
                )}
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center border transition-all',
                  activeTab === tab.id ? 'bg-white/10 border-white/10' : 'bg-gray-50 border-[#f1f1f1] group-hover:scale-105',
                )}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-black leading-tight">{tab.label}</p>
                  <p className={cn('text-[10px] font-bold uppercase tracking-widest mt-1', activeTab === tab.id ? 'text-gray-400' : 'text-[#bbbbbb]')}>
                    {activeTab === tab.id ? 'Active Node' : 'Configurable'}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-black text-white p-10 rounded-[32px] space-y-8 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight italic">Active Node</h3>
                <p className="text-white/50 text-xs font-black mt-2 uppercase tracking-[0.3em]">Cloud Infrastructure</p>
              </div>
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/50">Status</span>
                  <span className="text-green-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/50">Uptime</span>
                  <span className="text-white">99.99%</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="p-12 floating-card"
            >
              {activeTab === 'profile' && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Profile Intelligence</h3>
                    <p className="text-sm font-medium text-[#6b7280]">Update your organizational identity markers.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label htmlFor="settings-email" className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Deployment ID</label>
                      <div className="relative">
                        <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#bbbbbb]" />
                        <input
                          id="settings-email"
                          type="email"
                          readOnly
                          className="w-full h-14 pl-12 pr-6 bg-[#f5f5f5] border border-transparent rounded-2xl text-sm font-bold outline-none cursor-not-allowed opacity-60"
                          value={user?.email ?? ''}
                        />
                      </div>
                      <p className="text-[10px] text-[#bbbbbb] font-medium">Email cannot be changed on demo accounts.</p>
                    </div>
                    <div className="space-y-4">
                      <label htmlFor="settings-name" className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Operator Tag</label>
                      <div className="relative">
                        <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#bbbbbb]" />
                        <input
                          id="settings-name"
                          type="text"
                          title="Display name"
                          className="w-full h-14 pl-12 pr-6 bg-[#f5f5f5] border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#eeeeee] outline-none transition-all"
                          value={name}
                          onChange={e => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#f1f1f1]">
                    <p className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-widest">
                      Role: <span className="text-[#111111]">{user?.role ?? 'STAFF'}</span>
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Security Protocols</h3>
                    <p className="text-sm font-medium text-[#6b7280]">Arm your account with advanced defensive layers.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-[24px] flex items-center justify-between group hover:bg-black transition-all cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-[#f1f1f1]">
                          <Lock className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <p className="text-base font-black group-hover:text-white transition-colors">Two-Factor Authentication</p>
                          <p className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-widest mt-1">Status: Restricted</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2 bg-white text-black rounded-lg">
                        Activate
                      </div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-[24px] flex items-center justify-between group hover:bg-black transition-all cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-[#f1f1f1]">
                          <Key className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <p className="text-base font-black group-hover:text-white transition-colors">Cryptographic Keys</p>
                          <p className="text-[10px] font-bold text-[#bbbbbb] uppercase tracking-widest mt-1">Manage API SSH keys</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#bbbbbb]" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Alert Parameters</h3>
                    <p className="text-sm font-medium text-[#6b7280]">Configure how the system communicates critical events.</p>
                  </div>
                  <div className="space-y-8">
                    {[
                      { label: 'New Lead Ingestion', desc: 'Real-time alert when a high-value lead is captured.' },
                      { label: 'Pipeline Variance', desc: 'Alert when deals stall for more than 48 hours.' },
                      { label: 'Security Breach Protocol', desc: 'Emergency notification on unauthorized login attempts.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-[#f5f5f5] pb-8 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <p className="text-base font-black text-black">{item.label}</p>
                          <p className="text-xs font-medium text-[#6b7280]">{item.desc}</p>
                        </div>
                        <div className="w-14 h-8 bg-black rounded-full relative p-1 cursor-pointer">
                          <div className="w-6 h-6 bg-white rounded-full absolute right-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'regional' && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Regional Settings</h3>
                    <p className="text-sm font-medium text-[#6b7280]">Synchronize your interface with local standards.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label htmlFor="settings-language" className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Interface Language</label>
                      <div className="relative">
                        <Languages className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#bbbbbb]" />
                        <select
                          id="settings-language"
                          title="Interface language"
                          value={language}
                          onChange={e => setLanguage(e.target.value)}
                          className="w-full h-14 pl-12 pr-6 bg-[#f5f5f5] border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#eeeeee] outline-none appearance-none transition-all"
                        >
                          <option>Global English (EN-US)</option>
                          <option>Deutsche (DE)</option>
                          <option>Español (ES)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="settings-timezone" className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">System Timezone</label>
                      <div className="relative">
                        <Clock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#bbbbbb]" />
                        <select
                          id="settings-timezone"
                          title="System timezone"
                          value={timezone}
                          onChange={e => setTimezone(e.target.value)}
                          className="w-full h-14 pl-12 pr-6 bg-[#f5f5f5] border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#eeeeee] outline-none appearance-none transition-all text-xs"
                        >
                          <option>UTC+08:00 (Asia/Singapore)</option>
                          <option>UTC-05:00 (US/Eastern)</option>
                          <option>UTC+00:00 (GMT)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="settings-currency" className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Fiscal Currency</label>
                    <div className="relative">
                      <Coins className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#bbbbbb]" />
                      <select
                        id="settings-currency"
                        title="Fiscal currency"
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 bg-[#f5f5f5] border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#eeeeee] outline-none appearance-none transition-all"
                      >
                        <option>United States Dollar (USD)</option>
                        <option>Euro (EUR)</option>
                        <option>Singapore Dollar (SGD)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
