import { BANDWIDTH_TIERS } from './data.js';
import { validateInputs } from './validate.js';

export function bandwidthCost(params) {
  const { egressGb } = params;
  
  const validation = validateInputs('bandwidth', { egressGb });
  if (!validation.valid) throw new Error(validation.error);
  
  let remaining = egressGb;
  let totalCost = 0;
  const tiersBreakdown = [];
  let prevCap = 0;

  for (const tier of BANDWIDTH_TIERS) {
    if (remaining <= 0) break;

    const tierSize = tier.maxGb - prevCap;
    const gbInTier = Math.min(remaining, tierSize);
    const costInTier = gbInTier * tier.rate;

    totalCost += costInTier;
    remaining -= gbInTier;
    
    tiersBreakdown.push({
      name: tier.name,
      gb: Number(gbInTier.toFixed(2)),
      rate: tier.rate,
      cost: Number(costInTier.toFixed(2))
    });

    prevCap = tier.maxGb;
  }
  
  return {
    cost: Number(totalCost.toFixed(2)),
    formula: "Progressive tiered pricing",
    tiers: tiersBreakdown
  };
}
