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
    <div className="flex bg-white min-h-screen">
      {/* Left side: branding/image */}
      <div className="relative lg:flex flex-col justify-between hidden bg-[#fafafa] p-16 w-1/2 overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-20">
            <div className="flex justify-center items-center bg-black rounded w-10 h-10">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl uppercase tracking-tight">WardSuite</span>
          </div>

          <div className="space-y-4">
             <h1 className="max-w-md font-bold text-[64px] leading-[1] tracking-tight">
                Experience <br />
                <span className="font-light text-[#6b7280] italic">the next</span> <br />
                Sales Protocol.
             </h1>
             <p className="mt-8 max-w-sm font-medium text-[#6b7280] text-lg">
                Join the global network of high-performance teams using WardSuiteCRM to scale their revenue infrastructure.
             </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6">
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="border-2 border-white bg-gray-200 rounded-full w-10 h-10" />
              ))}
              <div className="flex justify-center items-center border-2 border-white bg-black px-3 rounded-full min-w-10 h-10">
                 <span className="font-bold text-[10px] text-white">+12</span>
              </div>
           </div>
           <div>
              <p className="font-bold text-sm">42.5k Members</p>
              <p className="font-bold text-[#6b7280] text-[10px] uppercase tracking-wider">Active Platforms</p>
           </div>
        </div>

        {/* Floating background elements */}
        <div className="top-1/2 right-0 absolute border-[#f1f1f1] border rounded-full w-[800px] h-[800px] -translate-y-1/2" />
        <div className="top-1/2 right-[100px] absolute border-[#f1f1f1] border rounded-full w-[600px] h-[600px] -translate-y-1/2" />
        
        <div className="bottom-12 left-16 absolute flex gap-8">
           <span className="font-bold text-[#6b7280] text-[10px] uppercase tracking-widest">Trusted by LeadGen AI</span>
           <span className="font-bold text-[#6b7280] text-[10px] uppercase tracking-widest">ISO Certified</span>
           <span className="font-bold text-[#6b7280] text-[10px] uppercase tracking-widest">GDPR Compliant</span>
        </div>
      </div>

      {/* Right side: login form */}
      <div className="flex flex-col flex-1 justify-center px-6 md:px-24">
        <div className="space-y-10 mx-auto w-full max-w-md">
          <div className="space-y-4 text-center lg:text-left">
            <h2 className="font-bold text-[42px] tracking-tight">Sign In</h2>
            <p className="font-medium text-[#6b7280]">Please enter your credentials to access your workspace.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-bold text-[#6b7280] text-[10px] uppercase tracking-widest">Workspace Email</label>
              <div className="relative">
                <Mail className="top-1/2 left-4 absolute w-4 h-4 text-[#6b7280] -translate-y-1/2" />
                <input 
                  type="email" 
                  placeholder="alex@company.com" 
                  required
                  className="border-[#f1f1f1] bg-[#f9fafb] py-4 pr-4 pl-12 border focus:border-black rounded-2xl w-full text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-bold text-[#6b7280] text-[10px] uppercase tracking-widest">Secure Password</label>
                <button type="button" className="font-bold text-[10px] hover:underline uppercase tracking-widest">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="top-1/2 left-4 absolute w-4 h-4 text-[#6b7280] -translate-y-1/2" />
                <input 
                  type="password" 
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" 
                  required
                  className="border-[#f1f1f1] bg-[#f9fafb] py-4 pr-4 pl-12 border focus:border-black rounded-2xl w-full text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="flex justify-center items-center gap-3 bg-black hover:opacity-90 py-5 rounded-full w-full font-bold text-white transition-opacity active:scale-[0.98]"
            >
              ACCESS WORKSPACE
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="relative">
             <div className="absolute inset-0 flex items-center text-[#f1f1f1]">
                <div className="border-[#f1f1f1] border-t w-full" />
             </div>
             <div className="relative flex justify-center bg-white px-4 font-bold text-[#6b7280] text-[10px] uppercase tracking-widest">
                Or continue with
             </div>
          </div>

          <div className="gap-4 grid grid-cols-2">
             <button className="flex justify-center items-center gap-2 border-[#f1f1f1] bg-white hover:bg-gray-50 py-4 border rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors">
                <Chrome className="w-4 h-4" />
                Google
             </button>
             <button className="flex justify-center items-center gap-2 border-[#f1f1f1] bg-white hover:bg-gray-50 py-4 border rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors">
                <Github className="w-4 h-4" />
                Github
             </button>
          </div>

          <p className="font-medium text-[#6b7280] text-center text-xs">
             Internal team access only? <button className="font-bold text-black hover:underline">Request Invitation</button>
          </p>
        </div>
      </div>
    </div>
  );
}
