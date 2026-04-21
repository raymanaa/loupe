import {
  Activity,
  Beaker,
  GitBranch,
  LayoutGrid,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-16 pb-20 md:px-10 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-6xl relative">
          <div className="mb-6 flex items-center gap-2">
            <span
              aria-hidden
              className="block h-[7px] w-[7px] rounded-sm bg-[color:var(--accent)]"
            />
            <span className="mono-small">
              Alpha · portfolio project
            </span>
          </div>

          <h1 className="display text-[44px] leading-[1.02] tracking-[-0.028em] text-ink max-w-[820px] md:text-[68px]">
            Observability{" "}
            <span className="display-italic text-[color:var(--accent)]">
              for LLM agents.
            </span>
          </h1>

          <p className="mt-6 max-w-[620px] text-[15px] leading-[1.7] text-ink-2 md:text-[17px]">
            Drop-in traces, evals, and prompt versioning for production LLM
            agents. Every call captured with tokens, cost, and latency; every
            prompt change gated by an eval suite; every regression caught
            before the customer notices.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/app"
              className="group flex items-center gap-1.5 rounded-md bg-[color:var(--accent-strong)] px-5 py-2.5 text-[14px] font-medium text-ink hover:bg-[color:var(--accent)] transition-colors"
            >
              <span>Open the console</span>
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-1.5 rounded-md border border-line bg-surface px-5 py-2.5 text-[14px] font-medium text-ink-2 hover:border-line-2 hover:text-ink transition-colors"
            >
              <span>Read the quickstart</span>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-3 md:flex md:gap-6">
            <StatPill value="<5 ms" label="SDK overhead" />
            <StatPill value="4 lines" label="to instrument" />
            <StatPill value="OTEL" label="compatible" />
            <StatPill value="self-host" label="available" />
          </div>
        </div>

        {/* Ambient background grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              linear-gradient(color-mix(in oklab, var(--accent) 6%, transparent) 1px, transparent 1px),
              linear-gradient(90deg, color-mix(in oklab, var(--accent) 6%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 70% 50% at 50% 20%, black 30%, transparent 80%)",
          }}
        />
      </section>

      {/* Problem strip */}
      <section className="border-t border-line bg-bg-2 px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[260px_1fr] md:gap-16">
            <div>
              <div className="mono-small">Pain shape</div>
              <h2 className="display mt-3 text-[26px] leading-[1.15] tracking-[-0.02em] text-ink">
                Prod agents fail{" "}
                <span className="display-italic text-[color:var(--accent)]">
                  silently.
                </span>
              </h2>
            </div>
            <div className="space-y-6">
              <PainLine
                headline="Prompts live in git."
                body="Only engineers can edit them. Rolling out a prompt change takes a PR, a review, a deploy. Product can't iterate."
              />
              <PainLine
                headline="No trace, no replay."
                body="When your agent hallucinates on a customer request, you have the final response and nothing in between. Good luck debugging."
              />
              <PainLine
                headline="Cost + latency surprises."
                body="One prompt change doubles your token usage. You notice two weeks later on the bill."
              />
              <PainLine
                headline="Evals are an afterthought."
                body="You wrote 30 test cases six months ago. They sit in a yaml. They haven't run against your last five prompt versions."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 max-w-[620px]">
            <div className="mono-small">What Loupe gives you</div>
            <h2 className="display mt-3 text-[32px] leading-[1.12] tracking-[-0.022em] text-ink md:text-[40px]">
              Four primitives,{" "}
              <span className="display-italic text-[color:var(--accent)]">
                one plane of glass.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={Activity}
              n="01"
              title="Traces"
              body="Every LLM/tool call captured as a span in a Gantt-style waterfall. Click a span → full prompt, completion, tokens, cost, latency, model."
            />
            <Feature
              icon={Beaker}
              n="02"
              title="Evals"
              body="Write test cases once. Every prompt change reruns the suite. Pass-rate chart + flaky-test detection. Regression alert when the bar drops."
            />
            <Feature
              icon={GitBranch}
              n="03"
              title="Prompt versions"
              body="Prompts live in Loupe. Non-engineers can edit them. Each version is a first-class artifact; roll forward or back without a redeploy."
            />
            <Feature
              icon={Timer}
              n="04"
              title="Cost & latency"
              body="Tabular, not buried. See per-prompt, per-model, per-endpoint cost at daily resolution. Budget caps with auto-alerts."
            />
          </div>
        </div>
      </section>

      {/* SDK snippet */}
      <section className="border-t border-line bg-bg-2 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr] md:gap-16">
            <div>
              <div className="mono-small">Integration</div>
              <h2 className="display mt-3 text-[26px] leading-[1.15] tracking-[-0.02em] text-ink">
                Instrument in{" "}
                <span className="display-italic text-[color:var(--accent)]">
                  four lines.
                </span>
              </h2>
              <p className="mt-4 max-w-[260px] text-[13px] leading-[1.7] text-ink-2">
                TypeScript, Python, Rust SDKs. Wrap your existing SDK client —
                no code changes downstream.
              </p>
            </div>
            <div className="relative">
              <div className="flex items-center gap-1.5 border-b border-line bg-surface rounded-t-lg px-4 py-2.5">
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--danger)]/70" />
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--warning)]/70" />
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--success)]/70" />
                <span className="ml-3 font-mono text-[11px] text-ink-3">
                  app.ts
                </span>
              </div>
              <pre className="overflow-x-auto rounded-b-lg border border-t-0 border-line bg-surface px-5 py-5 font-mono text-[12.5px] leading-[1.7]">
                <code>
                  <span className="text-ink-3">
                    {"// wrap your existing client"}
                  </span>
                  {"\n"}
                  <span className="text-[color:var(--accent)]">import</span>{" "}
                  <span className="text-ink">{"{ loupe }"}</span>{" "}
                  <span className="text-[color:var(--accent)]">from</span>{" "}
                  <span className="text-[color:var(--success)]">
                    {'"loupe-sdk"'}
                  </span>
                  ;{"\n"}
                  <span className="text-[color:var(--accent)]">import</span>{" "}
                  <span className="text-ink">OpenAI</span>{" "}
                  <span className="text-[color:var(--accent)]">from</span>{" "}
                  <span className="text-[color:var(--success)]">
                    {'"openai"'}
                  </span>
                  ;{"\n\n"}
                  <span className="text-[color:var(--accent)]">const</span>{" "}
                  <span className="text-ink">ai</span>{" "}
                  <span className="text-ink-3">=</span>{" "}
                  <span className="text-[color:var(--warning)]">loupe</span>(
                  <span className="text-[color:var(--accent)]">new</span>{" "}
                  <span className="text-ink">OpenAI</span>(), {"{"}
                  {"\n  "}
                  project: <span className="text-[color:var(--success)]">
                    {'"support-bot"'}
                  </span>
                  ,{"\n  "}
                  env: <span className="text-[color:var(--success)]">
                    {'"prod"'}
                  </span>
                  ,{"\n"}
                  {"}"});{"\n\n"}
                  <span className="text-ink-3">
                    {"// use it exactly as before — every call is now captured"}
                  </span>
                  {"\n"}
                  <span className="text-[color:var(--accent)]">await</span>{" "}
                  <span className="text-ink">ai.chat.completions.create</span>({"{"}...{"}"});
                </code>
              </pre>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-ink-3">
                <Zap className="h-3 w-3" strokeWidth={2} />
                <span>
                  ~5ms overhead per call · dev.loupe.local for local dev
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Sparkles
            className="mx-auto h-6 w-6 text-[color:var(--accent)] mb-5"
            strokeWidth={1.75}
          />
          <h2 className="display text-[36px] leading-[1.1] tracking-[-0.02em] text-ink md:text-[48px]">
            Stop guessing{" "}
            <span className="display-italic text-[color:var(--accent)]">
              what your agent did.
            </span>
          </h2>
          <p className="mt-5 max-w-[520px] mx-auto text-[14.5px] leading-[1.7] text-ink-2">
            Open the console. A demo workspace is seeded with real traces from
            a simulated support bot. Run an eval. Watch a trace stream in.
          </p>
          <div className="mt-8">
            <Link
              href="/app"
              className="group inline-flex items-center gap-1.5 rounded-md bg-[color:var(--accent-strong)] px-6 py-3 text-[14px] font-medium text-ink hover:bg-[color:var(--accent)] transition-colors"
            >
              <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2} />
              <span>Open the console</span>
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2">
      <span className="font-mono text-[13px] tabular-nums text-ink">
        {value}
      </span>
      <span className="text-[11px] text-ink-3">{label}</span>
    </div>
  );
}

function PainLine({
  headline,
  body,
}: {
  headline: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-4 border-l-2 border-line pl-5 py-1">
      <div>
        <div className="display text-[17px] leading-[1.3] text-ink">
          {headline}
        </div>
        <p className="mt-1 text-[13px] leading-[1.65] text-ink-2 max-w-[620px]">
          {body}
        </p>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  n,
  title,
  body,
}: {
  icon: typeof Activity;
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface px-5 py-5 transition-colors hover:border-line-2">
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-soft text-[color:var(--accent)]">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <span className="font-mono text-[10.5px] text-ink-3 tabular-nums">
          {n}
        </span>
      </div>
      <h3 className="display mt-5 text-[17px] leading-[1.2] text-ink">
        {title}
      </h3>
      <p className="mt-2 text-[12.5px] leading-[1.7] text-ink-2">{body}</p>
    </div>
  );
}
