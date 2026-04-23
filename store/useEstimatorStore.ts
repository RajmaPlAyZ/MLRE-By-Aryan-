// ============================================================
// ML Resource Estimator — Zustand Store
// ============================================================

import { create } from 'zustand';
import type {
  ModelConfig,
  TrainingConfig,
  HardwareConfig,
  EstimationResult,
  ComparisonEntry,
} from '@/types';
import { runEstimation } from '@/lib/calculations';
import { PRESETS } from '@/lib/presets';

// ---- Default values (LLaMA 3 8B preset) --------------------

const defaultPreset = PRESETS[0];

interface EstimatorState {
  // Sidebar active tab
  activeTab: 'model' | 'training' | 'hardware';

  // Configs
  modelConfig: ModelConfig;
  trainingConfig: TrainingConfig;
  hardwareConfig: HardwareConfig;

  // Results
  result: EstimationResult | null;
  hasRun: boolean;

  // Comparison table
  comparisons: ComparisonEntry[];

  // Theme
  darkMode: boolean;

  // Actions
  setActiveTab: (tab: 'model' | 'training' | 'hardware') => void;
  updateModelConfig: (patch: Partial<ModelConfig>) => void;
  updateTrainingConfig: (patch: Partial<TrainingConfig>) => void;
  updateHardwareConfig: (patch: Partial<HardwareConfig>) => void;
  runEstimation: () => void;
  loadPreset: (name: string) => void;
  addComparison: (name?: string) => void;
  removeComparison: (id: string) => void;
  clearComparisons: () => void;
  setComparisons: (comparisons: ComparisonEntry[]) => void;
  toggleDarkMode: () => void;
}

export const useEstimatorStore = create<EstimatorState>((set, get) => ({
  activeTab: 'model',

  modelConfig: { ...defaultPreset.modelConfig },
  trainingConfig: { ...defaultPreset.trainingConfig },
  hardwareConfig: { ...defaultPreset.hardwareConfig },

  result: null,
  hasRun: false,

  comparisons: [],

  darkMode: true,

  // ---- Actions --------------------------------------------

  setActiveTab: (tab) => set({ activeTab: tab }),

  updateModelConfig: (patch) =>
    set((s) => ({ modelConfig: { ...s.modelConfig, ...patch } })),

  updateTrainingConfig: (patch) =>
    set((s) => ({ trainingConfig: { ...s.trainingConfig, ...patch } })),

  updateHardwareConfig: (patch) =>
    set((s) => ({ hardwareConfig: { ...s.hardwareConfig, ...patch } })),

  runEstimation: () => {
    const { modelConfig, trainingConfig, hardwareConfig } = get();
    const result = runEstimation(modelConfig, trainingConfig, hardwareConfig);
    set({ result, hasRun: true });
  },

  loadPreset: (name) => {
    const preset = PRESETS.find((p) => p.name === name);
    if (!preset) return;
    const m = { ...preset.modelConfig };
    const t = { ...preset.trainingConfig };
    const h = { ...preset.hardwareConfig };
    const result = runEstimation(m, t, h);
    set({
      modelConfig: m,
      trainingConfig: t,
      hardwareConfig: h,
      result,
      hasRun: true,
    });
  },

  addComparison: (name) => {
    const { modelConfig, trainingConfig, hardwareConfig, result } = get();
    if (!result) return;

    const entry: ComparisonEntry = {
      id: crypto.randomUUID(),
      name: name ?? (modelConfig.modelName || 'Custom Config'),
      modelConfig: { ...modelConfig },
      trainingConfig: { ...trainingConfig },
      hardwareConfig: { ...hardwareConfig },
      result: { ...result },
      isCurrent: true,
    };

    set((s) => ({
      comparisons: [
        ...s.comparisons.map((c) => ({ ...c, isCurrent: false })),
        entry,
      ],
    }));
  },

  removeComparison: (id) =>
    set((s) => ({
      comparisons: s.comparisons.filter((c) => c.id !== id),
    })),

  clearComparisons: () => set({ comparisons: [] }),
  setComparisons: (comparisons) => set({ comparisons }),

  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
}));
