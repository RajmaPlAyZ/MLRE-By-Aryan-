// ============================================================
// ML Resource Estimator — Calculation Engine
// ============================================================

import type {
  ModelConfig,
  ModelType,
  TrainingConfig,
  HardwareConfig,
  VramBreakdown,
  EstimationResult,
  FeasibilityStatus,
  Precision,
} from '@/types';

// ============================================================
// Helpers
// ============================================================

/** Bytes per parameter for each precision level */
function precisionBytes(p: Precision): number {
  switch (p) {
    case 'fp32':  return 4;
    case 'fp16':  return 2;
    case 'bf16':  return 2;
    case 'int8':  return 1;
    case 'int4':  return 0.5;
  }
}

function bytesToGB(bytes: number): number {
  return bytes / (1024 ** 3);
}

// ============================================================
// Architecture-specific multipliers
// ============================================================

/**
 * Returns a multiplier applied to the base activation memory estimate.
 * Different architectures store different intermediate tensors, so
 * activations vary considerably.
 */
function activationMultiplier(type: ModelType): number {
  switch (type) {
    // Decoder-only: KV cache + causal attention
    case 'transformer_decoder':         return 1.0;
    // Encoder-only: no KV cache needed, but bidirectional attention
    case 'transformer_encoder':         return 0.8;
    // Enc-Dec: both encoder and decoder activations
    case 'transformer_encoder_decoder': return 1.6;
    // CNNs store feature maps per layer
    case 'cnn':                         return 2.0;
    // Vanilla RNN: simpler activations
    case 'rnn':                         return 0.6;
    // LSTM: 4 gates → ~4× state
    case 'lstm':                        return 2.4;
    // GRU: 3 gates → ~3× state
    case 'gru':                         return 1.8;
    // MoE: expert routing buffers
    case 'moe':                         return 1.3;
    // Diffusion: UNet stores many intermediate feature maps
    case 'diffusion':                   return 3.0;
    // GAN: generator + discriminator activations
    case 'gan':                         return 2.5;
    // VAE: encoder + decoder + reparameterisation
    case 'vae':                         return 2.0;
    case 'hybrid':                      return 1.2;
  }
}

/**
 * FLOPs multiplier relative to the canonical 6 × P × T formula
 * (which is calibrated for decoder-only transformers).
 */
function flopsMultiplier(type: ModelType): number {
  switch (type) {
    case 'transformer_decoder':         return 1.0;
    case 'transformer_encoder':         return 0.9;
    case 'transformer_encoder_decoder': return 1.4;
    case 'cnn':                         return 0.5;
    case 'rnn':                         return 0.4;
    case 'lstm':                        return 0.55;
    case 'gru':                         return 0.45;
    case 'moe':                         return 0.6;  // sparse — only activeExperts run
    case 'diffusion':                   return 2.5;  // many denoising steps
    case 'gan':                         return 1.8;  // G + D
    case 'vae':                         return 1.2;
    case 'hybrid':                      return 1.0;
  }
}

/**
 * Optimizer memory multiplier.
 * Adam/AdamW keep 2 extra states (m, v) → 2×.
 * SGD keeps only momentum → 1×.
 * Adafactor uses less memory → 0.5×.
 */
function optimizerMultiplier(opt?: string): number {
  switch (opt) {
    case 'sgd':       return 1;
    case 'adafactor': return 0.5;
    case 'adam':
    case 'adamw':
    default:          return 2;
  }
}

/**
 * Inference speed factor: how the architecture's compute intensity
 * changes the base tokens-per-sec estimate.
 */
function inferenceSpeedFactor(type: ModelType): number {
  switch (type) {
    case 'transformer_decoder':         return 1.0;
    case 'transformer_encoder':         return 1.2;
    case 'transformer_encoder_decoder': return 0.7;
    case 'cnn':                         return 3.0;   // CNNs are fast at inference
    case 'rnn':                         return 0.8;   // sequential → slow
    case 'lstm':                        return 0.7;
    case 'gru':                         return 0.75;
    case 'moe':                         return 1.1;   // sparse routing helps
    case 'diffusion':                   return 0.15;  // many sampling steps
    case 'gan':                         return 2.0;   // generator only
    case 'vae':                         return 1.8;
    case 'hybrid':                      return 1.0;
  }
}

