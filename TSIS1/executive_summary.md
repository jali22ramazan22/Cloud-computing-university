# EXECUTIVE SUMMARY: GO / NO-GO DECISION
## Kaspi Legal Intelligence Agent (KLIA) — Investment & Governance Review
**Author:** Head of Cloud Transformation (Human Synthesis — not AI-generated)
**Reviewed by:** CFO, Chief Legal Officer, Chief Compliance Officer
**Date:** March 2026
**Decision Required:** Approve Phase 1 build of KLIA pilot

---

## VERDICT: ✅ CONDITIONAL GO

**Proceed with Phase 1 pilot under the conditions defined in Section 4.**
The financial case is strong. The governance risks are real but manageable with the right architecture. The worst outcome is not building — it is continuing to scale a legal team reactively as Kaspi's merchant ecosystem grows at 39% YoY.

---

## SECTION 1 — FINANCIAL REASONING (ROI CALCULATION)

### Cost of the Problem (Current State)

**Kaspi Legal Team Assumptions:**
- Senior Legal Counsel average salary in Kazakhstan: **650,000 KZT/month** (~$1,300 USD)
  *(Source: hh.kz market data, March 2026 — senior legal/compliance in Almaty, financial sector)*
- Monthly working hours: 160 hours
- Effective hourly cost to Kaspi: **650,000 ÷ 160 = 4,063 KZT/hour (~$8.75/hour)**
- Estimated Legal team size (senior counsel, given 9,637 total employees and three-segment business): **20 senior lawyers**

**Wasted Time per Lawyer:**
- Discovery interview finding: each lawyer spends ~10 hours/week on manual cross-referencing and checklist work that KLIA can automate
- 10 hours/week × 4 weeks = **40 hours/month per lawyer**
- Cost of wasted time per lawyer: 40 × 4,063 = **162,500 KZT/month**

**Total Team Cost of Inefficiency:**
- 20 lawyers × 162,500 = **3,250,000 KZT/month**
- Annual cost of the status quo: **39,000,000 KZT/year (~$84,000 USD/year)**

**Hidden costs (not modeled but real):**
- Merchant onboarding delays → lost GMV from delayed partnerships
- Regulatory fines from missed compliance clauses (AFDRA fines: up to 1% of regulatory capital)
- Senior lawyer burnout and attrition (replacement cost: ~3–6 months salary per hire)

---

### Cost of the Solution (KLIA Build)

**One-Time Development Costs:**

| Item | Cost Estimate (KZT) | Notes |
|------|---------------------|-------|
| LLM fine-tuning on KZ legal corpus | 5,000,000 | ~3 months, 1 ML engineer |
| Rule engine development (KZ law ruleset) | 8,000,000 | Legal + engineering collaboration |
| Frontend / integration development | 6,000,000 | Portal + audit system |
| On-premises API gateway (data residency) | 4,000,000 | Infrastructure setup |
| Legal review & compliance sign-off | 3,000,000 | External counsel for governance framework |
| **Total One-Time Cost** | **26,000,000 KZT** | **~$56,000 USD** |

**Recurring Costs (Annual):**

| Item | Annual Cost (KZT) | Notes |
|------|-------------------|-------|
| Claude API tokens | 84,000 | ~500 contracts/month, ~2,000 tokens each = 12M tokens/year @ $15/1M tokens → ~$180 → 84,000 KZT |
| Maintenance & updates (0.5 FTE) | 6,000,000 | Ruleset updates as KZ law changes |
| On-premises hosting | 1,200,000 | Server costs |
| **Total Annual Operating Cost** | **7,284,000 KZT** | **~$15,700 USD** |

---

### ROI Calculation

