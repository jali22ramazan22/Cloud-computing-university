# PRODUCT REQUIREMENTS DOCUMENT
## Kaspi Legal Intelligence Agent (KLIA)
**Version:** 1.0
**Status:** Draft — Pending Executive Approval
**Author:** Head of Cloud Transformation, Kaspi Bank
**Date:** March 2026
**Classification:** INTERNAL — CONFIDENTIAL

---

## 1. JOBS TO BE DONE

### Primary Job Statement

> **"When I receive a contract for legal review, help me quickly identify high-risk clauses and generate a defensible analysis so that I can make confident decisions without fear of personal regulatory liability."**

### Supporting Jobs (Secondary)

| Job | Who | When |
|-----|-----|------|
| Triage contracts by risk level | Legal Counsel | Upon receipt |
| Cross-reference clauses against KZ law | Senior Lawyer | During review |
| Generate audit trail for compliance records | Legal Team Lead | After sign-off |
| Escalate automatically to Head of Legal | Junior Counsel | When threshold exceeded |

---

## 2. PROBLEM STATEMENT

Kaspi Bank's Legal & Compliance department reviews 15–25 contracts per week per senior lawyer. Despite Kaspi's $5.318B revenue (FY 2024, +32% YoY) and rapidly growing merchant ecosystem (Marketplace GMV +39% YoY), Legal headcount has not scaled proportionally.

**Root Cause (from JTBD Discovery):** The bottleneck is not reading speed. It is the absence of a psychological safety framework that allows lawyers to delegate risk detection to tooling without exposing themselves to personal regulatory liability. Under Kazakhstani banking regulation (AFDRA supervision), liability sits with named individuals — creating rational resistance to automation.

**Impact:**
- Average contract review cycle: 2–8 business days
- Lawyer overtime: estimated 10+ hours/week per senior counsel
- Merchant onboarding delays: Legal review is the #1 internal bottleneck for Marketplace growth
- Regulatory risk: High contract volume increases probability of missed compliance clauses

---

## 3. PROPOSED SOLUTION

### Product Name: **Kaspi Legal Intelligence Agent (KLIA)**

KLIA is an AI-assisted contract pre-screening agent that:
1. Ingests a contract (PDF or Word)
2. Identifies and classifies high-risk clauses
3. Cross-references against a curated Kazakhstani legal ruleset
4. Generates a structured risk report with explanation
5. Assigns a risk score (LOW / MEDIUM / HIGH / ESCALATE)
6. Produces a timestamped audit log attributing analysis to KLIA v1.0 (not to the lawyer)

KLIA does **not** approve or reject contracts. It is a decision-support tool. Final authority remains with the human lawyer. This distinction is critical for legal defensibility.

---

## 4. FUNCTIONAL REQUIREMENTS

### FR-01: Document Ingestion
- Accept PDF and .docx formats up to 100 pages
- Support Kazakh, Russian, and English language contracts
- Parse structured (formatted) and unstructured (scanned OCR) documents

### FR-02: Clause Detection & Classification
- Identify and label standard clause types:
  - Liability caps and indemnification
  - Data processing and personal data transfer
  - Governing law and dispute resolution jurisdiction
  - Termination triggers and penalties
  - IP ownership and confidentiality
  - Force majeure and material adverse change
- Flag non-standard or unusual clause variants

### FR-03: Kazakhstani Legal Ruleset Engine
- Cross-reference against:
  - Civil Code of Kazakhstan (Chapters on Obligations, Contracts)
  - Law on Personal Data and Its Protection (No. 94-V, as amended 2021)
  - Law on Banks and Banking Activity in Kazakhstan
  - AFDRA regulatory requirements for financial institutions
  - Anti-Money Laundering Law obligations
  - Kaspi Bank's internal standard contract templates (configurable)
- Ruleset must be version-controlled and auditable

### FR-04: Risk Scoring
- Assign risk level per clause: LOW / MEDIUM / HIGH / UNACCEPTABLE
- Assign overall contract risk score: GREEN / AMBER / RED / ESCALATE
- RED and ESCALATE contracts automatically route to Head of Legal

### FR-05: Structured Risk Report
- Output format: Markdown + PDF export
- Report must include:
  - Executive summary (3–5 bullet points)
  - Clause-by-clause risk table
  - Specific legal references for each flagged risk
  - Suggested remediation language (where applicable)
  - KLIA version, timestamp, confidence score
  - Mandatory disclaimer: "This analysis is AI-assisted and requires human lawyer review before any legal decision."

