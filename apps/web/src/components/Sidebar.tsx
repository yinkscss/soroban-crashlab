'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '∼' },
  { href: '/runs', label: 'Runs', icon: '#' },
  { href: '/analytics', label: 'Analytics', icon: '@' },
  { href: '/triage', label: 'Triage', icon: '!' },
  { href: '/logs', label: 'Logs', icon: '>' },
  { href: '/integrations', label: 'Integrations', icon: '+' },
  { href: '/settings', label: 'Settings', icon: '*' },
  { href: '/maintainer', label: 'Maintainer', icon: '$' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 flex flex-col border-r ${collapsed ? 'w-14' : 'w-52'} transition-all duration-150`}
      style={{
        background: '#0c0c0c',
        borderColor: '#1a1a1a',
      }}
    >
      <div className="flex items-center gap-2 px-3 h-14 border-b" style={{ borderColor: '#1a1a1a' }}>
        {!collapsed && (
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#606060' }}>
            CrashLab
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-xs p-1 rounded hover:bg-white/5 transition"
          style={{ color: '#606060' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '▸' : '◂'}
        </button>
      </div>

      <nav className="flex-1 flex flex-col py-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm transition-all"
              style={{
                color: isActive ? '#00ff41' : '#606060',
                background: isActive ? 'rgba(0, 255, 65, 0.04)' : 'transparent',
                borderLeft: isActive ? '2px solid #00ff41' : '2px solid transparent',
                textShadow: isActive ? '0 0 8px rgba(0, 255, 65, 0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#c0c0c0';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#606060';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span className="w-5 text-center text-xs font-bold opacity-60">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t text-[10px]" style={{ borderColor: '#1a1a1a', color: '#303030' }}>
        {!collapsed && (
          <span>v0.1.0 · Soroban CrashLab</span>
        )}
      </div>
    </aside>
  );
}
