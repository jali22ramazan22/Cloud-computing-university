# Test Specification: CFO Bot Pricing Engine

**Date**: 2026-03-26  
**Feature**: CFO Bot Cloud Cost Calculator  
**Source**: SSOT (spec.md) Section 2 Pricing Models

This specification outlines the minimum test cases required for each pricing function within the calculator engine. Every function is tested against three scenarios: a **normal** day-to-day input, an **edge/zero** case, and a **large/maximum** bounds case.

---

## 1. Compute Cost `computeCost(params)`

**Formula**: `instances × rate_per_hour × hours_per_month`
**Rates**: Basic ($0.008), Standard ($0.034), Premium ($0.134), High-Performance ($0.268)

| Test Case | Description | Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **TC-COMPUTE-1** | Normal Input | `{ instances: 3, tier: "Standard", hours: 730 }` | `{ cost: 74.46 }` |
| **TC-COMPUTE-2** | Edge Case (Minimums) | `{ instances: 1, tier: "Basic", hours: 1 }` | `{ cost: 0.01 }` *(rounded from 0.008)* |
| **TC-COMPUTE-3** | Large Numbers (Max) | `{ instances: 100, tier: "High-Performance", hours: 730 }` | `{ cost: 19564.00 }` |

---

## 2. Storage Cost `storageCost(params)`

**Formula**: `volume_gb × rate_per_gb_month`
**Rates**: Standard ($0.020), Nearline ($0.010), Coldline ($0.004), Archive ($0.0012)

| Test Case | Description | Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **TC-STORAGE-1** | Normal Input | `{ volumeGb: 500, tier: "Standard" }` | `{ cost: 10.00 }` |
| **TC-STORAGE-2** | Edge Case (Minimum volume, cheapest tier) | `{ volumeGb: 1, tier: "Archive" }` | `{ cost: 0.00 }` *(rounds from 0.0012)* |
| **TC-STORAGE-3** | Large Numbers (Max) | `{ volumeGb: 1000000, tier: "Standard" }` | `{ cost: 20000.00 }` |

---

## 3. Bandwidth Cost `bandwidthCost(params)`

**Formula**: Progressive tiers. Tier 1 (0-1 GB) at $0.00, Tier 2 (1-1024 GB) at $0.12, Tier 3 (1024-10240 GB) at $0.11, Tier 4 (10240+ GB) at $0.08

| Test Case | Description | Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **TC-BANDWIDTH-1** | Normal Input (Standard Tier) | `{ egressGb: 100 }` | `{ cost: 11.88 }` *(99 × 0.12)* |
| **TC-BANDWIDTH-2** | Edge Case (Free Tier / Zero) | `{ egressGb: 0.5 }` | `{ cost: 0.00 }` |
| **TC-BANDWIDTH-3** | Large Numbers (All Tiers) | `{ egressGb: 15000 }` | `{ cost: 1517.32 }` |

*Calculation for TC-BANDWIDTH-3: (1 × $0) + (1023 × $0.12) + (9216 × $0.11) + (4760 × $0.08) = $0 + $122.76 + $1013.76 + $380.80 = $1517.32*

---

## 4. Database Cost `databaseCost(params)`

**Formula**: `base_rate + (storage_gb × 0.170)`
**Base Rates**: Micro ($13.00), Small ($70.00), Medium ($140.00), Large ($280.00), XLarge ($560.00)

| Test Case | Description | Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **TC-DATABASE-1** | Normal Input | `{ tier: "Small", storageGb: 100 }` | `{ cost: 87.00 }` *(70 + 17)*|
| **TC-DATABASE-2** | Edge Case (Min storage, lowest tier) | `{ tier: "Micro", storageGb: 10 }` | `{ cost: 14.70 }` *(13 + 1.7)*|
| **TC-DATABASE-3** | Large Numbers (Max storage, highest tier)| `{ tier: "XLarge", storageGb: 10000 }` | `{ cost: 2260.00 }` *(560 + 1700)*|

---

## 5. Serverless Cost `serverlessCost(params)`

**Formula**: `Invocation Cost + Memory Cost + CPU Cost` (with free tier deductions)
*Invocations*: 2M free, then $0.40/1M. 
*Memory*: 400,000 GB-sec free, then $0.0000025 per GB-sec.
*CPU*: 200,000 GHz-sec free, then $0.0000100 per GHz-sec. (Mapped automatically by memory).

| Test Case | Description | Input | Expected Output |
| :--- | :--- | :--- | :--- |
| **TC-SERVERLESS-1** | Normal Input | `{ invocations: 3000000, durationMs: 200, memoryMb: 256 }` | `{ cost: 0.80 }` |
| **TC-SERVERLESS-2** | Edge Case (Inside Free Tier) | `{ invocations: 2000000, durationMs: 100, memoryMb: 128 }` | `{ cost: 0.00 }` |
| **TC-SERVERLESS-3** | Large Numbers | `{ invocations: 100000000, durationMs: 500, memoryMb: 1024 }` | `{ cost: 861.20 }` |

*Calculation for TC-SERVERLESS-3:*
- *Invocations: 98,000,000 billable × $0.0000004 = $39.20*
- *Memory (1024MB = 1GB): 50,000,000 GB-sec total. 49,600,000 billable × $0.0000025 = $124.00*
- *CPU (1024MB maps to 1.4 GHz): 70,000,000 GHz-sec total. 69,800,000 billable × $0.0000100 = $698.00*
- *Total = 39.20 + 124.00 + 698.00 = 861.20*
