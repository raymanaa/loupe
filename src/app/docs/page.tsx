import {
  BookOpen,
  CheckCircle2,
  Code2,
  Package,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      <MarketingNav />

      <article className="flex-1 px-6 pb-20 pt-10 md:px-10 md:pt-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 md:grid-cols-[220px_1fr]">
          <aside className="md:sticky md:top-12 md:self-start">
            <div className="mono-small flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" strokeWidth={2} />
              <span>SDK quickstart</span>
            </div>
            <h1 className="display mt-3 text-[28px] leading-[1.15] tracking-[-0.02em] text-ink">
              Four lines, and{" "}
              <span className="display-italic text-[color:var(--accent)]">
                you're live.
              </span>
            </h1>
            <nav className="mt-6 space-y-1.5 text-[12.5px]">
              {[
                ["#install", "1 · Install"],
                ["#init", "2 · Initialize"],
                ["#instrument", "3 · Instrument"],
                ["#verify", "4 · Verify"],
                ["#next", "Next steps"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="block text-ink-2 hover:text-ink"
                >
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="max-w-[720px] space-y-12">
            <Step
              n="01"
              id="install"
              icon={Package}
              title="Install the SDK"
            >
              <p>
                We ship TypeScript, Python, and Rust SDKs. All accept the same
                environment variables and produce compatible traces.
              </p>
              <Code>{`# node / deno / bun
pnpm add loupe-sdk

# python
pip install loupe

# rust
cargo add loupe`}</Code>
            </Step>

            <Step n="02" id="init" icon={Sparkles} title="Get credentials">
              <p>
                Create a project in the console; copy the project id and the
                API key. Set them as environment variables.
              </p>
              <Code>{`export LOUPE_API_KEY=lp_sk_live_abc123…
export LOUPE_PROJECT=support-bot
export LOUPE_ENV=prod`}</Code>
              <p className="mt-3 text-[12px] text-ink-3">
                For self-hosted, point{" "}
                <span className="font-mono text-ink-2">LOUPE_URL</span> at your
                instance; no other changes.
              </p>
            </Step>

            <Step
              n="03"
              id="instrument"
              icon={Code2}
              title="Wrap your existing client"
            >
              <p>
                No code changes downstream — all your{" "}
                <span className="font-mono">chat.completions.create</span>{" "}
                calls, tool calls, and retrievals now produce a trace.
              </p>
              <Code>{`import { loupe } from "loupe-sdk";
import OpenAI from "openai";

const ai = loupe(new OpenAI());

// use it exactly as before — every call is a span
const resp = await ai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: input }],
});`}</Code>
              <p className="mt-3 text-[12px] text-ink-3">
                Or use framework-specific integrations for LangChain, LlamaIndex,
                Vercel AI SDK, and Anthropic/Gemini directly.
              </p>
            </Step>

            <Step n="04" id="verify" icon={Zap} title="Verify it's recording">
              <p>
                Run one request. Open the console — a trace should land in
                under a second.
              </p>
              <Code>{`curl -X POST https://api.yourdomain.com/chat \\
  -d '{"message": "where is my order?"}'

# in another shell
loupe tail --project support-bot

✓ trace t_01jjq… · 1.8s · 1.17k tokens · $0.0019`}</Code>
            </Step>

            <div id="next" className="rounded-xl border border-line bg-surface px-6 py-6">
              <div className="flex items-start gap-4">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 text-[color:var(--success)]"
                  strokeWidth={2}
                />
                <div>
                  <h3 className="display text-[17px] text-ink">
                    You're observable.
                  </h3>
                  <p className="mt-1 text-[13px] leading-[1.65] text-ink-2">
                    Next: write your first eval suite (evals/_README.md in
                    your repo), or pin a prompt version so rolling back is a
                    single click.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href="/app"
                      className="flex items-center gap-1.5 rounded-md bg-[color:var(--accent-strong)] px-3.5 py-1.5 text-[12.5px] font-medium text-ink hover:bg-[color:var(--accent)] transition-colors"
                    >
                      <span>Open console</span>
                      <span aria-hidden>→</span>
                    </Link>
                    <Link
                      href="/security"
                      className="flex items-center gap-1.5 rounded-md border border-line bg-bg px-3.5 py-1.5 text-[12.5px] text-ink-2 hover:border-line-2 hover:text-ink transition-colors"
                    >
                      Security & data handling
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}

function Step({
  n,
  id,
  icon: Icon,
  title,
  children,
}: {
  n: string;
  id: string;
  icon: typeof BookOpen;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-soft text-[color:var(--accent)]">
          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[11px] text-ink-3">{n}</span>
          <h2 className="display text-[19px] leading-[1.25] text-ink">
            {title}
          </h2>
        </div>
      </div>
      <div className="text-[13.5px] leading-[1.75] text-ink-2 space-y-3">
        {children}
      </div>
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-line bg-surface px-4 py-4 font-mono text-[12.5px] leading-[1.7] text-ink whitespace-pre-wrap">
      {children}
    </pre>
  );
}
