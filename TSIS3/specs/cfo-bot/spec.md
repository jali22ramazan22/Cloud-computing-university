# CFO Bot — Cloud Cost Calculator Specification (SSOT)

**Version**: 1.1  
**Date**: 2026-03-26  
**Status**: Draft  
**Authors**: TSIS3 Project Team  
**Pricing Basis**: Google Cloud Platform (GCP), us-central1 region, on-demand pricing

---

## 1. Overview

### 1.1 Problem Statement

Organizations migrating to the cloud struggle to estimate monthly infrastructure costs accurately. Pricing models vary across cloud providers and service tiers, making it difficult for non-technical decision-makers (CFOs, finance teams, project managers) to forecast budgets without specialized knowledge. Existing cloud calculators are complex, provider-specific, and lack conversational guidance.

### 1.2 Solution

**CFO Bot** is a conversational chat bot web application that estimates monthly cloud infrastructure costs based on **Google Cloud Platform (GCP)** pricing. Users interact with the bot through a natural language chat interface, specifying their usage assumptions (e.g., number of virtual machines, storage volume, expected bandwidth). The bot guides users through component selection, applies defined pricing models, and produces a clear monthly cost breakdown with a total estimate.

### 1.3 Target Users

| User Type | Description | Primary Goal |
|-----------|-------------|--------------|
| **CFO / Finance Manager** | Non-technical budget decision-maker | Get a reliable monthly cost forecast |
| **Project Manager** | Plans cloud migration projects | Compare cost scenarios for different architectures |
| **Startup Founder** | Building MVP on the cloud | Understand baseline cloud costs before launch |
| **Student / Learner** | Learning cloud unit economics | Explore how cloud pricing works interactively |

### 1.4 Scope

**In Scope:**
- Conversational chat interface for cloud cost estimation
- Support for 5 core cloud components: Compute, Storage, Bandwidth, Database, Serverless Functions
- Multiple pricing tiers per component (based on GCP)
- Mathematical cost models with transparent formulas
- Monthly cost breakdown and total estimate
- Ability to adjust assumptions and recalculate
- Deployment to Google Firebase (public URL)
- Responsive web interface (desktop + mobile)

**Out of Scope:**
- Real-time pricing from live cloud provider APIs
- Multi-cloud comparison (AWS vs GCP vs Azure side-by-side)
- User authentication and saved sessions
- Payment processing
- Annual/multi-year commitment pricing (reserved instances, CUDs)
- Sustained Use Discounts (SUDs) or Spot VM pricing

---

## 2. Cloud Components & Pricing Models

The CFO Bot supports **five cloud service components**. Each component has defined tiers and a deterministic pricing formula. All prices are in **USD per month**, based on **GCP us-central1 region** on-demand rates.

### 2.1 Compute (Virtual Machines — GCP Compute Engine E2 Series)

Users specify the number of VM instances, the tier, and hours of operation per month.

| Tier | GCP Equivalent | vCPUs | RAM (GB) | Rate ($/hour) |
|------|---------------|-------|----------|----------------|
| Basic | e2-micro | Shared | 1 | $0.008 |
| Standard | e2-medium | 1 | 4 | $0.034 |
| Premium | e2-standard-4 | 4 | 16 | $0.134 |
| High-Performance | e2-standard-8 | 8 | 32 | $0.268 |

**Cost Formula:**
```
Compute Cost = Number of Instances × Rate per Hour × Hours per Month
```

**Default Assumption:** 730 hours/month (24/7 operation = 365.25 / 12 × 24)

**Constraints:**
- Minimum instances: 1
- Maximum instances: 100
- Hours per month: 1–730
- Only whole-number instance counts are accepted

### 2.2 Storage (Object Storage — GCP Cloud Storage)

Users specify the volume of data stored and the storage tier.

| Tier | Description | Rate ($/GB/month) |
|------|-------------|-------------------|
| Standard | General-purpose, frequently accessed | $0.020 |
| Nearline | Infrequently accessed (30-day min) | $0.010 |
| Coldline | Rarely accessed (90-day min) | $0.004 |
| Archive | Long-term archival (365-day min) | $0.0012 |

