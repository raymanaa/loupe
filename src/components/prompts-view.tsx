"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  GitBranch,
  Globe,
  Layers,
  RotateCcw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { formatRelative, type ProjectId } from "@/lib/mock-data";

type PromptVersion = {
  id: string;
  version: string;
  author: string;
  ts: number;
  deployedTo: ("dev" | "staging" | "prod")[];
  tokens: number;
  evalPass: number; // 0-100
  body: string;
  note?: string;
};

type PromptEntry = {
  id: string;
  name: string;
  description: string;
  projectId: ProjectId;
  versions: PromptVersion[];
};

const NOW = Date.parse("2026-04-21T04:00:00Z");

const PROMPTS: PromptEntry[] = [
  {
    id: "pr-support-reply",
    name: "support.reply",
    description: "Main reply generator for customer support",
    projectId: "p-support",
    versions: [
      {
        id: "v7",
        version: "v7",
        author: "Marcos L.",
        ts: NOW - 6 * 3600_000,
        deployedTo: ["prod", "staging", "dev"],
        tokens: 420,
        evalPass: 94,
        body:
          "You are a support agent for Waver, an e-commerce marketplace. Answer the customer's question using the retrieved KB snippets. Be concise. If you don't know, say so. Never invent order numbers or shipping carriers — quote them only if present in the KB snippets.\n\n[KB snippets]\n{{retrieved_snippets}}\n\n[Customer message]\n{{message}}",
        note: "Added 'never invent order numbers' — fixes 8 eval failures from v6",
      },
      {
        id: "v6",
        version: "v6",
        author: "Marcos L.",
        ts: NOW - 2 * 86400_000,
        deployedTo: [],
        tokens: 412,
        evalPass: 86,
        body:
          "You are a support agent for Waver, an e-commerce marketplace. Answer the customer's question using the retrieved KB snippets. Be concise. If you don't know, say so.\n\n[KB snippets]\n{{retrieved_snippets}}\n\n[Customer message]\n{{message}}",
      },
      {
        id: "v5",
        version: "v5",
        author: "Priya P.",
        ts: NOW - 9 * 86400_000,
        deployedTo: [],
        tokens: 388,
        evalPass: 78,
        body:
          "You are a friendly support agent. Answer questions using your best judgment.\n\n{{message}}",
      },
    ],
  },
  {
    id: "pr-support-classify",
    name: "support.classify_intent",
    description: "Classifies incoming tickets into urgency + intent",
    projectId: "p-support",
    versions: [
      {
        id: "v3",
        version: "v3",
        author: "Marcos L.",
        ts: NOW - 12 * 3600_000,
        deployedTo: ["prod", "staging", "dev"],
        tokens: 210,
        evalPass: 97,
        body:
          "Classify this customer message into one of: order_status, refund_request, shipping_change, account_help, general.\n\nMessage: {{message}}\n\nReturn JSON: {\"intent\": \"...\", \"urgency\": \"low|medium|high\"}",
      },
    ],
  },
  {
    id: "pr-gradecard-essay",
    name: "grade.essay",
    description: "Grades a student essay against a rubric",
    projectId: "p-gradecard",
    versions: [
      {
        id: "v3",
        version: "v3",
        author: "Dr. Torres",
        ts: NOW - 18 * 3600_000,
        deployedTo: ["prod", "dev"],
        tokens: 640,
        evalPass: 88,
        body:
          "You are an AP English teacher grading a 10th grade essay. Use this rubric:\n- Thesis clarity (0-5)\n- Textual support (0-5)\n- Organization (0-5)\n- Voice (0-3)\n- Mechanics (0-2)\n\nEssay:\n{{essay}}\n\nReturn JSON with scores + 3-paragraph feedback addressed to the student. Be kind but honest.",
      },
      {
        id: "v2",
        version: "v2",
        author: "Dr. Torres",
        ts: NOW - 4 * 86400_000,
        deployedTo: [],
        tokens: 580,
        evalPass: 74,
        body:
          "Grade this essay (rubric attached). Give scores and feedback.\n\n{{essay}}",
      },
    ],
  },
  {
    id: "pr-quote-underwrite",
    name: "quote.underwrite",
    description: "Generates insurance quotes from risk disclosure forms",
    projectId: "p-quote",
    versions: [
      {
        id: "v2",
        version: "v2",
        author: "K. Alves",
        ts: NOW - 3 * 86400_000,
        deployedTo: ["staging", "dev"],
        tokens: 1240,
        evalPass: 81,
        body:
          "Underwrite this policy using actuarial tables {{tables}}.\n\nRisk disclosure:\n{{disclosure}}\n\nReturn quote JSON with perils, exclusions, and annual premium.",
      },
    ],
  },
];

