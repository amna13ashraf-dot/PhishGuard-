import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, AlertTriangle, ShieldAlert, ShieldCheck, History, Activity } from 'lucide-react';
import { ScanHistoryEntry } from '../types';

interface RiskHistoryChartProps {
  history: ScanHistoryEntry[];
}

export const RiskHistoryChart: React.FC<RiskHistoryChartProps> = ({ history }) => {
  // Calculate trend metrics
  const recentScores = history.map((h) => h.score);
  const latestScore = recentScores[recentScores.length - 1] ?? 0;
  const previousScore = recentScores.length > 1 ? recentScores[recentScores.length - 2] : latestScore;
  const scoreDiff = latestScore - previousScore;
  const avgScore = Math.round(recentScores.reduce((a, b) => a + b, 0) / (recentScores.length || 1));

  const isEscalating = scoreDiff > 10;
  const isDeescalating = scoreDiff < -10;

  // Custom cyber tooltip for recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: ScanHistoryEntry = payload[0].payload;
      const isCritical = data.score >= 65;
      const isSuspicious = data.score >= 26 && data.score < 65;

      return (
        <div className="p-3.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl font-mono text-xs max-w-xs backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 mb-1.5 pb-1.5 border-b border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              {data.displayDate}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                isCritical
                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                  : isSuspicious
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}
            >
              {data.riskLevel}
            </span>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-white text-sm truncate font-sans">
              {data.sourceTitle}
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500 text-[11px]">Fraud Risk Score:</span>
              <span
                className={`font-bold text-sm ${
                  isCritical ? 'text-rose-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {data.score}%
              </span>
            </div>
            {data.keyFlag && (
              <div className="pt-1 text-[11px] text-cyan-300/90 flex items-start gap-1">
                <span className="text-slate-500">Flag:</span>
                <span className="truncate">{data.keyFlag}</span>
              </div>
            )}
            {data.isCurrent && (
              <div className="pt-1 text-[10px] text-cyan-400 font-bold tracking-wider uppercase">
                ★ Active Inspection
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl p-5 sm:p-6 space-y-6" id="risk-history-timeline-section">
      {/* Top Header & Telemetry Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Threat Escalation Timeline & Risk Velocity</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  RECHARTS FORENSIC OSINT
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Tracks temporal fraud risk variance across your consecutive job application reviews to detect campaign escalation.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Trend Indicator Ribbon */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Velocity Delta</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  isEscalating
                    ? 'text-rose-400'
                    : isDeescalating
                    ? 'text-emerald-400'
                    : 'text-slate-300'
                }`}
              >
                {scoreDiff > 0 ? `+${scoreDiff}%` : `${scoreDiff}%`}
                <span className="text-[10px] font-normal text-slate-500">vs prev</span>
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">History Avg</span>
            <span className="font-bold text-slate-200">{avgScore}% Risk</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Total Scanned</span>
            <span className="font-bold text-cyan-400">{history.length} In Log</span>
          </div>
        </div>
      </div>

      {/* Threat Escalation Advisory Banner */}
      {isEscalating && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-3 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-rose-300 font-mono tracking-wide uppercase text-[11px]">
              CRITICAL THREAT ESCALATION DETECTED
            </span>
            <p className="text-slate-300 leading-relaxed">
              Your recent scans show a sharp risk increase (+{scoreDiff}%). Attackers may be actively harvesting your contact details from resume boards with targeted impersonation lures.
            </p>
          </div>
        </div>
      )}

      {/* Main Recharts Line Chart Container */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={history}
            margin={{ top: 20, right: 30, left: -10, bottom: 25 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />

            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              tickLine={{ stroke: '#334155' }}
              dy={10}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 65, 85, 100]}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              tickLine={{ stroke: '#334155' }}
              unit="%"
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Threshold Reference Lines */}
            <ReferenceLine
              y={65}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'CRITICAL THRESHOLD (65%)',
                fill: '#ef4444',
                fontSize: 10,
                position: 'insideTopRight',
                fontFamily: 'JetBrains Mono',
              }}
            />

            <ReferenceLine
              y={25}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'SAFE BASELINE (25%)',
                fill: '#10b981',
                fontSize: 10,
                position: 'insideBottomRight',
                fontFamily: 'JetBrains Mono',
              }}
            />

            {/* Main Risk Score Line */}
            <Line
              type="monotone"
              dataKey="score"
              name="Fraud Risk Score"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const isCurrent = payload.isCurrent;
                const isCrit = payload.score >= 65;
                const isSusp = payload.score >= 26 && payload.score < 65;

                const fill = isCrit ? '#ef4444' : isSusp ? '#f59e0b' : '#10b981';

                return (
                  <g key={`dot-${payload.id}`}>
                    {isCurrent && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={10}
                        fill={fill}
                        opacity={0.25}
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isCurrent ? 6 : 4.5}
                      fill={fill}
                      stroke="#0f172a"
                      strokeWidth={2}
                    />
                  </g>
                );
              }}
              activeDot={{
                r: 8,
                fill: '#06b6d4',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Category Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-400">Critical Risk (66-100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-400">Suspicious (26-65%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-400">Legitimate (0-25%)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <History className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click any sample or scan a new offer to append live telemetry points</span>
        </div>
      </div>
    </div>
  );
};