**Cost Formula:**
```
Storage Cost = Volume (GB) × Rate per GB/month
```

**Constraints:**
- Minimum volume: 1 GB
- Maximum volume: 1,000,000 GB (1 PB)
- Decimal values accepted (e.g., 500.5 GB)

### 2.3 Bandwidth (Data Transfer / Egress — GCP Network)

Users specify the expected outbound data transfer per month.

| Tier | Range | Rate ($/GB) |
|------|-------|-------------|
| Free Tier | 0–1 GB | $0.00 |
| Standard | 1 GB – 1 TB | $0.12 |
| Bulk | 1 TB – 10 TB | $0.11 |
| Enterprise | 10+ TB | $0.08 |

**Note:** 1 TB = 1,024 GB; 10 TB = 10,240 GB

**Cost Formula (tiered / progressive):**
```
Bandwidth Cost =
    min(egress_gb, 1) × $0.00
  + min(max(egress_gb - 1, 0), 1023) × $0.12
  + min(max(egress_gb - 1024, 0), 9216) × $0.11
  + max(egress_gb - 10240, 0) × $0.08
```

**Note:** Bandwidth pricing is **progressive** (tiered), not flat-rate. The first 1 GB is free, the next ~1 TB at $0.12/GB, etc. Ingress (inbound) is free and not calculated.

**Constraints:**
- Minimum egress: 0 GB
- Maximum egress: 500,000 GB (500 TB)
- Ingress (inbound) is free and not calculated

### 2.4 Database (Managed Database — GCP Cloud SQL)

Users specify the database tier and storage volume.

| Tier | GCP Equivalent | vCPUs | RAM (GB) | Base Rate ($/month) | Storage Rate ($/GB/month) |
|------|---------------|-------|----------|---------------------|--------------------------|
| Micro | db-f1-micro | Shared | 0.6 | $13.00 | $0.170 |
| Small | db-custom-1-4096 | 1 | 4 | $70.00 | $0.170 |
| Medium | db-custom-2-8192 | 2 | 8 | $140.00 | $0.170 |
| Large | db-custom-4-16384 | 4 | 16 | $280.00 | $0.170 |
| XLarge | db-custom-8-32768 | 8 | 32 | $560.00 | $0.170 |

**Cost Formula:**
```
Database Cost = Base Rate + (Storage Volume (GB) × Storage Rate)
```

**Note:** Base rates include instance compute (vCPU + memory). Storage rate is for SSD storage. Prices are simplified from GCP Cloud SQL Enterprise edition.

**Constraints:**
- Minimum storage: 10 GB
- Maximum storage: 10,000 GB (10 TB)
- Only one database instance per calculation (users can add multiple components for multiple DBs)

### 2.5 Serverless Functions (FaaS — GCP Cloud Functions Gen 1)

Users specify expected monthly invocations, average execution duration, and memory allocation. CPU is **automatically allocated** proportionally to memory.

**Memory → CPU Allocation Table:**

| Memory | CPU (auto-allocated) |
|--------|---------------------|
| 128 MB (0.125 GB) | 200 MHz (0.2 GHz) |
| 256 MB (0.25 GB) | 400 MHz (0.4 GHz) |
| 512 MB (0.5 GB) | 800 MHz (0.8 GHz) |
| 1024 MB (1 GB) | 1400 MHz (1.4 GHz) |
| 2048 MB (2 GB) | 2400 MHz (2.4 GHz) |

**Pricing Rates:**

| Parameter | Rate |
|-----------|------|
| Invocations | $0.40 per 1 million invocations |
| Memory Time | $0.0000025 per GB-second |
| CPU Time | $0.0000100 per GHz-second |

**Free Tier (per month):**

| Parameter | Free Allowance |
|-----------|---------------|
| Invocations | 2,000,000 |
| Memory Time | 400,000 GB-seconds |
| CPU Time | 200,000 GHz-seconds |

