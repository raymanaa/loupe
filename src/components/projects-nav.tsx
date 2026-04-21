"use client";

import { Activity, Plus } from "lucide-react";
import Link from "next/link";
import {
  PROJECTS,
  tracesForProject,
  type ProjectId,
} from "@/lib/mock-data";

export function ProjectsNav({
  activeProjectId,
  onSelectProject,
}: {
  activeProjectId: ProjectId;
  onSelectProject: (id: ProjectId) => void;
}) {
  return (
    <aside className="flex h-full w-[252px] shrink-0 flex-col border-r border-line bg-bg">
      <div className="px-5 pt-5 pb-3">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-soft text-[color:var(--accent)]"
          >
            <Activity className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="display text-[16px] leading-none text-ink">
            Loupe
          </span>
          <span className="font-mono text-[10px] text-ink-3 uppercase tracking-[0.22em]">
            α
          </span>
        </Link>
        <p className="mt-2 text-[11.5px] leading-[1.5] text-ink-3">
          Observability for LLM agents
        </p>
      </div>

      <div className="flex items-center justify-between px-5 pt-4 pb-2 border-t border-line">
        <span className="mono-small">Projects</span>
        <span className="font-mono text-[10.5px] text-ink-3">
          {PROJECTS.length}
        </span>
      </div>

      <nav className="flex flex-col px-2 py-1">
        {PROJECTS.map((p) => {
          const active = p.id === activeProjectId;
          const tCount = tracesForProject(p.id).length;
          return (
            <button
              key={p.id}
              onClick={() => onSelectProject(p.id)}
              className={[
                "group relative mx-0 mb-0.5 flex items-start gap-2.5 rounded-md px-3 py-2.5 text-left transition-colors",
                active
                  ? "bg-surface shadow-[0_0_0_1px_var(--line)]"
                  : "hover:bg-surface-2",
              ].join(" ")}
            >
              <span
                aria-hidden
                className={[
                  "mt-[5px] h-[6px] w-[6px] rounded-full shrink-0 transition-colors",
                  active ? "bg-[color:var(--accent)]" : "bg-ink-4",
                ].join(" ")}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-ink truncate">
                  {p.name}
                </div>
                <div className="text-[11px] text-ink-3 truncate font-mono">
                  {tCount} traces · {p.defaultEnv}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <button
        disabled
        className="mx-2 mt-1 flex items-center gap-2 rounded-md px-3 py-2 text-[12px] text-ink-3 disabled:cursor-not-allowed hover:bg-surface-2 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
        <span>New project</span>
        <span className="ml-auto font-mono text-[10px] text-ink-4">soon</span>
      </button>

      <div className="mt-auto border-t border-line px-5 py-4">
        <Link
          href="/docs"
          className="text-[11.5px] text-ink-3 hover:text-ink-2 transition-colors block"
        >
          ↗ SDK quickstart
        </Link>
        <Link
          href="/"
          className="mt-1.5 text-[11px] text-ink-3 hover:text-ink-2 transition-colors block"
        >
          ← Back to landing
        </Link>
      </div>
    </aside>
  );
}
