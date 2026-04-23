'use client';

import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'violet' | 'emerald' | 'amber';
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
}

const COLOR_MAP = {
  blue: {
    bg: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20',
    icon: 'bg-blue-500/15 text-blue-400',
    glow: 'shadow-blue-500/5',
  },
  green: {
    bg: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/20',
    icon: 'bg-emerald-500/15 text-emerald-400',
    glow: 'shadow-emerald-500/5',
  },
  orange: {
    bg: 'from-orange-500/10 to-orange-600/5',
    border: 'border-orange-500/20',
    icon: 'bg-orange-500/15 text-orange-400',
    glow: 'shadow-orange-500/5',
  },
  red: {
    bg: 'from-red-500/10 to-red-600/5',
    border: 'border-red-500/20',
    icon: 'bg-red-500/15 text-red-400',
    glow: 'shadow-red-500/5',
  },
  violet: {
    bg: 'from-sky-500/10 to-sky-600/5',
    border: 'border-sky-500/20',
    icon: 'bg-sky-500/15 text-sky-400',
    glow: 'shadow-sky-500/5',
  },
  emerald: {
    bg: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/20',
    icon: 'bg-emerald-500/15 text-emerald-400',
    glow: 'shadow-emerald-500/5',
  },
  amber: {
    bg: 'from-amber-500/10 to-amber-600/5',
    border: 'border-amber-500/20',
    icon: 'bg-amber-500/15 text-amber-400',
    glow: 'shadow-amber-500/5',
  },
};

export function MetricCard({
  icon,
  label,
  value,
  subtitle,
  color = 'blue',
  variant = 'secondary',
  children,
}: MetricCardProps) {
  const c = COLOR_MAP[color];

  if (variant === 'primary') {
    return (
      <div
        className={`group relative overflow-hidden rounded-2xl border ${c.border} 
                    bg-gradient-to-br ${c.bg} p-5 shadow-lg ${c.glow}
                    transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
      >
        {/* Subtle gradient glow */}
        <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />

        <div className="relative">
          <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${c.icon}`}>
            {icon}
          </div>
          <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/5 
                  bg-gradient-to-br from-white/[0.03] to-transparent p-4
                  transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl ${c.icon}`}>
          {icon}
        </div>
        <p className="text-[11px] font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
        {subtitle && (
          <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// ---- Feasibility Card (special variant) --------------------

interface FeasibilityCardProps {
  status: 'feasible' | 'risky' | 'not_feasible';
  percent: number;
  vramUsed: number;
  vramTotal: number;
}

export function FeasibilityCard({
  status,
  percent,
  vramUsed,
  vramTotal,
}: FeasibilityCardProps) {
  const config = {
    feasible: {
      color: 'text-emerald-400',
      bg: 'from-emerald-500/10 to-emerald-600/5',
      border: 'border-emerald-500/20',
      barColor: 'bg-emerald-500',
      label: 'Feasible',
      emoji: '✅',
      desc: 'Your system can handle this configuration.',
    },
    risky: {
      color: 'text-amber-400',
      bg: 'from-amber-500/10 to-amber-600/5',
      border: 'border-amber-500/20',
      barColor: 'bg-amber-500',
      label: 'Risky',
      emoji: '⚠️',
      desc: 'Tight on VRAM. Consider reducing batch size.',
    },
    not_feasible: {
      color: 'text-red-400',
      bg: 'from-red-500/10 to-red-600/5',
      border: 'border-red-500/20',
      barColor: 'bg-red-500',
      label: 'Not Feasible',
      emoji: '❌',
      desc: 'Exceeds available GPU VRAM.',
    },
  }[status];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${config.border} 
                  bg-gradient-to-br ${config.bg} p-5 shadow-lg
                  transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
    >
      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />
      <div className="relative">
        <p className="text-xs font-medium text-slate-400 mb-1">Overall Feasibility</p>
        <p className={`text-2xl font-bold ${config.color}`}>
          {config.emoji} {config.label}
        </p>
        <p className="mt-1 text-xs text-slate-500">{config.desc}</p>
      </div>
    </div>
  );
}

export function VramFitCard({
  percent,
  vramUsed,
  vramTotal,
}: {
  percent: number;
  vramUsed: number;
  vramTotal: number;
}) {
  const barColor =
    percent > 100
      ? 'bg-red-500'
      : percent > 80
      ? 'bg-amber-500'
      : 'bg-emerald-500';
  const textColor =
    percent > 100
      ? 'text-red-400'
      : percent > 80
      ? 'text-amber-400'
      : 'text-emerald-400';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 
                    bg-gradient-to-br from-white/[0.03] to-transparent p-5
                    transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />
      <div className="relative">
        <p className="text-xs font-medium text-slate-400 mb-1">VRAM Fit</p>
        <p className={`text-3xl font-bold ${textColor}`}>
          {Math.min(percent, 999).toFixed(0)}%
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {vramUsed.toFixed(1)} / {vramTotal} GB
        </p>
        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
