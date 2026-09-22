import React, { useState } from 'react';
import { Eye, ShieldAlert, AlertTriangle, CheckCircle, Info, Sparkles, Filter } from 'lucide-react';
import { ForensicAuditReport, HighlightSpan } from '../types';

interface XRayViewerProps {
  report: ForensicAuditReport;
}

export const XRayViewer: React.FC<XRayViewerProps> = ({ report }) => {
  const [selectedHighlight, setSelectedHighlight] = useState<HighlightSpan | null>(
    report.highlights.length > 0 ? report.highlights[0] : null
  );
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning'>('all');

  const filteredHighlights = report.highlights.filter((h) => {
    if (filterType === 'all') return true;
    return h.category === filterType;
  });

  // Render text with interactive spans
  const renderHighlightedDocument = () => {
    const raw = report.rawText;
    if (report.highlights.length === 0) {
      return <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 leading-relaxed">{raw}</pre>;
    }

    // Sort highlights by length descending to match larger phrases first
    const sorted = [...report.highlights].sort((a, b) => b.phrase.length - a.phrase.length);

    // Build regex
    const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexPattern = new RegExp(`(${sorted.map((h) => escapeRegExp(h.phrase)).join('|')})`, 'gi');

    const parts = raw.split(regexPattern);

    return (
      <div className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500/30">
        {parts.map((part, idx) => {
          const matchedHL = sorted.find((h) => h.phrase.toLowerCase() === part.toLowerCase());

          if (!matchedHL) {
            return <span key={idx}>{part}</span>;
          }

          const isCritical = matchedHL.category === 'critical';
          const isWarning = matchedHL.category === 'warning';
          const isSelected = selectedHighlight?.id === matchedHL.id;

          const badgeClasses = isCritical
            ? 'bg-rose-950/90 text-rose-300 border-rose-500 shadow-sm shadow-rose-950/80 hover:bg-rose-900'
            : isWarning
            ? 'bg-amber-950/90 text-amber-300 border-amber-500 shadow-sm shadow-amber-950/80 hover:bg-amber-900'
            : 'bg-emerald-950/90 text-emerald-300 border-emerald-500 shadow-sm shadow-emerald-950/80 hover:bg-emerald-900';

          return (
            <mark
              key={idx}
              onClick={() => setSelectedHighlight(matchedHL)}
              className={`relative inline cursor-pointer px-1 py-0.5 mx-0.5 rounded border transition-all ${badgeClasses} ${
                isSelected ? 'ring-2 ring-cyan-400 font-bold' : ''
              }`}
              title={`${matchedHL.label}: Click to inspect forensic profile`}
            >
              {part}
              <span className="text-[9px] font-sans ml-1 px-1 rounded bg-black/50 opacity-90 uppercase">
                {matchedHL.label}
              </span>
            </mark>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl" id="xray-viewer-section">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>X-Ray Text Highlight Viewer</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {report.highlights.length} Scam Triggers Detected
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive split pane mapping detected phishing cues directly against raw communication text.
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <button
            onClick={() => setFilterType('all')}
            className={`px-2 py-1 rounded transition ${
              filterType === 'all' ? 'bg-cyan-950 text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({report.highlights.length})
          </button>
          <button
            onClick={() => setFilterType('critical')}
            className={`px-2 py-1 rounded transition ${
              filterType === 'critical' ? 'bg-rose-950 text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilterType('warning')}
            className={`px-2 py-1 rounded transition ${
              filterType === 'warning' ? 'bg-amber-950 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Warnings
          </button>
        </div>
      </div>

      {/* Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left Pane: Interactive Document Text */}
        <div className="lg:col-span-7 p-5 bg-slate-950/70 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto max-h-[560px]">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-3 pb-2 border-b border-slate-800/80">
            <span>DOCUMENT PAYLOAD: {report.sourceTitle}</span>
            <span className="text-cyan-400">Click highlighted text to inspect</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            {renderHighlightedDocument()}
          </div>
        </div>

        {/* Right Pane: Inspector & Forensic Trigger Dossier */}
        <div className="lg:col-span-5 p-5 bg-slate-900/40 flex flex-col justify-between overflow-y-auto max-h-[560px]">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3 pb-2 border-b border-slate-800/80">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>FORENSIC TRIGGER DOSSIER</span>
              </span>
              <span className="text-slate-500">Live Indicator Inspector</span>
            </div>

            {selectedHighlight ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      selectedHighlight.category === 'critical'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : selectedHighlight.category === 'warning'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {selectedHighlight.category} THREAT
                  </span>
                  {selectedHighlight.mitreCode && (
                    <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {selectedHighlight.mitreCode}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    {selectedHighlight.label}
                  </h4>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
                    "{selectedHighlight.phrase}"
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Mechanics & Scam Taxonomy:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedHighlight.description}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-xs text-rose-300 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Investigator Advisory:</strong> Never deposit checks provided by prospective employers or wire funds to 3rd party vendors.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                Select any highlighted marker on the left to review its fraud anatomy.
              </div>
            )}

            {/* Quick List of All Highlights */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                All Trigger Cues ({filteredHighlights.length}):
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredHighlights.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHighlight(h)}
                    className={`w-full p-2 rounded-lg text-left text-xs font-mono flex items-center justify-between border transition ${
                      selectedHighlight?.id === h.id
                        ? 'bg-cyan-950/40 border-cyan-500 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <span className="truncate max-w-[200px]">"{h.phrase}"</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        h.category === 'critical'
                          ? 'text-rose-400 bg-rose-950'
                          : h.category === 'warning'
                          ? 'text-amber-400 bg-amber-950'
                          : 'text-emerald-400 bg-emerald-950'
                      }`}
                    >
                      {h.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
