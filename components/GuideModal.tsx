import React from 'react';
import { X, BookOpen, Zap, Server, Brain, Calculator, Info } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Window */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-blue-500/20 bg-[#050810] shadow-2xl shadow-blue-900/20 flex flex-col animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-blue-500/10 px-6 py-4 bg-[#0a0f1a]/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">How to Use the Estimator</h2>
              <p className="text-xs text-slate-400">A quick guide to ML resource estimation</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Section: The Workflow */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Zap size={16} /> 1. The Workflow
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-blue-500/10 bg-black/50 p-4">
                <Brain size={20} className="mb-2 text-blue-300" />
                <h4 className="font-semibold text-white text-sm mb-1">Pick a Model</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Start by choosing an architecture (like Transformer or CNN) and setting parameters like layer count and sequence length.
                </p>
              </div>
              <div className="rounded-xl border border-blue-500/10 bg-black/50 p-4">
                <Server size={20} className="mb-2 text-blue-300" />
                <h4 className="font-semibold text-white text-sm mb-1">Set Hardware</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Input your available VRAM and GPU TFLOPs to determine if the model will fit and how fast it will run.
                </p>
              </div>
              <div className="rounded-xl border border-blue-500/10 bg-black/50 p-4">
                <Calculator size={20} className="mb-2 text-blue-300" />
                <h4 className="font-semibold text-white text-sm mb-1">Calculate</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hit the Calculate button to generate real-time estimates for VRAM usage, training time, and inference speed.
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-sm text-blue-200 flex items-start gap-2">
              <Info size={16} className="mt-0.5 shrink-0" />
              <p><strong>Pro Tip:</strong> Use the "Load Preset" dropdown in the sidebar to instantly configure known models like LLaMA 3, ResNet, or Stable Diffusion.</p>
            </div>
          </section>

          {/* Section: Terminology */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <BookOpen size={16} /> 2. Key Terminology
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <strong className="text-white block mb-1">VRAM (Video RAM)</strong>
                <span className="text-slate-400">The memory on your GPU. Exceeding this limit causes Out of Memory (OOM) errors. The estimator breaks this down into Weights, Activations, Optimizer States, and Gradients.</span>
              </div>
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <strong className="text-white block mb-1">Precision (FP16 / INT8)</strong>
                <span className="text-slate-400">The data format used. FP32 uses 4 bytes per parameter. FP16 uses 2 bytes, cutting memory requirements in half. Quantization (INT8/INT4) reduces it even further.</span>
              </div>
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <strong className="text-white block mb-1">FLOPs</strong>
                <span className="text-slate-400">Floating Point Operations. A measure of the total computational work required to train the model or process a token.</span>
              </div>
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <strong className="text-white block mb-1">MFU (Model FLOPs Utilization)</strong>
                <span className="text-slate-400">How efficiently your code uses the GPU's theoretical maximum power. Higher batch sizes typically result in higher MFU.</span>
              </div>
            </div>
          </section>

          {/* Section: Limitations */}
          <section className="space-y-3 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Info size={16} /> 3. Limitations & Disclaimers
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              These calculations are theoretical estimates based on standard architectural math and heuristic multipliers. Real-world performance will vary based on:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1 ml-2">
              <li>Framework overhead (PyTorch, TensorFlow, JAX).</li>
              <li>Memory fragmentation and dynamic allocation patterns.</li>
              <li>Communication bottlenecks in multi-GPU setups.</li>
              <li>Implementation details like FlashAttention or Gradient Checkpointing.</li>
            </ul>
          </section>

        </div>
        
        {/* Footer */}
        <div className="border-t border-blue-500/10 bg-[#0a0f1a]/50 p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
          >
            Got it, let's estimate
          </button>
        </div>

      </div>
    </div>
  );
}
