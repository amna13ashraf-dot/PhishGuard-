import React, { useState } from 'react';
import {
  Globe,
  FileCheck2,
  MessageSquareWarning,
  Coins,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Shield,
  Layers,
  Scale,
} from 'lucide-react';
import { ForensicAuditReport, ThreatItem } from '../types';

interface ThreatAccordionProps {
  report: ForensicAuditReport;
}

export const ThreatAccordion: React.FC<ThreatAccordionProps> = ({ report }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    domain: true,
    document: true,
    linguistic: true,
    salary: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const domainThreats = report.threats.filter((t) => t.category === 'domain');
  const documentThreats = report.threats.filter((t) => t.category === 'document');
  const linguisticThreats = report.threats.filter((t) => t.category === 'linguistic');
  const salaryThreats = report.threats.filter((t) => t.category === 'salary');

  const getStatusBadge = (threats: ThreatItem[]) => {
    const hasFailed = threats.some((t) => t.status === 'failed');
    const hasWarning = threats.some((t) => t.status === 'warning');

    if (hasFailed) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-950/80 text-rose-400 border border-rose-800/80">
          <XCircle className="w-3.5 h-3.5" />
          <span>THREAT DETECTED</span>
        </span>
      );
    }
    if (hasWarning) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-800/80">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>ANOMALY FLAGGED</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>PASSED VERIFICATION</span>
      </span>
    );
  };

  return (
    <div className="space-y-4" id="threat-breakdown-accordion">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span>Forensic Threat Breakdown & Telemetry</span>
          </h3>
          <p className="text-xs text-slate-400">
            Automated verification across OSINT domain registries, document structures, and linguistic fraud triggers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setOpenSections({
                domain: true,
                document: true,
                linguistic: true,
                salary: true,
              })
            }
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition"
          >
            Expand All
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() =>
              setOpenSections({
                domain: false,
                document: false,
                linguistic: false,
                salary: false,
              })
            }
            className="text-xs font-mono text-slate-400 hover:text-slate-300 transition"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion 1: Domain & Email Authentication */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('domain')}
          className="w-full p-4 flex items-center justify-between text-left bg-slate-950/40 hover:bg-slate-950/80 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                1. Domain & Email Authentication
              </h4>
              <p className="text-xs text-slate-400">
                WHOIS domain age, typosquatting checks, and SPF/DKIM/DMARC cryptographic alignment.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(domainThreats)}
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                openSections.domain ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </div>
        </button>

        {openSections.domain && (
          <div className="p-4 sm:p-5 border-t border-slate-800 space-y-4">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Sending Domain</span>
                <span className={`font-bold truncate block ${report.domainAuth.isSpoofed ? 'text-rose-400' : 'text-slate-200'}`}>
                  {report.domainAuth.extractedDomain}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Domain Age</span>
                <span className={`font-bold ${report.domainAuth.domainAgeDays < 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {report.domainAuth.domainAgeDays < 30 ? `${report.domainAuth.domainAgeDays} Days (FRESH DOMAIN)` : `${Math.round(report.domainAuth.domainAgeDays / 365)} Years`}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">SPF Status</span>
                <span className={`font-bold ${report.domainAuth.spfStatus === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {report.domainAuth.spfStatus}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">DKIM Cryptography</span>
                <span className={`font-bold ${report.domainAuth.dkimStatus === 'VALID_DKIM' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {report.domainAuth.dkimStatus}
                </span>
              </div>
            </div>

            {/* Detailed Findings */}
            <div className="space-y-3">
              {domainThreats.map((threat) => (
                <ThreatRow key={threat.id} threat={threat} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Document Metadata & OCR Audit */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('document')}
          className="w-full p-4 flex items-center justify-between text-left bg-slate-950/40 hover:bg-slate-950/80 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                2. Document Metadata & OCR Audit
              </h4>
              <p className="text-xs text-slate-400">
                PDF author software inspection, hidden font layers, and digital PKI certificate integrity.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(documentThreats)}
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                openSections.document ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </div>
        </button>

        {openSections.document && (
          <div className="p-4 sm:p-5 border-t border-slate-800 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Author Software</span>
                <span className={`font-bold truncate block ${report.docMetadata.softwareSuspicion === 'HIGH' ? 'text-rose-400' : 'text-slate-200'}`}>
                  {report.docMetadata.authorSoftware}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Digital PKI Signature</span>
                <span className={`font-bold ${report.docMetadata.hasDigitalCert ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {report.docMetadata.hasDigitalCert ? 'SIGNED & SEALED' : 'UNSIGNED DOCUMENT'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Hidden Font Layers</span>
                <span className={`font-bold ${report.docMetadata.hasHiddenFontLayers ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {report.docMetadata.hasHiddenFontLayers ? 'ANOMALIES FOUND' : 'CLEAN'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Tampering Status</span>
                <span className={`font-bold ${report.docMetadata.tamperingDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {report.docMetadata.tamperingDetected ? 'TAMPERED / CONVERTED' : 'GENUINE RENDER'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {documentThreats.map((threat) => (
                <ThreatRow key={threat.id} threat={threat} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accordion 3: Behavioral & Linguistic Fraud Signals */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('linguistic')}
          className="w-full p-4 flex items-center justify-between text-left bg-slate-950/40 hover:bg-slate-950/80 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                3. Behavioral & Linguistic Fraud Signals
              </h4>
              <p className="text-xs text-slate-400">
                Advance fee requests, Telegram redirection, bypassed interviews, and urgency pressure tactics.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(linguisticThreats)}
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                openSections.linguistic ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </div>
        </button>

        {openSections.linguistic && (
          <div className="p-4 sm:p-5 border-t border-slate-800 space-y-3">
            {linguisticThreats.map((threat) => (
              <ThreatRow key={threat.id} threat={threat} />
            ))}
          </div>
        )}
      </div>

      {/* Accordion 4: Salary & Benefit Sanity Index */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('salary')}
          className="w-full p-4 flex items-center justify-between text-left bg-slate-950/40 hover:bg-slate-950/80 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                4. Salary & Benefit Sanity Index
              </h4>
              <p className="text-xs text-slate-400">
                Role compensation sanity comparison against industry median benchmarks.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(salaryThreats)}
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                openSections.salary ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </div>
        </button>

        {openSections.salary && (
          <div className="p-4 sm:p-5 border-t border-slate-800 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-400 font-mono">DETECTED ROLE CATEGORY</span>
                  <h5 className="text-sm font-bold text-white">{report.salarySanity.roleTitle}</h5>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-mono">BENCHMARK DEVIATION</span>
                  <div className={`text-base font-bold font-mono ${report.salarySanity.isExtremeOutlier ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {report.salarySanity.deviationPercent > 0 ? `+${Math.round(report.salarySanity.deviationPercent)}%` : `${Math.round(report.salarySanity.deviationPercent)}%`}
                    {report.salarySanity.isExtremeOutlier && ' (EXTREME OUTLIER)'}
                  </div>
                </div>
              </div>

              {/* Comparative Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Standard Market Median: {report.salarySanity.marketMedianSalary}</span>
                  <span className="font-bold text-white">Offered: {report.salarySanity.offeredSalary}</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: '40%' }} title="Industry Median" />
                  <div
                    className={`h-full ${report.salarySanity.isExtremeOutlier ? 'bg-rose-500' : 'bg-cyan-500'}`}
                    style={{ width: `${Math.min(60, Math.max(10, report.salarySanity.deviationPercent / 5))}%` }}
                    title="Offered Deviation"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                {report.salarySanity.assessment}
              </p>
            </div>

            <div className="space-y-3">
              {salaryThreats.map((threat) => (
                <ThreatRow key={threat.id} threat={threat} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ThreatRow: React.FC<{ threat: ThreatItem }> = ({ threat }) => {
  const isFailed = threat.status === 'failed';
  const isWarning = threat.status === 'warning';

  return (
    <div
      className={`p-3.5 rounded-xl border transition ${
        isFailed
          ? 'bg-rose-950/20 border-rose-900/60'
          : isWarning
          ? 'bg-amber-950/20 border-amber-900/60'
          : 'bg-slate-950/50 border-slate-800/80'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          {isFailed ? (
            <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : isWarning ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span className="text-sm font-bold text-white">{threat.title}</span>
        </div>

        {threat.mitreRef && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
            {threat.mitreRef}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-2">
        {threat.description}
      </p>

      {threat.evidence && (
        <div className="p-2 rounded bg-slate-900/90 border border-slate-800/80 text-[11px] font-mono text-slate-400 mb-2">
          <span className="text-slate-500 uppercase block text-[10px]">Evidence Trace:</span>
          <span className="text-cyan-300">{threat.evidence}</span>
        </div>
      )}

      {threat.recommendation && (
        <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
          <span className="text-emerald-400 font-semibold uppercase text-[10px] mt-0.5 font-mono">Action:</span>
          <span>{threat.recommendation}</span>
        </div>
      )}
    </div>
  );
};
