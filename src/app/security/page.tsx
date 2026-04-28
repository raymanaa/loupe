import { Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNav } from "@/components/marketing-nav";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      <MarketingNav />

      <article className="flex-1 px-6 pb-20 pt-10 md:px-10 md:pt-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 md:grid-cols-[220px_1fr]">
          <aside className="md:sticky md:top-12 md:self-start">
            <div className="mono-small flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" strokeWidth={2} />
              <span>Security</span>
            </div>
            <h1 className="display mt-3 text-[28px] leading-[1.15] tracking-[-0.02em] text-ink">
              What we{" "}
              <span className="display-italic text-[color:var(--accent)]">
                send
              </span>
              , where it{" "}
              <span className="display-italic text-[color:var(--accent)]">
                sits.
              </span>
            </h1>
            <nav className="mt-6 space-y-1.5 text-[12.5px]">
              {[
                ["#what", "What we capture"],
                ["#redact", "Redaction"],
                ["#retention", "Retention"],
                ["#storage", "Storage & encryption"],
                ["#self-host", "Self-hosting"],
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

          <div className="max-w-[720px] space-y-14">
            <Section id="what" title="What we capture">
              <p>
                Per call, the SDK captures: the full prompt sent, the full
                completion received, the model identifier, token counts, cost
                estimate, latency, parent/child span relationships, and any
                metadata you attach. Tool-call arguments and results are
                captured verbatim unless you mark a field sensitive.
              </p>
              <p className="mt-3">
                We do <em>not</em> capture: application-level secrets, user
                passwords, bearer tokens, or any field tagged{" "}
                <span className="font-mono">@loupe.redact</span>. The SDK
                inspects your request bodies for common secret shapes and
                strips them before transmission.
              </p>
            </Section>

            <Section id="redact" title="PII and secret redaction">
              <p>
                A client-side redaction pass runs before any payload leaves
                your process. Defaults: email, phone, SSN, credit-card, bearer
                tokens, API keys for major providers. Decorate your own types
                with{" "}
                <span className="font-mono text-ink">@loupe.redact("email")</span>{" "}
                to add rules.
              </p>
              <Mono>
                {`@loupe.redact("email", "phone")
class User: ...

# emails and phones in User payloads are replaced
# with deterministic placeholders before send`}
              </Mono>
              <p className="mt-3">
                Redaction runs before the span leaves your process; even if
                our ingress is breached, redacted fields never existed on the
                wire.
              </p>
            </Section>

            <Section id="retention" title="Retention">
              <p>
                Default retention on the hosted tier is 30 days for raw spans
                and 365 days for aggregate metrics. Paid tiers configurable
                1-730 days. Expired data is deleted within 24 hours of its
                retention boundary; no dark copies.
              </p>
              <p className="mt-3">
                You can trigger an immediate delete of a trace or all traces
                for a user id via{" "}
                <span className="font-mono text-ink">
                  loupe purge --user-id=…
                </span>
                .
              </p>
            </Section>

            <Section id="storage" title="Storage & encryption">
              <p>
                Spans are stored in an append-only column store, encrypted at
                rest with AES-256 (per-tenant keys). Transport is TLS 1.3
                only. The hosted control plane runs in eu-west-1 or us-east-1;
                you pick at project creation. No cross-region replication
                unless you enable it.
              </p>
              <p className="mt-3">
                Audit logs for data access are exposed via the audit API.
              </p>
            </Section>

            <Section id="self-host" title="Self-hosting">
              <p>
                The entire stack ships as a single Docker image and a Helm
                chart. Your ingress, your object store (S3-compatible), your
                keys. The SDK is configured with one env var:{" "}
                <span className="font-mono text-ink">LOUPE_URL</span>.
              </p>
              <p className="mt-3">
                Self-hosted has feature parity. Updates are signed releases
                pulled from a public registry.
              </p>
            </Section>

            <div className="rounded-xl border border-line bg-surface px-6 py-6 flex items-start gap-4">
              <Lock
                className="mt-0.5 h-5 w-5 text-[color:var(--accent)]"
                strokeWidth={2}
              />
              <div>
                <h3 className="display text-[17px] text-ink">
                  This is a portfolio pilot.
                </h3>
                <p className="mt-1 text-[13px] leading-[1.65] text-ink-2">
                  Loupe is a design/engineering showcase, not a production
                  offering. The security posture described here is what a real
                  deployment should look like — it is not implemented in the
                  live alpha.
                </p>
                <Link
                  href="/app"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[color:var(--accent-strong)] px-3.5 py-1.5 text-[12.5px] font-medium text-ink hover:bg-[color:var(--accent)] transition-colors"
                >
                  Explore the console
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-[11px] font-mono uppercase tracking-[0.18em] text-ink-3">
        {title}
      </h2>
      <div className="mt-3 text-[14px] leading-[1.75] text-ink">{children}</div>
    </section>
  );
}

function Mono({ children }: { children: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface px-4 py-3 font-mono text-[12px] leading-[1.7] text-ink-2 whitespace-pre-wrap">
      {children}
    </pre>
  );
}
