export type ProjectId = string;
export type TraceId = string;
export type SpanId = string;

export type Env = "dev" | "staging" | "prod";

export type Project = {
  id: ProjectId;
  name: string;
  slug: string;
  description: string;
  envs: Env[];
  defaultEnv: Env;
  createdAt: string;
};

export type SpanKind = "llm" | "tool" | "retrieval" | "guard" | "span";

export type Span = {
  id: SpanId;
  traceId: TraceId;
  parentId: SpanId | null;
  name: string;
  kind: SpanKind;
  /** ms from trace start */
  startedAt: number;
  durationMs: number;
  status: "success" | "error";
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
  prompt?: string;
  completion?: string;
  metadata?: Record<string, string>;
  error?: string;
};

export type Trace = {
  id: TraceId;
  projectId: ProjectId;
  env: Env;
  startedAt: number;
  durationMs: number;
  totalTokens: number;
  totalCostUsd: number;
  status: "success" | "error" | "partial";
  promptName: string;
  promptVersion: string;
  input: string;
  output: string;
  spans: Span[];
};

export const PROJECTS: Project[] = [
  {
    id: "p-support",
    name: "Support bot",
    slug: "support-bot",
    description: "Customer-support triage agent for an e-commerce marketplace",
    envs: ["dev", "staging", "prod"],
    defaultEnv: "prod",
    createdAt: "2026-03-04",
  },
  {
    id: "p-gradecard",
    name: "Gradecard",
    slug: "gradecard",
    description: "Essay-grading assistant for high-school English teachers",
    envs: ["dev", "prod"],
    defaultEnv: "prod",
    createdAt: "2026-02-18",
  },
  {
    id: "p-quote",
    name: "Quote engine",
    slug: "quote-engine",
    description: "B2B insurance quote generator from risk disclosure forms",
    envs: ["dev", "staging"],
    defaultEnv: "staging",
    createdAt: "2026-04-01",
  },
];

/* Build synthetic traces for each project. Realistic-ish shapes. */

const NOW = Date.parse("2026-04-21T04:00:00Z");

function trace(
  overrides: Partial<Trace> &
    Pick<Trace, "id" | "projectId" | "env" | "promptName" | "promptVersion">,
): Trace {
  return {
    startedAt: NOW - 60_000 * 30,
    durationMs: 1800,
    totalTokens: 1200,
    totalCostUsd: 0.0032,
    status: "success",
    input: "",
    output: "",
    spans: [],
    ...overrides,
  };
}

function span(s: Omit<Span, "status"> & { status?: Span["status"] }): Span {
  return { status: "success", ...s };
}

/* Support bot — 10 traces spanning last 3 hours */

const SUPPORT_TRACES: Trace[] = [];

{
  const tid = "t-sb-001";
  const spans: Span[] = [
    span({
      id: "s-1",
      traceId: tid,
      parentId: null,
      name: "agent.run",
      kind: "span",
      startedAt: 0,
      durationMs: 1820,
    }),
    span({
      id: "s-2",
      traceId: tid,
      parentId: "s-1",
      name: "guard.pii_redact",
      kind: "guard",
      startedAt: 6,
      durationMs: 22,
      metadata: { redacted: "2 emails" },
    }),
    span({
      id: "s-3",
      traceId: tid,
      parentId: "s-1",
      name: "retrieval.kb",
      kind: "retrieval",
      startedAt: 30,
      durationMs: 140,
      metadata: { hits: "4", collection: "shipping-faq" },
    }),
    span({
      id: "s-4",
      traceId: tid,
      parentId: "s-1",
      name: "openai.chat.completions",
      kind: "llm",
      startedAt: 180,
      durationMs: 1420,
      model: "gpt-4o-mini",
      inputTokens: 860,
      outputTokens: 312,
      costUsd: 0.0019,
      prompt:
        "You are a support agent for Waver, an e-commerce marketplace. Answer the customer's question using the retrieved KB snippets. Be concise. If you don't know, say so.\n\n[KB snippets]\n- Orders over $50 ship free in 3-5 business days…",
      completion:
        "Hi there — thanks for reaching out! Shipping for your order placed on Apr 18 typically takes 3-5 business days, so you should see it by Apr 25 at the latest. If it doesn't arrive by then, we can open a trace.",
    }),
    span({
      id: "s-5",
      traceId: tid,
      parentId: "s-1",
      name: "guard.tone_check",
      kind: "guard",
      startedAt: 1610,
      durationMs: 180,
      metadata: { score: "4.6", threshold: "3.5" },
    }),
  ];
  SUPPORT_TRACES.push(
    trace({
      id: tid,
      projectId: "p-support",
      env: "prod",
      promptName: "support.reply.v7",
      promptVersion: "v7",
      durationMs: 1820,
      totalTokens: 1172,
      totalCostUsd: 0.0019,
      startedAt: NOW - 2 * 60_000,
      input: "where's my order?",
      output: "Hi there — thanks for reaching out! Shipping…",
      spans,
    }),
  );
}