**Cost Formula:**
```
Invocation Cost = max(invocations - 2,000,000, 0) × ($0.40 / 1,000,000)

GB_seconds = invocations × (avg_duration_ms / 1000) × memory_gb
Memory Cost = max(GB_seconds - 400,000, 0) × $0.0000025

GHz_seconds = invocations × (avg_duration_ms / 1000) × cpu_ghz
CPU Cost = max(GHz_seconds - 200,000, 0) × $0.0000100

Serverless Cost = Invocation Cost + Memory Cost + CPU Cost
```

**Constraints:**
- Minimum invocations: 0
- Maximum invocations: 1,000,000,000 (1 billion)
- Average duration: 1 ms – 540,000 ms (9 minutes max, GCP Gen 1 limit)
- Memory allocation options: 128 MB, 256 MB, 512 MB, 1024 MB, 2048 MB

---

## 3. Functional Requirements

### FR-01: Conversational Chat Interface

The bot shall present a chat-style interface where the user types messages and receives structured responses.

**Acceptance Criteria:**
- The user can type natural language queries about cloud costs
- The bot responds with relevant questions to gather required inputs
- The bot recognizes component names (e.g., "compute", "VM", "storage", "database")
- Conversation history is visible and scrollable within the session

### FR-02: Guided Component Selection

The bot shall guide users through selecting cloud components step by step.

**Acceptance Criteria:**
- When a user starts a conversation, the bot greets and asks which component(s) they want to estimate
- The bot presents available tiers for the selected component
- The bot asks for required parameters (quantity, hours, volume, etc.) with clear prompts
- The bot provides default values and explains what each parameter means

### FR-03: Cost Calculation Engine

The bot shall accurately calculate costs using the pricing models defined in Section 2.

**Acceptance Criteria:**
- All five component pricing formulas produce mathematically correct results
- Bandwidth progressive tiering calculates correctly across tier boundaries
- Serverless free tier is properly subtracted before charging (invocations, memory, CPU separately)
- Results are rounded to 2 decimal places (USD cents)
- Calculation results are deterministic — same inputs always produce same output

### FR-04: Cost Breakdown Display

The bot shall present a clear, itemized cost breakdown after calculation.

**Acceptance Criteria:**
- Each component shows: component name, tier selected, input parameters, and calculated cost
- For Serverless: show invocation cost, memory cost, and CPU cost separately
- A summary section shows the total monthly cost across all selected components
- The breakdown is formatted as a readable table or structured message within the chat

### FR-05: Recalculation & Adjustment

The user shall be able to modify assumptions and recalculate without restarting.

**Acceptance Criteria:**
- The user can say "change compute to 5 instances" and the bot updates accordingly
- The user can add or remove components from the estimate
- After any modification, the bot displays an updated cost breakdown
- Previous estimates remain visible in chat history

### FR-06: Input Validation & Error Handling

The bot shall validate all user inputs and handle errors gracefully.

**Acceptance Criteria:**
- Numeric inputs outside valid ranges produce clear error messages with the valid range
- Non-numeric inputs for numeric fields are rejected with a helpful prompt
- Unknown component names trigger a list of supported components
- The bot never crashes or displays raw error traces to the user

### FR-07: Conversation Reset

The user shall be able to start a new estimation from scratch.

**Acceptance Criteria:**
- A "reset" or "start over" command clears the current estimate
- The bot confirms the reset and starts the greeting flow again
- Previous conversation remains visible above the reset point

### FR-08: Help & Information

The bot shall provide contextual help about cloud components and pricing.

**Acceptance Criteria:**
- The user can ask "what is compute?" and receive a brief explanation
- The user can ask "show pricing" for any component and see the pricing table
- A "help" command lists all available commands and usage examples

### FR-09: Flow Cancellation

The bot shall provide a way to escape from partial-input loops.

**Acceptance Criteria:**
- If the bot is asking for a parameter (e.g. hours), the user can reply "cancel" or "отмена".
- The bot abandons the current component being configured and returns to the greeting/component selection state.
- The interface prevents the user from being permanently trapped by rigid datatype validation.

---

## 4. User Scenarios & Acceptance Tests

