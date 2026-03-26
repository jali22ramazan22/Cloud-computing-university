import { STORAGE_TIERS } from './data.js';
import { validateInputs } from './validate.js';

export function storageCost(params) {
  const { volumeGb, tier } = params;
  
  const validation = validateInputs('storage', { volumeGb });
  if (!validation.valid) throw new Error(validation.error);
  
  const tierData = STORAGE_TIERS[tier];
  if (!tierData) throw new Error(`Unknown storage tier: ${tier}`);

  const cost = Number((volumeGb * tierData.rate).toFixed(2));
  
  return {
    cost,
    formula: `${volumeGb} GB x $${tierData.rate.toFixed(4)}`
  };
}
