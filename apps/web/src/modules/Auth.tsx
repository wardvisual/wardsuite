import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Zap, ArrowRight, Github, Chrome, User, Building, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/src/store/auth.store';
import { authApi } from '@/src/services/auth.api';

type AuthMode = 'login' | 'register' | 'forgot-password';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'forgot-password') {
      alert('Reset link sent to your workspace email.');
      setMode('login');
      return;
    }

    if (mode === 'register') {
      navigate('/dashboard');
      return;
    }

    setLoading(true);
    try {
      const result = await authApi.login({ email, password });
      setAuth(result.user, result.token);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex lg:flex-row flex-col bg-white min-h-screen font-sans overflow-hidden">
      <div className="relative flex flex-col justify-between bg-white p-12 lg:p-24 lg:w-[50%]">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-black rounded-full w-10 h-10">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="font-bold text-black text-xl tracking-tight">WardSuite</span>
        </div>

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

      <div className="flex flex-1 justify-center items-center border-[#f1f1f1] bg-white p-8 lg:p-24 border-l">
        <div className="space-y-12 w-full max-w-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h2 className="font-bold text-[64px] text-black leading-none tracking-tight">
                  {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Join Us' : 'Reset'}
                </h2>
                <p className="font-medium text-[#9ca3af] text-lg leading-tight">
                  {mode === 'login'
                    ? 'Enter your credentials to access your workspace.'
                    : mode === 'register'
                    ? 'Secure your spot in the intelligence network.'
                    : 'Provide your email to receive recovery instructions.'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 p-4 border border-red-100 rounded-2xl font-medium text-red-700 text-sm">
                  {error}
                </div>
              )}

              {mode === 'login' && (
                <p className="-mt-8 font-medium text-[#9ca3af] text-xs">
                  Demo: <span className="font-bold">admin@wardsuite.com</span> / <span className="font-bold">admin123</span>
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  {mode === 'register' && (
                    <>
                      <div className="space-y-3">
                        <label className="ml-1 font-black text-[#9ca3af] text-[10px] uppercase tracking-widest">Workspace ID</label>
                        <div className="relative group">
                          <Building className="group-focus-within:text-black top-1/2 left-6 absolute w-5 h-5 text-[#bbbbbb] transition-colors -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="acme-corp"
                            className="border-[#eeeeee] border-2 bg-white pr-6 pl-14 focus:border-black rounded-[24px] w-full h-16 font-medium text-black text-lg transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="ml-1 font-black text-[#9ca3af] text-[10px] uppercase tracking-widest">Full Name</label>
                        <div className="relative group">
                          <User className="group-focus-within:text-black top-1/2 left-6 absolute w-5 h-5 text-[#bbbbbb] transition-colors -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            className="border-[#eeeeee] border-2 bg-white pr-6 pl-14 focus:border-black rounded-[24px] w-full h-16 font-medium text-black text-lg transition-all outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-3">
                    <label className="ml-1 font-black text-[#9ca3af] text-[10px] uppercase tracking-widest">Workspace Email</label>
                    <div className="relative group">
                      <Mail className="group-focus-within:text-black top-1/2 left-6 absolute w-5 h-5 text-[#bbbbbb] transition-colors -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@wardsuite.com"
                        className="border-[#eeeeee] border-2 bg-white pr-6 pl-14 focus:border-black rounded-[24px] w-full h-16 font-medium text-black text-lg transition-all outline-none"
                      />
                    </div>
                  </div>

                  {mode !== 'forgot-password' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <label className="font-black text-[#9ca3af] text-[10px] uppercase tracking-widest">Secure Password</label>
                        {mode === 'login' && (
                          <button
                            type="button"
                            onClick={() => setMode('forgot-password')}
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
                          onChange={(e) => setPassword(e.target.value)}
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
                  className="flex justify-center items-center gap-4 bg-black hover:opacity-90 disabled:opacity-60 shadow-2xl shadow-black/10 rounded-full w-full h-[72px] font-bold text-base text-white uppercase tracking-[0.2em] transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' ? 'Access Workspace' : mode === 'register' ? 'Initialize Account' : 'Send Reset Link'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {mode === 'login' && (
                <>
                  <div className="relative flex justify-center items-center py-4">
                    <div className="absolute inset-0 flex items-center"><div className="border-[#f1f1f1] border-t w-full" /></div>
                    <span className="relative bg-white px-6 font-black text-[#bbbbbb] text-[10px] uppercase tracking-[0.2em]">Or continue with</span>
                  </div>
                  <div className="gap-4 grid grid-cols-2">
                    <button type="button" className="flex justify-center items-center gap-4 border-[#eeeeee] bg-white hover:bg-gray-50 border rounded-2xl h-14 transition-all">
                      <Chrome className="w-4 h-4 text-black" />
                      <span className="font-black text-[11px] text-black uppercase tracking-widest">Google</span>
                    </button>
                    <button type="button" className="flex justify-center items-center gap-4 border-[#eeeeee] bg-white hover:bg-gray-50 border rounded-2xl h-14 transition-all">
                      <Github className="w-4 h-4 text-black" />
                      <span className="font-black text-[11px] text-black uppercase tracking-widest">Github</span>
                    </button>
                  </div>
                </>
              )}

              <div className="space-y-4 pt-6 text-center">
                {mode === 'login' ? (
                  <p className="font-medium text-[#9ca3af] text-base">
                    New to the protocol?{' '}
                    <button type="button" onClick={() => setMode('register')} className="font-bold text-black hover:underline">
                      Create Account
                    </button>
                  </p>
                ) : mode === 'register' ? (
                  <p className="font-medium text-[#9ca3af] text-base">
                    Already on the grid?{' '}
                    <button type="button" onClick={() => setMode('login')} className="font-bold text-black hover:underline">
                      Log in
                    </button>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="flex items-center gap-2 mx-auto font-bold text-black text-sm hover:underline uppercase tracking-widest"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
