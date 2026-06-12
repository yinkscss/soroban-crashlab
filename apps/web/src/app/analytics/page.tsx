'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FuzzingRun } from '../types';

export default function AnalyticsPage() {
  const [runs, setRuns] = useState<FuzzingRun[]>([]);
  const [dataState, setDataState] = useState<'loading' | 'error' | 'success'>('loading');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/runs')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setRuns(data.runs ?? []);
          setDataState('success');
        }
      })
      .catch(() => {
        if (!cancelled) setDataState('error');
      });
    return () => { cancelled = true; };
  }, []);

  const byStatus = runs.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bySeverity = runs.reduce((acc, r) => {
    acc[r.severity] = (acc[r.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byArea = runs.reduce((acc, r) => {
    acc[r.area] = (acc[r.area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-8 crt-fade-in">
      <div>
        <h1 className="text-lg font-bold crt-text">Analytics</h1>
        <p className="text-xs mt-1" style={{ color: '#606060' }}>Failure clustering, heatmaps, trends and run comparisons</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/analytics/clusters" className="crt-card p-4 flex flex-col gap-2 hover:border-[#2a2a2a] transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: '#c0c0c0' }}>Failure Clusters</span>
            <span className="crt-text text-xs">→</span>
          </div>
          <span className="text-xs" style={{ color: '#606060' }}>View grouped failure signatures and crash patterns</span>
        </Link>

        <Link href="/analytics/heatmap" className="crt-card p-4 flex flex-col gap-2 hover:border-[#2a2a2a] transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: '#c0c0c0' }}>Performance Heatmap</span>
            <span className="crt-text text-xs">→</span>
          </div>
          <span className="text-xs" style={{ color: '#606060' }}>Visualize run duration, CPU and memory usage patterns</span>
        </Link>

        <Link href="/analytics/flaky" className="crt-card p-4 flex flex-col gap-2 hover:border-[#2a2a2a] transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: '#c0c0c0' }}>Flaky Test Detection</span>
            <span className="crt-text text-xs">→</span>
          </div>
          <span className="text-xs" style={{ color: '#606060' }}>Identify non deterministic crashes and unstable tests</span>
        </Link>

        <Link href="/trends" className="crt-card p-4 flex flex-col gap-2 hover:border-[#2a2a2a] transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: '#c0c0c0' }}>Crash Trends</span>
            <span className="crt-text text-xs">→</span>
          </div>
          <span className="text-xs" style={{ color: '#606060' }}>Time series crash trend visualization and analysis</span>
        </Link>
      </div>

      {dataState === 'success' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="crt-card p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#606060' }}>By Status</h3>
            <div className="space-y-2 text-xs">
              {Object.entries(byStatus).map(([key, count]) => (
                <div key={key} className="flex justify-between">
                  <span style={{ color: '#606060' }}>{key}</span>
                  <span style={{ color: '#c0c0c0' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="crt-card p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#606060' }}>By Severity</h3>
            <div className="space-y-2 text-xs">
              {Object.entries(bySeverity).map(([key, count]) => (
                <div key={key} className="flex justify-between">
                  <span style={{ color: '#606060' }}>{key}</span>
                  <span style={{ color: '#c0c0c0' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="crt-card p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#606060' }}>By Area</h3>
            <div className="space-y-2 text-xs">
              {Object.entries(byArea).map(([key, count]) => (
                <div key={key} className="flex justify-between">
                  <span style={{ color: '#606060' }}>{key}</span>
                  <span style={{ color: '#c0c0c0' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
