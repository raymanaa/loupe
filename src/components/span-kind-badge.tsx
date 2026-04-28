"use client";

import type { SpanKind } from "@/lib/mock-data";

const STYLES: Record<SpanKind, { label: string; color: string; bg: string }> = {
  llm: { label: "LLM", color: "#a78bfa", bg: "#1e1a3e" },
  tool: { label: "TOOL", color: "#60a5fa", bg: "#0e1f3e" },
  retrieval: { label: "RET", color: "#34d399", bg: "#0d2e25" },
  guard: { label: "GUARD", color: "#fbbf24", bg: "#2a1f0a" },
  span: { label: "SPAN", color: "#a2a6ae", bg: "#1a1c24" },
};

export function SpanKindBadge({ kind }: { kind: SpanKind }) {
  const s = STYLES[kind];
  return (
    <span
      className="inline-flex items-center rounded-[3px] px-1.5 py-[1px] font-mono text-[9.5px] tracking-[0.12em]"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
}

export function spanKindColor(kind: SpanKind): string {
  return STYLES[kind].color;
}

export function spanKindBg(kind: SpanKind): string {
  return STYLES[kind].bg;
}
