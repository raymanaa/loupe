# Loupe

**Observability for LLM agents.** Drop-in traces, evals, and prompt versioning for production LLM agents. Everything you wished you had when your prod agent started drifting.

- **Live:** [loupe.raymnz.com](https://loupe.raymnz.com) (and [workers.dev fallback](https://loupe.rayen-manaa12.workers.dev))
- **Status:** Portfolio pilot — alpha
- **Stack:** Next 16 · React 19 · Tailwind 4 · `framer-motion` · Cloudflare Workers + Static Assets · Inter Variable + JetBrains Mono

---

## Why this exists

Prod LLM agents fail silently. Prompts live in git and only engineers edit them. Cost surprises show up on the bill two weeks after the bad prompt ships. Evals are a yaml file nobody reruns. And when your agent hallucinates on a customer request, all you have is the final output — no trace of how it got there.

Loupe is the control plane for that stack. One SDK, one console, four primitives: **traces · evals · prompt versions · cost & latency.**

Existing players (LangSmith, Helicone, Phoenix) cover parts of this. Loupe's wager is on **design quality** (Linear-tier product chrome, engineer-audience palette), **eval-first ergonomics** (evals are not an afterthought tab), and a clean **self-hosting path** (single docker image, one env var).

---

## What it does

### Traces (default tab)
- Table of every trace in the selected project + env
- Columns: started, id, prompt+version, duration, tokens, cost, status (color-coded dot with glow)
- Click a trace → right-side panel with:
  - Header stats (duration, tokens, cost, status)
  - **Waterfall** — Gantt-style per-span rows with kind badges (LLM / TOOL / RET / GUARD), depth-indented, axis ticks, red blocks for errored spans
  - **Span detail** — metadata key/value table, error block if failed, prompt + completion code blocks with copy-to-clipboard

### Prompts
- Prompt library per project with full version history
- Left list: prompt name + description + latest-version chip
- Version column: per-version row with live-env chips, eval pass %, token count, author, ts
- Right pane:
  - Release note callout (accent bar)
  - **Line-level diff** against the previous version (green added / red strikethrough removed) or plain view if it's the first version
  - Deploy/rollback buttons (scaffolded, disabled in alpha)

### Evals
- Suite list per project with latest pass %
- Per-suite detail:
  - Four stat cards (pass rate with delta vs. previous, tests fraction, failing count, flaky count), color-coded
  - **Regression alert banner** auto-renders when delta < −5pp
  - 30-day line chart (SVG, gradient fill, dashed gridlines, dot markers)
  - Test cases list with pass/fail/flaky indicators + last-failure detail blocks

### Top bar
- Project/env breadcrumb with inline env selector pills (prod green / staging amber / dev indigo)
- Search (disabled, ⌘K scaffold)

---

## Marketing surfaces

| Route | What it is |
|---|---|
| `/` | Landing — hero, pain strip, 4-feature grid, SDK snippet, CTAs |
| `/app` | The console |
| `/docs` | 4-step SDK quickstart (install → init → instrument → verify) |
| `/changelog` | Vertical timeline of fake releases (highlight / fix / normal) |
| `/security` | What we capture, redaction, retention, storage, self-hosting |

---

## Architecture

```
                            ┌────────────────────────────────────┐
   browser                  │   Cloudflare Worker (edge)         │
   ───────                  │                                    │
   Next 16 static export  ──│   /api/health  (stub)             │
   (out/ → ASSETS)          │   Everything else → ASSETS         │
                            └────────────────────────────────────┘
                                           │
                              loupe.raymnz.com (custom domain)
                              loupe.rayen-manaa12.workers.dev (fallback)

   Pilot data:
     All mock data lives in src/lib/mock-data.ts (traces, spans,
     prompts, eval suites). Production would swap these readers for
     fetches against /api/projects/:id/{traces,prompts,evals}.
```

Five public routes, all statically exported. The SDK snippet on the landing page is a mockup — the actual SDK does not exist yet; this is a portfolio showcase.

---

## Demo walkthrough (60 seconds)

1. Open [loupe.raymnz.com](https://loupe.raymnz.com). Landing hero → **Open the console**.
2. Land in Support bot · Traces tab. 8 traces visible; one is red (Stripe timeout + retry).
3. Click the top trace. Waterfall on the right: `agent.run → guard.pii_redact → retrieval.kb → openai.chat.completions → guard.tone_check` rendered as colored Gantt bars across 1.8s.
4. Click the LLM span. Full prompt + completion in the code blocks. Copy button.
5. Switch to the **Prompts** tab. `support.reply · v7 · live` with a diff against v6 showing an added "never invent order numbers" safety clause.
6. Switch to **Evals**. `support.reply suite` shows a 30-day chart with a dip five days ago (the v6 regression) and recovery. One flaky test, zero failing.
7. Switch to the Gradecard project. Entirely different data — Claude 3.5 Sonnet traces, essay-grading prompts, rubric-alignment eval suite.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next 16 App Router, static export | No SSR needed; every surface is marketing or client-state |
| React | 19 | latest stable |
| Styling | Tailwind 4 with custom theme | Dark engineering-tool palette distinct from Axon |
| Type | Inter Variable + JetBrains Mono | Linear-adjacent, deliberate echo of Axon for portfolio coherence |
| Icons | `lucide-react` | |
| Animation | `framer-motion` | Panel slides, span hover, regression alert |
| Deploy | Cloudflare Workers + Static Assets | Single worker handles `/api/*` (stub) and falls through to assets |
| Local dev | `pnpm dev` | standard Next 16 |

---

## Shipped milestones

| | | |
|---|---|---|
| M1 | ✅ | Scaffold + landing + brand + deploy |
| M2 | ✅ | App shell with projects sidebar + tabs + top bar |
| M3 | ✅ | Traces table + waterfall viewer |
| M4 | ✅ | Span detail (prompt/completion code blocks + metadata + copy) |
| M5 | pending | Live-streaming demo trace (run button adds spans over ~3s) |
| M6 | ✅ | Prompts tab with version history + line-level diff |
| M7 | ✅ | Evals dashboard — suites, regression alerts, 30-day chart, test results |
| M8 | ✅ | `/docs` · `/changelog` · `/security` static pages |
| M9 | ✅ | This README |

---

## Develop locally

```bash
pnpm install
pnpm dev         # http://localhost:3000
pnpm cf:deploy   # next build && wrangler deploy
```

---

## Axon & Loupe — the portfolio arc

Loupe is portfolio project #2, paired with **[Axon](https://axon.raymnz.com)** (transparent résumé screening). Together they illustrate two ends of the "AI-native product" spectrum: a buyer-facing compliance tool (Axon) and an engineer-facing infra tool (Loupe). Different audiences, different visual vocabularies, same underlying craft.

Built by [Rayen Manaa](https://github.com/raymanaa).
