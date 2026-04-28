"use client";

import { Activity, Beaker, GitBranch } from "lucide-react";

export type ProjectTab = "traces" | "prompts" | "evals";

const TABS: { id: ProjectTab; label: string; icon: typeof Activity }[] = [
  { id: "traces", label: "Traces", icon: Activity },
  { id: "prompts", label: "Prompts", icon: GitBranch },
  { id: "evals", label: "Evals", icon: Beaker },
];

export function ProjectTabs({
  active,
  onChange,
}: {
  active: ProjectTab;
  onChange: (t: ProjectTab) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {TABS.map((t) => {
        const isActive = active === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={[
              "relative flex items-center gap-2 px-3 py-2 text-[13px] transition-colors",
              isActive ? "text-ink" : "text-ink-2 hover:text-ink",
            ].join(" ")}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span className="font-medium">{t.label}</span>
            {isActive && (
              <span
                aria-hidden
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[color:var(--accent)]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
