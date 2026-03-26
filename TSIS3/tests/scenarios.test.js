import { describe, test, expect } from 'vitest';
import { calculateComponent } from '../src/utils/pricing/index.js';

describe('CFO Bot E2E Scenarios (from spec.md)', () => {
  
  test('Scenario 1: Single Component Estimate (Compute)', () => {
    // 3 Standard VMs running 24/7 (730 hours)
    const result = calculateComponent('compute', { instances: 3, tier: 'Standard', hours: 730 });
    expect(result.cost).toBe(74.46); // 3 * 0.034 * 730 = 74.46
  });

  test('Scenario 2: Multi-Component Architecture', () => {
    // 5 Premium compute, 730 hours -> 489.10
    const compute = calculateComponent('compute', { instances: 5, tier: 'Premium', hours: 730 });
    // Database Large + 500GB -> 280 + 85 = 365.00
    const db = calculateComponent('database', { tier: 'Large', storageGb: 500 });
    // Storage Standard 1000GB -> 20.00
    const storage = calculateComponent('storage', { tier: 'Standard', volumeGb: 1000 });
    // Bandwidth 1000GB -> 120.00 (Free 1GB ignored in this simplified scenario, or wait 999 * 0.12 = 119.88)
    const bandwidth = calculateComponent('bandwidth', { egressGb: 1000 });
    
    expect(compute.cost).toBe(489.10);
    expect(db.cost).toBe(365.00);
    expect(storage.cost).toBe(20.00);
    expect(bandwidth.cost).toBe(119.88);
    
    const total = compute.cost + db.cost + storage.cost + bandwidth.cost;
    expect(total).toBe(993.98); // Matches the sum of the components
  });

  test('Scenario 3: Progressive Bandwidth Transfer (15TB)', () => {
    // 15,000 GB transferred
    const result = calculateComponent('bandwidth', { egressGb: 15000 });
    expect(result.cost).toBe(1517.32);
    // Breakdown validation
    expect(result.tiers.length).toBe(4);
    expect(result.tiers[0].name).toBe('Free');
    expect(result.tiers[1].name).toBe('Standard');
    expect(result.tiers[2].name).toBe('Bulk');
    expect(result.tiers[3].name).toBe('Enterprise');
  });

  test('Scenario 4: Serverless Free Tier Deduction', () => {
    // 3 million invocations, 200ms per, 256MB memory
    const result = calculateComponent('serverless', { invocations: 3000000, durationMs: 200, memoryMb: 256 });
    expect(result.cost).toBe(0.80);
    expect(result.invocationCost).toBe(0.40);
    expect(result.memoryCost).toBe(0.00); // under 400k GB-s
    expect(result.cpuCost).toBe(0.40); // over 200k GHz-s limit
  });

  test('Scenario 5: Constraint Validation Rejection', () => {
    // Invalid instances: -5
    expect(() => calculateComponent('compute', { instances: -5, tier: 'Basic', hours: 1 })).toThrow();
    // Invalid parameter: missing tier
    expect(() => calculateComponent('compute', { instances: 1, hours: 1 })).toThrow();
  });
});
