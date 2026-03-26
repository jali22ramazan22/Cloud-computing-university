import { COMPUTE_TIERS } from './data.js';
import { validateInputs } from './validate.js';

/**
 * Calculate cost for Compute Engine instance
 * @param {Object} params { instances, tier, hours }
 */
export function computeCost(params) {
  const { instances, tier, hours } = params;
  
  const validation = validateInputs('compute', { instances, hours });
  if (!validation.valid) throw new Error(validation.error);
  
  const tierData = COMPUTE_TIERS[tier];
  if (!tierData) throw new Error(`Unknown compute tier: ${tier}`);

  // Need to round to 2 decimals as per output requirements
  const cost = Number((instances * tierData.rate * hours).toFixed(2));
  
  return {
    cost,
    formula: `${instances} x $${tierData.rate.toFixed(3)} x ${hours} hours`,
    breakdown: { rate: tierData.rate, hours, instances }
  };
}
