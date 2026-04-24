'use client';

import React from 'react';
import Image from 'next/image';
import { useEstimatorStore } from '@/store/useEstimatorStore';
import { PRESETS } from '@/lib/presets';
import type { ModelType, Precision, ModelCategory, TrainingConfig } from '@/types';
import { MODEL_TYPE_LABELS, MODEL_CATEGORIES } from '@/types';
import {
  Brain, Cpu, Server, Zap, ChevronDown, ChevronUp,
  Layers, HardDrive, GitCompareArrows,
  BookOpen, Moon, Sun, Sparkles, Menu, X,
} from 'lucide-react';

// ---- Tiny form helpers ------------------------------------

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-slate-400 mb-1.5">{children}</label>;
}

function Input({
  value, onChange, type = 'number', suffix, ...rest
}: {
  value: string | number; onChange: (v: string) => void; type?: string; suffix?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  return (
    <div className="relative">
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
        {...rest} />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{suffix}</span>}
    </div>
  );
}

function Select({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-all appearance-none cursor-pointer focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30">
      {children}
    </select>
  );
}

// ---- Collapsible Section ----------------------------------

function Section({ title, icon: Icon, number, defaultOpen = false, children }: {
  title: string; icon: React.ElementType; number: number; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/5">
        <span className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/15 text-blue-400">
            <Icon size={14} />
          </span>
          {number}. {title}
        </span>
        {open ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

// ---- Dynamic field visibility by model type ----------------

function showHeads(t: ModelType) {
  return ['transformer_decoder','transformer_encoder','transformer_encoder_decoder','moe'].includes(t);
}
function showContext(t: ModelType) {
  return !['gan','vae'].includes(t);
}
function showMoE(t: ModelType) {
  return t === 'moe';
}

// ---- Grouped presets --------------------------------------

const groupedPresets = MODEL_CATEGORIES.map((cat) => ({
  category: cat,
  presets: PRESETS.filter((p) => p.category === cat),
})).filter((g) => g.presets.length > 0);

// ---- Main Sidebar -----------------------------------------

export default function Sidebar() {
  const {
    modelConfig, trainingConfig, hardwareConfig,
    updateModelConfig, updateTrainingConfig, updateHardwareConfig,
    runEstimation, loadPreset, darkMode, toggleDarkMode,
  } = useEstimatorStore();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ---- Config panel (shared between mobile and desktop) -----
  const configPanel = (
    <div className="flex h-full w-72 max-w-[85vw] flex-col border-r border-blue-500/10 bg-black/95 lg:bg-[#050810]/90">
      {/* Mobile close header */}
      <div className="flex items-center justify-between border-b border-white/5 p-3 lg:hidden">
        <span className="text-sm font-bold text-white">Configuration</span>
        <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
          <X size={18} />
        </button>
      </div>

      {/* Preset selector */}
      <div className="border-b border-white/5 p-4">
        <Label>Load Preset</Label>
        <Select value="" onChange={(v) => { if (v) { loadPreset(v); setMobileOpen(false); } }}>
          <option value="" className="bg-[#0a0f1a]">Select a preset…</option>
          {groupedPresets.map((g) => (
            <optgroup key={g.category} label={`── ${g.category} ──`} className="bg-[#0a0f1a] text-slate-400">
              {g.presets.map((p) => (
                <option key={p.name} value={p.name} className="bg-[#0a0f1a] text-white">{p.name}</option>
              ))}
            </optgroup>
          ))}
        </Select>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Section title="Model Configuration" icon={Brain} number={1} defaultOpen={true}>
          <div>
            <Label>Model Type</Label>
            <Select value={modelConfig.modelType} onChange={(v) => updateModelConfig({ modelType: v as ModelType })}>
              {(Object.entries(MODEL_TYPE_LABELS) as [ModelType, string][]).map(([val, lbl]) => (
                <option key={val} value={val} className="bg-[#0a0f1a]">{lbl}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Model Name (Optional)</Label>
            <Input type="text" value={modelConfig.modelName} onChange={(v) => updateModelConfig({ modelName: v })} placeholder="e.g. LLaMA 3 8B" />
          </div>
          <div>
            <Label>Total Parameters</Label>
            <Input value={modelConfig.parameters / 1e9} onChange={(v) => updateModelConfig({ parameters: parseFloat(v || '0') * 1e9 })} suffix="Billion" step="0.1" min="0" />
          </div>
          {showContext(modelConfig.modelType) && (
            <div>
              <Label>{['cnn','diffusion','gan','vae'].includes(modelConfig.modelType) ? 'Input Size (px / tokens)' : 'Context Window / Sequence Length'}</Label>
              <Input value={modelConfig.contextLength} onChange={(v) => updateModelConfig({ contextLength: parseInt(v || '0') })} suffix={['cnn','diffusion','gan','vae'].includes(modelConfig.modelType) ? 'px' : 'tokens'} min="1" />
            </div>
          )}
          <div>
            <Label>Layers</Label>
            <Input value={modelConfig.layers} onChange={(v) => updateModelConfig({ layers: parseInt(v || '1') })} min="1" />
          </div>
          <div>
            <Label>Hidden Size</Label>
            <Input value={modelConfig.hiddenSize} onChange={(v) => updateModelConfig({ hiddenSize: parseInt(v || '1') })} min="1" />
          </div>
          {showHeads(modelConfig.modelType) && (
            <div>
              <Label>Attention Heads</Label>
              <Input value={modelConfig.heads} onChange={(v) => updateModelConfig({ heads: parseInt(v || '1') })} min="1" />
            </div>
          )}
          {showMoE(modelConfig.modelType) && (
            <>
              <div>
                <Label>Total Experts</Label>
                <Input value={modelConfig.numExperts ?? 8} onChange={(v) => updateModelConfig({ numExperts: parseInt(v || '8') })} min="1" />
              </div>
              <div>
                <Label>Active Experts (per token)</Label>
                <Input value={modelConfig.activeExperts ?? 2} onChange={(v) => updateModelConfig({ activeExperts: parseInt(v || '2') })} min="1" />
              </div>
            </>
          )}
        </Section>

        <Section title="Training Configuration" icon={Layers} number={2}>
          <div>
            <Label>Precision</Label>
            <Select value={trainingConfig.precision} onChange={(v) => updateTrainingConfig({ precision: v as Precision })}>
              <option value="fp32" className="bg-[#0a0f1a]">FP32 (Full Precision)</option>
              <option value="fp16" className="bg-[#0a0f1a]">FP16 (Mixed Precision)</option>
              <option value="bf16" className="bg-[#0a0f1a]">BF16 (Brain Float)</option>
              <option value="int8" className="bg-[#0a0f1a]">INT8 (Quantized)</option>
              <option value="int4" className="bg-[#0a0f1a]">INT4 (Heavy Quantized)</option>
            </Select>
          </div>
          <div>
            <Label>Optimizer</Label>
            <Select value={trainingConfig.optimizer ?? 'adamw'} onChange={(v) => updateTrainingConfig({ optimizer: v as TrainingConfig['optimizer'] })}>
              <option value="adamw" className="bg-[#0a0f1a]">AdamW</option>
              <option value="adam" className="bg-[#0a0f1a]">Adam</option>
              <option value="sgd" className="bg-[#0a0f1a]">SGD + Momentum</option>
              <option value="adafactor" className="bg-[#0a0f1a]">Adafactor</option>
            </Select>
          </div>
          <div>
            <Label>Batch Size (per GPU)</Label>
            <Input value={trainingConfig.batchSize} onChange={(v) => updateTrainingConfig({ batchSize: parseInt(v || '1') })} min="1" />
          </div>
          <div>
            <Label>Gradient Accumulation Steps</Label>
            <Input value={trainingConfig.gradientAccumulation} onChange={(v) => updateTrainingConfig({ gradientAccumulation: parseInt(v || '1') })} min="1" />
          </div>
          <div>
            <Label>Dataset Size ({['cnn','gan','vae','diffusion'].includes(modelConfig.modelType) ? 'samples' : 'tokens'})</Label>
            <Input value={trainingConfig.datasetSize >= 1e9 ? trainingConfig.datasetSize / 1e9 : trainingConfig.datasetSize / 1e6}
              onChange={(v) => updateTrainingConfig({ datasetSize: parseFloat(v || '0') * (trainingConfig.datasetSize >= 1e9 ? 1e9 : 1e6) })}
              suffix={trainingConfig.datasetSize >= 1e9 ? 'Billion' : 'Million'} step="0.1" min="0" />
          </div>
          <div>
            <Label>Epochs</Label>
            <Input value={trainingConfig.epochs} onChange={(v) => updateTrainingConfig({ epochs: parseInt(v || '1') })} min="1" />
          </div>
        </Section>

        <Section title="Hardware Configuration" icon={HardDrive} number={3}>
          <div>
            <Label>GPU VRAM</Label>
            <Input value={hardwareConfig.gpuVram} onChange={(v) => updateHardwareConfig({ gpuVram: parseFloat(v || '0') })} suffix="GB" min="0" />
          </div>
          <div>
            <Label>GPU TFLOPs</Label>
            <Input value={hardwareConfig.gpuTflops} onChange={(v) => updateHardwareConfig({ gpuTflops: parseFloat(v || '0') })} suffix="TFLOPs" min="0" />
          </div>
          <div>
            <Label>Number of GPUs</Label>
            <Input value={hardwareConfig.numGpus ?? 1} onChange={(v) => updateHardwareConfig({ numGpus: parseInt(v || '1') })} min="1" />
          </div>
          <div>
            <Label>System RAM</Label>
            <Input value={hardwareConfig.ram} onChange={(v) => updateHardwareConfig({ ram: parseFloat(v || '0') })} suffix="GB" min="0" />
          </div>
          <div>
            <Label>CPU Cores</Label>
            <Input value={hardwareConfig.cpuCores} onChange={(v) => updateHardwareConfig({ cpuCores: parseInt(v || '1') })} min="1" />
          </div>
        </Section>
      </div>

      {/* Estimation button */}
      <div className="border-t border-white/5 p-4">
        <button onClick={() => { runEstimation(); setMobileOpen(false); }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110 active:scale-[0.98]">
          <Zap size={16} />
          Calculate Estimation
        </button>
      </div>

      {/* Help footer — hidden on very small screens */}
      <div className="hidden sm:block border-t border-white/5 p-4">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs font-medium text-slate-300 mb-1">Need Help?</p>
          <p className="text-xs text-slate-500 leading-relaxed">Read the documentation or watch a quick tutorial.</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile hamburger button (shown on < lg) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`fixed top-3 left-3 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-[#060A06]/90 border border-[#E3FF00]/20 text-[#E3FF00] shadow-[0_0_15px_rgba(227,255,0,0.1)] backdrop-blur-sm lg:hidden transition-all duration-300 ease-out ${
          mobileOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100 hover:scale-105'
        }`}
        aria-label="Open configuration sidebar"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile overlay ── */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? 'visible' : 'invisible'
        }`} 
        onClick={() => setMobileOpen(false)}
      >
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`} 
        />
        <div 
          className={`relative h-full flex transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`} 
          onClick={(e) => e.stopPropagation()}
        >
          {configPanel}
        </div>
      </div>

      {/* ── Desktop sidebar (hidden on < lg) ── */}
      <div className="hidden lg:flex h-screen">
        {/* Config panel — desktop */}
        {configPanel}
      </div>
    </>
  );
}