```
Annual Savings:    39,000,000 KZT
Annual Costs:       7,284,000 KZT
                  ─────────────────
Net Annual Benefit: 31,716,000 KZT  (~$68,300 USD)

First-Year ROI:
  = (Net Benefit – One-Time Build Cost) / Total First-Year Investment
  = (31,716,000 – 26,000,000) / (26,000,000 + 7,284,000)
  = 5,716,000 / 33,284,000
  = 17.2% Year 1 ROI

Payback Period: ~10 months

From Year 2 onwards:
  ROI = 31,716,000 / 7,284,000 = 435% annual ROI

3-Year NPV (discount rate 12%):
  Year 0:  –26,000,000 KZT (build)
  Year 1:  +31,716,000 – 7,284,000 = +24,432,000 KZT (discounted: +21,814,286)
  Year 2:  +31,716,000 – 7,284,000 = +24,432,000 KZT (discounted: +19,477,041)
  Year 3:  +31,716,000 – 7,284,000 = +24,432,000 KZT (discounted: +17,390,215)
  ─────────────────────────────────────────────────────────────────────────────
  3-Year NPV: +32,681,542 KZT  (~$70,400 USD)
```

**Financial Conclusion:** KLIA is financially sound even under conservative assumptions. The API token cost ($180/year) is negligible compared to salary savings ($84,000/year). The 17.2% first-year ROI meets Kaspi's internal investment threshold for digital initiatives, and the 435% Year 2+ ROI makes this one of the highest-return internal tool investments available.

---

## SECTION 2 — GOVERNANCE & ETHICS (KAZAKHSTAN AI TEST)

### Risk 1: Data Residency ⚠️ HIGH RISK — MITIGATED BY ARCHITECTURE

**The Issue:**
Kaspi contracts contain legally sensitive information including counterparty PII, financial terms, and regulatory commitments. Kazakhstan's **Law on Personal Data and Its Protection (No. 94-V, as amended 2021)** requires that personal data of Kazakhstani citizens be stored and processed on servers physically located within Kazakhstan. Sending contract data to a foreign cloud AI service (e.g., directly to Anthropic's US-based Claude API) would violate this requirement.

Additionally, **AFDRA regulations** require that financial institutions maintain control over data used in compliance-related processes. An external SaaS contract review tool with undefined data residency would fail AFDRA audit.

**Mitigation:**
KLIA's PRD specifies on-premises deployment with an API gateway that processes contract data within Kazakhstan. The Claude API is called through an on-premises proxy that strips PII before transmission (or uses a locally-deployed model). Kaspi's existing AWS infrastructure (noted in 2024 Annual Report as ~70% of tech stack) is operated through AWS Regions compliant with Kazakhstani data localization requirements.

**Residual Risk:** LOW if on-premises architecture is correctly implemented.

---

### Risk 2: Regulatory Liability — AI in Compliance ⚠️ HIGH RISK — REQUIRES GOVERNANCE FRAMEWORK

**The Issue:**
Under Kazakhstani banking regulation, compliance decisions carry personal liability for named officers. The JTBD interview revealed that lawyers fear AI tools because there is no legal framework establishing how liability is shared when an AI-assisted review misses a risk. If KLIA misses a compliance clause and Kaspi signs a problematic contract, the reviewing lawyer faces regulatory action — even if they "trusted the tool."

**Mitigation:**
KLIA must be governed under a formal **AI Decision-Support Policy** approved by the Legal and Compliance leadership. Key elements:
- KLIA output is explicitly classified as "advisory pre-screening" not "legal review"
- Every contract requires a named human lawyer to certify review with audit trail
- KLIA's confidence scores are disclosed — low-confidence outputs are escalated automatically
- The AI Decision-Support Policy is registered with AFDRA as part of Kaspi's operational risk framework

**Residual Risk:** MEDIUM. Kazakhstan has no specific AI liability legislation yet (National AI Concept 2024-2029 is a roadmap, not a binding law). Proactive AFDRA engagement is essential.

---

### Risk 3: Hallucination in Legal Documents ⚠️ HIGH RISK — REQUIRES VALIDATION PROTOCOL

**The Issue:**
Large language models can hallucinate legal citations — generating plausible-sounding but incorrect references to laws, case precedents, or regulatory articles. In a legal compliance context at a systemically important financial institution, a hallucinated legal citation that goes undetected could result in a materially flawed contract review.

**Mitigation:**
- KLIA's ruleset engine uses deterministic, rule-based logic for citation (NOT LLM generation) — specific law references are retrieved from a curated, version-controlled database
- LLM is used only for clause identification, risk classification, and natural language explanation — not for generating legal citations
- All LLM outputs are labeled with a confidence score; outputs below threshold (< 85%) are flagged for mandatory human review
- Quarterly validation testing: a sample of KLIA outputs is reviewed by Head of Legal against ground truth