### Scenario 1: Basic Single-Component Estimate

**Actor:** Startup Founder  
**Flow:**
1. User opens the CFO Bot
2. Bot greets: "Welcome to CFO Bot! I can help you estimate your monthly cloud costs. Which components would you like to estimate? (Compute, Storage, Bandwidth, Database, Serverless)"
3. User: "I need 3 Standard VMs running 24/7"
4. Bot parses: component=Compute, tier=Standard (e2-medium), instances=3, hours=730
5. Bot calculates: 3 × $0.034 × 730 = **$74.46**
6. Bot displays result with breakdown

**Expected Result:** Total monthly cost = $74.46

### Scenario 2: Multi-Component Estimate

**Actor:** Project Manager  
**Flow:**
1. User requests Compute: 2 Premium (e2-standard-4) instances, 730 hours
2. User adds Storage: 500 GB Standard
3. User adds Bandwidth: 100 GB egress
4. Bot calculates each component:
   - Compute: 2 × $0.134 × 730 = $195.64
   - Storage: 500 × $0.020 = $10.00
   - Bandwidth: 1 GB × $0.00 + 99 GB × $0.12 = $11.88
5. Bot displays total: **$217.52**

**Expected Result:** Itemized breakdown summing to $217.52

### Scenario 3: Bandwidth Tiered Pricing

**Actor:** CFO  
**Flow:**
1. User specifies 15,000 GB (~14.6 TB) egress
2. Bot calculates progressive tiers:
   - Tier 1 (Free): 1 GB × $0.00 = $0.00
   - Tier 2 (Standard): 1,023 GB × $0.12 = $122.76
   - Tier 3 (Bulk): 9,216 GB × $0.11 = $1,013.76
   - Tier 4 (Enterprise): 4,760 GB × $0.08 = $380.80
3. Total Bandwidth: **$1,517.32**

**Expected Result:** Progressive tiers applied correctly = $1,517.32

### Scenario 4: Serverless with Free Tier

**Actor:** Student  
**Flow:**
1. User specifies 3,000,000 invocations, 200ms avg duration, 256 MB memory
2. Bot auto-allocates CPU: 400 MHz (0.4 GHz)
3. Bot calculates:
   - **Invocations:**
     - Billable: 3,000,000 - 2,000,000 = 1,000,000
     - Cost: 1,000,000 × $0.0000004 = $0.40
   - **Memory:**
     - GB-seconds: 3,000,000 × 0.2 × 0.25 = 150,000
     - 150,000 < 400,000 free tier → Cost = $0.00
   - **CPU:**
     - GHz-seconds: 3,000,000 × 0.2 × 0.4 = 240,000
     - Billable: 240,000 - 200,000 = 40,000
     - Cost: 40,000 × $0.0000100 = $0.40
4. Total Serverless: **$0.80**

**Expected Result:** Free tier correctly deducted per dimension, total = $0.80

### Scenario 5: Input Validation

**Actor:** Any user  
**Flow:**
1. User: "I need -5 VMs" → Bot: "Number of instances must be between 1 and 100"
2. User: "I need abc VMs" → Bot: "Please enter a valid number for instances"
3. User: "Price my quantum computer" → Bot: "I support these components: Compute, Storage, Bandwidth, Database, Serverless"

**Expected Result:** All invalid inputs handled with helpful messages

### Scenario 6: Adjustment & Recalculation

**Actor:** Project Manager  
**Flow:**
1. User completes a multi-component estimate
2. User: "Change compute to 5 Premium instances"
3. Bot updates Compute: 5 × $0.134 × 730 = $489.10
4. Bot displays full updated breakdown with new total

**Expected Result:** Only the modified component changes; others remain intact

---

## 5. Non-Functional Requirements

### NFR-01: Performance
- Cost calculations shall complete in under 1 second
- The chat interface shall feel responsive — message send-to-display within 500ms
- The application shall load within 3 seconds on standard broadband

### NFR-02: Usability
- The interface shall be intuitive enough that a non-technical CFO can use it without training
- All pricing information shall be transparent — the user can see formulas used
- Mobile-responsive layout that works on screens 375px and wider

