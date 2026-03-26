import { CONSTRAINTS } from './data.js';

/**
 * Validates numeric and enum inputs based on constraints.
 * @param {string} component - The component name (compute, storage, etc.)
 * @param {Object} inputs - Key value pairs of inputs to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateInputs(component, inputs) {
  const rules = CONSTRAINTS[component];
  if (!rules) return { valid: false, error: `Unknown component: ${component}` };

  for (const [key, value] of Object.entries(inputs)) {
    const rule = rules[key];
    if (!rule) continue; // Ignore extra fields like 'tier' (handled separately)
    
    // Type check
    if (typeof value !== 'number' || isNaN(value)) {
      return { valid: false, error: `${key} must be a valid number` };
    }

    if (rule.type === 'integer' && !Number.isInteger(value)) {
      return { valid: false, error: `${key} must be a whole number` };
    }

    // Value checks
    if (rule.type === 'enum') {
      if (!rule.validValues.includes(value)) {
        return { valid: false, error: `${key} must be one of: ${rule.validValues.join(', ')}` };
      }
    } else {
      if (value < rule.min || value > rule.max) {
        return { valid: false, error: `${key} must be between ${rule.min} and ${rule.max}` };
      }
    }
  }

  return { valid: true };
}