**Residual Risk:** LOW-MEDIUM with deterministic citation engine. HIGH if LLM is allowed to generate legal references.

---

### Risk 4: Transparency & Explainability ✅ MANAGED

**The Issue:**
Kazakhstan's National AI Development Concept (2024-2029) emphasizes the need for explainable AI in sensitive domains. Black-box AI decisions in financial compliance would face regulatory and ethical scrutiny.

**Mitigation:**
KLIA's architecture requires clause-level explanation with specific legal references for every flagged risk. No risk score is generated without an auditable rationale. This satisfies the spirit of Kazakhstan's explainability expectations and aligns with AFDRA's operational transparency requirements.

---

### Risk 5: Vendor Dependency (Anthropic) ⚠️ MEDIUM RISK

**The Issue:**
Kaspi's critical compliance function should not be dependent on a single foreign AI vendor. Changes to Anthropic's API pricing, terms, or availability could disrupt operations.

**Mitigation:**
- Build KLIA with a model-agnostic API layer — swap underlying LLM without rebuilding the product
- Evaluate local/open-source model alternatives (e.g., fine-tuned Llama 3) for on-premises deployment as a fallback
- SLA requirements: KLIA must function independently of external API for tier-1 contract reviews

---

## SECTION 3 — GOVERNANCE SUMMARY TABLE

| Risk | Severity | Probability | Mitigation | Residual Risk |
|------|----------|-------------|------------|---------------|
| Data residency violation | High | High (if unmitigated) | On-premises deployment + KZ-local infrastructure | Low |
| AI liability gap | High | Medium | AI Decision-Support Policy + AFDRA registration | Medium |
| Hallucinated legal citations | High | Medium | Deterministic citation engine + LLM for classification only | Low-Medium |
| Lack of transparency | Medium | Low (mitigated by design) | Clause-level explanations + full audit trail | Low |
| Vendor dependency | Medium | Low | Model-agnostic API layer + open-source fallback | Low |

---

## SECTION 4 — CONDITIONS FOR GO

The Board should approve Phase 1 of KLIA **subject to the following conditions:**

1. **Data Residency Architecture Review:** CTO to certify that KLIA deployment meets Law No. 94-V data residency requirements before any contract data is processed.

2. **AI Decision-Support Policy:** Chief Legal Officer to approve and publish an internal policy defining KLIA's role, human review obligations, and liability attribution. Deadline: 30 days before pilot launch.

3. **AFDRA Notification:** Compliance team to notify AFDRA of the pilot as part of Kaspi's operational change management process. Do not seek permission — notify and engage proactively.

4. **Pilot Scope:** Phase 1 is limited to LOW and MEDIUM risk contracts only. RED and ESCALATE contracts continue on manual review. Expand to all contract types only after 6-month pilot validation.

5. **Hallucination Testing:** Before launch, run KLIA against 100 historical contracts with known correct analysis. Accuracy must exceed 90% on clause detection and risk classification.

---

## FINAL RECOMMENDATION

| Criterion | Assessment |
|-----------|------------|
| Financial viability | ✅ Strong — 435% ROI from Year 2, $70K+ NPV over 3 years |
| Legal compliance | ✅ Achievable — with on-premises architecture and governance policy |
| Technical feasibility | ✅ Yes — Kaspi's existing AWS infrastructure and $200M+ tech investment supports this |
| Organizational readiness | ⚠️ Partial — Legal team needs to be included as co-designers, not just users |
| Regulatory risk | ⚠️ Manageable — requires proactive AFDRA engagement and KZ data residency compliance |

**Decision: CONDITIONAL GO.**
Build the pilot. Engage Legal as co-designers. Do not skip the governance framework. The risk of NOT building is higher than the risk of building it right.

---

*This Executive Summary represents human synthesis of AI-assisted research and financial modeling. All salary figures sourced from hh.kz market data. All Kaspi financial figures sourced from Kaspi.kz FY 2024 Annual Report (SEC Form 20-F) and Deloitte-audited KASE disclosures. ROI model assumptions are conservative and do not include indirect benefits (reduced regulatory fines, reduced lawyer attrition).*
