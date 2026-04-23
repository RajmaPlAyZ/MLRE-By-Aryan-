// ============================================================
// ML Resource Estimator — Type Definitions
// ============================================================

export type ModelType =
  | 'transformer_decoder'
  | 'transformer_encoder'
  | 'transformer_encoder_decoder'
  | 'cnn'
  | 'rnn'
  | 'lstm'
  | 'gru'
  | 'moe'
  | 'diffusion'
  | 'gan'
  | 'vae'
  | 'hybrid';

export type Precision = 'fp32' | 'fp16' | 'bf16' | 'int8' | 'int4';
export type FeasibilityStatus = 'feasible' | 'risky' | 'not_feasible';

/** Human-readable labels for every ModelType */
export const MODEL_TYPE_LABELS: Record<ModelType, string> = {
  transformer_decoder:         'Transformer (Decoder Only)',
  transformer_encoder:         'Transformer (Encoder Only)',
  transformer_encoder_decoder: 'Transformer (Encoder-Decoder)',
  cnn:                         'CNN (Convolutional)',
  rnn:                         'RNN (Vanilla)',
  lstm:                        'LSTM',
  gru:                         'GRU',
  moe:                         'Mixture of Experts (MoE)',
  diffusion:                   'Diffusion Model',
  gan:                         'GAN',
  vae:                         'VAE / Autoencoder',
  hybrid:                      'Hybrid / Custom',
};

/** Category groupings for the preset dropdown */
export const MODEL_CATEGORIES = [
  'LLM / Transformer',
  'Vision / CNN',
  'Sequence / RNN',
  'Generative',
  'Other',
] as const;

export type ModelCategory = (typeof MODEL_CATEGORIES)[number];

// ---- Input Configs ----------------------------------------

export interface ModelConfig {
  modelType: ModelType;
  modelName: string;
  parameters: number;        // raw count (e.g. 7_000_000_000)
  layers: number;
  hiddenSize: number;
  heads: number;
  contextLength: number;     // sequence length / image size for CNNs
  vocabSize?: number;        // relevant for language models
  intermediateSize?: number; // FFN intermediate size
  numExperts?: number;       // MoE models
  activeExperts?: number;    // MoE: experts used per token
}

export interface TrainingConfig {
  datasetSize: number;       // tokens / samples
  batchSize: number;
  epochs: number;
  precision: Precision;
  gradientAccumulation: number;
  learningRate?: number;
  warmupSteps?: number;
  optimizer?: 'adam' | 'adamw' | 'sgd' | 'adafactor';
}

export interface HardwareConfig {
  gpuVram: number;           // GB
  gpuTflops: number;         // TFLOPs
  ram: number;               // GB
  cpuCores: number;
  numGpus?: number;
  gpuName?: string;
}

// ---- Estimation Results -----------------------------------

export interface VramBreakdown {
  weights: number;           // bytes
  gradients: number;
  optimizer: number;
  activations: number;
  total: number;
}

export interface EstimationResult {
  vram: VramBreakdown;
  totalFlops: number;
  totalTokens: number;
  trainingTimeSeconds: number;
  tokensPerSec: number;
  feasibility: FeasibilityStatus;
  feasibilityPercent: number;     // vram usage as % of GPU VRAM
  peakVram: number;               // GB
  ramUsage: number;               // GB
  storageRequired: number;        // GB
}

// ---- Comparison -------------------------------------------

export interface ComparisonEntry {
  id: string;
  name: string;
  modelConfig: ModelConfig;
  trainingConfig: TrainingConfig;
  hardwareConfig: HardwareConfig;
  result: EstimationResult;
  isCurrent: boolean;
}

// ---- Presets ----------------------------------------------

export interface Preset {
  name: string;
  category: ModelCategory;
  modelConfig: ModelConfig;
  trainingConfig: TrainingConfig;
  hardwareConfig: HardwareConfig;
}
