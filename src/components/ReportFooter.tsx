import React from 'react';
import {
  Download,
  AlertOctagon,
  ShieldAlert,
  FileCheck,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { ForensicAuditReport } from '../types';

interface ReportFooterProps {
  report: ForensicAuditReport;
  onOpenExportModal: () => void;
  onOpenReportModal: () => void;
}

export const ReportFooter: React.FC<ReportFooterProps> = ({
  report,
  onOpenExportModal,
  onOpenReportModal,
}) => {
  return (
    <footer className="max-w-7xl mx-auto px-4 py-8 space-y-6" id="actionable-next-steps-footer">
      {/* Primary Action Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Actionable Forensic Next Steps
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Official Case Triage & Incident Mitigation
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
            Preserve cryptographically stamped evidence for legal records or lodge a formal complaint with cybersecurity regulatory bureaus.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            id="export-official-report-btn"
            onClick={onOpenExportModal}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs sm:text-sm font-semibold border border-slate-700 transition shadow-lg cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Official Forensic Report</span>
          </button>

          <button
            id="report-scam-btn"
            onClick={onOpenReportModal}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs sm:text-sm font-bold transition shadow-lg shadow-rose-950/50 cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4 text-white" />
            <span>Report Scam (IC3 / FTC)</span>
          </button>
        </div>
      </div>

      {/* Cyber Defense Best Practices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold mb-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>Rule #1: The Fake Check Trap</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Never deposit a check sent by an employer to "purchase home equipment". Under US/EU banking laws, banks make funds available in 1-2 days before the check bounces 10 days later. You are personally liable for wired amounts.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold mb-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>Rule #2: Zero-Interview Redirection</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Legitimate Fortune 500 employers never conduct candidate interviews solely via text on Telegram, WhatsApp, or Signal. Always insist on corporate video meetings with verified email invitations.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold mb-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>Rule #3: Independent Verification</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Never click links in offer emails. Navigate directly to the company's official corporate careers website (e.g. <code>careers.google.com</code>) to verify the job requisition ID and recruiter identity.
          </p>
        </div>
      </div>

      {/* Hackathon Credits & Disclaimer */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
        <div>
          <span>PhishGuard OSINT Engine • Cybersecurity Hackathon Edition</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Zero Logging Privacy</span>
          <span>MITRE ATT&CK Framework Aligned</span>
        </div>
      </div>
    </footer>
  );
};
