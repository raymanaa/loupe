"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Beaker, CheckCircle2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { type ProjectId } from "@/lib/mock-data";

type EvalRun = {
  day: number; // 0 = today, 29 = 30 days ago
  pass: number;
  total: number;
};

type EvalSuite = {
  id: string;
  name: string;
  description: string;
  projectId: ProjectId;
  runs: EvalRun[]; // 30 day series
  tests: {
    id: string;
    name: string;
    status: "pass" | "fail" | "flaky";
    lastFail?: string;
  }[];
  promptLink: string;
};

function generateSeries(
  seed: number,
  target = 92,
  noise = 6,
  length = 30,
): EvalRun[] {
  // Deterministic-ish noisy series that regresses then recovers
  const out: EvalRun[] = [];
  for (let i = 0; i < length; i++) {
    const t = length - 1 - i;
    const total = 30 + (seed % 20);
    const base = target;
    const dip = t > 3 && t < 7 ? -12 : 0; // brief regression
    const jitter = ((seed * (t + 3)) % 11) - 5;
    const pct = Math.max(40, Math.min(100, base + dip + jitter / 2));
    const pass = Math.round((pct / 100) * total);
    out.push({ day: t, pass, total });
  }
  return out;
}

const SUITES: EvalSuite[] = [
  {
    id: "e-sb-reply",
    name: "support.reply suite",
    description: "60 scripted scenarios the bot should handle correctly",
    projectId: "p-support",
    promptLink: "support.reply",
    runs: generateSeries(3, 94),
    tests: [
      { id: "t1", name: "Asks for order number when missing", status: "pass" },
      { id: "t2", name: "Does not invent carriers", status: "pass" },
      { id: "t3", name: "Escalates refund > $200", status: "pass" },
      {
        id: "t4",
        name: "Handles non-English input politely",
        status: "flaky",
        lastFail: "fr-FR input scored 2.1/5 on tone (3 of last 10 runs)",
      },
      {
        id: "t5",
        name: "Refuses to give out another user's data",
        status: "pass",
      },
      { id: "t6", name: "Never recommends a competitor", status: "pass" },
    ],
  },
  {
    id: "e-sb-classify",
    name: "support.classify suite",
    description: "Intent + urgency classifier coverage",
    projectId: "p-support",
    promptLink: "support.classify_intent",
    runs: generateSeries(7, 97, 3),
    tests: [
      { id: "t1", name: "Classifies refund request correctly", status: "pass" },
      { id: "t2", name: "Distinguishes urgent vs. routine", status: "pass" },
      {
        id: "t3",
        name: "Handles sarcasm",
        status: "fail",
        lastFail:
          'Sarcastic message "yeah thanks for the prompt refund"... classified as gratitude (expected: refund_request)',
      },
    ],
  },
  {
    id: "e-gc-grade",
    name: "grade.essay suite",
    description: "Rubric alignment against 40 pre-scored essays",
    projectId: "p-gradecard",
    promptLink: "grade.essay",
    runs: generateSeries(11, 88),
    tests: [
      { id: "t1", name: "Thesis score within ±1 of human grader", status: "pass" },
      {
        id: "t2",
        name: "Does not penalize dialect differences",
        status: "pass",
      },
      {
        id: "t3",
        name: "Feedback is kind but honest",
        status: "flaky",
        lastFail: "Feedback tone slipped harsh on 2 of 10 runs",
      },
    ],
  },
  {
    id: "e-qe-quote",
    name: "quote.underwrite suite",
    description: "Actuarial correctness on 25 seed scenarios",
    projectId: "p-quote",
    promptLink: "quote.underwrite",
    runs: generateSeries(13, 81),
    tests: [
      {
        id: "t1",
        name: "Does not miss catastrophic-peril disclosures",
        status: "pass",
      },
      {
        id: "t2",
        name: "Premium within ±8% of underwriter baseline",
        status: "flaky",
        lastFail: "Out by 14% on MI manufacturing policy",
      },
    ],
  },
];

