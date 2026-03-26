import { computeCost } from './compute.js';
import { storageCost } from './storage.js';
import { bandwidthCost } from './bandwidth.js';
import { databaseCost } from './database.js';
import { serverlessCost } from './serverless.js';

export const CALCULATORS = {
  compute: computeCost,
  storage: storageCost,
  bandwidth: bandwidthCost,
  database: databaseCost,
  serverless: serverlessCost
};

/**
 * Main entry point for all component calculations
 * @param {string} component - The type of component (compute, storage, etc)
 * @param {Object} params - The user inputs to calculate against
 * @returns {Object} Total cost and formula properties
 */
export function calculateComponent(component, params) {
  const calculator = CALCULATORS[component];
  if (!calculator) {
    throw new Error(`Calculator for component '${component}' not found.`);
  }
  return calculator(params);
}
