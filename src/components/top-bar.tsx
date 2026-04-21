"use client";

import { ChevronDown, HelpCircle, Search } from "lucide-react";
import type { Env, Project } from "@/lib/mock-data";

export function TopBar({
  project,
  env,
  onChangeEnv,
}: {
  project: Project;
  env: Env;
  onChangeEnv: (e: Env) => void;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-line bg-bg px-6 py-3">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 font-mono text-[11.5px] text-ink-3">
          <span>{project.name}</span>
          <span aria-hidden className="text-ink-4">
            /
          </span>
          <EnvSelector value={env} options={project.envs} onChange={onChangeEnv} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled
          className="flex h-7 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[12px] text-ink-3 disabled:cursor-not-allowed"
          title="Search is coming in a future release"
        >
          <Search className="h-3 w-3" strokeWidth={2} />
          <span>Search</span>
          <span className="ml-2 font-mono text-[10px]">⌘K</span>
        </button>
        <button
          disabled
          className="flex h-7 w-7 items-center justify-center rounded-md text-ink-3 hover:bg-surface-2 disabled:cursor-not-allowed"
        >
          <HelpCircle className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}

function EnvSelector({
  value,
  options,
  onChange,
}: {
  value: Env;
  options: Env[];
  onChange: (e: Env) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {options.map((o) => {
        const active = o === value;
        const color =
          o === "prod"
            ? "var(--success)"
            : o === "staging"
              ? "var(--warning)"
              : "var(--accent)";
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={[
              "flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors",
              active
                ? "bg-surface text-ink"
                : "text-ink-3 hover:text-ink-2 hover:bg-surface",
            ].join(" ")}
          >
            <span
              aria-hidden
              className="h-[5px] w-[5px] rounded-full"
              style={{
                background: color,
                opacity: active ? 1 : 0.5,
              }}
            />
            {o}
          </button>
        );
      })}
      <ChevronDown
        aria-hidden
        className="ml-0.5 h-3 w-3 text-ink-4"
        strokeWidth={2}
      />
    </div>
  );
}