export function PromptsView({ projectId }: { projectId: ProjectId }) {
  const prompts = useMemo(
    () => PROMPTS.filter((p) => p.projectId === projectId),
    [projectId],
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    prompts[0]?.id ?? null,
  );
  const selected = useMemo(
    () => prompts.find((p) => p.id === selectedId) ?? prompts[0] ?? null,
    [prompts, selectedId],
  );

  if (prompts.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-10 text-center">
        <div className="max-w-md">
          <GitBranch
            className="mx-auto h-6 w-6 text-ink-3 mb-3"
            strokeWidth={1.75}
          />
          <h3 className="display text-[18px] text-ink">No prompts yet.</h3>
          <p className="mt-2 text-[12.5px] text-ink-2">
            When your agent calls an LLM via the SDK, the prompt gets captured
            here with full version history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0">
      {/* Prompt list */}
      <div className="flex w-[280px] shrink-0 flex-col border-r border-line bg-bg">
        <div className="border-b border-line px-5 py-3">
          <span className="mono-small">Prompts · {prompts.length}</span>
        </div>
        <div className="flex flex-col py-1">
          {prompts.map((p) => {
            const active = p.id === selected?.id;
            const latest = p.versions[0];
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={[
                  "mx-2 my-0.5 rounded-md px-3 py-2.5 text-left transition-colors",
                  active
                    ? "bg-surface shadow-[0_0_0_1px_var(--line)]"
                    : "hover:bg-surface-2",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={[
                      "h-[6px] w-[6px] rounded-full",
                      active ? "bg-[color:var(--accent)]" : "bg-ink-4",
                    ].join(" ")}
                  />
                  <span className="font-mono text-[12px] text-ink truncate">
                    {p.name}
                  </span>
                </div>
                <div className="mt-1 ml-4 text-[11px] text-ink-3 truncate">
                  {p.description}
                </div>
                <div className="mt-1.5 ml-4 flex items-center gap-1.5 font-mono text-[10.5px] text-ink-3">
                  <span className="rounded bg-surface-2 px-1 py-[1px] text-ink-2">
                    {latest.version}
                  </span>
                  <span>·</span>
                  <span>{formatRelative(latest.ts)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompt detail */}
      {selected && <PromptDetail prompt={selected} />}
    </div>
  );
}

function PromptDetail({ prompt }: { prompt: PromptEntry }) {
  const [compareIdx, setCompareIdx] = useState<number>(0); // which version to show
  const current = prompt.versions[compareIdx];
  const previous =
    compareIdx + 1 < prompt.versions.length
      ? prompt.versions[compareIdx + 1]
      : null;

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="border-b border-line px-8 py-5">
        <div className="flex items-start justify-between gap-8">
          <div>
            <div className="mono-small">Prompt</div>
            <h2 className="display mt-1.5 text-[22px] leading-[1.2] text-ink">
              {prompt.name}
            </h2>
            <p className="mt-1 max-w-[520px] text-[12.5px] text-ink-2">
              {prompt.description}
            </p>
          </div>
          <button
            disabled
            className="flex items-center gap-1.5 rounded-md border border-line bg-surface px-3.5 py-2 text-[12.5px] text-ink-2 disabled:cursor-not-allowed hover:text-ink hover:border-line-2 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Roll back</span>
            <span className="font-mono text-[10px] text-ink-3">soon</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Version history left */}
        <div className="w-[240px] shrink-0 border-r border-line bg-bg overflow-y-auto">
          <div className="border-b border-line px-5 py-3 mono-small">
            Versions
          </div>
          <ol>
            {prompt.versions.map((v, i) => {
              const active = i === compareIdx;
              return (
                <li key={v.id}>
                  <button
                    onClick={() => setCompareIdx(i)}
                    className={[
                      "flex w-full items-start gap-3 px-5 py-3 text-left border-b border-line transition-colors",
                      active ? "bg-accent-soft/40" : "hover:bg-surface",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden
                      className={[
                        "mt-1 h-2 w-2 rounded-full",
                        active
                          ? "bg-[color:var(--accent)]"
                          : i === 0
                            ? "bg-[color:var(--success)]"
                            : "bg-ink-4",
                      ].join(" ")}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[12px] text-ink">
                          {v.version}
                        </span>
                        {v.deployedTo.length > 0 && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-[color:var(--success)]/10 px-1 py-[1px] font-mono text-[9.5px] text-[color:var(--success)]">
                            live
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-ink-3 mt-0.5">
                        {v.author} · {formatRelative(v.ts)}
                      </div>
                      <div className="mt-1 flex items-center gap-2 font-mono text-[10.5px]">
                        <EvalChip pct={v.evalPass} />
                        <span className="text-ink-3">{v.tokens}t</span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Prompt body + diff */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-ink-3" strokeWidth={2} />
                <span className="font-mono text-[13px] text-ink">
                  {prompt.name}
                  <span className="text-ink-3">/</span>
                  {current.version}
                </span>
              </div>
              {current.deployedTo.length > 0 && (
                <div className="flex items-center gap-1">
                  {current.deployedTo.map((env) => (
                    <span
                      key={env}
                      className="inline-flex items-center gap-1 rounded bg-surface border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-2"
                    >
                      <Globe className="h-2.5 w-2.5" strokeWidth={2} />
                      {env}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <EvalChip pct={current.evalPass} />
              <span className="text-ink-3">
                {current.tokens} tokens · by {current.author}
              </span>
            </div>
          </div>

          {current.note && (
            <div className="mb-4 rounded-md border-l-2 border-[color:var(--accent)] bg-accent-soft/20 px-3 py-2 text-[12px] text-ink-2">
              {current.note}
            </div>
          )}

          {previous ? (
            <DiffView from={previous.body} to={current.body} />
          ) : (
            <pre className="rounded-lg border border-line bg-surface px-4 py-4 font-mono text-[12px] leading-[1.7] text-ink whitespace-pre-wrap">
              {current.body}
            </pre>
          )}

          {previous && (
            <div className="mt-3 text-[10.5px] font-mono text-ink-3">
              diff vs {previous.version} · {formatRelative(previous.ts)} by{" "}
              {previous.author}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EvalChip({ pct }: { pct: number }) {
  const color =
    pct >= 90 ? "var(--success)" : pct >= 80 ? "var(--warning)" : "var(--danger)";
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[11px]">
      <CheckCircle2
        className="h-3 w-3"
        strokeWidth={2.5}
        style={{ color }}
      />
      <span style={{ color }}>{pct}%</span>
    </span>
  );
}

/* Minimal line-level diff. Good-enough visual; not a proper Myers diff. */
function DiffView({ from, to }: { from: string; to: string }) {
  const fromLines = from.split("\n");
  const toLines = to.split("\n");
  const max = Math.max(fromLines.length, toLines.length);
  type Row = { type: "same" | "added" | "removed"; content: string };
  const rows: Row[] = [];

  // Greedy: walk through, if lines match keep 'same', else show removed+added.
  const fromSet = new Set(fromLines);
  const toSet = new Set(toLines);

  for (let i = 0; i < max; i++) {
    const a = fromLines[i];
    const b = toLines[i];
    if (a === b && a !== undefined) rows.push({ type: "same", content: a });
    else {
      if (a !== undefined && !toSet.has(a))
        rows.push({ type: "removed", content: a });
      if (b !== undefined && !fromSet.has(b))
        rows.push({ type: "added", content: b });
      if (a !== undefined && b !== undefined && toSet.has(a) && a !== b) {
        rows.push({ type: "same", content: a });
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg border border-line bg-surface overflow-hidden"
    >
      <div className="divide-y divide-line font-mono text-[12px] leading-[1.7]">
        {rows.map((r, i) => (
          <div
            key={i}
            className={[
              "flex items-start gap-3 px-4 py-1",
              r.type === "added"
                ? "bg-[color:var(--success)]/8"
                : r.type === "removed"
                  ? "bg-[color:var(--danger)]/8"
                  : "",
            ].join(" ")}
          >
            <span
              className="mt-[3px] inline-block h-3 w-3 shrink-0 text-center font-mono text-[10px]"
              style={{
                color:
                  r.type === "added"
                    ? "var(--success)"
                    : r.type === "removed"
                      ? "var(--danger)"
                      : "var(--color-ink-4)",
              }}
            >
              {r.type === "added" ? "+" : r.type === "removed" ? "−" : "·"}
            </span>
            <span
              className="text-ink whitespace-pre-wrap break-words flex-1 min-w-0"
              style={{
                color:
                  r.type === "added"
                    ? "var(--success)"
                    : r.type === "removed"
                      ? "var(--danger)"
                      : "var(--ink-2)",
                textDecoration: r.type === "removed" ? "line-through" : "none",
                opacity: r.type === "removed" ? 0.7 : 1,
              }}
            >
              {r.content || " "}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
