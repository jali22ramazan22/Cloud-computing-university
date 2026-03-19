# KASPI BANK — SOURCE DOCUMENTS & RAW DATA
## Context loaded for AI-assisted strategic audit
**Retrieval date:** March 2026
**Purpose:** Grounding documents for Cagan Audit (Phase 1) and Financial Defense (Phase 3)

---

## PRIMARY SOURCES

### 1. FY 2024 Annual Report — SEC Form 20-F
- **URL:** https://www.sec.gov/Archives/edgar/data/1985487/000095017025035904/kspi-20241231.htm
- **Filed:** 2025, for fiscal year ending December 31, 2024
- **Auditor:** Deloitte LLP (IFRS)
- **Key extracts used:**
  - Revenue FY 2024: $5.318 billion (+32% YoY)
  - Net Income FY 2024: $2.183 billion (+25% YoY)
  - Operating Margin: 75.09%
  - Total Assets: 8,377,101 million tenge
  - Total Liabilities: 6,804,240 million tenge
  - Net Profit (bank subsidiary): 1,056,834 million tenge
  - Organizational model: "Small dedicated product teams, each led by a directly responsible individual"
  - Performance metric: NPS and Monthly Active Users (not financial targets for team managers)
  - Infrastructure: ~70% from AWS and local Kazakhstan providers

### 2. 4Q & FY 2024 Earnings Release
- **URL:** https://ir.kaspi.kz/media/4Q__FY_2024_Results.pdf
- **Published:** ir.kaspi.kz (Investor Relations)
- **Key extracts used:**
  - Monthly Active Users (Super App): 10.2 million
  - Monthly transactions per active consumer: 73 (record high)
  - Payments transactions: +40% YoY
  - Marketplace GMV growth: +39% YoY (Q4 2024)
  - E-Commerce GMV: +67% in Q4, +85% full fiscal year
  - E-Commerce purchases: +123% YoY
  - Q4 2024: Revenue and net income both +28% YoY
  - 2025 guidance: ~20% net income growth expected

### 3. Kaspi Bank JSC Consolidated Financial Statements — KASE Disclosure
- **URL:** https://kase.kz/en/information/news/show/1545418
- **Ticker:** CSBN (KASE), KSPI (NASDAQ)
- **Published:** June 19, 2025
- **Key extracts used:**
  - Confirmation of IFRS compliance
  - Three regulatory supervisors: National Bank of Kazakhstan, AFDRA, Financial Monitoring Agency
  - Free Cash Flow 2024: 486 billion KZT
  - Cash Position: 1.08 trillion KZT

### 4. Kaspi.kz ESG Report 2023
- **URL:** https://www.sustainalytics.com/esg-rating/kaspi-kz-jsc/2006309543
- **URL:** https://www.annualreports.com/Company/kaspi-kz
- **Key extracts used:**
  - Community investment: >$5 million to education and environmental projects (2023)
  - Goal to reduce carbon footprint through green technologies
  - ESG Risk Rating assessed by Sustainalytics

### 5. Kaspi.kz Investor Relations — Governance & Management
- **URL:** https://ir.kaspi.kz/governance/management/
- **URL:** https://ir.kaspi.kz/governance/directors/
- **Key extracts used:**
  - CEO: Mikheil Lomtadze (Harvard MBA, Co-founder 2007, multiple "Best CEO in Kazakhstan" 2017-2022)
  - Co-founder: Vyacheslav Kim (Chairman of Board)
  - CFO: Tengiz Mosidze (founding team 2008)
  - COO: Pavel Mironov (founding team 2008)
  - Board includes international members: Alina Prawdzik (ex-Meta/eBay), Douglas Gardner (ex-EY Russia)

### 6. Kaspi.kz Technology Partnership
- **URL:** https://www.tietoevry.com/en/success-stories/2024/kaspi-kazakhstan/
- **Key extracts used:**
  - Partnership with Tieto Banktech for payment processing scalability
  - Card Suite payment processing: traffic balancing, issuing authorization database split
  - Technology investment: >$200 million in last fiscal year

### 7. Kaspi.kz Mission Statement
- **URL:** https://ir.kaspi.kz/about/
- **Key extracts used:**
  - Mission: "To improve the lives of Kazakhstanis through technology"
  - Product ecosystem: Kaspi.kz Super App + Kaspi Pay Super App for merchants
  - Market position: #1 in Payments, Marketplace, Fintech in Kazakhstan
  - Market share: ~60% of local digital payments sector

---

## SECONDARY SOURCES (REGULATORY & MARKET CONTEXT)

### 8. Kazakhstan Law on Personal Data (No. 94-V)
- Amended 2021
- Relevance: Data residency requirement — personal data of KZ citizens must be stored/processed on servers within Kazakhstan
- Used in: Phase 3 Governance analysis (Risk 1)

### 9. Kazakhstan National AI Development Concept 2024-2029
- Approved by Government of Kazakhstan
- Relevance: AI governance framework roadmap; explainability requirements in sensitive domains
- Used in: Phase 3 Governance analysis (Risk 4)

### 10. AFDRA (Agency for Regulation and Development of Financial Markets)
- Regulatory authority for Kaspi Bank
- Relevance: Operational change notification requirements; AI in compliance processes
- Used in: Phase 3 Governance analysis (Risk 2)

### 11. Salary Market Data
- **Source:** hh.kz (Kazakhstan's primary job market platform), March 2026
- Senior Legal Counsel, Almaty, financial sector: 550,000 – 750,000 KZT/month
- Used value: 650,000 KZT/month (midpoint)
- Used in: Phase 3 ROI calculation

### 12. Anthropic Claude API Pricing
- **Source:** anthropic.com/api
- Claude claude-sonnet-4-6: ~$15 per 1 million tokens (input)
- Used in: Phase 3 API cost calculation (~500 contracts/month × 2,000 tokens = 1M tokens/month = $15/month)

---

## DATA QUALITY NOTES

- All financial figures from Kaspi Annual Report are Deloitte-audited IFRS figures
- Salary figures are market estimates from hh.kz, not Kaspi internal data (Kaspi does not disclose individual salary bands)
- Legal team size (20 lawyers) is an estimate based on company size and three-segment regulatory complexity — not confirmed in public filings
- Token cost estimates are based on current API pricing and estimated average contract length (~10 pages = ~2,000 tokens); actual usage may vary

---

## HOW THESE SOURCES WERE USED

| Source | Used In | Specific Fact |
|--------|---------|---------------|
| SEC 20-F 2024 | Transformation Memo | Revenue $5.318B, operating margin 75.09%, org model |
| Earnings Release | Transformation Memo | MAU 10.2M, GMV +39%, payments +40% |
| KASE Disclosure | Transformation Memo | Three regulatory supervisors, cash position |
| ESG Report | Transformation Memo | Community investment, sustainability goals |
| Governance pages | Transformation Memo | CEO Harvard MBA, NPS-based management |
| Tieto Banktech | Transformation Memo | $200M+ tech investment, AWS infrastructure |
| Law No. 94-V | Executive Summary | Data residency risk |
| AFDRA | Executive Summary | Regulatory liability risk |
| National AI Concept | Executive Summary | Transparency/explainability requirement |
| hh.kz | Executive Summary | Salary baseline for ROI |
| Anthropic pricing | Executive Summary | API token cost for ROI |
