"use client";

import { Activity } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
];

export function MarketingNav() {
  const pathname = usePathname();
  return (
    <header className="relative z-10 flex items-center justify-between border-b border-line px-6 py-4 md:px-10">
      <Link href="/" className="flex items-center gap-2 group">
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-soft text-[color:var(--accent)]"
        >
          <Activity className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
        <span className="display text-[16px] leading-none text-ink group-hover:text-ink/80">
          Loupe
        </span>
        <span className="font-mono text-[10px] text-ink-3 uppercase tracking-[0.22em] ml-1">
          α
        </span>
      </Link>

      <nav className="hidden items-center gap-1 md:flex">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={[
                "px-3 py-1.5 text-[13px] rounded-md transition-colors",
                active
                  ? "text-ink bg-surface-2"
                  : "text-ink-2 hover:text-ink hover:bg-surface-2",
              ].join(" ")}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href="/app"
          className="group flex items-center gap-1.5 rounded-md bg-[color:var(--accent-strong)] px-3.5 py-1.5 text-[13px] font-medium text-ink hover:bg-[color:var(--accent)] transition-colors"
        >
          <span>Open console</span>
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </div>
    </header>
  );
}
