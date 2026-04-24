import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Cpu } from 'lucide-react';

interface NavbarProps {
  userId: string | null;
}

export default function Navbar({ userId }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-[#E3FF00]/10 bg-[#060A06]/80 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-xl supports-[backdrop-filter]:bg-[#060A06]/60">
      
      {/* Techy Decorative Line */}
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[#E3FF00]/20 to-transparent"></div>

      {/* Logo & Branding */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-white overflow-hidden shadow-[0_0_15px_rgba(227,255,0,0.15)] ring-1 sm:ring-2 ring-[#E3FF00]/50 transition-transform duration-300 hover:scale-105 group">
          <div className="absolute inset-0 bg-[#E3FF00]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Image src="/logo-v2.png" alt="MLRE Logo" width={48} height={48} className="object-contain p-1" />
        </div>
        
        <div className="flex flex-col justify-center">
          <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase leading-none flex items-center gap-2">
            MLRE 
            <span className="hidden sm:flex text-[#E3FF00] text-[10px] sm:text-xs tracking-widest font-mono border border-[#E3FF00]/20 bg-[#E3FF00]/10 px-1.5 py-0.5 rounded">
              v1.0.0
            </span>
          </span>
          <span className="hidden sm:block text-[9px] sm:text-[10px] text-emerald-100/50 uppercase font-mono tracking-widest mt-0.5">
            // Resource Estimator
          </span>
          <span className="block sm:hidden text-[10px] text-[#E3FF00]/80 uppercase font-mono tracking-widest mt-0.5">
            By Aryan
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {userId ? (
          <Link href="/dashboard" className="group relative flex items-center gap-2 rounded-lg sm:rounded-xl bg-[#E3FF00]/10 border border-[#E3FF00]/30 px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-[#E3FF00] transition-all hover:bg-[#E3FF00] hover:text-black hover:shadow-[0_0_20px_rgba(227,255,0,0.4)]">
            <Cpu size={16} className="hidden sm:block group-hover:animate-pulse" />
            <span className="tracking-wide uppercase">Dashboard</span>
          </Link>
        ) : (
          <>
            <SignInButton mode="modal" children={<button className="text-xs sm:text-sm font-mono tracking-wide text-slate-400 hover:text-white transition-colors px-2">LOGIN</button>} />
            <SignUpButton mode="modal" children={<button className="relative overflow-hidden rounded-lg sm:rounded-xl bg-[#E3FF00] px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[0_0_15px_rgba(227,255,0,0.2)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(227,255,0,0.4)]">
              <span className="relative z-10">Deploy</span>
            </button>} />
          </>
        )}
      </div>
    </nav>
  );
}
