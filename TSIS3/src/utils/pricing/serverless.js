import { 
  SERVERLESS_RATES, 
  SERVERLESS_FREE_TIERS, 
  SERVERLESS_CPU_MAP 
} from './data.js';
import { validateInputs } from './validate.js';

export function serverlessCost(params) {
  const { invocations, durationMs, memoryMb } = params;
  
  const validation = validateInputs('serverless', { invocations, durationMs, memoryMb });
  if (!validation.valid) throw new Error(validation.error);
  
  // 1. Invocation Cost
  const billableInvocations = Math.max(0, invocations - SERVERLESS_FREE_TIERS.invocations);
  const invocationCost = billableInvocations * SERVERLESS_RATES.invocation;

  // 2. Memory Cost
  const memoryGb = memoryMb / 1024;
  const executionSecs = durationMs / 1000;
  
  const totalGbSeconds = invocations * memoryGb * executionSecs;
  const billableGbSeconds = Math.max(0, totalGbSeconds - SERVERLESS_FREE_TIERS.memoryGbSec);
  const memoryCost = billableGbSeconds * SERVERLESS_RATES.memoryGbSec;

  // 3. CPU Cost
  const cpuGhz = SERVERLESS_CPU_MAP[memoryMb];
  if (cpuGhz === undefined) {
    throw new Error(`Unknown CPU allocation for memory: ${memoryMb}`);
  }

  const totalGhzSeconds = invocations * cpuGhz * executionSecs;
  const billableGhzSeconds = Math.max(0, totalGhzSeconds - SERVERLESS_FREE_TIERS.cpuGhzSec);
  const cpuCost = billableGhzSeconds * SERVERLESS_RATES.cpuGhzSec;

  const totalCost = Number((invocationCost + memoryCost + cpuCost).toFixed(2));

  return {
    cost: totalCost,
    invocationCost: Number(invocationCost.toFixed(2)),
    memoryCost: Number(memoryCost.toFixed(2)),
    cpuCost: Number(cpuCost.toFixed(2)),
    allocatedCpuGhz: cpuGhz,
    usage: {
      gbSeconds: Number(totalGbSeconds.toFixed(2)),
      ghzSeconds: Number(totalGhzSeconds.toFixed(2))
    },
    freeTier: SERVERLESS_FREE_TIERS
  };
}
