/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { HeaderStats } from './components/HeaderStats';
import { InspectionInput } from './components/InspectionInput';
import { RiskGauge } from './components/RiskGauge';
import { ThreatAccordion } from './components/ThreatAccordion';
import { XRayViewer } from './components/XRayViewer';
import { RiskHistoryChart } from './components/RiskHistoryChart';
import { ReportFooter } from './components/ReportFooter';
import { ExportReportModal } from './components/ExportReportModal';
import { ReportScamModal } from './components/ReportScamModal';
import { SAMPLE_TEST_CASES } from './data/samples';
import { runForensicAudit } from './services/forensicEngine';
import { ForensicAuditReport, SampleTestCase, ScanHistoryEntry } from './types';
import { Shield, Cpu, Radar, CheckCircle2 } from 'lucide-react';

const INITIAL_SCAN_HISTORY: ScanHistoryEntry[] = [
  {
    id: 'hist-1',
    timestamp: '2026-09-02T10:14:00Z',
    displayDate: 'Sep 02',
    sourceTitle: 'Atlassian_Fullstack_Dev_Offer.pdf',
    score: 8,
    riskLevel: 'LEGITIMATE',
    keyFlag: 'Clean DocuSign PKI seal & aligned SPF/DKIM',
  },
  {
    id: 'hist-2',
    timestamp: '2026-09-08T14:30:00Z',
    displayDate: 'Sep 08',
    sourceTitle: 'Shopify_Senior_UX_Contract.pdf',
    score: 14,
    riskLevel: 'LEGITIMATE',
    keyFlag: 'Authentic enterprise onboarding portal',
  },
  {
    id: 'hist-3',
    timestamp: '2026-09-12T09:45:00Z',
    displayDate: 'Sep 12',
    sourceTitle: 'Meta_Global_Operations_Specialist.eml',
    score: 38,
    riskLevel: 'SUSPICIOUS',
    keyFlag: 'Unverified sender sub-domain & generic recruiter handle',
  },
  {
    id: 'hist-4',
    timestamp: '2026-09-16T18:20:00Z',
    displayDate: 'Sep 16',
    sourceTitle: 'Google_Staff_Product_Designer_Offer.pdf',
    score: 86,
    riskLevel: 'CRITICAL',
    keyFlag: 'Domain typosquatting (@google-careers-portal.com)',
  },
  {
    id: 'hist-5',
    timestamp: '2026-09-18T11:05:00Z',
    displayDate: 'Active',
    sourceTitle: 'Apex_Data_Entry_Remote.pdf',
    score: 96,
    riskLevel: 'CRITICAL',
    keyFlag: 'Advance fake check & Telegram redirect',
    isCurrent: true,
  },
];

export default function App() {
  const [scannedCount, setScannedCount] = useState<number>(14892);
  const [activeSampleId, setActiveSampleId] = useState<string | null>('sample-telegram-scam');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>(INITIAL_SCAN_HISTORY);
  const [report, setReport] = useState<ForensicAuditReport>(() => {
    return runForensicAudit(SAMPLE_TEST_CASES[0].rawText, SAMPLE_TEST_CASES[0].fileName, 'PASTED_TEXT');
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const reportSectionRef = useRef<HTMLDivElement>(null);

  const scanSteps = [
    'Parsing ESMTP Headers & Domain WHOIS Age...',
    'Inspecting Document Metadata & Font Layer Anomaly Streams...',
    'Evaluating NLP Behavioral Scam Triggers & Wire Extraction Cues...',
    'Benchmarking Compensation against Levels.fyi Market Medians...',
    'Synthesizing Forensic Audit Report & Cryptographic Hash...',
  ];

  const handleSelectSample = (sample: SampleTestCase) => {
    setActiveSampleId(sample.id);
  };

  const handleAnalyze = ({
    text,
    fileName,
    type,
  }: {
    text: string;
    fileName: string;
    type: 'DOCUMENT_UPLOAD' | 'PASTED_TEXT' | 'EMAIL_HEADERS';
  }) => {
    setIsAnalyzing(true);
    setScanStepIndex(0);

    const stepInterval = setInterval(() => {
      setScanStepIndex((prev) => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 240);

    setTimeout(() => {
      clearInterval(stepInterval);
      const generatedReport = runForensicAudit(text, fileName, type);
      setReport(generatedReport);
      setIsAnalyzing(false);
      setScannedCount((c) => c + 1);

      // Append to temporal scan history
      setScanHistory((prev) => {
        const updatedPrev = prev.map((p) => ({ ...p, isCurrent: false }));
        const newEntry: ScanHistoryEntry = {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          displayDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sourceTitle: fileName.length > 28 ? fileName.slice(0, 25) + '...' : fileName,
          score: generatedReport.overallScore,
          riskLevel: generatedReport.riskLevel,
          keyFlag: generatedReport.threats[0]?.title || 'Forensic Scan Triggered',
          isCurrent: true,
        };
        return [...updatedPrev, newEntry];
      });

      // Scroll to report
      setTimeout(() => {
        reportSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 1300);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Top Header & Stats */}
      <HeaderStats scannedCount={scannedCount} />

      {/* Main Content Area */}
      <main className="relative z-10 space-y-8 pb-12">
        {/* Inspection Input */}
        <InspectionInput
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          onSelectSample={handleSelectSample}
          activeSampleId={activeSampleId}
        />

        {/* Live Analysis Pipeline Overlay / Banner */}
        {isAnalyzing && (
          <div className="max-w-7xl mx-auto px-4">
            <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-cyan-900/50 border border-cyan-400 flex items-center justify-center text-cyan-400 animate-pulse">
                      <Radar className="w-6 h-6 animate-spin" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                      DEEP FORENSIC HEURISTIC PIPELINE
                    </span>
                    <h4 className="text-base font-bold text-white">
                      {scanSteps[scanStepIndex]}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {scanSteps.map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 w-6 rounded-full transition-all duration-300 ${
                          i <= scanStepIndex ? 'bg-cyan-400' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Forensic Audit Report */}
        <section
          ref={reportSectionRef}
          id="forensic-audit-report-section"
          className="max-w-7xl mx-auto px-4 space-y-8"
        >
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                LIVE FORENSIC AUDIT REPORT
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Case Report: {report.sourceTitle}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Deep Inspection Complete</span>
            </div>
          </div>

          {/* 1. Risk Gauge & Executive Summary */}
          <RiskGauge report={report} />

          {/* Recharts Timeline: Risk Score History Over Time */}
          <RiskHistoryChart history={scanHistory} />

          {/* 2. Detailed Threat Breakdown Accordion */}
          <ThreatAccordion report={report} />

          {/* 3. X-Ray Text Highlight Viewer */}
          <XRayViewer report={report} />
        </section>

        {/* Actionable Next Steps Footer */}
        <ReportFooter
          report={report}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
      </main>

      {/* Export Forensic Report Modal */}
      <ExportReportModal
        report={report}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Report Scam Modal */}
      <ReportScamModal
        report={report}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
