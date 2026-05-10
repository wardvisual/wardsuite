import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Zap, ArrowRight, Github, Chrome, User, Building, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'register' | 'forgot-password';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot-password') {
       // Mock send reset link
       alert('Reset link sent to your workspace email.');
       setMode('login');
    } else {
       navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Column: Branding Section */}
      <div className="lg:w-[50%] p-12 lg:p-24 flex flex-col justify-between relative bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black">WISED</span>
        </div>

        <div className="max-w-xl">
          <h1 className="text-[64px] lg:text-[84px] font-black leading-[1.0] tracking-tight text-black mb-8">
            Experience <br />
            <span className="text-[#cccccc] font-medium italic">the next</span> <br />
            Sales Protocol.
          </h1>
          <p className="text-[#6b7280] text-xl font-medium leading-relaxed max-w-md">
            Join the global network of high-performance teams using WisedCRM to scale their revenue infrastructure.
          </p>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-14 h-14 rounded-2xl bg-[#f5f5f5] border-4 border-white shadow-sm" />
              ))}
            </div>
            <div>
              <p className="text-base font-black text-black">42.5k Members</p>
              <p className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Active Platforms</p>
            </div>
          </div>
        </div>

        <div className="flex gap-12">
          <span className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Trusted by LeadGen AI</span>
          <span className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">ISO Certified</span>
          <span className="text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">GDPR Compliant</span>
        </div>
      </div>

      {/* Right Column: Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white border-l border-[#f1f1f1]">
        <div className="w-full max-w-[420px] space-y-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-[64px] font-bold tracking-tight text-black leading-none">
                  {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Join Us' : 'Reset'}
                </h2>
                <p className="text-[#9ca3af] text-lg font-medium leading-tight">
                  {mode === 'login' 
                    ? 'Please enter your credentials to access your workspace.' 
                    : mode === 'register' 
                      ? 'Secure your spot in the intelligence network.'
                      : 'Provide your email to receive recovery instructions.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  {mode === 'register' && (
                    <>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest ml-1">Workspace ID</label>
                        <div className="relative group">
                          <Building className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-[#bbbbbb] group-focus-within:text-black transition-colors" />
                          <input
                            type="text"
                            required
                            placeholder="acme-corp"
                            className="w-full h-16 pl-14 pr-6 bg-white border-2 border-[#eeeeee] focus:border-black rounded-[24px] outline-none transition-all font-medium text-black text-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                          <User className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-[#bbbbbb] group-focus-within:text-black transition-colors" />
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            className="w-full h-16 pl-14 pr-6 bg-white border-2 border-[#eeeeee] focus:border-black rounded-[24px] outline-none transition-all font-medium text-black text-lg"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest ml-1">Workspace Email</label>
                    <div className="relative group">
                      <Mail className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-[#bbbbbb] group-focus-within:text-black transition-colors" />
                      <input
                        type="email"
                        required
                        placeholder="war"
                        className="w-full h-16 pl-14 pr-6 bg-white border-2 border-[#eeeeee] focus:border-black rounded-[24px] outline-none transition-all font-medium text-black text-lg"
                      />
                    </div>
                  </div>

                  {mode !== 'forgot-password' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-widest">Secure Password</label>
                        {mode === 'login' && (
                          <button 
                            type="button" 
                            onClick={() => setMode('forgot-password')}
                            className="text-[10px] font-black text-black uppercase tracking-widest hover:underline"
                          >
                            Forgot?
                          </button>
                        )}
                      </div>
                      <div className="relative group">
                        <Lock className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-[#bbbbbb] group-focus-within:text-black transition-colors" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          className="w-full h-16 pl-14 pr-6 bg-[#fafafa] border-2 border-transparent focus:border-black focus:bg-white rounded-[24px] outline-none transition-all font-medium text-black text-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full h-18 bg-black text-white rounded-full font-bold flex items-center justify-center gap-4 hover:opacity-90 transition-all shadow-2xl shadow-black/10 text-base uppercase tracking-[0.2em] relative overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-4">
                    {mode === 'login' ? 'Access Workspace' : mode === 'register' ? 'Initialize Account' : 'Send Reset Link'}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </button>
              </form>

              {mode === 'login' && (
                <>
                  <div className="relative py-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#f1f1f1]"></div></div>
                    <span className="relative px-6 bg-white text-[10px] font-black text-[#bbbbbb] uppercase tracking-[0.2em]">Or continue with</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button className="h-14 bg-white border border-[#eeeeee] rounded-2xl flex items-center justify-center gap-4 hover:bg-gray-50 transition-all group">
                      <Chrome className="w-4 h-4 text-black" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-black">Google</span>
                    </button>
                    <button className="h-14 bg-white border border-[#eeeeee] rounded-2xl flex items-center justify-center gap-4 hover:bg-gray-50 transition-all group">
                      <Github className="w-4 h-4 text-black" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-black">Github</span>
                    </button>
                  </div>
                </>
              )}

              <div className="text-center pt-6 space-y-4">
                {mode === 'login' ? (
                  <p className="text-base font-medium text-[#9ca3af]">
                    New to the protocol? <button onClick={() => setMode('register')} className="text-black font-bold hover:underline">Create Account</button>
                  </p>
                ) : mode === 'register' ? (
                  <p className="text-base font-medium text-[#9ca3af]">
                    Already on the grid? <button onClick={() => setMode('login')} className="text-black font-bold hover:underline">Log in</button>
                  </p>
                ) : (
                  <button onClick={() => setMode('login')} className="flex items-center gap-2 mx-auto text-sm font-bold text-black hover:underline uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </button>
                )}
                
                {mode === 'login' && (
                  <p className="text-base font-medium text-[#9ca3af]">
                    Internal team access only? <button className="text-black font-bold hover:underline">Request Invitation</button>
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
