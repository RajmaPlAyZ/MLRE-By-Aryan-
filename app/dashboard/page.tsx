'use client';

import React from 'react';
import { UserButton } from '@clerk/nextjs';
import Sidebar from '@/components/Sidebar';
import { MetricCard, FeasibilityCard, VramFitCard } from '@/components/MetricCard';
import {
  VramBreakdownChart,
  TrainingTimeChart,
  VramVsBatchSizeChart,
  TokensPerSecChart,
} from '@/components/Charts';
import ComparisonTable from '@/components/ComparisonTable';
import { GuideModal } from '@/components/GuideModal';
import { useEstimatorStore } from '@/store/useEstimatorStore';
import {
  formatNumber,
  formatTime,
  formatFlops,
  formatBytes,
} from '@/lib/calculations';
import {
  Cpu,
  Layers,
  Zap,
  HardDrive,
  Clock,
  Gauge,
  Database,
  Save,
  Settings,
  BarChart3,
  BookOpen,
} from 'lucide-react';

export default function Home() {
  const [isGuideOpen, setIsGuideOpen] = React.useState(false);

  const {
    modelConfig,
    trainingConfig,
    hardwareConfig,
    result,
    hasRun,
    runEstimation,
  } = useEstimatorStore();

  // Auto-run estimation on first load
  React.useEffect(() => {
    if (!hasRun) {
      runEstimation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-blue-500/10 bg-black/80 backdrop-blur-xl px-4 sm:px-6 py-3">
          <div className="pl-10 lg:pl-0">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Estimation Dashboard
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">
              Real-time estimation of resources and performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/20 hover:text-blue-300"
            >
              <BookOpen size={14} />
              <span className="hidden sm:inline">Help & Guide</span>
            </button>
            <UserButton />
          </div>
        </header>

        <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

        {result ? (
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* ============================================== */}
            {/* Section 1: Executive Summary                   */}
            {/* ============================================== */}
            <section className="animate-fade-in-up">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">
                Executive Summary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeasibilityCard
                status={result.feasibility}
                percent={result.feasibilityPercent}
                vramUsed={result.peakVram}
                vramTotal={hardwareConfig.gpuVram}
              />
              <VramFitCard
                percent={result.feasibilityPercent}
                vramUsed={result.peakVram}
                vramTotal={hardwareConfig.gpuVram}
              />
              <MetricCard
                icon={<Clock size={18} />}
                label="Est. Training Time"
                value={formatTime(result.trainingTimeSeconds)}
                subtitle={`(${(result.trainingTimeSeconds / 3600).toFixed(1)} hours)`}
                color="blue"
                variant="primary"
              />
              <MetricCard
                icon={<Gauge size={18} />}
                label="Est. Inference Speed"
                value={result.tokensPerSec.toFixed(1)}
                subtitle="tokens / sec"
                color="blue"
                variant="primary"
              />
              </div>
            </section>

            {/* ============================================== */}
            {/* Section 2: Detailed Resource Breakdown         */}
            {/* ============================================== */}
            <section className="animate-fade-in-up delay-100">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">
                Detailed Breakdown
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <MetricCard
                icon={<Cpu size={16} />}
                label="Total Parameters"
                value={formatNumber(modelConfig.parameters)}
                subtitle="Parameters"
                color="blue"
              />
              <MetricCard
                icon={<Layers size={16} />}
                label="Total Tokens (Training)"
                value={formatNumber(result.totalTokens)}
                subtitle="Tokens"
                color="blue"
              />
              <MetricCard
                icon={<BarChart3 size={16} />}
                label="Total FLOPs (Training)"
                value={formatFlops(result.totalFlops)}
                subtitle="FLOPs"
                color="emerald"
              />
              <MetricCard
                icon={<Zap size={16} />}
                label="Peak VRAM Usage"
                value={`${result.peakVram.toFixed(1)} GB`}
                subtitle={`of ${hardwareConfig.gpuVram} GB`}
                color="orange"
              />
              <MetricCard
                icon={<HardDrive size={16} />}
                label="System RAM Usage"
                value={`${result.ramUsage.toFixed(1)} GB`}
                subtitle={`of ${hardwareConfig.ram} GB`}
                color="amber"
              />
              <MetricCard
                icon={<Database size={16} />}
                label="Storage Required"
                value={`${result.storageRequired.toFixed(1)} GB`}
                subtitle="(Temp + Checkpoints)"
                color="green"
              />
              </div>
            </section>

            {/* ============================================== */}
            {/* Section 3: Visualizations                      */}
            {/* ============================================== */}
            <section className="animate-fade-in-up delay-200">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">
                Performance Visualizations
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <VramBreakdownChart result={result} />
              <TrainingTimeChart
                modelConfig={modelConfig}
                trainingConfig={trainingConfig}
                hardwareConfig={hardwareConfig}
              />
            </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <VramVsBatchSizeChart
                modelConfig={modelConfig}
                trainingConfig={trainingConfig}
                hardwareConfig={hardwareConfig}
              />
              <TokensPerSecChart
                modelConfig={modelConfig}
                hardwareConfig={hardwareConfig}
              />
            </div>

            </section>

            {/* ============================================== */}
            {/* Section 4: Comparison Table                    */}
            {/* ============================================== */}
            <section className="animate-fade-in-up delay-300">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">
                Configuration Comparison
              </h2>
              <ComparisonTable />
            </section>

            {/* Footer */}
            <div className="pb-4 text-center">
              <p className="text-[11px] text-slate-600">
                ⚡ Estimates are approximate and may vary based on hardware, software, and implementation.
              </p>
            </div>
          </div>
        ) : (
          /* Empty state — before first estimation */
          <div className="flex flex-1 items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                <Zap size={36} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Ready to Estimate
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Configure your model, training, and hardware parameters in the
                sidebar, then click{' '}
                <span className="font-semibold text-blue-400">
                  Calculate Estimation
                </span>{' '}
                to see results.
              </p>
              <button
                onClick={runEstimation}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 
                           px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 
                           transition hover:shadow-blue-500/40 hover:brightness-110"
              >
                <Zap size={16} />
                Calculate Now
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
