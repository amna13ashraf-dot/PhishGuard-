import React from 'react';
import { ShieldCheck, Activity, Cpu, AlertTriangle, Radio } from 'lucide-react';

interface HeaderStatsProps {
  scannedCount: number;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({ scannedCount }) => {
  return (
    <header className="relative w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      {/* Top micro-ribbon */}
      <div className="w-full border-b border-slate-800/80 bg-slate-900/60 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-emerald-400 font-medium">OSINT RADAR ACTIVE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-mono">FTC / IC3 HEURISTIC FEED v4.8</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>LIVE TELEMETRY</span>
            </span>
            <span className="hidden sm:inline text-slate-500">ZERO DATA RETENTION ENFORCED</span>
          </div>
        </div>
      </div>

      {/* Main branding hero */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-mono font-medium mb-3">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>CYBERSECURITY DEFENSE LAB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-950/50">
                <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
              </span>
              <span>
                Phish<span className="text-cyan-400">Guard</span>
              </span>
              <span className="text-xs sm:text-sm font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal border border-slate-700/60">
                FORENSIC SUITE
              </span>
            </h1>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              AI & Forensic OSINT Engine to verify job offers, analyze header metadata, and detect employment fraud in seconds.
            </p>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-xl shadow-inner">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                Scanned
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">
                {scannedCount.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">+12 today</span>
            </div>

            <div className="flex flex-col border-l border-slate-800 pl-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Accuracy
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-0.5">
                98.4%
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Detection Rate</span>
            </div>

            <div className="flex flex-col border-l border-slate-800 pl-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                Avg Latency
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-cyan-300 mt-0.5">
                1.2s
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Real-time OSINT</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
