/**
 * CFO Bot Pricing Constants
 * Derived from spec.md (SSOT)
 */

export const COMPUTE_TIERS = {
  "Basic": { gcpName: "e2-micro", vCPUs: "Shared", ramGb: 1, rate: 0.008 },
  "Standard": { gcpName: "e2-medium", vCPUs: 1, ramGb: 4, rate: 0.034 },
  "Premium": { gcpName: "e2-standard-4", vCPUs: 4, ramGb: 16, rate: 0.134 },
  "High-Performance": { gcpName: "e2-standard-8", vCPUs: 8, ramGb: 32, rate: 0.268 }
};

export const STORAGE_TIERS = {
  "Standard": { rate: 0.020 },
  "Nearline": { rate: 0.010 },
  "Coldline": { rate: 0.004 },
  "Archive": { rate: 0.0012 }
};

// Tiered bandwidth: maxGb is the limit for that tier, rate is per GB
export const BANDWIDTH_TIERS = [
  { name: "Free", maxGb: 1, rate: 0.00 },
  { name: "Standard", maxGb: 1024, rate: 0.12 },
  { name: "Bulk", maxGb: 10240, rate: 0.11 },
  { name: "Enterprise", maxGb: Infinity, rate: 0.08 }
];

export const DATABASE_TIERS = {
  "Micro": { baseRate: 13.00 },
  "Small": { baseRate: 70.00 },
  "Medium": { baseRate: 140.00 },
  "Large": { baseRate: 280.00 },
  "XLarge": { baseRate: 560.00 }
};

export const DB_STORAGE_RATE = 0.170;

export const SERVERLESS_RATES = {
  invocation: 0.40 / 1000000, 
  memoryGbSec: 0.0000025,
  cpuGhzSec: 0.0000100
};

export const SERVERLESS_FREE_TIERS = {
  invocations: 2000000,
  memoryGbSec: 400000,
  cpuGhzSec: 200000
};

export const SERVERLESS_CPU_MAP = {
  128: 0.2, // 200 MHz
  256: 0.4,
  512: 0.8,
  1024: 1.4,
  2048: 2.4
};

// Constraints for validation
export const CONSTRAINTS = {
  compute: {
    instances: { min: 1, max: 100, type: 'integer' },
    hours: { min: 1, max: 730, type: 'integer' }
  },
  storage: {
    volumeGb: { min: 1, max: 1000000, type: 'float' }
  },
  bandwidth: {
    egressGb: { min: 0, max: 500000, type: 'float' }
  },
  database: {
    storageGb: { min: 10, max: 10000, type: 'float' }
  },
  serverless: {
    invocations: { min: 0, max: 1000000000, type: 'integer' },
    durationMs: { min: 1, max: 540000, type: 'integer' },
    memoryMb: { validValues: [128, 256, 512, 1024, 2048], type: 'enum' }
  }
};