// ============================================================
// Core Estimations
// ============================================================

export function estimateVram(
  model: ModelConfig,
  training: TrainingConfig,
): VramBreakdown {
  const isTraining = !!training.optimizer;
  const pBytes = precisionBytes(training.precision);

  // For MoE the total params include all experts, but we use activeExperts
  // to determine actual runtime memory for routing
  let effectiveParams = model.parameters;
  if (model.modelType === 'moe' && model.numExperts && model.activeExperts) {
    // Weights stored for all experts, but activations only for active ones
    effectiveParams = model.parameters; // weights = all experts
  }

  const weights = effectiveParams * pBytes;
  let gradients = 0;
  let optimizer = 0;

  if (isTraining) {
    gradients = effectiveParams * pBytes;
    
    // Real-world optimizer states (always in FP32 to prevent underflow):
    // AdamW: 12 bytes/param (4B master weights + 4B momentum + 4B variance)
    // SGD: 8 bytes/param (4B master + 4B momentum)
    // Adafactor: ~4 bytes/param
    switch (training.optimizer) {
      case 'sgd':
        optimizer = effectiveParams * 8;
        break;
      case 'adafactor':
        optimizer = effectiveParams * 4;
        break;
      case 'adam':
      case 'adamw':
      default:
        optimizer = effectiveParams * 12;
        break;
    }
  }

  // Base activation memory
  const actMul = activationMultiplier(model.modelType);
  const activations = training.batchSize * model.layers * model.hiddenSize * 4 * actMul;

  return {
    weights,
    gradients,
    optimizer,
    activations,
    total: weights + gradients + optimizer + activations,
  };
}

export function estimateTotalTokens(training: TrainingConfig): number {
  return training.datasetSize * training.epochs;
}

export function estimateFlops(
  model: ModelConfig,
  totalTokens: number,
  isTraining: boolean = true,
): number {
  // 6 * P * T for training (1 forward + 2 backward pass equivalents)
  // 2 * P * T for inference (forward pass only)
  const baseMulti = isTraining ? 6 : 2;
  const base = baseMulti * model.parameters * totalTokens;
  const mul  = flopsMultiplier(model.modelType);

  // MoE adjustment: only active experts compute per token
  let moeFactor = 1;
  if (model.modelType === 'moe' && model.numExperts && model.activeExperts) {
    moeFactor = model.activeExperts / model.numExperts;
  }

  return base * mul * moeFactor;
}

export function estimateTrainingTime(
  flops: number,
  hw: HardwareConfig,
  batchSize: number = 32,
): number {
  const numGpus = hw.numGpus ?? 1;
  
  // Adjust MFU based on batch size to reflect that larger batch sizes better utilize hardware.
  // Base MFU is around 50% for typical large batches (e.g. 32).
  const mfuFactor = Math.min(1.0, 0.2 + 0.8 * (Math.min(batchSize, 32) / 32));
  const effectiveMfu = 0.5 * mfuFactor;

  const effectiveTflops = hw.gpuTflops * 1e12 * effectiveMfu * numGpus;
  if (effectiveTflops === 0) return Infinity;
  return flops / effectiveTflops;
}

export function estimateTokensPerSec(
  model: ModelConfig,
  hw: HardwareConfig,
): number {
  const paramsInBillions = model.parameters / 1e9;
  if (paramsInBillions === 0) return 0;
  const base = (hw.gpuTflops * 100) / paramsInBillions;
  return base * inferenceSpeedFactor(model.modelType);
}

export function determineFeasibility(
  vramGB: number,
  gpuVramGB: number,
): { status: FeasibilityStatus; percent: number } {
  if (gpuVramGB === 0) return { status: 'not_feasible', percent: Infinity };
  const percent = (vramGB / gpuVramGB) * 100;
  if (percent > 100) return { status: 'not_feasible', percent };
  if (percent > 80)  return { status: 'risky', percent };
  return { status: 'feasible', percent };
}

// ============================================================
// Aggregate Estimation
// ============================================================

