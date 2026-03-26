# Quickstart: CFO Bot Development

**Feature**: CFO Bot (Cloud Cost Calculator)  
**Tech Stack**: HTML + CSS + Vanilla JavaScript  
**Deployment**: Google Firebase Hosting

---

## Prerequisites

- Node.js 18+ (for Firebase CLI)
- Google account (for Firebase project)
- Modern browser (Chrome 90+ recommended)

## Local Development

```bash
# 1. Navigate to project root
cd TSIS3/

# 2. No build step needed — just serve the public/ directory
# Option A: Python (if available)
python3 -m http.server 8080 --directory public/

# Option B: Node.js
npx serve public/

# Option C: VS Code Live Server extension
# Right-click public/index.html → "Open with Live Server"

# 3. Open in browser
open http://localhost:8080
```

## Project Structure

```
public/                   # Deploy this folder to Firebase
├── index.html            # Single page app
├── css/styles.css        # All styles
├── js/
│   ├── app.js            # Entry point
│   ├── pricing/          # Cost calculators (pure functions)
│   │   ├── data.js       # Tiers, rates, constraints
│   │   ├── compute.js
│   │   ├── storage.js
│   │   ├── bandwidth.js
│   │   ├── database.js
│   │   ├── serverless.js
│   │   └── index.js
│   ├── chat/             # Bot logic
│   │   ├── parser.js     # Intent extraction
│   │   ├── bot.js        # Response generation
│   │   ├── session.js    # State management
│   │   └── responses.js  # Message templates
│   └── ui/               # Rendering
│       ├── messages.js
│       ├── breakdown.js
│       ├── quickreply.js
│       └── effects.js
└── assets/
```

## Firebase Deployment

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize (run from TSIS3/ root)
firebase init hosting
# → Public directory: public
# → Single-page app: Yes
# → Do not overwrite index.html

# 4. Deploy
firebase deploy

# 5. Your app is live at:
# https://<project-id>.web.app
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| No framework (vanilla JS) | SPA chat UI is simple enough; no build step needed |
| Client-side only | All calculations in browser; works offline |
| Rule-based parser | Deterministic behavior; no API keys needed |
| Modular calculators | Each component = 1 file; easy to test |
| Dark mode default | Professional finance aesthetic |

## Testing

```bash
# Run unit tests (from TSIS3/ root)
# Option A: Open tests/test-runner.html in browser
# Option B: Node.js
node tests/pricing.test.js

# Quick verification in browser console:
# Open the app, press F12, go to Console tab:
import('./js/pricing/compute.js').then(m => console.log(m.computeCost({instances:3, tier:"Standard", hours:730})))
# Expected: { cost: 74.46, ... }
```

## Useful References

- [Spec (SSOT)](./specs/cfo-bot/spec.md) — All pricing formulas and requirements
- [Plan](./specs/cfo-bot/plan.md) — Implementation phases and test matrix
- [Data Model](./specs/cfo-bot/data-model.md) — Entity definitions and state machine
- [Contracts](./specs/cfo-bot/contracts/internal-api.md) — Function interfaces
