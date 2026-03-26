import { describe, it, expect } from 'vitest';
import { computeCost } from '../src/utils/pricing/compute.js';
import { storageCost } from '../src/utils/pricing/storage.js';
import { bandwidthCost } from '../src/utils/pricing/bandwidth.js';
import { databaseCost } from '../src/utils/pricing/database.js';
import { serverlessCost } from '../src/utils/pricing/serverless.js';

describe('CFO Bot Pricing Engine', () => {

  describe('computeCost', () => {
    it('should calculate normal input correctly (TC-COMPUTE-1)', () => {
      const result = computeCost({ instances: 3, tier: 'Standard', hours: 730 });
      expect(result).toMatchObject({ cost: 74.46 });
    });

    it('should handle edge case minimums (TC-COMPUTE-2)', () => {
      const result = computeCost({ instances: 1, tier: 'Basic', hours: 1 });
      expect(result).toMatchObject({ cost: 0.01 }); 
    });

    it('should handle large maximum bounds (TC-COMPUTE-3)', () => {
      const result = computeCost({ instances: 100, tier: 'High-Performance', hours: 730 });
      expect(result).toMatchObject({ cost: 19564.00 });
    });
  });

  describe('storageCost', () => {
    it('should calculate normal input correctly (TC-STORAGE-1)', () => {
      const result = storageCost({ volumeGb: 500, tier: 'Standard' });
      expect(result).toMatchObject({ cost: 10.00 });
    });

    it('should handle edge case minimum volume / cheapest tier (TC-STORAGE-2)', () => {
      const result = storageCost({ volumeGb: 1, tier: 'Archive' });
      expect(result).toMatchObject({ cost: 0.00 }); 
    });

    it('should handle large maximum bounds (TC-STORAGE-3)', () => {
      const result = storageCost({ volumeGb: 1000000, tier: 'Standard' });
      expect(result).toMatchObject({ cost: 20000.00 });
    });
  });

  describe('bandwidthCost', () => {
    it('should calculate normal input in the standard tier correctly (TC-BANDWIDTH-1)', () => {
      const result = bandwidthCost({ egressGb: 100 });
      expect(result).toMatchObject({ cost: 11.88 }); 
    });

    it('should handle edge case free tier (TC-BANDWIDTH-2)', () => {
      const result = bandwidthCost({ egressGb: 0.5 });
      expect(result).toMatchObject({ cost: 0.00 });
    });

    it('should handle cross-tier progressive large numbers (TC-BANDWIDTH-3)', () => {
      const result = bandwidthCost({ egressGb: 15000 });
      expect(result).toMatchObject({ cost: 1517.32 }); 
    });
  });

  describe('databaseCost', () => {
    it('should calculate normal input correctly (TC-DATABASE-1)', () => {
      const result = databaseCost({ tier: 'Small', storageGb: 100 });
      expect(result).toMatchObject({ cost: 87.00 }); 
    });

    it('should handle edge case minimal storage and tier (TC-DATABASE-2)', () => {
      const result = databaseCost({ tier: 'Micro', storageGb: 10 });
      expect(result).toMatchObject({ cost: 14.70 });
    });

    it('should handle large maximum bounds (TC-DATABASE-3)', () => {
      const result = databaseCost({ tier: 'XLarge', storageGb: 10000 });
      expect(result).toMatchObject({ cost: 2260.00 }); 
    });
  });

  describe('serverlessCost', () => {
    it('should calculate normal input correctly (TC-SERVERLESS-1)', () => {
      const result = serverlessCost({ invocations: 3000000, durationMs: 200, memoryMb: 256 });
      expect(result).toMatchObject({ cost: 0.80 }); 
    });

    it('should handle edge case inside all free tiers (TC-SERVERLESS-2)', () => {
      const result = serverlessCost({ invocations: 2000000, durationMs: 100, memoryMb: 128 });
      expect(result).toMatchObject({ cost: 0.00 });
    });

    it('should handle large inputs spanning across all limits (TC-SERVERLESS-3)', () => {
      const result = serverlessCost({ invocations: 100000000, durationMs: 500, memoryMb: 1024 });
      expect(result).toMatchObject({ cost: 861.20 }); 
    });
  });
});
