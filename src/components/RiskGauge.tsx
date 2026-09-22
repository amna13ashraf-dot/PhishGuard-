import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Fingerprint, Clock, CheckCircle, Copy } from 'lucide-react';
import { ForensicAuditReport } from '../types';

interface RiskGaugeProps {
  report: ForensicAuditReport;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ report }) => {
  const [copiedHash, setCopiedHash] = React.useState(false);

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  // Arc angle represents 0 to 100%
  const strokeDashoffset = circumference - (report.overallScore / 100) * circumference;

  let colorClasses = {
    badge: 'bg-rose-950/80 text-rose-400 border-rose-800/80',
    dialStroke: '#ef4444',
    glow: 'cyber-glow-red',
    text: 'text-rose-400',
    title: 'CRITICAL FRAUD RISK',
    icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
  };

  if (report.riskLevel === 'SUSPICIOUS') {
    colorClasses = {
      badge: 'bg-amber-950/80 text-amber-400 border-amber-800/80',
      dialStroke: '#f59e0b',
      glow: 'cyber-glow-amber',
      text: 'text-amber-400',
      title: 'SUSPICIOUS ANOMALIES',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    };
  } else if (report.riskLevel === 'LEGITIMATE') {
    colorClasses = {
      badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80',
      dialStroke: '#10b981',
      glow: 'cyber-glow-green',
      text: 'text-emerald-400',
      title: 'LEGITIMATE OFFER',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    };
  }

  const handleCopyHash = () => {
    navigator.clipboard.writeText(report.sha256Checksum);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className={`p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden ${colorClasses.glow}`}>
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none opacity-40" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: Interactive Circular Dial */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex items-center justify-center">
            <svg className="w-44 h-44 transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke="#1e293b"
                strokeWidth="12"
                fill="transparent"
                className="opacity-60"
              />
              {/* Colored progress ring */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke={colorClasses.dialStroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  transition: 'stroke-dashoffset 1.2s ease-out',
                }}
              />
            </svg>

            {/* Center dial content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Fraud Risk
              </span>
              <span className={`text-4xl font-black font-mono tracking-tight ${colorClasses.text}`}>
                {report.overallScore}%
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Score 0-100
              </span>
            </div>
          </div>

          <div className="flex flex-col text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${colorClasses.badge}`}>
                {colorClasses.icon}
                <span>{colorClasses.title}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                Confidence: {report.confidenceScore}%
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Forensic Verdict & Threat Evaluation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {report.executiveSummary}
            </p>
          </div>
        </div>

        {/* Right: Forensic Certificate Details */}
        <div className="w-full lg:w-auto flex flex-col gap-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono">
          <div className="flex items-center justify-between gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
              <span>INCIDENT ID:</span>
            </span>
            <span className="text-cyan-400 font-bold">{report.id}</span>
          </div>

          <div className="flex items-center justify-between gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>TIMESTAMP:</span>
            </span>
            <span className="text-slate-300">{new Date(report.scanTimestamp).toLocaleTimeString()} UTC</span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">SHA-256 ARTIFACT HASH:</span>
              <button
                onClick={handleCopyHash}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
              >
                {copiedHash ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <span className="text-[11px] text-slate-400 break-all bg-slate-900 p-1.5 rounded border border-slate-800 select-all">
              {report.sha256Checksum}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
