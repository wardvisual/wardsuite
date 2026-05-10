import React from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Github, Chrome, ArrowRight, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side: branding/image */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#fafafa] p-16 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-20">
            <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">Wised</span>
          </div>

          <div className="space-y-4">
             <h1 className="text-[64px] font-bold tracking-tight leading-[1] max-w-md">
                Experience <br />
                <span className="text-[#6b7280] italic font-light">the next</span> <br />
                Sales Protocol.
             </h1>
             <p className="text-[#6b7280] text-lg font-medium max-w-sm mt-8">
                Join the global network of high-performance teams using WisedCRM to scale their revenue infrastructure.
             </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6">
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />
              ))}
              <div className="min-w-10 h-10 px-3 rounded-full border-2 border-white bg-black flex items-center justify-center">
                 <span className="text-white text-[10px] font-bold">+12</span>
              </div>
           </div>
           <div>
              <p className="text-sm font-bold">42.5k Members</p>
              <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-wider">Active Platforms</p>
           </div>
        </div>

        {/* Floating background elements */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] border border-[#f1f1f1] rounded-full" />
        <div className="absolute top-1/2 right-[100px] -translate-y-1/2 w-[600px] h-[600px] border border-[#f1f1f1] rounded-full" />
        
        <div className="absolute bottom-12 left-16 flex gap-8">
           <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Trusted by LeadGen AI</span>
           <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">ISO Certified</span>
           <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">GDPR Compliant</span>
        </div>
      </div>

      {/* Right side: login form */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-24">
        <div className="max-w-md w-full mx-auto space-y-10">
          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-[42px] font-bold tracking-tight">Sign In</h2>
            <p className="text-[#6b7280] font-medium">Please enter your credentials to access your workspace.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Workspace Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input 
                  type="email" 
                  placeholder="alex@company.com" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-[#f9fafb] border border-[#f1f1f1] rounded-2xl text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Secure Password</label>
                <button type="button" className="text-[10px] font-bold tracking-widest uppercase hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input 
                  type="password" 
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-[#f9fafb] border border-[#f1f1f1] rounded-2xl text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-black text-white py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              ACCESS WORKSPACE
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="relative">
             <div className="absolute inset-0 flex items-center text-[#f1f1f1]">
                <div className="w-full border-t border-[#f1f1f1]" />
             </div>
             <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest bg-white px-4 text-[#6b7280]">
                Or continue with
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center gap-2 py-4 bg-white border border-[#f1f1f1] rounded-2xl text-xs font-bold hover:bg-gray-50 transition-colors uppercase tracking-widest">
                <Chrome className="w-4 h-4" />
                Google
             </button>
             <button className="flex items-center justify-center gap-2 py-4 bg-white border border-[#f1f1f1] rounded-2xl text-xs font-bold hover:bg-gray-50 transition-colors uppercase tracking-widest">
                <Github className="w-4 h-4" />
                Github
             </button>
          </div>

          <p className="text-center text-xs text-[#6b7280] font-medium">
             Internal team access only? <button className="text-black font-bold hover:underline">Request Invitation</button>
          </p>
        </div>
      </div>
    </div>
  );
}
