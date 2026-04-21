"use client";

import { useMemo, useState } from "react";
import { EvalsView } from "@/components/evals-view";
import { ProjectTabs, type ProjectTab } from "@/components/project-tabs";
import { ProjectsNav } from "@/components/projects-nav";
import { PromptsView } from "@/components/prompts-view";
import { TopBar } from "@/components/top-bar";
import { TracesView } from "@/components/traces-view";
import {
  getProject,
  PROJECTS,
  type Env,
  type ProjectId,
} from "@/lib/mock-data";

export function Shell() {
  const [activeProjectId, setActiveProjectId] = useState<ProjectId>(
    PROJECTS[0].id,
  );
  const [activeTab, setActiveTab] = useState<ProjectTab>("traces");

  const project = useMemo(
    () => getProject(activeProjectId) ?? PROJECTS[0],
    [activeProjectId],
  );
  const [env, setEnv] = useState<Env>(project.defaultEnv);

  function selectProject(id: ProjectId) {
    setActiveProjectId(id);
    const p = getProject(id);
    if (p) setEnv(p.defaultEnv);
    setActiveTab("traces");
  }

  return (
    <div className="flex h-full w-full bg-bg text-ink">
      <ProjectsNav
        activeProjectId={activeProjectId}
        onSelectProject={selectProject}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar project={project} env={env} onChangeEnv={setEnv} />

        <div className="flex shrink-0 items-center justify-between border-b border-line bg-bg px-6">
          <ProjectTabs active={activeTab} onChange={setActiveTab} />
          <div className="font-mono text-[10.5px] text-ink-3">
            last 24h · {project.slug}
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {activeTab === "traces" && (
            <TracesView projectId={activeProjectId} />
          )}
          {activeTab === "prompts" && (
            <PromptsView projectId={activeProjectId} />
          )}
          {activeTab === "evals" && <EvalsView projectId={activeProjectId} />}
        </div>
      </div>
    </div>
  );
}
