import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";
import { TRACES, formatCost, formatDurationMs, formatRelative, formatTokens } from "@/lib/mock-data";

export default function Landing() {
  const trace = TRACES[0];
  const llmSpan = trace.spans.find((s) => s.kind === "llm") ?? trace.spans[0];

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />

      <section className="flex-1">
        <div className="mx-auto max-w-[1120px] px-6 md:px-10 pt-24 pb-20 md:pt-32">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-[1.25fr_1fr] md:items-center md:gap-16">
            <div>
              <div className="label" style={{ color: "var(--accent, #8f99ff)" }}>
                LLM observability
              </div>
              <h1 className="display mt-5 text-[64px] leading-[0.94] tracking-[-0.02em] md:text-[96px]">
                Every call,{" "}
                <span className="display-italic" style={{ color: "var(--accent, #8f99ff)" }}>
                  traceable.
                </span>
              </h1>
              <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.65] text-ink-2">
                Catch regressions. Spot runaway spend. Reproduce any trace, span by span.
              </p>
              <div className="mt-8">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-[14px] rounded-[3px] hover:bg-ink-2 transition-colors"
                >
                  Open the monitor
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <div className="border border-line bg-surface rounded-[4px] p-5">
              <div className="flex items-baseline justify-between">
                <span className="mono text-[10px] text-ink-3 tracking-[0.12em]">
                  TRACE · {trace.promptName} · {trace.promptVersion}
                </span>
                <span
                  className="mono text-[10px] font-semibold tracking-[0.14em]"
                  style={{
                    color:
                      trace.status === "success"
                        ? "var(--ok, #3ab07b)"
                        : "var(--crit, #e4555e)",
                  }}
                >
                  {trace.status.toUpperCase()}
                </span>
              </div>
              <div className="display mt-2 text-[20px] leading-tight text-ink">
                {trace.spans.length} spans · {trace.env}
              </div>
              <div className="mono mt-0.5 text-[10.5px] text-ink-3">
                {formatRelative(trace.startedAt)}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
                <Stat label="p99" value={formatDurationMs(trace.durationMs)} />
                <Stat label="tokens" value={formatTokens(trace.totalTokens)} />
                <Stat label="cost" value={formatCost(trace.totalCostUsd)} />
              </div>
              {llmSpan.model && (
                <div className="mt-3 text-[11px] text-ink-3 mono">
                  {llmSpan.name} — {llmSpan.model}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-y border-line">
          <div className="mx-auto max-w-[1120px] px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Step n="01" verb="Trace" detail="Every call, every span" />
            <Step n="02" verb="Compare" detail="Eval by commit, diff inline" />
            <Step n="03" verb="Reproduce" detail="One click, any span" />
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono text-[9.5px] text-ink-3 uppercase tracking-[0.12em]">{label}</div>
      <div className="mono text-[14px] tabular-nums text-ink mt-0.5">{value}</div>
    </div>
  );
}

function Step({ n, verb, detail }: { n: string; verb: string; detail: string }) {
  return (
    <div>
      <div className="mono text-[10.5px] text-ink-3 tracking-[0.16em]">{n}</div>
      <div className="display mt-1 text-[26px] leading-none text-ink">{verb}.</div>
      <div className="mt-1 text-[13px] text-ink-2">{detail}</div>
    </div>
  );
}