### NFR-03: Reliability
- The application shall work without a backend server (client-side calculation) for basic functionality
- Session data (current estimate and recent chat history) shall persist across page refreshes using browser `localStorage`
- The bot shall handle all edge cases without crashing

### NFR-04: Deployment
- Hosted on Google Firebase Hosting with a publicly accessible URL
- Static site deployment (no server-side rendering required)
- HTTPS enforced by default via Firebase

### NFR-05: Accessibility
- Minimum contrast ratio of 4.5:1 for all text
- Keyboard navigable — users can type and submit messages without a mouse
- Screen-reader friendly with appropriate ARIA labels on interactive elements

---

## 6. Architectural Constraints

### AC-01: Client-Side Architecture
- All cost calculation logic runs in the browser (client-side)
- No external API calls required for core functionality
- The bot's "intelligence" is rule-based pattern matching, not a live LLM call

### AC-02: Firebase Hosting
- Deployed as a static web application on Google Firebase Hosting
- No Firebase backend services (Firestore, Functions) required for MVP
- Optional: Firebase Functions for any serverless backend logic if needed

### AC-03: No External Dependencies for Core Logic
- Pricing data is embedded in the application (not fetched from external APIs)
- The application works fully offline once loaded (except for initial load)

### AC-04: Single Page Application
- The entire experience runs in a single HTML page
- No page navigation or routing required
- Chat interface is the single interaction paradigm

### AC-05: Strict Component Limitation
- The estimate supports exactly ONE configuration set per component category.
- If a user specifies a second "Compute" request, the bot strictly replaces the memory of the first.
- Complex mixed-architecture estimates (e.g., 3 frontend VMs and 2 worker VMs) are deliberately simplified out of scope for the MVP.

---

## 7. UI/UX Requirements

### UX-01: Chat Interface Layout
- Full-screen chat layout with a message area and input field at the bottom
- Bot messages appear left-aligned; user messages appear right-aligned
- Visual distinction between bot and user messages (colors, icons, or avatars)
- Auto-scroll to latest message

### UX-02: Visual Design
- Dark mode by default with a professional, finance-oriented aesthetic
- Clean typography (sans-serif font family)
- Cost figures prominently displayed with currency formatting ($X,XXX.XX)
- Color-coded cost components in breakdown (e.g., Compute=blue, Storage=green, etc.)

### UX-03: Interactive Elements
- Clickable quick-reply buttons for common actions (e.g., component selection, tier selection)
- Formatted tables for pricing tiers and cost breakdowns within chat bubbles
- Subtle animations on message appearance (fade-in or slide-up)

### UX-04: Responsive Behavior
- Desktop: Chat centered with max-width 800px
- Tablet: Full-width with appropriate padding
- Mobile: Full-width, larger touch targets for buttons

---

## 8. Key Entities

| Entity | Attributes | Description |
|--------|-----------|-------------|
| **Component** | name, type, tiers[] | A cloud service category (Compute, Storage, etc.) |
| **Tier** | name, gcpEquivalent, specs, rate | A pricing level within a component |
| **Estimate** | components[], totalCost | A collection of component cost calculations |
| **ComponentEstimate** | component, tier, inputs{}, cost | Cost calculation for a single component |
| **ChatMessage** | sender, content, timestamp, type | A message in the conversation |

---

## 9. Success Criteria

| # | Criterion | Measurement |
|---|-----------|-------------|
| SC-01 | Users can complete a single-component cost estimate in under 1 minute | Timed user test |
| SC-02 | All five pricing formulas produce mathematically correct results for 100% of test cases | Automated test suite |
| SC-03 | Users can complete a multi-component estimate with 3+ services in under 3 minutes | Timed user test |
| SC-04 | The bot handles all defined edge cases without error | Edge case test suite |
| SC-05 | The application is publicly accessible via a Firebase URL | URL reachability check |
| SC-06 | Non-technical users can use the bot without external instructions | Usability observation |
| SC-07 | Cost breakdown displays all components with correct itemization | Visual verification |
| SC-08 | The interface is usable on mobile devices (375px width) | Device/responsive test |

