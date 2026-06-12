"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FuzzingRun } from "./types";

function DashboardContent() {
  const [runs, setRuns] = useState<FuzzingRun[]>([]);
  const [dataState, setDataState] = useState<"loading" | "error" | "success">("loading");

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const load = async () => {
      setDataState("loading");
      try {
        const res = await fetch("/api/runs", { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setRuns(data.runs ?? []);
          setDataState("success");
        }
      } catch {
        if (!cancelled) setDataState("error");
      }
    };
    void load();
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, []);

  const totalRuns = runs.length;
  const runningRuns = runs.filter((r) => r.status === "running").length;
  const failedRuns = runs.filter((r) => r.status === "failed").length;
  const completedRuns = runs.filter((r) => r.status === "completed").length;
  const criticalRuns = runs.filter((r) => r.severity === "critical").length;
  const recentRuns = runs.slice(0, 5);

  const StatCard = ({ label, value, accent }: { label: string; value: string | number; accent?: string }) => (
    <div className="crt-card p-4 flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest" style={{ color: '#606060' }}>{label}</span>
      <span className="text-2xl font-bold" style={{ color: accent || '#00ff41' }}>{value}</span>
    </div>
  );

  return (
    <div className="p-6 space-y-8 crt-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold crt-text">Dashboard</h1>
          <p className="text-xs mt-1" style={{ color: '#606060' }}>Fuzzing campaign overview and system status</p>
        </div>
        <Link
          href="/runs"
          className="crt-button px-4 py-2 text-xs font-semibold rounded"
        >
          View All Runs ▸
        </Link>
      </div>

      {dataState === "error" && (
        <div className="crt-card p-4" style={{ borderColor: '#ff3355' }}>
          <span style={{ color: '#ff3355' }} className="text-xs font-bold uppercase tracking-widest">Connection Error</span>
          <p className="text-xs mt-1" style={{ color: '#606060' }}>
            Could not reach the backend API. Showing available data.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Total Runs" value={dataState === "loading" ? "..." : totalRuns} />
        <StatCard label="Running" value={dataState === "loading" ? "..." : runningRuns} accent="#3388ff" />
        <StatCard label="Completed" value={dataState === "loading" ? "..." : completedRuns} accent="#00ff41" />
        <StatCard label="Failed" value={dataState === "loading" ? "..." : failedRuns} accent="#ff3355" />
        <StatCard label="Critical" value={dataState === "loading" ? "..." : criticalRuns} accent="#ffb000" />
      </div>

      {dataState === "loading" && (
        <div className="crt-card p-8 flex items-center justify-center">
          <span className="crt-cursor text-sm" style={{ color: '#606060' }}>Loading data</span>
        </div>
      )}

      {dataState === "success" && (
        <>
          <div>
            <h2 className="text-sm font-bold mb-3" style={{ color: '#c0c0c0' }}>Recent Runs</h2>
            <div className="crt-card overflow-hidden">
              <table className="w-full crt-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Area</th>
                    <th>Severity</th>
                    <th>Duration</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentRuns.map((run) => (
                    <tr key={run.id}>
                      <td className="font-mono text-xs" style={{ color: '#606060' }}>{run.id}</td>
                      <td>
                        <span className={`crt-badge crt-badge-${run.status}`}>{run.status}</span>
                      </td>
                      <td style={{ color: '#c0c0c0' }}>{run.area}</td>
                      <td style={{ color: run.severity === 'critical' ? '#ffb000' : '#c0c0c0' }}>{run.severity}</td>
                      <td style={{ color: '#606060' }}>{run.duration.toLocaleString()}ms</td>
                      <td>
                        <Link href={`/runs/${run.id}`} className="crt-link text-xs">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="crt-card p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#606060' }}>Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <Link href="/runs" className="crt-button px-3 py-2 text-xs rounded flex items-center justify-between">
                  <span>Browse all runs</span>
                  <span style={{ color: '#606060' }}>→</span>
                </Link>
                <Link href="/analytics" className="crt-button px-3 py-2 text-xs rounded flex items-center justify-between">
                  <span>View analytics and charts</span>
                  <span style={{ color: '#606060' }}>→</span>
                </Link>
                <Link href="/triage" className="crt-button px-3 py-2 text-xs rounded flex items-center justify-between">
                  <span>Failure triage board</span>
                  <span style={{ color: '#606060' }}>→</span>
                </Link>
                <Link href="/integrations" className="crt-button px-3 py-2 text-xs rounded flex items-center justify-between">
                  <span>Manage integrations</span>
                  <span style={{ color: '#606060' }}>→</span>
                </Link>
              </div>
            </div>
            <div className="crt-card p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#606060' }}>System</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span style={{ color: '#606060' }}>Backend Status</span>
                  <span className="crt-text">{dataState === "success" ? "Online" : "Offline"}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#606060' }}>Data Source</span>
                  <span style={{ color: '#606060' }}>{process.env.NEXT_PUBLIC_API_URL ? "Remote API" : "Mock Data"}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#606060' }}>Environment</span>
                  <span style={{ color: '#606060' }}>{process.env.NEXT_PUBLIC_VERCEL_ENV || "Development"}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <span className="crt-cursor text-sm" style={{ color: '#606060' }}>Loading</span>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
