import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";
import { TRACES, formatCost, formatDurationMs, formatRelative, formatTokens } from "@/lib/mock-data";

export default function Landing() {
  const trace = TRACES[0];
  const llmSpan = trace.spans.find((s) => s.kind === "llm") ?? trace.spans[0];
  const recentTraces = TRACES.slice(0, 4);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <MarketingNav />

      <section>
        <div className="mx-auto max-w-[1120px] px-6 md:px-10 pt-24 pb-20 md:pt-32">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-[1.25fr_1fr] md:items-center md:gap-16">
            <div>
              <div className="label" style={{ color: "var(--accent, #8f99ff)" }}>LLM observability</div>
              <h1 className="display mt-5 text-[64px] leading-[0.94] tracking-[-0.02em] md:text-[96px]">
                Every call,{" "}
                <span className="display-italic" style={{ color: "var(--accent, #8f99ff)" }}>traceable.</span>
              </h1>
              <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.65] text-ink-2">
                Catch regressions. Spot runaway spend. Reproduce any trace, span by span.
              </p>
              <div className="mt-8">
                <Link href="/app" className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-[14px] rounded-[3px] hover:bg-ink-2 transition-colors">
                  Open the monitor
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
            <div className="border border-line bg-surface rounded-[4px] p-5">
              <div className="flex items-baseline justify-between">
                <span className="mono text-[10px] text-ink-3 tracking-[0.12em]">TRACE · {trace.promptName} · {trace.promptVersion}</span>
                <span className="mono text-[10px] font-semibold tracking-[0.14em]" style={{ color: trace.status === "success" ? "var(--ok, #3ab07b)" : "var(--crit, #e4555e)" }}>
                  {trace.status.toUpperCase()}
                </span>
              </div>
              <div className="display mt-2 text-[20px] leading-tight text-ink">{trace.spans.length} spans · {trace.env}</div>
              <div className="mono mt-0.5 text-[10.5px] text-ink-3">{formatRelative(trace.startedAt)}</div>
              <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
                <MiniStat label="p99" value={formatDurationMs(trace.durationMs)} />
                <MiniStat label="tokens" value={formatTokens(trace.totalTokens)} />
                <MiniStat label="cost" value={formatCost(trace.totalCostUsd)} />
              </div>
              {llmSpan.model && <div className="mt-3 text-[11px] text-ink-3 mono">{llmSpan.name} — {llmSpan.model}</div>}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto max-w-[1120px] px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat n="every" label="Call, span-by-span traced" />
          <Stat n="1 click" label="Reproduce any past trace" />
          <Stat n="per commit" label="Eval regression diff" />
          <Stat n="ms" label="Cost + latency per span" />
        </div>
      </section>

      <Section label="When it regresses in prod">
        <p className="display-italic text-[30px] leading-[1.25] text-ink max-w-[34ch] md:text-[42px]">
          You need the trace, not the tweet.
        </p>
        <p className="mt-6 max-w-[60ch] text-[15px] leading-[1.7] text-ink-2">
          By the time a prompt regression reaches Slack, the customer has already moved on. Loupe puts every call on record — every model, every token, every dollar — so the moment &ldquo;it feels worse&rdquo; arrives, the trace is a search away.
        </p>
      </Section>

      <Section label="How a regression gets caught">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <Move n="01" verb="Trace" detail="Wrap your SDK once. Every call and tool-use and retrieval is a span." />
          <Move n="02" verb="Eval" detail="Run your eval set on every commit. Diff pass-rate against main in the PR." />
          <Move n="03" verb="Alert" detail="When a slice drops, Loupe pages you with the trace that regressed first." />
          <Move n="04" verb="Reproduce" detail="One click replays the exact input against your branch. No reconstruction." />
          <Move n="05" verb="Fix" detail="Ship the PR. The eval set re-runs automatically; the alert resolves." />
        </ol>
      </Section>

      <Section label="Three things only Loupe does">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature title="Eval by commit." body="Not nightly. Every PR ships its own eval report; regressions never reach main silently." />
          <Feature title="Reproduce in one click." body="Replay the exact trace against a branch. No scraping logs, no regenerating prompts from memory." />
          <Feature title="Cost on every span." body="Not per-month aggregates. Per-span tokens and dollars, so you can kill the retrieval loop you didn&apos;t know was quadratic." />
        </div>
      </Section>

      <Section label="Made for">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[14px] leading-[1.65] text-ink-2">
          <Persona title="The ML engineer">Ships prompts, evals, retrieval. Wants the regression diff in the PR, not in Monday standup.</Persona>
          <Persona title="The platform eng">Owns the LLM gateway. Needs cost and latency per prompt-name, not per-org.</Persona>
          <Persona title="The cost-aware PM">Watches the burn. Wants to know which feature cost $400 in completions last week.</Persona>
        </ul>
      </Section>

      <Section label="Recent traces" right={<Link href="/app" className="mono text-[11px] text-ink-3 hover:text-ink transition-colors">all traces →</Link>}>
        <ul className="border-y border-line divide-y divide-line">
          {recentTraces.map((t) => (
            <li key={t.id}>
              <Link href="/app" className="group grid grid-cols-[auto_1fr_auto] gap-5 py-4 items-baseline hover:bg-paper-2/40 transition-colors px-1">
                <span
                  className="mono text-[10.5px] font-semibold tracking-[0.14em]"
                  style={{ color: t.status === "success" ? "var(--ok, #3ab07b)" : "var(--crit, #e4555e)" }}
                >
                  {t.status.toUpperCase()}
                </span>
                <div>
                  <div className="text-[14px] text-ink leading-tight mono">{t.promptName} · {t.promptVersion}</div>
                  <div className="mono text-[10px] text-ink-3 mt-0.5">{t.spans.length} spans · {formatDurationMs(t.durationMs)} · {formatCost(t.totalCostUsd)}</div>
                </div>
                <span className="mono text-[10.5px] text-ink-3 group-hover:text-ink">open →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <section className="mx-auto max-w-[1120px] px-6 md:px-10 py-16">
        <blockquote className="border-l-2 pl-6 max-w-[60ch]" style={{ borderColor: "var(--accent, #8f99ff)" }}>
          <p className="display-italic text-[28px] leading-[1.3] text-ink md:text-[34px]">
            &ldquo;Found the token regression in twelve minutes. It would have taken a week without the per-span cost view.&rdquo;
          </p>
          <footer className="mt-4 smallcaps mono text-[11px] text-ink-3 tracking-[0.14em]">
            — D. Rodriguez · ML engineer · &lt;pilot · not a customer&gt;
          </footer>
        </blockquote>
      </section>

      <Section label="Questions">
        <dl className="divide-y divide-line border-y border-line">
          <Faq q="Which SDKs are supported?">Anthropic, OpenAI, Bedrock, Vertex, and raw HTTP at v0.9. LangChain and LlamaIndex in beta. Drop-in wrapper; no rewrite.</Faq>
          <Faq q="Can we self-host?">Yes. Loupe ships as a single Docker container plus a Postgres. Cloud offering uses the same container.</Faq>
          <Faq q="What about retention?">90-day default on the hosted tier. Self-host is unlimited. PII redaction runs at ingest; the original prompts never leave your network.</Faq>
          <Faq q="How do evals integrate with CI?">GitHub Action + generic CLI. Eval report lands as a PR comment with a link to the full diff.</Faq>
          <Faq q="Is it cheap?">Free under 1M spans/month. After that, $0.20 per 100K spans. No per-seat pricing.</Faq>
        </dl>
      </Section>

      <section className="border-t-2 border-ink">
        <div className="mx-auto max-w-[1120px] px-6 md:px-10 py-20 text-center">
          <div className="label">Next regression</div>
          <h2 className="display mt-3 text-[40px] leading-[1.05] tracking-[-0.02em] text-ink md:text-[54px]">
            Traced.{" "}
            <span className="display-italic" style={{ color: "var(--accent, #8f99ff)" }}>Before standup.</span>
          </h2>
          <div className="mt-8">
            <Link href="/app" className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-[14px] rounded-[3px] hover:bg-ink-2 transition-colors">
              Open the monitor
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Section({ label, right, children }: { label: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="mx-auto max-w-[1120px] px-6 md:px-10 py-16">
        <div className="flex items-baseline justify-between border-b border-line pb-3 mb-8">
          <span className="label">{label}</span>
          {right}
        </div>
        {children}
      </div>
    </section>
  );
}
function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="display text-[28px] leading-none tabular-nums text-ink md:text-[32px]">{n}</div>
      <div className="mt-2 text-[11.5px] leading-[1.45] text-ink-3 max-w-[28ch]">{label}</div>
    </div>
  );
}
function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono text-[9.5px] text-ink-3 uppercase tracking-[0.12em]">{label}</div>
      <div className="mono text-[14px] tabular-nums text-ink mt-0.5">{value}</div>
    </div>
  );
}
function Move({ n, verb, detail }: { n: string; verb: string; detail: string }) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-4 items-baseline">
      <span className="mono text-[11px] text-ink-3 tabular-nums tracking-[0.16em]">{n}</span>
      <div>
        <div className="display text-[22px] leading-none text-ink">{verb}.</div>
        <div className="mt-1 text-[13.5px] leading-[1.6] text-ink-2 max-w-[40ch]">{detail}</div>
      </div>
    </li>
  );
}
function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="display text-[20px] leading-[1.2] text-ink">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-[1.65] text-ink-2 max-w-[36ch]">{body}</p>
    </div>
  );
}
function Persona({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="border-t-2 border-ink pt-3">
      <div className="display text-[18px] leading-tight text-ink">{title}</div>
      <p className="mt-2 max-w-[36ch]">{children}</p>
    </li>
  );
}
function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 md:gap-10 py-5">
      <dt className="display text-[17px] text-ink leading-tight">{q}</dt>
      <dd className="text-[14px] leading-[1.7] text-ink-2 max-w-[62ch]">{children}</dd>
    </div>
  );
}
