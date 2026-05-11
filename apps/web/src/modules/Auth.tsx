import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, User, Building, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Logo } from '@/src/components/ui/Logo';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/src/store/auth.store';
import { authApi } from '@/src/services/auth.api';

type AuthMode = 'login' | 'register' | 'forgot-password';

const DEMO_ACCOUNTS = [
  {
    initial: 'A',
    label: 'Admin',
    email: 'admin@wardsuite.com',
    password: 'admin123',
    role: 'Full access',
    color: 'bg-black text-white',
  },
  {
    initial: 'M',
    label: 'Manager',
    email: 'manager@wardsuite.com',
    password: 'manager123',
    role: 'Team lead',
    color: 'bg-[#f5f5f5] text-black',
  },
  {
    initial: 'S',
    label: 'Staff',
    email: 'staff@wardsuite.com',
    password: 'staff123',
    role: 'Read + edit',
    color: 'bg-[#f5f5f5] text-black',
  },
];

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  const fillDemo = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setEmail(account.email);
    setPassword(account.password);
    setActiveDemo(account.email);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'forgot-password') {
      setForgotSent(true);
      return;
    }

    if (mode === 'register') {
      setError('Registration is disabled in demo mode. Use a demo account below to sign in.');
      return;
    }

    setLoading(true);
    try {
      const result = await authApi.login({ email, password });
      setAuth(result.user, result.token);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password. Try a demo account.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError('');
    setForgotSent(false);
    setActiveDemo(null);
  };

  return (
    <div className="flex lg:flex-row flex-col bg-white min-h-screen font-sans overflow-hidden">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:relative lg:flex flex-col justify-between bg-white p-12 lg:p-24 lg:w-[50%]">
        <Logo size="sm" />

        <div className="max-w-xl">
          <h1 className="mb-8 font-black text-[64px] text-black lg:text-[84px] leading-[1.0] tracking-tight">
            Experience <br />
            <span className="font-medium text-[#cccccc] italic">the next</span> <br />
            Sales Protocol.
          </h1>
          <p className="max-w-md font-medium text-[#6b7280] text-xl leading-relaxed">
            Join the global network of high-performance teams using WardSuiteCRM to scale their revenue infrastructure.
          </p>

          <div className="flex items-center gap-6 mt-12">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border-4 border-white bg-[#f5f5f5] shadow-sm rounded-2xl w-14 h-14" />
              ))}
            </div>
            <div>
              <p className="font-black text-base text-black">42.5k Members</p>
              <p className="font-black text-[#bbbbbb] text-[10px] uppercase tracking-[0.2em]">Active Platforms</p>
            </div>
          </div>
        </div>

        <div className="flex gap-12">
          <span className="font-black text-[#bbbbbb] text-[10px] uppercase tracking-[0.2em]">Trusted by LeadGen AI</span>
          <span className="font-black text-[#bbbbbb] text-[10px] uppercase tracking-[0.2em]">ISO Certified</span>
          <span className="font-black text-[#bbbbbb] text-[10px] uppercase tracking-[0.2em]">GDPR Compliant</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 justify-center items-center border-[#f1f1f1] bg-white p-8 lg:p-24 lg:border-l">
        <div className="space-y-10 lg:space-y-12 w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-3">
                <h2 className="font-bold text-[40px] sm:text-[56px] text-black leading-none tracking-tight">
                  {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Join Us' : 'Reset'}
                </h2>
                <p className="font-medium text-[#9ca3af] text-base leading-tight">
                  {mode === 'login'
                    ? 'Enter your credentials to access your workspace.'
                    : mode === 'register'
                    ? 'Create your WardSuite account.'
                    : 'Provide your email to receive recovery instructions.'}
                </p>
              </div>

              {/* Demo accounts — login only */}
              {mode === 'login' && (
                <div className="space-y-2">
                  <p className="font-black text-[#9ca3af] text-[10px] uppercase tracking-widest">Quick Access</p>
                  <div className="flex gap-2">
                    {DEMO_ACCOUNTS.map((account) => (
                      <div key={account.email} className="relative group flex-1">
                        <button
                          type="button"
                          onClick={() => fillDemo(account)}
                          className={`w-full flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all ${
                            activeDemo === account.email
                              ? 'border-black bg-black/[0.03]'
                              : 'border-[#eeeeee] hover:border-[#cccccc]'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${account.color}`}>
                            {account.initial}
                          </div>
                          <span className="font-black text-[9px] uppercase tracking-widest text-[#9ca3af]">{account.label}</span>
                        </button>
                        {/* Tooltip */}
                        <div className="group-hover:opacity-100 group-hover:translate-y-0 bottom-full left-1/2 -translate-x-1/2 translate-y-1 absolute mb-2 opacity-0 pointer-events-none transition-all duration-200 z-10">
                          <div className="bg-black px-3 py-2 rounded-xl text-white whitespace-nowrap">
                            <p className="font-bold text-[10px]">{account.email}</p>
                            <p className="font-medium text-[9px] text-white/60 uppercase tracking-widest mt-0.5">{account.role}</p>
                          </div>
                          <div className="w-2 h-2 bg-black rotate-45 mx-auto -mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 p-4 border border-red-100 rounded-2xl font-medium text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Forgot password sent confirmation */}
              {mode === 'forgot-password' && forgotSent ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <div className="flex justify-center items-center bg-green-50 rounded-full w-16 h-16">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <p className="font-bold text-black text-base">Check your inbox</p>
                      <p className="mt-1 font-medium text-[#9ca3af] text-sm">
                        If <span className="font-bold text-black">{email || 'that email'}</span> is registered, a reset link has been sent.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="flex items-center justify-center gap-2 w-full border-2 border-[#eeeeee] hover:border-black rounded-full h-[56px] font-bold text-sm text-black transition-all uppercase tracking-widest"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {mode === 'register' && (
                      <>
                        <div className="space-y-2">
                          <label className="ml-1 font-black text-[#9ca3af] text-[10px] uppercase tracking-widest">Workspace ID</label>
                          <div className="relative group">
                            <Building className="group-focus-within:text-black top-1/2 left-6 absolute w-5 h-5 text-[#bbbbbb] transition-colors -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="acme-corp"
                              className="border-[#eeeeee] border-2 bg-white pr-6 pl-14 focus:border-black rounded-[24px] w-full h-16 font-medium text-black text-lg transition-all outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="ml-1 font-black text-[#9ca3af] text-[10px] uppercase tracking-widest">Full Name</label>
                          <div className="relative group">
                            <User className="group-focus-within:text-black top-1/2 left-6 absolute w-5 h-5 text-[#bbbbbb] transition-colors -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="John Doe"
                              className="border-[#eeeeee] border-2 bg-white pr-6 pl-14 focus:border-black rounded-[24px] w-full h-16 font-medium text-black text-lg transition-all outline-none"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <label className="ml-1 font-black text-[#9ca3af] text-[10px] uppercase tracking-widest">
                        {mode === 'forgot-password' ? 'Your Email' : 'Workspace Email'}
                      </label>
                      <div className="relative group">
                        <Mail className="group-focus-within:text-black top-1/2 left-6 absolute w-5 h-5 text-[#bbbbbb] transition-colors -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setActiveDemo(null); }}
                          placeholder="admin@wardsuite.com"
                          className="border-[#eeeeee] border-2 bg-white pr-6 pl-14 focus:border-black rounded-[24px] w-full h-16 font-medium text-black text-lg transition-all outline-none"
                        />
                      </div>
                    </div>

                    {mode !== 'forgot-password' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                          <label className="font-black text-[#9ca3af] text-[10px] uppercase tracking-widest">
                            {mode === 'register' ? 'Password' : 'Secure Password'}
                          </label>
                          {mode === 'login' && (
                            <button
                              type="button"
                              onClick={() => switchMode('forgot-password')}
                              className="font-black text-[10px] text-black hover:underline uppercase tracking-widest"
                            >
                              Forgot?
                            </button>
                          )}
                        </div>
                        <div className="relative group">
                          <Lock className="group-focus-within:text-black top-1/2 left-6 absolute w-5 h-5 text-[#bbbbbb] transition-colors -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setActiveDemo(null); }}
                            placeholder="••••••••"
                            className="border-2 bg-[#fafafa] focus:bg-white pr-6 pl-14 border-transparent focus:border-black rounded-[24px] w-full h-16 font-medium text-black text-lg transition-all outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex justify-center items-center gap-4 bg-black hover:opacity-90 disabled:opacity-60 shadow-2xl shadow-black/10 rounded-full w-full h-[64px] font-bold text-base text-white uppercase tracking-[0.2em] transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {mode === 'login'
                          ? 'Access Workspace'
                          : mode === 'register'
                          ? 'Create Account'
                          : 'Send Reset Link'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Mode switcher */}
              {!forgotSent && (
                <div className="text-center pt-2">
                  {mode === 'login' ? (
                    <p className="font-medium text-[#9ca3af] text-sm">
                      New to the platform?{' '}
                      <button type="button" onClick={() => switchMode('register')} className="font-bold text-black hover:underline">
                        Create Account
                      </button>
                    </p>
                  ) : mode === 'register' ? (
                    <p className="font-medium text-[#9ca3af] text-sm">
                      Already have an account?{' '}
                      <button type="button" onClick={() => switchMode('login')} className="font-bold text-black hover:underline">
                        Sign In
                      </button>
                    </p>
                  ) : (
                    !forgotSent && (
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="flex items-center gap-2 mx-auto font-bold text-black text-sm hover:underline uppercase tracking-widest"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                      </button>
                    )
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
