const COMPONENTS = {
  compute: /compute|vm|server|instance/i,
  storage: /storage|disk|bucket|gb/i,
  bandwidth: /bandwidth|egress|transfer|network/i,
  database: /database|db|sql/i,
  serverless: /serverless|function|faas/i
};

const ACTIONS = {
  help: /help|what is|how to/i,
  reset: /reset|clear|start over|restart/i,
  show_pricing: /show|pricing|price|rates/i,
  modify: /change|update|modify|instead/i,
  remove: /remove|delete|drop/i,
  show_breakdown: /summary|total|breakdown|estimate/i,
  cancel: /cancel|отмена|stop|abort/i
};

export function parseUserMessage(message) {
  const msg = message.toLowerCase().trim();
  if (!msg) return { action: "unknown" };

  for (const [actionName, regex] of Object.entries(ACTIONS)) {
    if (regex.test(msg)) {
      const intent = { action: actionName };
      if (actionName === 'show_pricing') {
         const comp = detectComponent(msg);
         if (comp) intent.component = comp;
      }
      return intent;
    }
  }

  const componentMatch = detectComponent(msg);
  if (componentMatch) {
    if (/add|need|want|give|create/.test(msg) || msg === componentMatch || msg.split(' ').length <= 2) {
      return { action: "select_component", component: componentMatch };
    }
  }

  const numberMatch = msg.match(/\d+(\.\d+)?/);
  if (numberMatch || typeof detectTier(msg) === 'string') {
     const intent = { action: "provide_input", raw: msg };
     if (numberMatch) intent.params = { number: parseFloat(numberMatch[0]) };
     const tier = detectTier(msg);
     if (tier) intent.tier = tier;
     return intent;
  }

  return { action: "unknown" };
}

function detectComponent(msg) {
  for (const [comp, regex] of Object.entries(COMPONENTS)) {
    if (regex.test(msg)) return comp;
  }
  return null;
}

function detectTier(msg) {
  if (/basic|micro/i.test(msg)) return /micro/i.test(msg) ? 'Micro' : 'Basic';
  if (/standard/i.test(msg)) return 'Standard';
  if (/premium/i.test(msg)) return 'Premium';
  if (/high-performance/i.test(msg)) return 'High-Performance';
  if (/nearline/i.test(msg)) return 'Nearline';
  if (/coldline/i.test(msg)) return 'Coldline';
  if (/archive/i.test(msg)) return 'Archive';
  if (/small/i.test(msg)) return 'Small';
  if (/medium/i.test(msg)) return 'Medium';
  if (/xlarge/i.test(msg)) return 'XLarge';
  if (/large/i.test(msg)) return 'Large';
  return null;
}
