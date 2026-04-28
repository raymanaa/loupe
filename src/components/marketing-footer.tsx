import { Activity } from "lucide-react";
import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-line px-6 py-12 md:px-10 bg-bg-2">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-soft text-[color:var(--accent)]"
            >
              <Activity className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <span className="display text-[15px] leading-none text-ink">
              Loupe
            </span>
          </div>
          <p className="mt-3 max-w-[260px] text-[12px] leading-[1.65] text-ink-3">
            Observability + evals for LLM agents. Drop in once; see every call,
            every eval, every prompt version.
          </p>
        </div>

        <div>
          <div className="mono-small">Product</div>
          <ul className="mt-3 space-y-2 text-[13px]">
            <li>
              <Link
                href="/app"
                className="text-ink-2 hover:text-ink transition-colors"
              >
                Console
              </Link>
            </li>
            <li>
              <Link
                href="/docs"
                className="text-ink-2 hover:text-ink transition-colors"
              >
                Docs
              </Link>
            </li>
            <li>
              <Link
                href="/changelog"
                className="text-ink-2 hover:text-ink transition-colors"
              >
                Changelog
              </Link>
            </li>
            <li>
              <Link
                href="/security"
                className="text-ink-2 hover:text-ink transition-colors"
              >
                Security
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="mono-small">Context</div>
          <ul className="mt-3 space-y-2 text-[13px] text-ink-2">
            <li>Built by Rayen Manaa</li>
            <li>Portfolio project #2</li>
            <li>
              <a
                href="https://github.com/raymanaa/loupe"
                target="_blank"
                rel="noopener"
                className="hover:text-ink transition-colors"
              >
                github.com/raymanaa/loupe ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl items-center justify-between border-t border-line pt-6 text-[11px] text-ink-3">
        <div>© 2026 Loupe · alpha</div>
        <div className="font-mono">loupe.raymnz.com</div>
      </div>
    </footer>
  );
}
