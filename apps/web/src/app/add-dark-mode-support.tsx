"use client";

import Script from "next/script";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "crashlab:dark-mode";

export function useDarkMode(): {
  isDark: boolean;
  toggle: () => void;
  mounted: boolean;
} {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const next = saved === "true";
        setIsDark(next);
        document.documentElement.classList.toggle("dark", next);
        document.documentElement.style.colorScheme = next ? "dark" : "light";
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = "dark";
      }
    } catch {
      // ignore
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, String(isDark));
    } catch {
      // ignore
    }
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return { isDark, toggle, mounted };
}

const INITIAL_THEME_SCRIPT = `
  (function () {
    try {
      var saved = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
      var isDark = saved === 'true' || saved === null;
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    } catch (e) {}
  })();
`;

export default function DarkModeToggle() {
  const { isDark, toggle, mounted } = useDarkMode();

  return (
    <>
      <Script id="crashlab-dark-mode-init" strategy="beforeInteractive">
        {INITIAL_THEME_SCRIPT}
      </Script>
      {mounted && (
        <button
          type="button"
          onClick={toggle}
          className="crt-button px-3 py-1.5 text-xs rounded flex items-center gap-2"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="text-[10px] uppercase tracking-widest" style={{ color: '#606060' }}>
            {isDark ? 'Dark' : 'Light'}
          </span>
          <span className="crt-text">{isDark ? '☾' : '☀'}</span>
        </button>
      )}
    </>
  );
}