---

## 10. Assumptions

1. **Pricing basis**: All prices are based on GCP us-central1 region, on-demand pricing as of early 2026. They are simplified from official GCP rates for educational/estimation purposes.
2. **Single currency**: All costs are in US Dollars (USD). No currency conversion is supported.
3. **Monthly billing cycle**: All estimates are for a single calendar month (730 hours = 365.25 days / 12 × 24 hours).
4. **No discount programs**: Committed Use Discounts (CUDs), Sustained Use Discounts (SUDs), and Spot VM pricing are not modeled.
5. **Static pricing**: Pricing data is embedded in the application and does not update dynamically.
6. **Session-based with local persistence**: Each browser session uses `localStorage` to save the current estimate and chat history, preventing data loss on accidental refresh. Clearing the browser cache or explicitly using the "reset" command clears the data.
7. **English-only interface**: The bot communicates in English only.
8. **Serverless CPU auto-allocation**: CPU is automatically determined by memory selection per GCP Cloud Functions Gen 1 allocation table.
9. **Database storage simplified**: Storage rate ($0.170/GB/month) is a simplified average between GCP Cloud SQL HDD ($0.118) and SSD ($0.222) rates.

---

## 11. Dependencies

| Dependency | Type | Description |
|-----------|------|-------------|
| Google Firebase | Hosting Platform | Required for deployment (Phase 3) |
| Modern Web Browser | Runtime | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Internet Connection | Infrastructure | Required for initial page load only |

---

## 12. Glossary

| Term | Definition |
|------|-----------|
| **CFO** | Chief Financial Officer — the executive responsible for financial planning |
| **Egress** | Outbound data transfer from cloud to internet |
| **Ingress** | Inbound data transfer from internet to cloud (typically free) |
| **FaaS** | Functions as a Service — serverless compute model |
| **GB-second** | Unit of memory compute: 1 GB of memory used for 1 second |
| **GHz-second** | Unit of CPU compute: 1 GHz of CPU used for 1 second |
| **Progressive Pricing** | Tiered pricing where different rates apply to different usage ranges |
| **SSOT** | Single Source of Truth — the definitive reference document |
| **Unit Economics** | Per-unit cost analysis of cloud services |
| **SDD** | Spec-Driven Development — building software from formal specifications |
| **E2 Series** | GCP's cost-optimized VM family for general-purpose workloads |
| **Cloud SQL** | GCP's managed relational database service |
| **Cloud Functions** | GCP's serverless compute platform (FaaS) |

---

## Appendix A: Quick Reference — All Pricing Formulas

```
COMPUTE (GCP Compute Engine E2):
  cost = instances × rate_per_hour × hours_per_month

STORAGE (GCP Cloud Storage):
  cost = volume_gb × rate_per_gb_month

BANDWIDTH (GCP Network Egress, progressive):
  cost = free_tier(0–1 GB at $0.00/GB)
       + standard_tier(1–1,024 GB at $0.12/GB)
       + bulk_tier(1,024–10,240 GB at $0.11/GB)
       + enterprise_tier(10,240+ GB at $0.08/GB)

DATABASE (GCP Cloud SQL):
  cost = base_rate + (storage_gb × $0.170)

SERVERLESS (GCP Cloud Functions Gen 1):
  invocation_cost = max(invocations - 2,000,000, 0) × $0.0000004
  gb_seconds      = invocations × (duration_ms / 1000) × memory_gb
  memory_cost     = max(gb_seconds - 400,000, 0) × $0.0000025
  ghz_seconds     = invocations × (duration_ms / 1000) × cpu_ghz
  cpu_cost        = max(ghz_seconds - 200,000, 0) × $0.0000100
  cost            = invocation_cost + memory_cost + cpu_cost

  CPU Auto-Allocation:
    128 MB → 0.2 GHz | 256 MB → 0.4 GHz | 512 MB → 0.8 GHz
    1024 MB → 1.4 GHz | 2048 MB → 2.4 GHz
```