{
  const tid = "t-sb-002";
  const spans: Span[] = [
    span({
      id: "s-1",
      traceId: tid,
      parentId: null,
      name: "agent.run",
      kind: "span",
      startedAt: 0,
      durationMs: 4230,
      status: "error",
    }),
    span({
      id: "s-2",
      traceId: tid,
      parentId: "s-1",
      name: "guard.pii_redact",
      kind: "guard",
      startedAt: 4,
      durationMs: 18,
    }),
    span({
      id: "s-3",
      traceId: tid,
      parentId: "s-1",
      name: "retrieval.kb",
      kind: "retrieval",
      startedAt: 28,
      durationMs: 110,
    }),
    span({
      id: "s-4",
      traceId: tid,
      parentId: "s-1",
      name: "openai.chat.completions",
      kind: "llm",
      startedAt: 150,
      durationMs: 3200,
      model: "gpt-4o-mini",
      inputTokens: 920,
      outputTokens: 456,
      costUsd: 0.0024,
    }),
    span({
      id: "s-5",
      traceId: tid,
      parentId: "s-1",
      name: "tool.stripe.lookup_order",
      kind: "tool",
      startedAt: 3360,
      durationMs: 820,
      status: "error",
      error: "TimeoutError: stripe.orders.retrieve exceeded 800ms",
      metadata: { retries: "2" },
    }),
  ];
  SUPPORT_TRACES.push(
    trace({
      id: tid,
      projectId: "p-support",
      env: "prod",
      promptName: "support.reply.v7",
      promptVersion: "v7",
      durationMs: 4230,
      totalTokens: 1376,
      totalCostUsd: 0.0024,
      startedAt: NOW - 8 * 60_000,
      status: "error",
      input: "can I get a refund for order 9212?",
      output: "[error] stripe.orders.retrieve exceeded 800ms",
      spans,
    }),
  );
}

{
  const tid = "t-sb-003";
  const spans: Span[] = [
    span({
      id: "s-1",
      traceId: tid,
      parentId: null,
      name: "agent.run",
      kind: "span",
      startedAt: 0,
      durationMs: 2110,
    }),
    span({
      id: "s-2",
      traceId: tid,
      parentId: "s-1",
      name: "guard.pii_redact",
      kind: "guard",
      startedAt: 4,
      durationMs: 20,
    }),
    span({
      id: "s-3",
      traceId: tid,
      parentId: "s-1",
      name: "retrieval.kb",
      kind: "retrieval",
      startedAt: 30,
      durationMs: 160,
    }),
    span({
      id: "s-4",
      traceId: tid,
      parentId: "s-1",
      name: "openai.chat.completions",
      kind: "llm",
      startedAt: 200,
      durationMs: 1860,
      model: "gpt-4o-mini",
      inputTokens: 1040,
      outputTokens: 280,
      costUsd: 0.0018,
    }),
  ];
  SUPPORT_TRACES.push(
    trace({
      id: tid,
      projectId: "p-support",
      env: "prod",
      promptName: "support.reply.v7",
      promptVersion: "v7",
      durationMs: 2110,
      totalTokens: 1320,
      totalCostUsd: 0.0018,
      startedAt: NOW - 18 * 60_000,
      input: "is the gray sweater back in stock in M?",
      output: "Yes — the gray sweater in size M restocked yesterday…",
      spans,
    }),
  );
}

// Add more quick support traces for volume
for (let i = 4; i <= 8; i++) {
  const tid = `t-sb-00${i}`;
  const duration = 1400 + Math.floor(Math.random() * 2200);
  const inputTokens = 600 + Math.floor(Math.random() * 800);
  const outputTokens = 200 + Math.floor(Math.random() * 400);
  const status = i === 5 ? "error" : "success";
  const spans: Span[] = [
    span({
      id: `${tid}-s-1`,
      traceId: tid,
      parentId: null,
      name: "agent.run",
      kind: "span",
      startedAt: 0,
      durationMs: duration,
      status,
    }),
    span({
      id: `${tid}-s-2`,
      traceId: tid,
      parentId: `${tid}-s-1`,
      name: "retrieval.kb",
      kind: "retrieval",
      startedAt: 30,
      durationMs: 120 + Math.floor(Math.random() * 80),
    }),
    span({
      id: `${tid}-s-3`,
      traceId: tid,
      parentId: `${tid}-s-1`,
      name: "openai.chat.completions",
      kind: "llm",
      startedAt: 160,
      durationMs: duration - 200,
      model: "gpt-4o-mini",
      inputTokens,
      outputTokens,
      costUsd: (inputTokens / 1e6) * 0.15 + (outputTokens / 1e6) * 0.6,
    }),
  ];
  SUPPORT_TRACES.push(
    trace({
      id: tid,
      projectId: "p-support",
      env: "prod",
      promptName: "support.reply.v7",
      promptVersion: "v7",
      durationMs: duration,
      totalTokens: inputTokens + outputTokens,
      totalCostUsd: (inputTokens / 1e6) * 0.15 + (outputTokens / 1e6) * 0.6,
      status,
      startedAt: NOW - (20 + i * 10) * 60_000,
      input: [
        "how do I reset my password?",
        "i was charged twice",
        "can you change the shipping address on order 9941?",
        "your size chart is confusing",
        "thanks! just wanted to say it arrived",
      ][i - 4],
      output:
        status === "success" ? "…" : "[error] rate limit on openai upstream",
      spans,
    }),
  );
}

