import { ChevronRight } from "lucide-react";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";

type Release = {
  version: string;
  date: string;
  tag?: "highlight" | "fix";
  title: string;
  body: string[];
};

const RELEASES: Release[] = [
  {
    version: "v0.6.0",
    date: "Apr 20, 2026",
    tag: "highlight",
    title: "Flaky-test detection in eval suites",
    body: [
      "Eval runs now classify tests as pass / fail / flaky based on the last 10 runs. Flaky tests count against pass-rate but don't trigger regression alerts.",
      "Added Anthropic prompt-caching-aware span collapse so repeated system prompts don't inflate token counts.",
      "SDK: LangChain integration supports LCEL.",
    ],
  },
  {
    version: "v0.5.2",
    date: "Apr 11, 2026",
    tag: "fix",
    title: "Waterfall ordering fix",
    body: [
      "Sibling spans that started within the same millisecond could render in the wrong order. Fixed by stabilizing on trace-insertion order.",
      "Fix: prompts tab copy button failed on Safari < 17.",
    ],
  },
  {
    version: "v0.5.0",
    date: "Mar 30, 2026",
    title: "Prompt versioning",
    body: [
      "Prompts are now first-class artifacts. Edit from the console, version on save, roll forward / back per env.",
      "Added /docs quickstart page and TypeScript SDK 1.2 with framework-specific integrations.",
      "Evals: regression alert banner auto-renders when pass rate drops > 5pp.",
    ],
  },
  {
    version: "v0.4.0",
    date: "Mar 18, 2026",
    title: "Cost + latency breakdown",
    body: [
      "New cost panel per prompt, per model, per endpoint. Daily resolution, 30 day retention on free tier.",
      "SDK overhead benchmarked to ~4ms per call on the p99 path.",
    ],
  },
  {
    version: "v0.3.0",
    date: "Mar 4, 2026",
    title: "Eval suites",
    body: [
      "Define eval test cases in your repo; Loupe reruns them automatically on every prompt-version change. Results surface in the Evals tab with a 30 day chart.",
    ],
  },
  {
    version: "v0.2.0",
    date: "Feb 22, 2026",
    title: "Span waterfalls",
    body: [
      "Replaced the flat call list with a Gantt-style waterfall. Parent/child relationships preserved; color-coded per span kind.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      <MarketingNav />

      <article className="flex-1 px-6 pb-20 pt-10 md:px-10 md:pt-16">
        <div className="mx-auto max-w-3xl">
          <div className="mono-small flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" strokeWidth={2} />
            <span>Changelog</span>
          </div>
          <h1 className="display mt-3 text-[38px] leading-[1.08] tracking-[-0.025em] text-ink md:text-[48px]">
            What's{" "}
            <span className="display-italic text-[color:var(--accent)]">
              shipped.
            </span>
          </h1>
          <p className="mt-4 text-[14px] leading-[1.7] text-ink-2 max-w-[560px]">
            Release notes for the Loupe SDK and console. Alpha builds only —
            versions below v1.0 may introduce breaking changes without a
            migration path. Pin your SDK version.
          </p>

          <ol className="mt-12 space-y-12 relative border-l border-line pl-8">
            {RELEASES.map((r) => (
              <li key={r.version} className="relative">
                <span
                  aria-hidden
                  className={[
                    "absolute -left-[37px] top-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-bg",
                    r.tag === "highlight"
                      ? "bg-[color:var(--accent)]"
                      : r.tag === "fix"
                        ? "bg-[color:var(--warning)]"
                        : "bg-ink-3",
                  ].join(" ")}
                />
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className="font-mono text-[13px] text-ink">
                      {r.version}
                    </span>
                    {r.tag === "highlight" && (
                      <span className="ml-2 inline-block rounded bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--accent)]">
                        highlight
                      </span>
                    )}
                    {r.tag === "fix" && (
                      <span className="ml-2 inline-block rounded bg-[color:var(--warning)]/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--warning)]">
                        fix
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11.5px] text-ink-3">
                    {r.date}
                  </span>
                </div>
                <h2 className="display mt-2 text-[19px] leading-[1.25] text-ink">
                  {r.title}
                </h2>
                <ul className="mt-3 space-y-2">
                  {r.body.map((b, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-[13px] leading-[1.7] text-ink-2"
                    >
                      <span
                        aria-hidden
                        className="mt-[9px] h-[3px] w-[3px] shrink-0 rounded-full bg-ink-4"
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}
