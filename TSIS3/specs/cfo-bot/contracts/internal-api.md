# API Contracts: CFO Bot

**Date**: 2026-03-26  
**Feature**: CFO Bot (Cloud Cost Calculator)  
**Architecture**: Client-side only (no REST API)

---

## Overview

Since CFO Bot is a **fully client-side application** (AC-01), there are no HTTP API endpoints. Instead, this document defines the **internal JavaScript function contracts** — the interfaces between modules.

All functions are **pure** (no side effects) and **synchronous** (calculations are instant).

---

## Calculation Module Contracts

### computeCost(params) → Result

**Source**: FR-03, Section 2.1

```javascript
/**
 * Calculate monthly cost for GCP Compute Engine E2 instances.
 *
 * @param {Object} params
 * @param {number} params.instances  - Number of VM instances (1–100, integer)
 * @param {string} params.tier       - One of: "Basic", "Standard", "Premium", "High-Performance"
 * @param {number} params.hours      - Hours per month (1–730, integer)
 *
 * @returns {Object} result
 * @returns {number} result.cost        - Monthly cost in USD, rounded to 2 decimals
 * @returns {string} result.formula     - Human-readable formula string
 * @returns {Object} result.breakdown   - Detailed breakdown
 *
 * @throws {ValidationError} If inputs are out of range or invalid type
 *
 * @example
 * computeCost({ instances: 3, tier: "Standard", hours: 730 })
 * // → { cost: 74.46, formula: "3 × $0.034 × 730", breakdown: { rate: 0.034, ... } }
 */
```

### storageCost(params) → Result

**Source**: FR-03, Section 2.2

```javascript
/**
 * Calculate monthly cost for GCP Cloud Storage.
 *
 * @param {Object} params
 * @param {number} params.volumeGb   - Storage volume in GB (1–1,000,000, float)
 * @param {string} params.tier       - One of: "Standard", "Nearline", "Coldline", "Archive"
 *
 * @returns {Object} result
 * @returns {number} result.cost        - Monthly cost in USD, rounded to 2 decimals
 * @returns {string} result.formula     - Human-readable formula string
 *
 * @throws {ValidationError} If inputs are out of range
 *
 * @example
 * storageCost({ volumeGb: 500, tier: "Standard" })
 * // → { cost: 10.00, formula: "500 × $0.020" }
 */
```

### bandwidthCost(params) → Result

**Source**: FR-03, Section 2.3

```javascript
/**
 * Calculate monthly cost for GCP Network Egress (progressive tiered pricing).
 *
 * @param {Object} params
 * @param {number} params.egressGb   - Outbound data transfer in GB (0–500,000, float)
 *
 * @returns {Object} result
 * @returns {number} result.cost        - Monthly cost in USD, rounded to 2 decimals
 * @returns {string} result.formula     - Human-readable formula string
 * @returns {Array}  result.tiers       - Per-tier breakdown
 * @returns {string} result.tiers[].name     - Tier name
 * @returns {number} result.tiers[].gb       - GB in this tier
 * @returns {number} result.tiers[].rate     - Rate for this tier
 * @returns {number} result.tiers[].cost     - Cost for this tier
 *
 * @throws {ValidationError} If egressGb is negative or exceeds max
 *
 * @example
 * bandwidthCost({ egressGb: 15000 })
 * // → {
 * //     cost: 1517.32,
 * //     tiers: [
 * //       { name: "Free", gb: 1, rate: 0.00, cost: 0.00 },
 * //       { name: "Standard", gb: 1023, rate: 0.12, cost: 122.76 },
 * //       { name: "Bulk", gb: 9216, rate: 0.11, cost: 1013.76 },
 * //       { name: "Enterprise", gb: 4760, rate: 0.08, cost: 380.80 }
 * //     ]
 * //   }
 */
```

### databaseCost(params) → Result

**Source**: FR-03, Section 2.4

```javascript
/**
 * Calculate monthly cost for GCP Cloud SQL.
 *
 * @param {Object} params
 * @param {string} params.tier       - One of: "Micro", "Small", "Medium", "Large", "XLarge"
 * @param {number} params.storageGb  - Storage volume in GB (10–10,000, float)
 *
 * @returns {Object} result
 * @returns {number} result.cost           - Total monthly cost in USD, rounded to 2 decimals
 * @returns {string} result.formula        - Human-readable formula string
 * @returns {number} result.baseCost       - Instance base rate
 * @returns {number} result.storageCost    - Storage cost component
 *
 * @throws {ValidationError} If inputs are out of range
 *
 * @example
 * databaseCost({ tier: "Small", storageGb: 100 })
 * // → { cost: 87.00, formula: "$70.00 + (100 × $0.170)", baseCost: 70.00, storageCost: 17.00 }
 */
```

### serverlessCost(params) → Result

**Source**: FR-03, Section 2.5

