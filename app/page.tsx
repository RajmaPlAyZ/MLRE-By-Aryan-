import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Brain, Zap, Server, BarChart3, ChevronRight, Calculator, Cpu, ShieldCheck, Clock, Settings2 } from 'lucide-react';

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-[#060A06] text-white selection:bg-[#E3FF00]/30 font-sans relative">
      
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid-pattern"></div>
      
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-[#E3FF00]/10 bg-[#060A06]/80 px-6 py-4 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white overflow-hidden shadow-lg shadow-[#E3FF00]/30 ring-2 ring-[#E3FF00]/50 transition hover:scale-105">
            <Image src="/logo-v2.png" alt="MLRE Logo" width={48} height={48} className="object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-2xl font-black tracking-tight uppercase leading-none">
              MLRE <span className="text-[#E3FF00] text-sm">By Aryan</span>
            </span>
            <span className="text-[10px] text-emerald-100/60 uppercase font-bold tracking-widest mt-1">
              Machine Learning Resource Estimator
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {userId ? (
            <Link href="/dashboard" className="rounded-xl bg-[#E3FF00] px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-[#E3FF00]/20 transition hover:brightness-110">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <SignInButton mode="modal" children={<button className="text-sm font-bold text-slate-300 hover:text-white transition">Log in</button>} />
              <SignUpButton mode="modal" children={<button className="rounded-xl bg-[#E3FF00] px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-[#E3FF00]/25 transition hover:brightness-110 hover:shadow-[#E3FF00]/40">Get Started</button>} />
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center px-4 pt-32 pb-24 text-center overflow-hidden">
        <div className="absolute top-0 -z-10 h-[1000px] w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(227,255,0,0.1),transparent)]"></div>
        
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E3FF00]/20 bg-[#E3FF00]/10 px-4 py-1.5 text-sm font-bold text-[#E3FF00] uppercase tracking-wider">
          <Zap size={14} className="animate-pulse" />
          <span>The Ultimate ML Resource Calculator</span>
        </div>
        
        <h1 className="max-w-5xl text-6xl font-black tracking-tighter uppercase sm:text-8xl mb-6 leading-none">
          Unmask The <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E3FF00] to-emerald-400 drop-shadow-[0_0_15px_rgba(227,255,0,0.3)]">Future of Compute</span>
        </h1>
        
        <p className="max-w-2xl text-lg text-emerald-100/60 mb-10 leading-relaxed font-medium">
          Instantly estimate VRAM usage, training time, and inference speeds for complex architectures like Transformers, MoE, and CNNs. Compare setups, save configurations, and stop guessing.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
          {userId ? (
            <Link href="/dashboard" className="flex items-center gap-2 rounded-2xl bg-[#E3FF00] px-8 py-4 text-base font-black uppercase text-black shadow-[0_0_30px_rgba(227,255,0,0.3)] transition hover:scale-105">
              Launch Estimator <ChevronRight size={18} />
            </Link>
          ) : (
            <SignUpButton mode="modal" children={<button className="flex items-center gap-2 rounded-2xl bg-[#E3FF00] px-8 py-4 text-base font-black uppercase text-black shadow-[0_0_30px_rgba(227,255,0,0.3)] transition hover:scale-105">Start Estimating Free <ChevronRight size={18} /></button>} />
          )}
        </div>
      </main>

      {/* Features Grid */}
      <section className="px-6 py-24 max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Precision planning for AI</h2>
          <p className="text-emerald-100/60 max-w-2xl mx-auto font-medium">Stop hitting Out-Of-Memory errors. Know exactly what hardware you need before you rent a single GPU.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-[2rem] border border-[#E3FF00]/10 bg-[#0A1108] p-8 shadow-2xl shadow-black/50 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E3FF00]/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="h-14 w-14 rounded-2xl bg-[#E3FF00]/10 flex items-center justify-center mb-6 text-[#E3FF00] border border-[#E3FF00]/20">
              <Brain size={28} />
            </div>
            <h3 className="text-xl font-black uppercase text-white mb-3 tracking-wide">12+ Architectures</h3>
            <p className="text-emerald-100/60 leading-relaxed font-medium">Full mathematical support for Transformers, MoE, Diffusion, CNNs, LSTMs and more with accurate heuristic scaling.</p>
          </div>

          <div className="rounded-[2rem] border border-[#E3FF00]/10 bg-[#0A1108] p-8 shadow-2xl shadow-black/50 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 delay-100">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400 border border-emerald-500/20">
              <Server size={28} />
            </div>
            <h3 className="text-xl font-black uppercase text-white mb-3 tracking-wide">Hardware Matching</h3>
            <p className="text-emerald-100/60 leading-relaxed font-medium">Input your GPU specifications to instantly see feasibility percentiles and estimated MFU (Model FLOPs Utilization).</p>
          </div>

          <div className="rounded-[2rem] border border-[#E3FF00]/10 bg-[#0A1108] p-8 shadow-2xl shadow-black/50 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 delay-200">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E3FF00]/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="h-14 w-14 rounded-2xl bg-[#E3FF00]/10 flex items-center justify-center mb-6 text-[#E3FF00] border border-[#E3FF00]/20">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-xl font-black uppercase text-white mb-3 tracking-wide">Save & Compare</h3>
            <p className="text-emerald-100/60 leading-relaxed font-medium">Save your configurations to your secure account and compare different models side-by-side to find the optimal setup.</p>
          </div>
        </div>
      </section>

      {/* How To Use Section */}
      <section className="px-6 py-24 border-t border-[#E3FF00]/10 bg-[#060A06] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tight mb-4">How To Use The Estimator</h2>
            <p className="text-emerald-100/60 max-w-2xl mx-auto font-medium">Three simple steps to go from a blank slate to a complete hardware strategy.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#E3FF00]/20 to-transparent"></div>
            
            <div className="relative flex flex-col items-center text-center group">
              <div className="h-24 w-24 rounded-full bg-[#0A1108] border-2 border-[#E3FF00]/30 flex items-center justify-center mb-6 z-10 shadow-[0_0_20px_rgba(227,255,0,0.1)] group-hover:border-[#E3FF00] transition-colors">
                <Settings2 size={40} className="text-[#E3FF00]" />
              </div>
              <h3 className="text-xl font-black uppercase text-white mb-2">1. Select Architecture</h3>
              <p className="text-emerald-100/60 font-medium">Choose from 12+ pre-built architectures or load a preset (e.g., LLaMA 3 8B, SDXL). Adjust layers, hidden sizes, and attention heads to match your specific model.</p>
            </div>

            <div className="relative flex flex-col items-center text-center group">
              <div className="h-24 w-24 rounded-full bg-[#0A1108] border-2 border-[#E3FF00]/30 flex items-center justify-center mb-6 z-10 shadow-[0_0_20px_rgba(227,255,0,0.1)] group-hover:border-[#E3FF00] transition-colors">
                <Cpu size={40} className="text-[#E3FF00]" />
              </div>
              <h3 className="text-xl font-black uppercase text-white mb-2">2. Define Hardware</h3>
              <p className="text-emerald-100/60 font-medium">Input your available VRAM, total system RAM, and the raw TFLOPs of your GPU setup. Specify training batch sizes and precision formats (FP16/INT8).</p>
            </div>

            <div className="relative flex flex-col items-center text-center group">
              <div className="h-24 w-24 rounded-full bg-[#0A1108] border-2 border-[#E3FF00]/30 flex items-center justify-center mb-6 z-10 shadow-[0_0_20px_rgba(227,255,0,0.1)] group-hover:border-[#E3FF00] transition-colors">
                <Calculator size={40} className="text-[#E3FF00]" />
              </div>
              <h3 className="text-xl font-black uppercase text-white mb-2">3. Calculate & Compare</h3>
              <p className="text-emerald-100/60 font-medium">Instantly view comprehensive reports on VRAM bottlenecks, estimated training duration, and MFU. Save your run and compare it against other hardware configs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation / Benefits Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="rounded-[3rem] bg-gradient-to-br from-[#0A1108] to-[#060A06] border border-[#E3FF00]/10 p-10 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_100%_100%_at_100%_0%,rgba(227,255,0,0.05),transparent)]"></div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight mb-6">Why Use MLRE?</h2>
              <p className="text-lg text-emerald-100/60 font-medium mb-8">
                Building AI models is expensive. Wasting hours debugging Out-Of-Memory (OOM) errors or renting the wrong cloud GPUs drains your budget. Our calculator acts as your strategic infrastructure partner.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-8 w-8 rounded-full bg-[#E3FF00]/10 flex items-center justify-center text-[#E3FF00] shrink-0 border border-[#E3FF00]/20">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase text-sm mb-1">Prevent Costly Mistakes</h4>
                    <p className="text-emerald-100/60 text-sm">Our heuristic math engine breaks down memory into weights, activations, optimizer states, and gradients so you know exactly where bottlenecks occur.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-8 w-8 rounded-full bg-[#E3FF00]/10 flex items-center justify-center text-[#E3FF00] shrink-0 border border-[#E3FF00]/20">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase text-sm mb-1">Realistic Time Estimates</h4>
                    <p className="text-emerald-100/60 text-sm">We dynamically scale Model FLOPs Utilization (MFU) based on your batch sizes, providing highly accurate training time estimates rather than theoretical maximums.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-8 w-8 rounded-full bg-[#E3FF00]/10 flex items-center justify-center text-[#E3FF00] shrink-0 border border-[#E3FF00]/20">
                    <BarChart3 size={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase text-sm mb-1">Data-Driven Decisions</h4>
                    <p className="text-emerald-100/60 text-sm">Save your configurations securely to your account. Render side-by-side comparisons to prove to stakeholders exactly which hardware tier is necessary.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="rounded-3xl border border-[#E3FF00]/20 bg-black/50 p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h4 className="font-bold text-white uppercase tracking-wider text-sm">Example Breakdown</h4>
                <span className="text-[#E3FF00] text-xs font-bold px-2 py-1 bg-[#E3FF00]/10 rounded border border-[#E3FF00]/20">LLaMA 3 8B</span>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100/60">Model Weights (FP16)</span>
                  <span className="text-white font-mono">14.9 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100/60">Optimizer States (Adam)</span>
                  <span className="text-white font-mono">29.8 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100/60">Gradients (FP16)</span>
                  <span className="text-white font-mono">14.9 GB</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex mt-2">
                  <div className="w-[25%] bg-[#E3FF00]"></div>
                  <div className="w-[50%] bg-emerald-500"></div>
                  <div className="w-[25%] bg-blue-500"></div>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-white font-bold">Total VRAM Required</span>
                  <span className="text-[#E3FF00] font-black font-mono text-lg">59.6 GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
