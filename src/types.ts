export type RiskLevel = 'CRITICAL' | 'SUSPICIOUS' | 'LEGITIMATE';

export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'clean';

export type ThreatCategory = 'domain' | 'document' | 'linguistic' | 'salary';

export interface ThreatItem {
  id: string;
  category: ThreatCategory;
  title: string;
  status: 'failed' | 'warning' | 'passed';
  severity: ThreatSeverity;
  description: string;
  evidence: string;
  recommendation: string;
  mitreRef?: string;
}

export interface HighlightSpan {
  id: string;
  phrase: string;
  category: 'critical' | 'warning' | 'legitimate';
  label: string;
  description: string;
  mitreCode?: string;
}

export interface DomainAuth {
  senderEmail: string;
  extractedDomain: string;
  isSpoofed: boolean;
  spoofedTarget?: string;
  domainAgeDays: number;
  spfStatus: 'PASS' | 'FAIL' | 'NEUTRAL';
  dkimStatus: 'VALID_DKIM' | 'MISSING_DKIM' | 'FAILED_DKIM';
  dmarcStatus: 'PASS' | 'FAIL' | 'NONE';
  registrar: string;
  nameservers: string[];
}

export interface DocumentMetadata {
  fileName: string;
  fileSize: string;
  fileType: string;
  authorSoftware: string;
  softwareSuspicion: 'HIGH' | 'MEDIUM' | 'LOW' | 'LEGITIMATE';
  creationDate: string;
  modifiedDate: string;
  hasHiddenFontLayers: boolean;
  hasDigitalCert: boolean;
  certIssuer?: string;
  tamperingDetected: boolean;
}

export interface SalarySanity {
  roleTitle: string;
  offeredSalary: string;
  marketMedianSalary: string;
  deviationPercent: number;
  isExtremeOutlier: boolean;
  assessment: string;
}

export interface ForensicAuditReport {
  id: string;
  scanTimestamp: string;
  sha256Checksum: string;
  overallScore: number; // 0 - 100 (higher = higher fraud probability)
  riskLevel: RiskLevel;
  confidenceScore: number;
  executiveSummary: string;
  sourceType: 'DOCUMENT_UPLOAD' | 'PASTED_TEXT' | 'EMAIL_HEADERS';
  sourceTitle: string;
  rawText: string;
  domainAuth: DomainAuth;
  docMetadata: DocumentMetadata;
  salarySanity: SalarySanity;
  threats: ThreatItem[];
  highlights: HighlightSpan[];
}

export interface SampleTestCase {
  id: string;
  name: string;
  tagline: string;
  riskBadge: RiskLevel;
  iconType: 'telegram' | 'google' | 'enterprise';
  fileName?: string;
  rawText: string;
}

export interface ScanHistoryEntry {
  id: string;
  timestamp: string;
  displayDate: string;
  sourceTitle: string;
  score: number;
  riskLevel: RiskLevel;
  keyFlag: string;
  isCurrent?: boolean;
}

