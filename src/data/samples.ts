import { SampleTestCase } from '../types';

export const SAMPLE_TEST_CASES: SampleTestCase[] = [
  {
    id: 'sample-telegram-scam',
    name: 'Fake Telegram HR Offer',
    tagline: 'Upfront check & home office payment fraud via Telegram interview',
    riskBadge: 'CRITICAL',
    iconType: 'telegram',
    fileName: 'Employment_Contract_DataClerk_Remote.pdf',
    rawText: `OFFICIAL LETTER OF EMPLOYMENT APPOINTMENT
Apex Global Logistics & Data Solutions LLC
Date: September 18, 2026

Dear Candidate,

Following your exceptional submission through our online questionnaire, we are pleased to extend an immediate offer for the position of Remote Senior Data Entry Specialist. There is NO formal video interview required as your qualifications have been pre-approved by the Board of Directors.

COMPENSATION & WORK TERMS:
- Base Rate: $78.50 per hour ($163,280/year) plus full healthcare from Day 1.
- Hours: Flexible 20-40 hours weekly, 100% remote anywhere in the US/Canada.

MANDATORY HOME OFFICE EQUIPMENT ONBOARDING:
To commence work on Monday, our accounting desk will issue you an upfront certified cashier check of $4,850.00 to cover your Apple MacBook Pro M3 Max, secure encryption scanner, and high-speed satellite router.
Upon receipt of the check, you are required to deposit it immediately into your personal checking account and wire back $3,200 via Zelle or wire transfer to our certified office vendor within 24 hours to secure equipment dispatch.

NEXT IMMEDIATE STEPS:
Download the Telegram app on your mobile phone and contact our Chief Talent Lead immediately at @HR_Robert_TalentDirector to claim your employee ID and confirm your mailing address for the check. Failure to connect on Telegram within 12 hours will result in automatic revocation of this offer.

Sincerely,
Dr. Robert Vance, HR Talent Acquisition
Apex Global Services`
  },
  {
    id: 'sample-google-spoof',
    name: 'Domain Spoofed Google Offer',
    tagline: 'Spoofed @google-careers-portal.com lookalike domain with forged headers',
    riskBadge: 'CRITICAL',
    iconType: 'google',
    fileName: 'Google_Staff_Product_Designer_Offer.pdf',
    rawText: `Delivered-To: candidate.security@gmail.com
Received: from mail-relay-node-71.host-vps-russia.net (unknown [185.220.101.42])
        by mx.google.com with ESMTP id z18si4928372plm.12.2026.09.19.04.12.01;
        Sat, 19 Sep 2026 04:12:01 -0700
Authentication-Results: mx.google.com;
       dkim=neutral (bad sig) header.i=@google-careers-portal.com;
       spf=fail (google.com: domain of hr@google-careers-portal.com does not designate 185.220.101.42 as permitted sender)
From: Google Careers Global <hr@google-careers-portal.com>
Subject: Congratulations! Official Google Employment Contract: Staff Product Designer
Date: September 19, 2026

Dear Candidate,

On behalf of Google LLC (Alphabet Inc.), we are thrilled to offer you the position of Staff Product Designer (L6) within Google Cloud UX.

OFFER HIGHLIGHTS:
- Annual Base Salary: $285,000 USD
- Target Annual Bonus: 25% ($71,250)
- Initial Alphabet Restricted Stock Units (GSU): $420,000 vesting over 4 years
- Location: Sunnyvale, CA or Remote within US

SECURITY CLEARANCE BACKGROUND PROTOCOL:
Due to confidentiality protocols surrounding our Gemini AI models, Google requires all pre-onboarded staff to submit a background verification processing fee of $250.00 refundable upon your first bi-weekly payroll cycle.
Please navigate to our employee onboarding gateway:
http://www.google-careers-portal.com/auth/id-verification-deposit

Note: Do not communicate via standard Google public forums or Mountain View main switchboards as this candidate pipeline is handled under an accelerated non-disclosure covenant.

Welcome to Google!
Talent Acquisition Team
Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA`
  },
  {
    id: 'sample-enterprise-clean',
    name: 'Verified Enterprise Offer',
    tagline: 'Legitimate Stripe offer with cryptographically aligned headers & standard terms',
    riskBadge: 'LEGITIMATE',
    iconType: 'enterprise',
    fileName: 'Stripe_Senior_Software_Engineer_Offer_Letter.pdf',
    rawText: `Delivered-To: candidate.dev@gmail.com
Received: from mail-wr1-x42d.outbound.stripe.com (mail-wr1-x42d.outbound.stripe.com. [198.2.186.44])
        by mx.google.com with ESMTPS id j9-20020a170902d38900b001ef763d5c5fsi4829107plc.448.2026.09.15.11.23.04;
        Tue, 15 Sep 2026 11:23:04 -0700
Authentication-Results: mx.google.com;
       dkim=pass header.i=@stripe.com header.s=stripe202409;
       spf=pass (google.com: domain of recruiting@stripe.com designates 198.2.186.44 as permitted sender) smtp.mailfrom=recruiting@stripe.com;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=stripe.com
From: Stripe Recruiting <recruiting@stripe.com>
Subject: Stripe Offer: Senior Software Engineer, Infrastructure
Date: September 15, 2026

Dear Alex,

We are delighted to formally offer you the position of Senior Software Engineer (L4) on the Global Financial Messaging team at Stripe, Inc.

TERMS OF EMPLOYMENT:
- Base Salary: $195,000 USD annualized, paid semi-monthly.
- Equity: $240,000 in Stripe Restricted Stock Units (RSUs) subject to Stripe's standard 4-year vesting schedule with a 1-year cliff.
- Sign-on Incentive: $25,000 payable on your first standard payroll cycle.
- Benefits: Comprehensive medical, dental, and vision insurance, 401(k) matching up to 5%, and standard paid time off.

ONBOARDING & VERIFICATION:
This offer is contingent upon standard Form I-9 employment eligibility verification and satisfactory completion of our standard criminal and reference background check managed via Sterling Talent Solutions (no candidate fee will ever be charged).
All official work equipment (company-managed laptop and security YubiKeys) will be provisioned directly by Stripe IT Logistics and shipped to your residential address prior to your start date.

Please sign this offer letter electronically via the secure DocuSign link attached below by September 22, 2026.

Sincerely,
Claire Thorne
Head of Engineering Talent
Stripe, Inc. - South San Francisco, CA`
  }
];
