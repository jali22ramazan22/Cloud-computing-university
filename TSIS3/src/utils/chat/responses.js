export const RESPONSES = {
  welcome: [
    `👋 Welcome to **CFO Bot**! I estimate monthly cloud costs for GCP.`,
    `I can give you estimates on 5 core cloud components.`,
    `Which component would you like to price out? (You can say "Compute", "Storage", "Database", "Bandwidth", or "Serverless")`
  ],
  help: [
    `Here's what I can estimate for you:
• **Compute**: VMs (E2 instances)
• **Storage**: Cloud Storage buckets
• **Bandwidth**: Network Egress
• **Database**: Cloud SQL
• **Serverless**: Cloud Functions Gen 1`,
    `You can type "add compute", "show pricing for storage", "reset", or "cancel" at any time.`
  ],
  componentPrompt: (component) => `Great, let's configure your **${component}**.`,
  tierPrompt: (tiers) => `What tier would you like? Available options: ${tiers.join(', ')}`,
  numberPrompt: (paramName) => `Please enter the number of **${paramName}**:`,
  invalidInput: (errorMsg) => `⚠️ ${errorMsg}. Please try again (or type "cancel" to abort).`,
  added: (component, cost) => `✅ Added **${component}** to your estimate ($${cost.toFixed(2)}/mo).`,
  cleared: "🗑️ Estimate cleared! Starting fresh.",
  cancelled: "🚫 Cancelled component configuration. Back to the main menu:",
  unknown: "I didn't quite catch that. Type **help** to see what I can do."
};