```javascript
/**
 * Calculate monthly cost for GCP Cloud Functions Gen 1.
 * CPU is auto-allocated based on memory selection.
 *
 * @param {Object} params
 * @param {number} params.invocations  - Monthly invocations (0–1,000,000,000, integer)
 * @param {number} params.durationMs   - Average execution duration in ms (1–540,000)
 * @param {number} params.memoryMb     - Memory allocation: 128 | 256 | 512 | 1024 | 2048
 *
 * @returns {Object} result
 * @returns {number} result.cost              - Total monthly cost in USD, rounded to 2 decimals
 * @returns {number} result.invocationCost    - Invocation charges
 * @returns {number} result.memoryCost        - Memory (GB-second) charges
 * @returns {number} result.cpuCost           - CPU (GHz-second) charges
 * @returns {number} result.allocatedCpuGhz   - Auto-allocated CPU in GHz
 * @returns {Object} result.usage             - Raw usage numbers
 * @returns {number} result.usage.gbSeconds   - Total GB-seconds
 * @returns {number} result.usage.ghzSeconds  - Total GHz-seconds
 * @returns {Object} result.freeTier          - Free tier deductions
 *
 * @throws {ValidationError} If inputs are out of range
 *
 * @example
 * serverlessCost({ invocations: 3000000, durationMs: 200, memoryMb: 256 })
 * // → {
 * //     cost: 0.80,
 * //     invocationCost: 0.40,
 * //     memoryCost: 0.00,
 * //     cpuCost: 0.40,
 * //     allocatedCpuGhz: 0.4,
 * //     usage: { gbSeconds: 150000, ghzSeconds: 240000 },
 * //     freeTier: { invocations: 2000000, gbSeconds: 400000, ghzSeconds: 200000 }
 * //   }
 */
```

---

## Chat Parser Contract

### parseUserMessage(message) → Intent

**Source**: FR-01, FR-02, FR-06

```javascript
/**
 * Parse natural language user input into a structured intent.
 *
 * @param {string} message - Raw user input text
 *
 * @returns {Object} intent
 * @returns {string} intent.action      - Detected action type
 * @returns {string} [intent.component] - Detected component (if applicable)
 * @returns {string} [intent.tier]      - Detected tier (if applicable)
 * @returns {Object} [intent.params]    - Extracted numeric parameters
 *
 * Possible actions:
 *   "select_component"  - User wants to estimate a component
 *   "provide_input"     - User provides a parameter value
 *   "modify"            - User wants to change an existing estimate
 *   "remove"            - User wants to remove a component
 *   "help"              - User asks for help
 *   "show_pricing"      - User wants to see pricing tables
 *   "reset"             - User wants to start over
 *   "show_breakdown"    - User wants to see current estimate
 *   "unknown"           - Input not recognized
 *
 * @example
 * parseUserMessage("I need 3 Standard VMs running 24/7")
 * // → {
 * //     action: "select_component",
 * //     component: "compute",
 * //     tier: "Standard",
 * //     params: { instances: 3, hours: 730 }
 * //   }
 *
 * parseUserMessage("help")
 * // → { action: "help" }
 *
 * parseUserMessage("change compute to 5 instances")
 * // → { action: "modify", component: "compute", params: { instances: 5 } }
 */
```

---

## Estimate Manager Contract

### EstimateManager

**Source**: FR-04, FR-05, FR-07

```javascript
/**
 * Manages the current cost estimate state.
 *
 * Methods:
 *
 * addComponent(type, tier, inputs) → ComponentEstimate
 *   Calculates and adds a component to the estimate.
 *   If same component type exists, replaces it.
 *
 * removeComponent(type) → boolean
 *   Removes a component from the estimate. Returns true if found.
 *
 * updateComponent(type, newInputs) → ComponentEstimate
 *   Updates inputs for an existing component and recalculates.
 *
 * getBreakdown() → { components: ComponentEstimate[], totalCost: number }
 *   Returns full itemized breakdown with total.
 *
 * reset() → void
 *   Clears all components and resets the estimate.
 *
 * hasComponents() → boolean
 *   Returns true if at least one component exists.
 */
```

---

## Formatting Contract

### formatCurrency(amount) → string

```javascript
/**
 * Format a number as USD currency string.
 *
 * @param {number} amount - Dollar amount
 * @returns {string} Formatted string with $ sign and 2 decimal places
 *
 * @example
 * formatCurrency(1517.32)  // → "$1,517.32"
 * formatCurrency(0.80)     // → "$0.80"
 * formatCurrency(0)        // → "$0.00"
 */
```

### formatBreakdownTable(estimate) → string

```javascript
/**
 * Generate an HTML table string for the cost breakdown.
 *
 * @param {Object} estimate - Estimate object from EstimateManager.getBreakdown()
 * @returns {string} HTML table string for rendering in a chat message
 *
 * Table columns: Component | Tier | Key Parameters | Monthly Cost
 * Footer row: Total | — | — | $X,XXX.XX
 */
```
