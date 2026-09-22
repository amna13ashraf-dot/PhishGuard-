import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  ShieldAlert,
  Copy,
  CheckCircle,
  FileCheck,
  Building,
  Flag,
} from 'lucide-react';
import { ForensicAuditReport } from '../types';

interface ReportScamModalProps {
  report: ForensicAuditReport;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportScamModal: React.FC<ReportScamModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  const [selectedAgency, setSelectedAgency] = useState<'ic3' | 'ftc' | 'linkedin'>('ic3');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const agencyConfig = {
    ic3: {
      name: 'FBI IC3 (Internet Crime Complaint Center)',
      url: 'https://www.ic3.gov/Home/FileComplaint',
      desc: 'US Federal Law Enforcement for wire fraud, advance fee scams, and cyber impersonation.',
      badge: 'FEDERAL COMPLAINT',
    },
    ftc: {
      name: 'FTC (Federal Trade Commission)',
      url: 'https://reportfraud.ftc.gov/',
      desc: 'Consumer protection agency tracking fake check scams, deceptive hiring, and identity theft.',
      badge: 'CONSUMER PROTECTION',
    },
    linkedin: {
      name: 'LinkedIn Trust & Safety / Recruiter Abuse',
      url: 'https://www.linkedin.com/help/linkedin/answer/a1340474',
      desc: 'Platform anti-abuse team to take down fake recruiter profiles and fraudulent company pages.',
      badge: 'PLATFORM ENFORCEMENT',
    },
  };

  const currentAgency = agencyConfig[selectedAgency];

  const complaintDossier = `SUBJECT: FRAUDULENT EMPLOYMENT OFFER & PHISHING INCIDENT REPORT
AGENCY TARGET: ${currentAgency.name}
EVIDENCE INCIDENT ID: ${report.id}
ANALYSIS DATE: ${new Date(report.scanTimestamp).toLocaleDateString()}

1. SUSPECT IDENTIFIER & NETWORK TELEMETRY:
- Suspect Sending Address: ${report.domainAuth.senderEmail}
- Extracted Phishing Domain: ${report.domainAuth.extractedDomain}
- Domain Age at Time of Detection: ${report.domainAuth.domainAgeDays} days
- Domain Spoofing Target: ${report.domainAuth.spoofedTarget || 'Unspecified Corporation'}
- SPF/DKIM Integrity: SPF=${report.domainAuth.spfStatus}, DKIM=${report.domainAuth.dkimStatus}

2. NATURE OF SCAM / FRAUD MODUS OPERANDI:
- Modus: ${report.threats.map((t) => t.title).join('; ')}
- Advance Fee/Check Solicitation: ${report.threats.some((t) => t.id.includes('check')) ? 'YES - Victim instructed to deposit check and wire funds' : 'NO'}
- Off-Platform Shadow Channel: ${report.threats.some((t) => t.id.includes('telegram')) ? 'YES - Suspect attempted routing to Telegram/WhatsApp' : 'NO'}

3. ARTIFACT SHA-256 PROOF:
Checksum: ${report.sha256Checksum}

4. RAW TRANSCRIPT EXCERPT:
${report.rawText.slice(0, 500)}...

Submitted via PhishGuard Cyber Forensic Suite for Law Enforcement Triage.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintDossier);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-400">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Report Employment Fraud & Scam
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Pre-filled incident dossier for law enforcement & platform safety teams
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Agency Selection Tabs */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(['ic3', 'ftc', 'linkedin'] as const).map((key) => {
              const item = agencyConfig[key];
              const isSelected = selectedAgency === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedAgency(key)}
                  className={`p-3 rounded-xl border text-left transition ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-mono block text-cyan-400 uppercase font-bold mb-1">
                    {item.badge}
                  </span>
                  <span className="text-xs font-bold block truncate">
                    {key === 'ic3' ? 'FBI IC3' : key === 'ftc' ? 'US FTC' : 'LinkedIn Safety'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <span className="font-bold text-white block mb-0.5">{currentAgency.name}</span>
            <p className="text-slate-400">{currentAgency.desc}</p>
          </div>

          {/* Dossier Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>PRE-CONFIGURED COMPLAINT TEXT:</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Complaint Dossier</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              value={complaintDossier}
              rows={8}
              className="w-full p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 leading-relaxed focus:outline-none select-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 font-mono">
            Copies forensic indicators, IP addresses, and check payment evidence directly.
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white transition flex items-center justify-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Text</span>
            </button>

            <a
              href={currentAgency.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-mono font-bold text-white transition flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/50"
            >
              <span>Launch Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