export function runEstimation(
  model: ModelConfig,
  training: TrainingConfig,
  hw: HardwareConfig,
): EstimationResult {
  const isTraining        = !!training.optimizer;
  const vram              = estimateVram(model, training);
  const totalTokens       = estimateTotalTokens(training);
  const totalFlops        = estimateFlops(model, totalTokens, isTraining);
  const trainingTimeSeconds = estimateTrainingTime(totalFlops, hw, training.batchSize);
  const tokensPerSec      = estimateTokensPerSec(model, hw);

  const peakVramGB = bytesToGB(vram.total);
  const { status, percent } = determineFeasibility(peakVramGB, hw.gpuVram);

  // RAM estimate: model weights in RAM + overhead
  const ramUsage = bytesToGB(vram.weights) * 1.2;

  // Storage: weights on disk + checkpoints (~3×) + dataset estimate
  const modelSizeGB = bytesToGB(vram.weights);
  const storageRequired = modelSizeGB * 4 + (training.datasetSize / 1e9) * 2;

  return {
    vram,
    totalFlops,
    totalTokens,
    trainingTimeSeconds,
    tokensPerSec,
    feasibility: status,
    feasibilityPercent: percent,
    peakVram: peakVramGB,
    ramUsage,
    storageRequired,
  };
}

// ============================================================
// Chart Data Generators
// ============================================================

export function generateVramVsBatchSize(
  model: ModelConfig,
  training: TrainingConfig,
  batchSizes: number[] = [1, 2, 4, 8, 16, 32],
) {
  return batchSizes.map((bs) => {
    const v = estimateVram(model, { ...training, batchSize: bs });
    return { batchSize: bs, vram: bytesToGB(v.total) };
  });
}

export function generateTrainingTimeVsBatchSize(
  model: ModelConfig,
  training: TrainingConfig,
  hw: HardwareConfig,
  batchSizes: number[] = [1, 2, 4, 8, 16, 32],
) {
  return batchSizes.map((bs) => {
    const totalTokens = estimateTotalTokens({ ...training, batchSize: bs });
    const flops = estimateFlops(model, totalTokens);
    const time  = estimateTrainingTime(flops, hw, bs);
    return {
      batchSize: bs,
      timeHours: time / 3600,
      timeDays:  time / 86400,
    };
  });
}

export function generateTokensPerSecVsContext(
  model: ModelConfig,
  hw: HardwareConfig,
  contextLengths: number[] = [1024, 2048, 4096, 8192, 16384, 32768],
) {
  return contextLengths.map((ctx) => {
    const base   = estimateTokensPerSec(model, hw);
    const factor = model.contextLength / ctx;
    return {
      contextLength: ctx,
      tokensPerSec: Math.max(base * Math.sqrt(factor), 1),
    };
  });
}

// ============================================================
// Formatting Helpers
// ============================================================

export function formatBytes(bytes: number): string {
  const gb = bytesToGB(bytes);
  if (gb >= 1)  return `${gb.toFixed(1)} GB`;
  const mb = bytes / (1024 ** 2);
  if (mb >= 1)  return `${mb.toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function formatNumber(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} T`;
  if (n >= 1e9)  return `${(n / 1e9).toFixed(2)} B`;
  if (n >= 1e6)  return `${(n / 1e6).toFixed(2)} M`;
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)} K`;
  return n.toFixed(0);
}

export function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '∞';
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
  const hours = Math.floor(seconds / 3600);
  if (hours < 24) {
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  }
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  const mins = Math.floor((seconds % 3600) / 60);
  return `${days}d ${remHours}h ${mins}m`;
}

export function formatFlops(flops: number): string {
  if (!isFinite(flops)) return '∞';
  if (flops >= 1e24) return `${(flops / 1e24).toFixed(2)}e+24`;
  if (flops >= 1e21) return `${(flops / 1e21).toFixed(2)}e+21`;
  if (flops >= 1e18) return `${(flops / 1e18).toFixed(2)} EFLOPs`;
  if (flops >= 1e15) return `${(flops / 1e15).toFixed(2)} PFLOPs`;
  if (flops >= 1e12) return `${(flops / 1e12).toFixed(2)} TFLOPs`;
  return `${flops.toFixed(0)} FLOPs`;
}