### FR-06: Audit Trail & Liability Attribution
- Every analysis logged to immutable audit database (on-premises, KZ data residency)
- Log records: contract hash, KLIA version, analysis timestamp, risk score, reviewing lawyer ID
- Audit log exportable for regulatory inspection
- KLIA's analysis is attributed to the system, not to the individual lawyer — providing legal separation

### FR-07: Human-in-the-Loop Workflow
- Lawyer must explicitly mark: "Reviewed KLIA analysis — Approve / Reject / Escalate"
- No contract proceeds without human sign-off
- System does not send communications to external parties

### FR-08: Integration
- Integrate with Kaspi's existing email/ticketing system (contract intake)
- Output deliverable to SharePoint/contract management repository
- API-first design for future integration with Kaspi's procurement systems

---

## 5. NON-FUNCTIONAL REQUIREMENTS

| Requirement | Specification |
|-------------|---------------|
| Data Residency | All data processed and stored within Kazakhstan (on-prem or KZ-based cloud) |
| Response Time | Risk report generated within 5 minutes for contracts ≤ 30 pages |
| Availability | 99.5% uptime during business hours (09:00–22:00 AST) |
| Security | Role-based access control; contracts encrypted at rest and in transit |
| Language | Full support for Kazakh and Russian; English secondary |
| Explainability | Every flagged risk must cite a specific legal article or internal policy |
| Auditability | Full audit log retained for 7 years (per Kazakhstani financial record requirements) |

---

## 6. OUT OF SCOPE (V1)

- Autonomous contract drafting or modification
- External party negotiations or communications
- Credit or financial risk assessment
- HR contract review (separate compliance domain)
- Cross-border regulatory analysis outside Kazakhstan

---

## 7. SUCCESS METRICS

| Metric | Baseline (Current) | Target (6 months post-launch) |
|--------|--------------------|-------------------------------|
| Average contract review cycle time | 2–8 days | < 1 day |
| Lawyer overtime hours/week | ~10 hours | < 3 hours |
| Contract throughput per lawyer/week | 15–25 | 40–60 (with pre-screening) |
| Escalation rate (to Head of Legal) | Unmeasured | < 15% of contracts |
| Lawyer satisfaction score | Unmeasured | ≥ 4.0/5.0 NPS |

---

## 8. TECHNICAL ARCHITECTURE (HIGH LEVEL)

```
[Contract Intake]
     │ (Email / Upload Portal)
     ▼
[Document Parser]
     │ (PDF/DOCX → structured text)
     ▼
[KLIA Core Engine]
     ├── Clause Detector (NLP model, fine-tuned on KZ legal corpus)
     ├── Ruleset Engine (configurable rule library — KZ law + internal policies)
     └── Risk Scorer (weighted clause risk → overall contract score)
     │
     ▼
[Risk Report Generator]
     │ (Structured output → PDF + Markdown)
     ▼
[Audit Logger] ──────────────► [Immutable Audit DB (on-premises)]
     │
     ▼
[Lawyer Review Interface]
     │ (Approve / Reject / Escalate)
     ▼
[Contract Repository + Notification to Requester]
```

**LLM Selection:** Claude claude-sonnet-4-6 (Anthropic) via API, deployed through on-premises API gateway with data residency controls.
**Fine-tuning:** Kaspi's internal contract corpus (anonymized) for domain adaptation.
**Infrastructure:** On-premises Kaspi data center (Almaty) to comply with KZ data residency requirements.

---

## 9. STAKEHOLDERS

| Role | Name/Group | Responsibility |
|------|-----------|----------------|
| Product Owner | Head of Cloud Transformation | Vision, priorities, Go/No-Go |
| Primary User | Senior Legal Counsel (Aizat Bekova persona) | Daily use, feedback |
| Legal Authority | Head of Legal Department | Sign-off on ruleset, escalation target |
| Compliance Oversight | Chief Compliance Officer | Governance framework approval |
| Technical Delivery | Internal IT / Cloud Team | Infrastructure, security |
| Regulatory Liaison | AFDRA point of contact | External regulatory alignment |

---

*This PRD was developed based on JTBD discovery interviews with the Legal persona and grounded in Kaspi Bank FY 2024 Annual Report data.*
