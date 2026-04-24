/**
 * Loupe landing — dark ops-dashboard
 * (grammar inspired by Datadog / Grafana product landings).
 */
import Link from "next/link";
import { TRACES, formatCost, formatDurationMs, formatTokens } from "@/lib/mock-data";

export default function Landing() {
  const recent = TRACES.slice(0, 5);

  return (
    <div className="loupe-shell min-h-screen">
      <style>{`
        .loupe-shell {
          background: #080a0e;
          color: #d9dde6;
          font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
          font-variant-numeric: tabular-nums;
        }
        .loupe-tile {
          background: #0e1218;
          border: 1px solid #1a2030;
          border-radius: 6px;
        }
        .loupe-hairline { border-color: #1a2030; }
        .loupe-accent-a { color: #5ee6b2; }
        .loupe-accent-b { color: #ffd26a; }
        .loupe-accent-c { color: #ff5a6a; }
        .loupe-muted { color: #6a7488; }
        .loupe-mono { font-family: var(--font-mono), ui-monospace, monospace; }
        @keyframes loupe-tick { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .loupe-live { animation: loupe-tick 1.8s ease-in-out infinite; }
      `}</style>

      <header className="border-b loupe-hairline">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3 text-[12.5px]">
          <Link href="/" className="flex items-baseline gap-2 font-semibold">
            <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#5ee6b2] loupe-live" />
            <span className="text-white text-[16px]">Loupe</span>
            <span className="loupe-mono text-[10px] loupe-muted tracking-[0.14em]">v0.9</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 loupe-muted">
            <Link href="/app" className="hover:text-white transition-colors">Traces</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link>
            <Link href="/security" className="hover:text-white transition-colors">Security</Link>
          </nav>
          <Link href="/app" className="rounded-[5px] bg-[#5ee6b2] text-black px-3 py-1.5 text-[12px] font-medium hover:bg-[#8af3cb] transition-colors">
            Open monitor
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-12 items-end">
          <div>
            <div className="loupe-mono text-[10px] tracking-[0.18em] loupe-accent-a">
              LLM OBSERVABILITY / v0.9
            </div>
            <h1 className="mt-5 text-[52px] leading-[1.02] tracking-[-0.02em] text-white font-semibold md:text-[72px]">
              Every call, every span,{" "}
              <span className="loupe-accent-a">every dollar.</span>
            </h1>
            <p className="mt-5 max-w-[48ch] text-[15px] leading-[1.6] loupe-muted">
              Trace every LLM call. Eval on every commit. Reproduce any prompt, span by span. Spot the regression before the customer tweets.
            </p>
            <div className="mt-8 flex items-center gap-3 text-[13px]">
              <Link href="/app" className="rounded-[5px] bg-[#5ee6b2] text-black px-4 py-2.5 font-medium hover:bg-[#8af3cb] transition-colors">
                Open monitor
              </Link>
              <Link href="/docs" className="loupe-muted hover:text-white transition-colors">
                Read the docs →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Vital label="REQ · LAST 1H" value="1.24 M" tone="a" delta="+4.2%" />
            <Vital label="COST · TODAY"  value="$284.18" tone="b" delta="−12%" />
            <Vital label="p99 · PROD"    value="2.14 s"  tone="a" delta="stable" />
            <Vital label="ERRORS · 15m"  value="7"       tone="c" delta="+3" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20">
        <div className="flex items-baseline justify-between mb-3">
          <div className="loupe-mono text-[10.5px] tracking-[0.16em] loupe-muted">LIVE — support-bot · prod</div>
          <div className="flex items-center gap-2 loupe-mono text-[10px] loupe-muted">
            <span className="inline-block h-[6px] w-[6px] rounded-full bg-[#5ee6b2] loupe-live" />
            streaming · 12 sources
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="loupe-tile md:col-span-7 p-4">
            <div className="flex items-baseline justify-between">
              <span className="loupe-mono text-[10px] tracking-[0.14em] loupe-muted">TRACES · LAST 15 MIN</span>
              <span className="loupe-mono text-[10px] loupe-muted">{recent.length} shown</span>
            </div>
            <ul className="mt-3">
              {recent.map((t) => {
                const tone = t.status === "success" ? "loupe-accent-a" : t.status === "error" ? "loupe-accent-c" : "loupe-accent-b";
                return (
                  <li key={t.id} className="grid grid-cols-[52px_1fr_auto_auto_auto] gap-4 items-baseline py-2.5 text-[12px]" style={{ borderTop: "1px solid #1a2030" }}>
                    <span className={`loupe-mono text-[10.5px] tracking-[0.12em] ${tone}`}>{t.status.toUpperCase()}</span>
                    <span className="loupe-mono text-white truncate">{t.promptName} · {t.promptVersion}</span>
                    <span className="loupe-mono text-[10.5px] loupe-muted tabular-nums">{formatDurationMs(t.durationMs)}</span>
                    <span className="loupe-mono text-[10.5px] loupe-muted tabular-nums">{formatTokens(t.totalTokens)}t</span>
                    <span className="loupe-mono text-[10.5px] loupe-accent-a tabular-nums">{formatCost(t.totalCostUsd)}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="loupe-tile md:col-span-5 p-4">
            <div className="flex items-baseline justify-between">
              <span className="loupe-mono text-[10px] tracking-[0.14em] loupe-muted">p99 LATENCY · 15m</span>
              <span className="loupe-mono text-[10.5px] loupe-accent-a">2.14s</span>
            </div>
            <Spark tone="#5ee6b2" className="mt-4 h-[70px] w-full" />
            <div className="mt-3 grid grid-cols-4 gap-2 text-center loupe-mono text-[9.5px] loupe-muted">
              <span>15m</span><span>10m</span><span>5m</span><span className="text-white">now</span>
            </div>
          </div>

          <div className="loupe-tile md:col-span-4 p-4">
            <div className="loupe-mono text-[10px] tracking-[0.14em] loupe-muted">EVAL · SUPPORT-QA</div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[28px] font-semibold text-white tabular-nums">92.4%</span>
              <span className="loupe-mono text-[11px] loupe-accent-a">+0.8</span>
            </div>
            <div className="mt-2 text-[11px] loupe-muted">pass rate · since PR #482</div>
            <Spark tone="#ffd26a" className="mt-4 h-[36px] w-full" />
          </div>

          <div className="loupe-tile md:col-span-4 p-4">
            <div className="loupe-mono text-[10px] tracking-[0.14em] loupe-muted">MODEL MIX</div>
            <ul className="mt-3 space-y-2 text-[11.5px]">
              <Row label="claude-opus-4-7"   pct={62} tone="#5ee6b2" />
              <Row label="claude-sonnet-4-6" pct={24} tone="#8af3cb" />
              <Row label="gpt-4.1-mini"      pct={11} tone="#ffd26a" />
              <Row label="other"             pct={3}  tone="#4a5366" />
            </ul>
          </div>

          <div className="loupe-tile md:col-span-4 p-4">
            <div className="loupe-mono text-[10px] tracking-[0.14em] loupe-muted">COST · BY ENV</div>
            <ul className="mt-3 space-y-2 text-[11.5px]">
              <CostRow env="prod"    value="$248.50" tone="loupe-accent-a" />
              <CostRow env="staging" value="$24.18"  tone="loupe-accent-b" />
              <CostRow env="dev"     value="$11.50"  tone="loupe-muted"     />
            </ul>
            <div className="mt-3 loupe-mono text-[10px] loupe-muted">budget · 28% of $1,000 used</div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t loupe-hairline pt-6 text-[12px]">
          <span className="loupe-muted">Live numbers for demo purposes. Wrap your SDK; ship in 10 minutes.</span>
          <Link href="/docs" className="loupe-mono text-[11px] tracking-[0.12em] text-white hover:text-[#5ee6b2] transition-colors">
            READ THE SDK DOCS →
          </Link>
        </div>
      </section>

      <footer className="border-t loupe-hairline">
        <div className="mx-auto max-w-[1280px] px-6 py-8 flex flex-wrap items-center justify-between gap-2 text-[11.5px] loupe-muted">
          <span>© 2026 Loupe · alpha</span>
          <span className="loupe-mono">loupe.raymnz.com</span>
          <a href="https://github.com/raymanaa/loupe" className="loupe-mono hover:text-white transition-colors">
            github.com/raymanaa/loupe ↗
          </a>
        </div>
      </footer>
    </div>
  );
}

function Vital({ label, value, delta, tone }: { label: string; value: string; delta: string; tone: "a" | "b" | "c" }) {
  const toneClass = tone === "a" ? "loupe-accent-a" : tone === "b" ? "loupe-accent-b" : "loupe-accent-c";
  return (
    <div className="loupe-tile p-4">
      <div className="loupe-mono text-[10px] tracking-[0.14em] loupe-muted">{label}</div>
      <div className="mt-2 text-[26px] font-semibold text-white tabular-nums">{value}</div>
      <div className={`mt-1 loupe-mono text-[10.5px] ${toneClass}`}>{delta}</div>
    </div>
  );
}

function Spark({ tone, className }: { tone: string; className?: string }) {
  const points = Array.from({ length: 32 }, (_, i) => {
    const y = 50 + Math.sin(i * 0.6) * 18 + Math.cos(i * 0.18) * 6;
    return `${(i / 31) * 100},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 80" preserveAspectRatio="none" className={className}>
      <polyline points={points} fill="none" stroke={tone} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Row({ label, pct, tone }: { label: string; pct: number; tone: string }) {
  return (
    <li>
      <div className="flex items-baseline justify-between loupe-mono">
        <span className="text-white/90">{label}</span>
        <span className="loupe-muted">{pct}%</span>
      </div>
      <div className="mt-1 h-[3px] w-full rounded" style={{ background: "#1a2030" }}>
        <div className="h-full rounded" style={{ width: `${pct}%`, background: tone }} />
      </div>
    </li>
  );
}

function CostRow({ env, value, tone }: { env: string; value: string; tone: string }) {
  return (
    <li className="flex items-baseline justify-between loupe-mono">
      <span className="text-white/80 uppercase tracking-[0.08em]">{env}</span>
      <span className={`tabular-nums ${tone}`}>{value}</span>
    </li>
  );
}
