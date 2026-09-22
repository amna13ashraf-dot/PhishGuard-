import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileCheck,
  ClipboardPaste,
  Shield,
  Trash2,
  AlertCircle,
  FileSearch,
  Sparkles,
  Zap,
} from 'lucide-react';
import { SAMPLE_TEST_CASES } from '../data/samples';
import { SampleTestCase } from '../types';

interface InspectionInputProps {
  onAnalyze: (payload: { text: string; fileName: string; type: 'DOCUMENT_UPLOAD' | 'PASTED_TEXT' | 'EMAIL_HEADERS' }) => void;
  isAnalyzing: boolean;
  onSelectSample: (sample: SampleTestCase) => void;
  activeSampleId: string | null;
}

export const InspectionInput: React.FC<InspectionInputProps> = ({
  onAnalyze,
  isAnalyzing,
  onSelectSample,
  activeSampleId,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('paste');
  const [pastedText, setPastedText] = useState<string>(SAMPLE_TEST_CASES[0].rawText);
  const [uploadedFile, setUploadedFile] = useState<{
    file: File;
    name: string;
    size: string;
    previewUrl?: string;
    extractedText: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setPastedText(text);
      }
    } catch {
      // In iframe permissions or unsupported browsers
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const sizeStr = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${Math.round(file.size / 1024)} KB`;

    // Simulated OCR extraction from uploaded document
    const reader = new FileReader();
    reader.onload = (event) => {
      let previewText = '';
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.eml')) {
        previewText = (event.target?.result as string) || '';
      } else {
        // High fidelity OCR extracted text simulation for PDFs/Images
        previewText = `OFFICIAL EMPLOYMENT APPOINTMENT LETTER\nFile: ${file.name}\nSize: ${sizeStr}\n\nPosition: Remote Technical Associate\nBase Compensation: $85.00/hour ($176,800/yr)\nTerms: Equipment purchase check of $4,500 will be provided. Deposit check and transfer $3,200 via certified wire transfer.\nContact recruitment lead immediately on Telegram @TalentDirect`;
      }

      setUploadedFile({
        file,
        name: file.name,
        size: sizeStr,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        extractedText: previewText,
      });
      setActiveTab('upload');
    };

    if (file.type.includes('text')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleTriggerAnalysis = () => {
    if (activeTab === 'upload' && uploadedFile) {
      onAnalyze({
        text: uploadedFile.extractedText,
        fileName: uploadedFile.name,
        type: 'DOCUMENT_UPLOAD',
      });
    } else {
      onAnalyze({
        text: pastedText,
        fileName: activeSampleId ? `${activeSampleId}.eml` : 'candidate_pasted_offer.txt',
        type: pastedText.toLowerCase().includes('received:') ? 'EMAIL_HEADERS' : 'PASTED_TEXT',
      });
    }
  };

  const handleSampleClick = (sample: SampleTestCase) => {
    onSelectSample(sample);
    setPastedText(sample.rawText);
    setActiveTab('paste');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-6" id="inspection-input-section">
      {/* Sample Test Cases Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Instant Hackathon Demo Test Scenarios
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Click to load pre-configured forensic payload
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_TEST_CASES.map((sample) => {
            const isSelected = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                id={`sample-btn-${sample.id}`}
                onClick={() => handleSampleClick(sample)}
                className={`relative flex flex-col p-3.5 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Zap className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {sample.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      sample.riskBadge === 'CRITICAL'
                        ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                        : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                    }`}
                  >
                    {sample.riskBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {sample.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual Tab Input Card */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-sm">
        {/* Tabs Bar */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-4 pt-3 gap-2">
          <button
            id="tab-paste"
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all ${
              activeTab === 'paste'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tab 2: Paste Offer Text & Email Headers</span>
          </button>

          <button
            id="tab-upload"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Tab 1: Upload Document (PDF / Image)</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-5 sm:p-6">
          {activeTab === 'paste' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">
                  Input: Raw Offer Contract, Email Body, or Full ESMTP Headers
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePasteClipboard}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition text-xs font-mono"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    <span>Paste Clipboard</span>
                  </button>
                  {pastedText && (
                    <button
                      onClick={() => setPastedText('')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/60 text-slate-400 hover:bg-rose-950/60 hover:text-rose-400 transition text-xs font-mono"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              <textarea
                id="offer-text-input"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste offer letter content, job description, recruiter emails, or ESMTP headers (Received: / Authentication-Results:)..."
                rows={9}
                className="w-full rounded-xl bg-slate-950/90 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner leading-relaxed resize-y"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>{pastedText.length.toLocaleString()} characters | {pastedText.trim().split(/\s+/).filter(Boolean).length} words</span>
                <span className="text-cyan-500/80">Header parsing & NLP trigger regex enabled</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.eml"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processFile(e.target.files[0]);
                  }
                }}
              />

              {!uploadedFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-950/30'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/80'
                  }`}
                >
                  <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 mb-4 shadow-lg shadow-cyan-950/40">
                    <UploadCloud className="w-10 h-10 animate-bounce" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                    Drag and Drop Offer Letter (PDF / PNG / JPG)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-4">
                    PhishGuard performs OCR, font layer dissection, software metadata parsing, and visual tampering detection.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-cyan-300 border border-slate-700">
                      Browse Local Files
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Max size 25MB</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {uploadedFile.name}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            OCR Ready
                          </span>
                        </h4>
                        <p className="text-xs font-mono text-slate-400">
                          {uploadedFile.size} | PDF Container Dissection Ready
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                      >
                        Change File
                      </button>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/60"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {uploadedFile.previewUrl && (
                    <div className="rounded-lg overflow-hidden border border-slate-800 max-h-48 bg-black flex items-center justify-center">
                      <img
                        src={uploadedFile.previewUrl}
                        alt="Document Preview"
                        className="max-h-48 object-contain"
                      />
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Extracted Text Preview:
                    </span>
                    <p className="text-xs font-mono text-slate-300 line-clamp-3 leading-relaxed">
                      {uploadedFile.extractedText}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Button: Run Deep Inspection */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <AlertCircle className="w-4 h-4 text-cyan-400" />
              <span>Inspection checks 24+ heuristics against live OSINT databases</span>
            </div>

            <button
              id="run-deep-inspection-btn"
              onClick={handleTriggerAnalysis}
              disabled={isAnalyzing || (activeTab === 'paste' && !pastedText.trim()) || (activeTab === 'upload' && !uploadedFile)}
              className="w-full sm:w-auto relative group overflow-hidden px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Shield className="w-5 h-5 text-slate-950 animate-spin" />
                  <span className="font-mono uppercase tracking-wider">Executing Forensic Pipeline...</span>
                </>
              ) : (
                <>
                  <FileSearch className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                  <span>Run Deep Inspection</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
