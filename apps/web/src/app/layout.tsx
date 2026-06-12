import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import DarkModeToggle from "./add-dark-mode-support";

export const metadata: Metadata = {
  title: "Soroban CrashLab | Smart Contract Fuzzing",
  description:
    "Intelligent mutation testing and runtime behavior tracing for Soroban smart contracts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen crt-scanline">
        <Sidebar />
        <div className="ml-52 min-h-screen flex flex-col transition-all duration-150">
          <header
            className="h-14 flex items-center justify-between px-6 border-b sticky top-0 z-30"
            style={{
              background: '#0c0c0c',
              borderColor: '#1a1a1a',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="crt-text text-sm font-bold tracking-widest uppercase">
                Soroban CrashLab
              </span>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: '#303030' }}>
                Fuzzing Framework
              </span>
            </div>
            <div className="flex items-center gap-3">
              <DarkModeToggle />
            </div>
          </header>
          <main className="flex-1 flex flex-col" style={{ background: '#0c0c0c' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