/* Gradecard — 5 traces */
const GRADECARD_TRACES: Trace[] = [];
for (let i = 1; i <= 5; i++) {
  const tid = `t-gc-00${i}`;
  const duration = 3200 + Math.floor(Math.random() * 3800);
  const inputTokens = 2400 + Math.floor(Math.random() * 1200);
  const outputTokens = 580 + Math.floor(Math.random() * 420);
  const spans: Span[] = [
    span({
      id: `${tid}-s-1`,
      traceId: tid,
      parentId: null,
      name: "agent.grade_essay",
      kind: "span",
      startedAt: 0,
      durationMs: duration,
    }),
    span({
      id: `${tid}-s-2`,
      traceId: tid,
      parentId: `${tid}-s-1`,
      name: "guard.profanity_filter",
      kind: "guard",
      startedAt: 10,
      durationMs: 35,
    }),
    span({
      id: `${tid}-s-3`,
      traceId: tid,
      parentId: `${tid}-s-1`,
      name: "anthropic.messages.create",
      kind: "llm",
      startedAt: 60,
      durationMs: duration - 100,
      model: "claude-3-5-sonnet",
      inputTokens,
      outputTokens,
      costUsd: (inputTokens / 1e6) * 3 + (outputTokens / 1e6) * 15,
    }),
  ];
  GRADECARD_TRACES.push(
    trace({
      id: tid,
      projectId: "p-gradecard",
      env: "prod",
      promptName: "grade.essay.v3",
      promptVersion: "v3",
      durationMs: duration,
      totalTokens: inputTokens + outputTokens,
      totalCostUsd: (inputTokens / 1e6) * 3 + (outputTokens / 1e6) * 15,
      startedAt: NOW - (15 + i * 25) * 60_000,
      input: `Essay on "The Great Gatsby" (${940 + i * 110} words)`,
      output: `Grade: ${["B+", "A-", "B", "A", "C+"][i - 1]} · 4-paragraph feedback`,
      spans,
    }),
  );
}

/* Quote engine — 3 traces */
const QUOTE_TRACES: Trace[] = [];
for (let i = 1; i <= 3; i++) {
  const tid = `t-qe-00${i}`;
  const duration = 5400 + Math.floor(Math.random() * 3000);
  const inputTokens = 3600 + Math.floor(Math.random() * 1400);
  const outputTokens = 820 + Math.floor(Math.random() * 280);
  const spans: Span[] = [
    span({
      id: `${tid}-s-1`,
      traceId: tid,
      parentId: null,
      name: "agent.generate_quote",
      kind: "span",
      startedAt: 0,
      durationMs: duration,
    }),
    span({
      id: `${tid}-s-2`,
      traceId: tid,
      parentId: `${tid}-s-1`,
      name: "tool.parse_pdf",
      kind: "tool",
      startedAt: 20,
      durationMs: 340,
    }),
    span({
      id: `${tid}-s-3`,
      traceId: tid,
      parentId: `${tid}-s-1`,
      name: "retrieval.actuarial_tables",
      kind: "retrieval",
      startedAt: 380,
      durationMs: 220,
    }),
    span({
      id: `${tid}-s-4`,
      traceId: tid,
      parentId: `${tid}-s-1`,
      name: "google.generative_ai",
      kind: "llm",
      startedAt: 620,
      durationMs: duration - 700,
      model: "gemini-2.5-pro",
      inputTokens,
      outputTokens,
      costUsd: (inputTokens / 1e6) * 1.25 + (outputTokens / 1e6) * 5,
    }),
  ];
  QUOTE_TRACES.push(
    trace({
      id: tid,
      projectId: "p-quote",
      env: "staging",
      promptName: "quote.underwrite.v2",
      promptVersion: "v2",
      durationMs: duration,
      totalTokens: inputTokens + outputTokens,
      totalCostUsd: (inputTokens / 1e6) * 1.25 + (outputTokens / 1e6) * 5,
      startedAt: NOW - (10 + i * 40) * 60_000,
      input: `Risk disclosure · ${["NYC restaurant", "CA tech startup (SaaS)", "MI manufacturing"][i - 1]}`,
      output: `Quote $${[12400, 48200, 31700][i - 1]}/yr · ${[3, 4, 2][i - 1]} covered perils`,
      spans,
    }),
  );
}

export const TRACES: Trace[] = [
  ...SUPPORT_TRACES,
  ...GRADECARD_TRACES,
  ...QUOTE_TRACES,
];

export function tracesForProject(projectId: ProjectId): Trace[] {
  return TRACES.filter((t) => t.projectId === projectId);
}

export function getProject(id: ProjectId): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function formatDurationMs(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export function formatCost(usd: number): string {
  if (usd < 0.01) return `$${usd.toFixed(5)}`;
  return `$${usd.toFixed(3)}`;
}

export function formatTokens(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function formatRelative(ts: number, now = NOW): string {
  const diff = now - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}
