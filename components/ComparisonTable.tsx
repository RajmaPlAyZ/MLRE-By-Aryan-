'use client';

import React from 'react';
import { useEstimatorStore } from '@/store/useEstimatorStore';
import { formatNumber, formatTime, formatBytes } from '@/lib/calculations';
import { Trash2, Plus, X, Download } from 'lucide-react';
import type { FeasibilityStatus } from '@/types';

function FeasibilityBadge({ status }: { status: FeasibilityStatus }) {
  const cfg = {
    feasible: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      label: 'Feasible',
    },
    risky: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      label: 'Risky',
    },
    not_feasible: {
      bg: 'bg-red-500/15',
      text: 'text-red-400',
      dot: 'bg-red-400',
      label: 'Not Feasible',
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function ComparisonTable() {
  const { modelConfig, trainingConfig, hardwareConfig, comparisons, setComparisons, result } =
    useEstimatorStore();
  const [loading, setLoading] = React.useState(false);

  const fetchComparisons = React.useCallback(async () => {
    try {
      const res = await fetch('/api/comparisons');
      if (res.ok) {
        const data = await res.json();
        const parsed = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          ...JSON.parse(d.config)
        }));
        setComparisons(parsed);
      }
    } catch (e) {
      console.error('Failed to fetch comparisons', e);
    }
  }, [setComparisons]);

  React.useEffect(() => {
    fetchComparisons();
  }, [fetchComparisons]);

  const handleAddComparison = async () => {
    if (!result) return;
    setLoading(true);
    
    const config = {
      modelConfig,
      trainingConfig,
      hardwareConfig,
      result,
      isCurrent: false
    };

    try {
      await fetch('/api/comparisons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: modelConfig.modelName || 'Custom Config',
          config
        })
      });
      await fetchComparisons();
    } catch (e) {
      console.error('Failed to save comparison', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveComparison = async (id: string) => {
    // Optimistic UI update could go here
    try {
      await fetch(`/api/comparisons/${id}`, { method: 'DELETE' });
      await fetchComparisons();
    } catch (e) {
      console.error('Failed to delete comparison', e);
    }
  };

  const handleExportCSV = () => {
    if (comparisons.length === 0) return;

    const headers = [
      'Configuration Name',
      'Model Type',
      'Parameters',
      'Precision',
      'Batch Size',
      'Context Length',
      'VRAM Usage (GB)',
      'Training Time (Hours)',
      'Tokens per Sec',
      'Feasibility'
    ];

    const rows = comparisons.map(entry => {
      return [
        `"${entry.name}"`,
        `"${entry.modelConfig.modelType}"`,
        entry.modelConfig.parameters,
        `"${entry.trainingConfig.precision}"`,
        entry.trainingConfig.batchSize,
        entry.modelConfig.contextLength,
        (entry.result.peakVram).toFixed(2),
        (entry.result.trainingTimeSeconds / 3600).toFixed(2),
        (entry.result.tokensPerSec).toFixed(2),
        `"${entry.result.feasibility}"`
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ml_estimations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4">
        <h3 className="text-sm font-semibold text-white shrink-0">
          Configuration Comparison
        </h3>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end">
          <button
            onClick={handleAddComparison}
            disabled={!result || loading}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5
                       text-xs font-medium text-slate-300 transition-all
                       hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={13} />
            Add Comparison
          </button>
          <button
            onClick={handleExportCSV}
            disabled={comparisons.length === 0 || loading}
            className="flex items-center gap-1.5 rounded-lg border border-[#E3FF00]/20 bg-[#E3FF00]/10 px-3 py-1.5
                       text-xs font-medium text-[#E3FF00] transition-all
                       hover:bg-[#E3FF00]/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={13} />
            Export CSV
          </button>
          <button
            onClick={() => setComparisons([])} // Only clears local view for now
            disabled={comparisons.length === 0 || loading}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5
                       text-xs font-medium text-slate-300 transition-all
                       hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X size={13} />
            Clear View
          </button>
        </div>
      </div>

      {comparisons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
            <Plus size={20} className="text-slate-600" />
          </div>
          <p className="text-sm text-slate-500">
            Run an estimation and click &ldquo;Add Comparison&rdquo; to compare configurations
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A1108]/80 backdrop-blur-sm sticky top-0 z-10">
              <tr className="border-b border-white/10">
                {[
                  'Config Name',
                  'Model & Params',
                  'Context',
                  'Batch',
                  'VRAM Usage',
                  'Training Time',
                  'Inference Speed',
                  'Feasibility',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisons.map((entry) => {
                const vramPct = entry.result.feasibilityPercent;
                const vramColor =
                  vramPct > 100
                    ? 'text-red-400'
                    : vramPct > 80
                    ? 'text-amber-400'
                    : 'text-emerald-400';

                return (
                  <tr
                    key={entry.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-3 py-3 text-sm text-white whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        {entry.name}
                        {entry.isCurrent && (
                          <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400">
                            Current
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold">{entry.modelConfig.modelName || 'Custom'}</span>
                        <span className="text-[10px] text-slate-500">{formatNumber(entry.modelConfig.parameters)} params</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-300 whitespace-nowrap font-mono text-xs">
                      {entry.modelConfig.contextLength.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-slate-300 whitespace-nowrap font-mono text-xs">
                      {entry.trainingConfig.batchSize}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className={`font-bold font-mono ${vramColor}`}>
                          {entry.result.peakVram.toFixed(1)} GB
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {entry.result.feasibilityPercent.toFixed(1)}% of GPU
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-300 whitespace-nowrap font-mono text-xs">
                      {formatTime(entry.result.trainingTimeSeconds)}
                    </td>
                    <td className="px-3 py-3 text-emerald-400 whitespace-nowrap font-mono text-xs font-bold">
                      {entry.result.tokensPerSec.toFixed(1)} t/s
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <FeasibilityBadge status={entry.result.feasibility} />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleRemoveComparison(entry.id)}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
