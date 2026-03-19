# JTBD DISCOVERY INTERVIEW LOG
## Synthetic Persona Interview — 5 Whys Methodology
**Interviewer:** Product Manager (Head of Cloud Transformation, Kaspi Bank)
**Persona:** Aizat Bekova, Senior Legal Counsel, Kaspi Bank Legal & Compliance Department
**Context:** Aizat has 7 years at Kaspi, reviews vendor and partner contracts daily.
**Method:** Jobs-to-Be-Done (JTBD) + 5 Whys root cause analysis
**Date:** March 2026

---

## PERSONA BRIEF

> *"I am Aizat Bekova. I joined Kaspi in 2018 after 4 years at a Kazakh law firm. I review between 15 and 25 contracts per week — vendor agreements, partnership contracts, SaaS licensing deals, and occasionally cross-border agreements with Kaspi's new Azerbaijan operations. I use Microsoft Word with tracked changes, email, and my own checklist in a spreadsheet. I sometimes work until 9 PM. My manager tells me I'm thorough. I would describe myself as terrified."*

---

## INTERVIEW TRANSCRIPT

---

**PM:** Aizat, thank you for your time. I want to understand your day. Walk me through what happens when a new contract lands on your desk.

**Aizat:** Sure. I get an email from Procurement or from a Business Unit — usually with the subject line "URGENT: Contract for review by EOD." I open the contract, which is usually a Word document between 15 and 60 pages. I go through it clause by clause with my checklist. I flag risky clauses — liability caps, data processing terms, governing law, termination triggers. I write up a comment memo. Then I send it back. Sometimes they push back. Sometimes I have to escalate to the Head of Legal. It takes me anywhere from 2 hours to a full day depending on complexity.

**PM:** When you say the work takes a full day — what specifically makes it take that long?

**Aizat:** Honestly? It's not just reading. I have to cross-reference each clause against Kazakhstani law. Is this indemnity clause enforceable under the Civil Code of Kazakhstan? Does this data processing clause comply with the Law on Personal Data (No. 94-V)? Does this governing law clause conflict with our AFDRA obligations? I can't just skim. If I miss something and we sign a contract that later becomes a regulatory problem, that's on me.

---

### WHY #1

**PM:** Why does the responsibility fall entirely on you personally?

**Aizat:** Because there's no system. There's no pre-screening tool, no risk scoring. No one checks the contract before it reaches me. Procurement sends it directly. So when it arrives, I'm the first — and last — line of defense before signing. Whatever I miss, nobody catches.

> **Insight 1:** There is no upstream filtering or risk tiering. Every contract, regardless of complexity or value, arrives at senior counsel level with equal urgency and zero pre-processing.

---

### WHY #2

**PM:** Why is there no pre-screening system or risk tiering in place?

**Aizat:** We've talked about it. A few years ago someone suggested we use a contract management tool. IT said it would take 18 months to implement and integrate with our systems. The budget was cut. So we stayed with email and Word. And honestly — the business keeps growing. There are more contracts every quarter. Kaspi's Marketplace GMV grew 39% last year. Every new merchant partnership means another contract. The volume has outpaced our capacity, but the process hasn't changed.

> **Insight 2:** Tool adoption was blocked by IT delivery timelines and budget cuts. The problem has worsened organically as Kaspi's business growth generated more contract volume without proportional Legal headcount growth.

---

### WHY #3

**PM:** Why hasn't the Legal team pushed harder for tooling, given the clear capacity problem?

**Aizat:** *[pauses]* That's a fair question. Honestly? We're afraid that if we automate, and the tool makes a mistake... who is responsible? Right now, if something goes wrong, I can show my checklist and my memo. I reviewed it. I flagged risks. The business decided to sign anyway. If a tool reviews it and the tool misses something, and I just "approved the tool's output" — am I still protected? Under Kazakhstani law, regulatory liability in banking compliance sits with specific named individuals, not with software. There's no legal precedent for AI making a compliance call.

> **Insight 3 (NON-OBVIOUS):** The resistance to automation is not laziness or technophobia. It is a rational response to a liability structure that places personal legal accountability on individual lawyers. In the absence of a defined governance framework for AI-assisted legal review, adoption of any tool represents personal risk to the lawyer, not risk reduction.

---

### WHY #4

**PM:** Why hasn't the organization defined a governance framework that would protect lawyers when using AI tools?

**Aizat:** Because nobody has asked us to. The direction from leadership is "digital transformation" and "AI for operations." But nobody sat with the Legal team and asked: what would you need to trust a tool? What process change would make this safe for you? The mandate comes from the top, but the implementation details — who owns the output, what the human review step looks like, what audit trail is required — nobody has designed that. We get announcements, not frameworks.

> **Insight 4:** There is a top-down AI mandate at Kaspi (consistent with Kazakhstan's National AI Development Concept 2024-2029) but zero bottom-up governance design. The Legal team has never been treated as a stakeholder in the AI adoption process — only as a target.

---

### WHY #5

**PM:** Why haven't lawyers been included as stakeholders in the AI transformation design process?

**Aizat:** *[sighs]* Because Legal is not seen as a product team. We're overhead. We're a cost center that slows things down. When the business wants to move fast, Legal is the bottleneck. Nobody thinks of us as people who could design a better system. We just review contracts. That's our "job." The irony is that we understand the risk better than anyone. We know exactly where the dangerous clauses are, what mistakes get made, what a tool would need to catch. But we've never been asked to co-design anything. We were not in the room when they chose the last contract tool. We just got a demo of something that didn't work.

> **Insight 5 (ROOT CAUSE):** The fundamental problem is not contract review speed. It is that the Legal team has been structurally excluded from product design processes while simultaneously being held personally liable for outcomes. This creates a system where lawyers rationally resist automation (to protect themselves) even when they intellectually understand its value. The organization has optimized for delivery speed at the consumer layer while treating internal experts as passive executors rather than empowered co-designers.

---

## JOBS-TO-BE-DONE STATEMENT

*"When I receive a contract for review, I need to quickly identify high-risk clauses and get confidence that I haven't missed anything critical — so that I can make a defensible approval decision without working until midnight and without exposing myself to personal regulatory liability."*

**The job is not: "review contracts faster."**
**The job is: "make confident, defensible decisions without fear."**

---

## KEY DISCOVERY FINDING

> The root cause of Kaspi Legal's contract review bottleneck is not a **speed problem** — it is a **psychological safety and liability governance problem.** Lawyers are rational actors operating under a perverse incentive structure: they bear full personal accountability for missed risks, but receive no benefit from automation that might reduce their control over the review process. Any AI solution that does not address this liability governance gap will be rejected by the very people it is meant to help.

---

*This interview was conducted using a synthetic AI persona grounded in real organizational dynamics common to Kazakhstani financial institutions. The persona's statements reflect patterns documented in JTBD research methodology.*
