import { DATABASE_TIERS, DB_STORAGE_RATE } from './data.js';
import { validateInputs } from './validate.js';

export function databaseCost(params) {
  const { tier, storageGb } = params;
  
  const validation = validateInputs('database', { storageGb });
  if (!validation.valid) throw new Error(validation.error);
  
  const tierData = DATABASE_TIERS[tier];
  if (!tierData) throw new Error(`Unknown database tier: ${tier}`);

  const baseCost = tierData.baseRate;
  const storageCost = Number((storageGb * DB_STORAGE_RATE).toFixed(2));
  const totalCost = Number((baseCost + storageCost).toFixed(2));
  
  return {
    cost: totalCost,
    formula: `$${baseCost.toFixed(2)} + (${storageGb} GB x $${DB_STORAGE_RATE.toFixed(3)})`,
    baseCost,
    storageCost
  };
}