export function EvalsView({ projectId }: { projectId: ProjectId }) {
  const suites = useMemo(
    () => SUITES.filter((s) => s.projectId === projectId),
    [projectId],
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    suites[0]?.id ?? null,
  );
  const selected = useMemo(
    () => suites.find((s) => s.id === selectedId) ?? suites[0] ?? null,
    [suites, selectedId],
  );

  if (suites.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-10 text-center">
        <div className="max-w-md">
          <Beaker
            className="mx-auto h-6 w-6 text-ink-3 mb-3"
            strokeWidth={1.75}
          />
          <h3 className="display text-[18px] text-ink">No eval suites yet.</h3>
          <p className="mt-2 text-[12.5px] text-ink-2">
            Define test cases once; Loupe reruns them whenever a prompt version
            lands.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex w-[280px] shrink-0 flex-col border-r border-line bg-bg">
        <div className="border-b border-line px-5 py-3">
          <span className="mono-small">Suites · {suites.length}</span>
        </div>
        <div className="flex flex-col py-1">
          {suites.map((s) => {
            const active = s.id === selected?.id;
            const latest = s.runs[0];
            const pct = Math.round((latest.pass / latest.total) * 100);
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
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
                    {s.name}
                  </span>
                </div>
                <div className="mt-1 ml-4 text-[11px] text-ink-3 truncate">
                  {s.tests.length} tests · {pct}% passing
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selected && <SuiteDetail suite={selected} />}
    </div>
  );
}

function SuiteDetail({ suite }: { suite: EvalSuite }) {
  const latest = suite.runs[0];
  const prev = suite.runs[1];
  const latestPct = Math.round((latest.pass / latest.total) * 100);
  const prevPct = Math.round((prev.pass / prev.total) * 100);
  const delta = latestPct - prevPct;
  const failing = suite.tests.filter((t) => t.status === "fail").length;
  const flaky = suite.tests.filter((t) => t.status === "flaky").length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-line px-8 py-5">
        <div>
          <div className="mono-small">Eval suite</div>
          <h2 className="display mt-1.5 text-[22px] leading-[1.2] text-ink">
            {suite.name}
          </h2>
          <p className="mt-1 max-w-[520px] text-[12.5px] text-ink-2">
            {suite.description} · against{" "}
            <span className="font-mono text-ink">{suite.promptLink}</span>
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <StatCard
            label="Pass rate"
            value={`${latestPct}%`}
            delta={delta}
            tone={latestPct >= 90 ? "good" : latestPct >= 80 ? "warn" : "bad"}
          />
          <StatCard
            label="Tests"
            value={`${latest.pass} / ${latest.total}`}
          />
          <StatCard
            label="Failing"
            value={String(failing)}
            tone={failing > 0 ? "bad" : "good"}
          />
          <StatCard
            label="Flaky"
            value={String(flaky)}
            tone={flaky > 0 ? "warn" : "good"}
          />
        </div>
      </div>

      {delta < -5 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-8 mt-5 flex items-start gap-3 rounded-lg border border-[color:var(--danger)]/40 bg-[color:var(--danger)]/6 px-4 py-3"
        >
          <AlertTriangle
            className="mt-0.5 h-4 w-4 text-[color:var(--danger)]"
            strokeWidth={2}
          />
          <div>
            <div className="display text-[13px] text-[color:var(--danger)]">
              Regression detected
            </div>
            <p className="mt-0.5 text-[12px] text-ink-2">
              Pass rate dropped {Math.abs(delta)}pp since the last run. Inspect
              failing tests below or roll back to the previous prompt version.
            </p>
          </div>
        </motion.div>
      )}

      <section className="px-8 py-6">
        <div className="mono-small mb-3">Pass rate · 30 day</div>
        <Chart runs={suite.runs} />
      </section>

      <section className="border-t border-line px-8 py-6">
        <div className="mono-small mb-3">Tests</div>
        <ul className="space-y-1.5">
          {suite.tests.map((t) => (
            <TestRow key={t.id} test={t} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function Chart({ runs }: { runs: EvalRun[] }) {
  const w = 720;
  const h = 160;
  const padX = 16;
  const padY = 14;
  const sorted = [...runs].sort((a, b) => b.day - a.day); // oldest first
  const max = 100;
  const points = sorted.map((r, i) => {
    const pct = (r.pass / r.total) * 100;
    const x = padX + (i / (sorted.length - 1)) * (w - padX * 2);
    const y = h - padY - (pct / max) * (h - padY * 2);
    return { x, y, pct, day: r.day };
  });
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const area =
    `${path} L ${points[points.length - 1].x.toFixed(1)} ${h - padY} L ${points[0].x.toFixed(1)} ${h - padY} Z`;

  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-4">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-[160px]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* grid lines */}
        {[25, 50, 75, 100].map((pct) => {
          const y = h - padY - (pct / 100) * (h - padY * 2);
          return (
            <g key={pct}>
              <line
                x1={padX}
                x2={w - padX}
                y1={y}
                y2={y}
                stroke="var(--line)"
                strokeDasharray="2 3"
                strokeWidth={1}
              />
              <text
                x={padX - 4}
                y={y + 3}
                fontSize="9"
                textAnchor="end"
                fill="var(--ink-3)"
                fontFamily="var(--font-mono)"
              >
                {pct}
              </text>
            </g>
          );
        })}
        <path d={area} fill="url(#chart-fill)" />
        <path
          d={path}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) =>
          i % 5 === 0 || i === points.length - 1 ? (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={2}
              fill="var(--accent)"
              stroke="var(--bg)"
              strokeWidth={1.5}
            />
          ) : null,
        )}
      </svg>
      <div className="mt-2 flex items-center justify-between font-mono text-[10.5px] text-ink-3">
        <span>-30d</span>
        <span>today</span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta?: number;
  tone?: "good" | "warn" | "bad";
}) {
  const color =
    tone === "good"
      ? "var(--success)"
      : tone === "warn"
        ? "var(--warning)"
        : tone === "bad"
          ? "var(--danger)"
          : "var(--ink)";
  return (
    <div className="rounded-md border border-line bg-surface px-3 py-2 min-w-[120px]">
      <div className="mono-small">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span
          className="display text-[20px] tabular-nums"
          style={{ color }}
        >
          {value}
        </span>
        {delta !== undefined && delta !== 0 && (
          <span
            className="font-mono text-[11px] tabular-nums"
            style={{
              color:
                delta > 0
                  ? "var(--success)"
                  : delta < -5
                    ? "var(--danger)"
                    : "var(--warning)",
            }}
          >
            {delta > 0 ? "+" : ""}
            {delta}pp
          </span>
        )}
      </div>
    </div>
  );
}

function TestRow({ test }: { test: EvalSuite["tests"][number] }) {
  const icon =
    test.status === "pass" ? (
      <CheckCircle2
        className="h-3.5 w-3.5 text-[color:var(--success)]"
        strokeWidth={2.5}
      />
    ) : test.status === "flaky" ? (
      <AlertTriangle
        className="h-3.5 w-3.5 text-[color:var(--warning)]"
        strokeWidth={2.5}
      />
    ) : (
      <XCircle
        className="h-3.5 w-3.5 text-[color:var(--danger)]"
        strokeWidth={2.5}
      />
    );
  return (
    <li className="rounded-md border border-line bg-surface px-3 py-2.5">
      <div className="flex items-start gap-3">
        {icon}
        <div className="min-w-0 flex-1">
          <div className="text-[13px] text-ink">{test.name}</div>
          {test.lastFail && (
            <div className="mt-1 rounded-md bg-bg-2 px-2.5 py-1.5 font-mono text-[11px] text-ink-3 leading-[1.55]">
              {test.lastFail}
            </div>
          )}
        </div>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
          {test.status}
        </span>
      </div>
    </li>
  );
}
