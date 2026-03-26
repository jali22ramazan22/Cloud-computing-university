# Research: CFO Bot — Technology Decisions

**Date**: 2026-03-26  
**Status**: Complete  
**Feature**: CFO Bot (Cloud Cost Calculator)

---

## R-01: Frontend Framework Selection

**Decision**: Vanilla HTML + CSS + JavaScript (no framework)

**Rationale:**
- The app is a single-page chat interface — no routing, no complex state management needed
- Client-side only — all calculation logic runs in the browser
- Firebase Hosting serves static files — no SSR required
- Minimizes bundle size and load time (NFR-01: <3s load)
- No build step needed — deploy HTML/CSS/JS directly to Firebase
- Easier to understand and defend during project presentation

**Alternatives Considered:**
| Alternative | Reason Rejected |
|------------|----------------|
| React/Vue/Angular | Overkill for a single-page chat UI; adds build complexity |
| Next.js | SSR not needed; Firebase Hosting is static-only |
| Svelte | Good option but adds build step; vanilla is simpler for this scope |

---

## R-02: Chat Bot Architecture (NLP vs Rule-Based)

**Decision**: Rule-based pattern matching with keyword extraction

**Rationale:**
- Per AC-01: Bot intelligence is rule-based, not a live LLM call
- Deterministic behavior — same input always produces same output (FR-03)
- No API keys, no costs, no latency from external services
- Works fully offline once loaded (AC-03)
- Sufficient for a structured domain (5 components, known parameters)

**Pattern Matching Strategy:**
1. Tokenize user input (lowercase, split by spaces/punctuation)
2. Match against component keywords: `compute|vm|server`, `storage|disk|bucket`, `bandwidth|egress|transfer|network`, `database|db|sql`, `serverless|function|lambda|faas`
3. Extract numeric values with context: `3 instances`, `500 gb`, `730 hours`
4. Match tier keywords: `basic|micro`, `standard|medium`, `premium`, `high|large|xlarge`
5. Match action keywords: `help`, `reset|clear|start over`, `show|pricing|price`, `change|update|modify`, `add`, `remove|delete`

**Alternatives Considered:**
| Alternative | Reason Rejected |
|------------|----------------|
| OpenAI/Gemini API | Adds cost, latency, API key management; not deterministic |
| Dialogflow | Over-engineered for a cost calculator with 5 fixed domains |
| Rasa (local NLP) | Requires Python backend; violates AC-01 (client-side only) |

---

## R-03: Cost Calculation Engine Design

**Decision**: Modular calculator with separate pure functions per component

**Rationale:**
- Each component formula is independent — no cross-dependencies
- Pure functions (input → output) are easy to unit test (SC-02)
- Separation of calculation logic from UI/chat parsing enables testing without DOM

**Module Structure:**
```
pricing/
  compute.js     — calculateCompute(instances, tier, hours)
  storage.js     — calculateStorage(volumeGb, tier)
  bandwidth.js   — calculateBandwidth(egressGb)
  database.js    — calculateDatabase(tier, storageGb)
  serverless.js  — calculateServerless(invocations, durationMs, memoryMb)
  index.js       — aggregates all calculators, provides estimate summary
```

**Alternatives Considered:**
| Alternative | Reason Rejected |
|------------|----------------|
| Single monolithic calculator | Hard to test, hard to maintain |
| Class-based OOP | Over-engineered for stateless calculations |
| Web Workers | Overkill — calculations complete in <1ms |

---

## R-04: Firebase Deployment Strategy

**Decision**: Firebase Hosting with static deployment via `firebase deploy`

**Rationale:**
- Firebase Hosting serves static content globally via CDN
- Free tier includes 10 GB storage + 360 MB/day transfer — more than sufficient
- HTTPS automatic (NFR-04)
- Simple CLI deployment: `firebase init` → `firebase deploy`
- No Firebase backend services (Firestore, Functions) needed for MVP

**Deployment Flow:**
```
1. firebase init hosting  (set public dir to 'public/')
2. Build/copy files to public/
3. firebase deploy
4. Access at: https://<project-id>.web.app
```

**Alternatives Considered:**
| Alternative | Reason Rejected |
|------------|----------------|
| GitHub Pages | Works but assignment specifically requires Firebase |
| Vercel/Netlify | Good alternatives but not Firebase |
| Firebase + Cloud Functions | No backend logic needed; adds complexity |

---

## R-05: Testing Strategy

**Decision**: Unit tests with a lightweight test runner (or manual verification scripts)

**Rationale:**
- Cost calculation accuracy is the #1 priority (SC-02)
- Each pricing formula can be tested with known input/output pairs
- Test cases derived directly from Scenarios 1–4 in the spec
- No DOM testing needed for core logic — pure function tests

**Test Matrix:**
| Component | Test Cases | Priority |
|-----------|-----------|----------|
| Compute | 4 tiers × edge cases (min/max instances, hours) | Critical |
| Storage | 4 tiers × volume ranges | Critical |
| Bandwidth | Progressive tiers, boundary values (1 GB, 1024 GB, 10240 GB) | Critical |
| Database | 5 tiers × storage ranges | Critical |
| Serverless | Free tier deductions (invocations, memory, CPU separately) | Critical |
| Input Validation | Negative numbers, non-numeric, out of range | High |
| Chat Parser | Component keywords, tier keywords, number extraction | Medium |

---

## R-06: Chat UI Component Design

**Decision**: Custom chat UI built with vanilla CSS (no UI library)

**Rationale:**
- Chat UI is a simple list of message bubbles — does not warrant a library
- Full control over styling (dark mode, finance aesthetic, UX-02)
- Responsive behavior (UX-04) achievable with CSS media queries and flexbox
- Quick-reply buttons are simple `<button>` elements with click handlers

**UI Components:**
1. `ChatContainer` — scrollable message area
2. `MessageBubble` — bot (left) or user (right) aligned message
3. `CostBreakdown` — formatted table inside a bot message
4. `QuickReplyBar` — row of clickable buttons below the input
5. `InputBar` — text input + send button at the bottom
6. `TypingIndicator` — animated dots while "bot is thinking"
