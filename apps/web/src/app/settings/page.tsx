'use client';

import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-8 crt-fade-in">
      <div>
        <h1 className="text-lg font-bold crt-text">Settings</h1>
        <p className="text-xs mt-1" style={{ color: '#606060' }}>System configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/settings/alerting" className="crt-card p-4 flex flex-col gap-2 hover:border-[#2a2a2a] transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: '#c0c0c0' }}>Alerting</span>
            <span className="crt-text text-xs">→</span>
          </div>
          <span className="text-xs" style={{ color: '#606060' }}>Configure notification presets and alert thresholds</span>
        </Link>

        <Link href="/settings/reporting" className="crt-card p-4 flex flex-col gap-2 hover:border-[#2a2a2a] transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: '#c0c0c0' }}>Reporting</span>
            <span className="crt-text text-xs">→</span>
          </div>
          <span className="text-xs" style={{ color: '#606060' }}>Report generation templates and export preferences</span>
        </Link>

        <Link href="/settings/accessibility" className="crt-card p-4 flex flex-col gap-2 hover:border-[#2a2a2a] transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: '#c0c0c0' }}>Accessibility</span>
            <span className="crt-text text-xs">→</span>
          </div>
          <span className="text-xs" style={{ color: '#606060' }}>Keyboard navigation, screen reader and contrast settings</span>
        </Link>

        <div className="crt-card p-4 flex flex-col gap-2 opacity-60">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: '#c0c0c0' }}>API Configuration</span>
            <span className="text-xs" style={{ color: '#606060' }}>Coming Soon</span>
          </div>
          <span className="text-xs" style={{ color: '#606060' }}>Backend URL, rate limits and authentication</span>
        </div>
      </div>

      <div className="crt-card p-4">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#606060' }}>Current Configuration</h3>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span style={{ color: '#606060' }}>API URL</span>
            <span style={{ color: '#c0c0c0' }}>{process.env.NEXT_PUBLIC_API_URL || 'Not configured (using mock data)'}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: '#606060' }}>Environment</span>
            <span style={{ color: '#c0c0c0' }}>{process.env.NEXT_PUBLIC_VERCEL_ENV || 'Development'}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: '#606060' }}>Mock Data</span>
            <span style={{ color: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA !== 'false' ? '#00ff41' : '#ff3355' }}>
              {process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA !== 'false' ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
