"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  Copy,
  DollarSign,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SpanKindBadge, spanKindBg, spanKindColor } from "@/components/span-kind-badge";
import {
  formatCost,
  formatDurationMs,
  formatRelative,
  formatTokens,
  tracesForProject,
  type ProjectId,
  type Span,
  type Trace,
} from "@/lib/mock-data";

export function TracesView({ projectId }: { projectId: ProjectId }) {
  const traces = useMemo(() => tracesForProject(projectId), [projectId]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null);

  const selected = useMemo(
    () => traces.find((t) => t.id === selectedId) ?? null,
    [traces, selectedId],
  );

  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex flex-1 flex-col min-w-0">
        <TracesTable
          traces={traces}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setSelectedSpanId(null);
          }}
        />
      </div>
      <AnimatePresence mode="wait">
        {selected && (
          <TracePanel
            key={selected.id}
            trace={selected}
            selectedSpanId={selectedSpanId}
            onSelectSpan={setSelectedSpanId}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Table ---------- */

function TracesTable({
  traces,
  selectedId,
  onSelect,
}: {
  traces: Trace[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full min-w-[820px] border-collapse">
        <thead className="sticky top-0 z-10 bg-bg">
          <tr>
            <Th>Started</Th>
            <Th>Trace</Th>
            <Th>Prompt</Th>
            <Th className="text-right">Duration</Th>
            <Th className="text-right">Tokens</Th>
            <Th className="text-right">Cost</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {traces.map((t) => {
            const isSelected = t.id === selectedId;
            return (
              <tr
                key={t.id}
                onClick={() => onSelect(t.id)}
                className={[
                  "cursor-pointer transition-colors",
                  isSelected ? "bg-accent-soft/40" : "hover:bg-surface",
                ].join(" ")}
              >
                <Td>
                  <div className="font-mono text-[11.5px] text-ink-2">
                    {formatRelative(t.startedAt)}
                  </div>
                </Td>
                <Td>
                  <div className="min-w-0">
                    <div className="font-mono text-[11.5px] text-ink">
                      {t.id}
                    </div>
                    <div className="text-[11.5px] text-ink-3 truncate max-w-[360px]">
                      {t.input}
                    </div>
                  </div>
                </Td>
                <Td>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-2">
                    {t.promptName}
                    <span className="rounded bg-surface-2 px-1 py-[1px] text-[9.5px] text-ink-3">
                      {t.promptVersion}
                    </span>
                  </span>
                </Td>
                <Td className="text-right">
                  <span className="font-mono text-[12px] tabular-nums text-ink">
                    {formatDurationMs(t.durationMs)}
                  </span>
                </Td>
                <Td className="text-right">
                  <span className="font-mono text-[12px] tabular-nums text-ink">
                    {formatTokens(t.totalTokens)}
                  </span>
                </Td>
                <Td className="text-right">
                  <span className="font-mono text-[12px] tabular-nums text-ink">
                    {formatCost(t.totalCostUsd)}
                  </span>
                </Td>
                <Td>
                  <StatusDot status={t.status} />
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={[
        "px-4 py-3 text-left text-[10.5px] font-mono uppercase tracking-[0.16em] text-ink-3 border-b border-line",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={[
        "px-4 py-3 border-b border-line",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </td>
  );
}

function StatusDot({ status }: { status: Trace["status"] }) {
  const color =
    status === "success"
      ? "#34d399"
      : status === "error"
        ? "#f87171"
        : "#fbbf24";
  const label =
    status === "success" ? "ok" : status === "error" ? "error" : "partial";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className="h-[6px] w-[6px] rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}66` }}
      />
      <span className="font-mono text-[11px] text-ink-2">{label}</span>
    </span>
  );
}

/* ---------- Trace detail panel ---------- */

function TracePanel({
  trace,
  selectedSpanId,
  onSelectSpan,
  onClose,
}: {
  trace: Trace;
  selectedSpanId: string | null;
  onSelectSpan: (id: string | null) => void;
  onClose: () => void;
}) {
  const selectedSpan = useMemo(
    () => trace.spans.find((s) => s.id === selectedSpanId) ?? trace.spans[0] ?? null,
    [trace.spans, selectedSpanId],
  );

  return (
    <motion.aside
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 24, opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.2, 0, 0.2, 1] }}
      className="flex h-full w-[520px] shrink-0 flex-col border-l border-line bg-bg-2"
    >
      <header className="flex items-start justify-between border-b border-line px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mono-small">
            <span>Trace</span>
            <span className="text-ink-4">·</span>
            <span>{formatRelative(trace.startedAt)}</span>
          </div>
          <div className="mt-1 font-mono text-[13px] text-ink">{trace.id}</div>
          <div className="mt-1 text-[12px] text-ink-2 truncate max-w-[400px]">
            {trace.input}
          </div>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-ink-3">
            <InlineStat icon={Clock} value={formatDurationMs(trace.durationMs)} />
            <InlineStat icon={Zap} value={`${formatTokens(trace.totalTokens)} tokens`} />
            <InlineStat icon={DollarSign} value={formatCost(trace.totalCostUsd)} />
            <StatusDot status={trace.status} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-ink-3 hover:bg-surface-2 hover:text-ink transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <section className="border-b border-line px-5 py-4">
          <div className="mono-small mb-2">Waterfall</div>
          <Waterfall
            trace={trace}
            selectedSpanId={selectedSpan?.id ?? null}
            onSelect={onSelectSpan}
          />
        </section>

        {selectedSpan && (
          <section className="px-5 py-4">
            <div className="mono-small mb-2">Span detail</div>
            <SpanDetail span={selectedSpan} />
          </section>
        )}
      </div>
    </motion.aside>
  );
}

function InlineStat({
  icon: Icon,
  value,
}: {
  icon: typeof Clock;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-2">
      <Icon className="h-3 w-3 text-ink-3" strokeWidth={2} />
      <span className="tabular-nums">{value}</span>
    </span>
  );
}

/* ---------- Waterfall ---------- */

function Waterfall({
  trace,
  selectedSpanId,
  onSelect,
}: {
  trace: Trace;
  selectedSpanId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const totalMs = trace.durationMs;

  // Sort by startedAt; render a row per span
  const rows = [...trace.spans].sort((a, b) => a.startedAt - b.startedAt);

  // Track axis markers
  const markers = useMemo(() => {
    const step = roundTickStep(totalMs);
    const out: number[] = [];
    for (let t = 0; t <= totalMs; t += step) out.push(t);
    if (out[out.length - 1] !== totalMs) out.push(totalMs);
    return out;
  }, [totalMs]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between font-mono text-[10.5px] text-ink-3">
        <span>spans ({rows.length})</span>
        <span>{formatDurationMs(totalMs)}</span>
      </div>
      <div className="rounded-md border border-line bg-surface overflow-hidden">
        {/* Tick header */}
        <div className="relative h-6 border-b border-line">
          {markers.map((t) => {
            const left = (t / totalMs) * 100;
            return (
              <div
                key={t}
                className="absolute top-0 bottom-0 border-l border-line/60"
                style={{ left: `${left}%` }}
              >
                <span className="absolute left-1 top-1 font-mono text-[9.5px] text-ink-3">
                  {formatDurationMs(t)}
                </span>
              </div>
            );
          })}
        </div>
        {/* Rows */}
        <div className="divide-y divide-line">
          {rows.map((s) => {
            const leftPct = (s.startedAt / totalMs) * 100;
            const widthPct = Math.max(1, (s.durationMs / totalMs) * 100);
            const isSel = s.id === selectedSpanId;
            const depth = getDepth(s, trace.spans);
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={[
                  "relative block w-full text-left transition-colors",
                  isSel ? "bg-accent-soft/60" : "hover:bg-surface-2",
                ].join(" ")}
              >
                <div className="grid grid-cols-[180px_1fr] gap-3 items-center px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-3 shrink-0" style={{ marginLeft: depth * 10 }}>
                      {depth > 0 && (
                        <span className="block h-[1px] w-3 bg-line-2" />
                      )}
                    </div>
                    <SpanKindBadge kind={s.kind} />
                    <span className="font-mono text-[11px] text-ink truncate">
                      {s.name}
                    </span>
                  </div>
                  <div className="relative h-6">
                    <div
                      className="absolute top-1 h-4 rounded-[3px]"
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                        background: s.status === "error"
                          ? "#f87171"
                          : spanKindColor(s.kind),
                        opacity: 0.85,
                        boxShadow: `0 0 0 1px ${
                          s.status === "error" ? "#f8717133" : spanKindBg(s.kind)
                        }`,
                      }}
                    >
                      <span
                        className="pl-2 pr-2 block w-full truncate font-mono text-[10.5px] leading-4"
                        style={{
                          color: s.status === "error" ? "#fff" : "#0d0e12",
                          mixBlendMode: "normal",
                        }}
                      >
                        {formatDurationMs(s.durationMs)}
                      </span>
                    </div>
                    {s.status === "error" && (
                      <span
                        className="absolute top-0 right-0 flex items-center gap-1 text-[10px] text-[color:var(--danger)]"
                      >
                        <AlertTriangle className="h-3 w-3" strokeWidth={2} /> err
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getDepth(s: Span, all: Span[]): number {
  let depth = 0;
  let current: Span | undefined = s;
  const byId = new Map(all.map((x) => [x.id, x]));
  while (current?.parentId) {
    depth++;
    current = byId.get(current.parentId);
    if (depth > 10) break;
  }
  return depth;
}

function roundTickStep(totalMs: number): number {
  const ticks = 4;
  const raw = totalMs / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  const step = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
  return step * mag;
}

/* ---------- Span detail ---------- */

function SpanDetail({ span }: { span: Span }) {
  const [copied, setCopied] = useState(false);
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-line bg-surface px-3 py-2.5">
        <div className="flex items-center gap-2">
          <SpanKindBadge kind={span.kind} />
          <span className="font-mono text-[12px] text-ink truncate">
            {span.name}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10.5px] text-ink-2">
          <MetaKV k="started" v={`+${formatDurationMs(span.startedAt)}`} />
          <MetaKV k="duration" v={formatDurationMs(span.durationMs)} />
          {span.model && <MetaKV k="model" v={span.model} />}
          {span.inputTokens !== undefined && (
            <MetaKV k="tokens in" v={formatTokens(span.inputTokens)} />
          )}
          {span.outputTokens !== undefined && (
            <MetaKV k="tokens out" v={formatTokens(span.outputTokens)} />
          )}
          {span.costUsd !== undefined && (
            <MetaKV k="cost" v={formatCost(span.costUsd)} />
          )}
          {span.metadata &&
            Object.entries(span.metadata).map(([k, v]) => (
              <MetaKV key={k} k={k} v={String(v)} />
            ))}
        </div>
      </div>

      {span.error && (
        <div className="rounded-md border border-[color:var(--danger)]/40 bg-[color:var(--danger)]/5 px-3 py-2.5">
          <div className="mono-small text-[color:var(--danger)] mb-1">
            Error
          </div>
          <code className="block font-mono text-[12px] text-ink whitespace-pre-wrap break-words">
            {span.error}
          </code>
        </div>
      )}

      {span.prompt && (
        <CodeBlock
          label="Prompt"
          code={span.prompt}
          onCopy={() => copy(span.prompt!)}
          copied={copied}
        />
      )}

      {span.completion && (
        <CodeBlock
          label="Completion"
          code={span.completion}
          onCopy={() => copy(span.completion!)}
          copied={copied}
        />
      )}
    </div>
  );
}

function MetaKV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-ink-3 truncate">{k}</span>
      <span className="text-ink truncate text-right">{v}</span>
    </div>
  );
}

function CodeBlock({
  label,
  code,
  onCopy,
  copied,
}: {
  label: string;
  code: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="rounded-md border border-line bg-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
        <span className="mono-small">{label}</span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors font-mono"
        >
          {copied ? "copied" : <><Copy className="h-3 w-3" strokeWidth={2} /> copy</>}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-3 font-mono text-[11.5px] leading-[1.65] text-ink-2 whitespace-pre-wrap break-words max-h-[260px]">
        {code}
      </pre>
    </div>
  );
}

// Avoid unused import lint
void ChevronRight;
