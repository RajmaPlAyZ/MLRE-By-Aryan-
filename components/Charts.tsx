'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import type { EstimationResult, ModelConfig, TrainingConfig, HardwareConfig } from '@/types';
import {
  generateVramVsBatchSize,
  generateTrainingTimeVsBatchSize,
  generateTokensPerSecVsContext,
  formatBytes,
} from '@/lib/calculations';

// ---- VRAM Breakdown Pie Chart -----------------------------

const PIE_COLORS = ['#6366f1', '#a78bfa', '#f97316', '#22c55e', '#64748b'];

export function VramBreakdownChart({ result }: { result: EstimationResult }) {
  const data = [
    { name: 'Model Weights', value: result.vram.weights, color: PIE_COLORS[0] },
    { name: 'Activations', value: result.vram.activations, color: PIE_COLORS[1] },
    { name: 'Optimizer States', value: result.vram.optimizer, color: PIE_COLORS[2] },
    { name: 'Gradients', value: result.vram.gradients, color: PIE_COLORS[3] },
    {
      name: 'Others / Buffers',
      value: Math.max(result.vram.total * 0.01, 1024 * 1024), // 1% overhead minimum
      color: PIE_COLORS[4],
    },
  ];

  const totalGB = (result.vram.total / (1024 ** 3)).toFixed(1);

  return (
    <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-5">
      <h3 className="text-sm font-semibold text-white mb-4">
        Memory Usage Breakdown (VRAM)
      </h3>

      <div className="flex items-center gap-6">
        <div className="relative">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
                formatter={(value) => formatBytes(Number(value))}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-white">{totalGB} GB</span>
            <span className="text-[10px] text-slate-500">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 flex-1">
          {data.map((entry, idx) => {
            const pct = ((entry.value / result.vram.total) * 100).toFixed(1);
            return (
              <div key={idx} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-slate-300">{entry.name}</span>
                  <span className="text-xs text-slate-500 ml-1">
                    {formatBytes(entry.value)} ({pct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- Training Time vs Batch Size Line Chart ---------------

export function TrainingTimeChart({
  modelConfig,
  trainingConfig,
  hardwareConfig,
}: {
  modelConfig: ModelConfig;
  trainingConfig: TrainingConfig;
  hardwareConfig: HardwareConfig;
}) {
  const data = generateTrainingTimeVsBatchSize(
    modelConfig,
    trainingConfig,
    hardwareConfig,
  );

  return (
    <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">
          Training Time Estimation
        </h3>
        <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded-md">
          By Batch Size
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="batchSize"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickFormatter={(v) => `${v.toFixed(0)}d`}
          />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#e2e8f0',
            }}
            formatter={(v) => [`${Number(v).toFixed(1)} days`, 'Time']}
            labelFormatter={(l) => `Batch Size: ${l}`}
          />
          <Line
            type="monotone"
            dataKey="timeDays"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#818cf8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---- VRAM Usage vs Batch Size Line Chart ------------------

export function VramVsBatchSizeChart({
  modelConfig,
  trainingConfig,
  hardwareConfig,
}: {
  modelConfig: ModelConfig;
  trainingConfig: TrainingConfig;
  hardwareConfig: HardwareConfig;
}) {
  const data = generateVramVsBatchSize(modelConfig, trainingConfig);

  return (
    <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">
          VRAM Usage vs Batch Size
        </h3>
        <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded-md">
          {trainingConfig.precision.toUpperCase()}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="batchSize"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickFormatter={(v) => `${v.toFixed(0)} GB`}
          />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#e2e8f0',
            }}
            formatter={(v) => [`${Number(v).toFixed(1)} GB`, 'VRAM']}
            labelFormatter={(l) => `Batch Size: ${l}`}
          />
          <ReferenceLine
            y={hardwareConfig.gpuVram}
            stroke="#ef4444"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: `VRAM Limit (${hardwareConfig.gpuVram} GB)`,
              fill: '#ef4444',
              fontSize: 10,
              position: 'insideTopLeft',
            }}
          />
          <Line
            type="monotone"
            dataKey="vram"
            stroke="#22c55e"
            strokeWidth={2.5}
            dot={{ fill: '#22c55e', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#4ade80' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---- Tokens/sec vs Context Length -------------------------

export function TokensPerSecChart({
  modelConfig,
  hardwareConfig,
}: {
  modelConfig: ModelConfig;
  hardwareConfig: HardwareConfig;
}) {
  const data = generateTokensPerSecVsContext(modelConfig, hardwareConfig);

  return (
    <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">
          Tokens / Second (Inference)
        </h3>
        <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded-md">
          FP16
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="contextLength"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickFormatter={(v) => {
              if (v >= 1000) return `${v / 1000}K`;
              return v;
            }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#e2e8f0',
            }}
            formatter={(v) => [`${Number(v).toFixed(1)} tok/s`, 'Speed']}
            labelFormatter={(l) => `Context: ${l >= 1000 ? `${l / 1000}K` : l}`}
          />
          <Line
            type="monotone"
            dataKey="tokensPerSec"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={{ fill: '#f97316', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#fb923c' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
