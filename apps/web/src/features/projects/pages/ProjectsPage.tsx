"use client";

import * as React from "react";
import { Plus, Search, FolderOpen, Loader2 } from "lucide-react";
import { Button, Input } from "@cognix/ui";
import { ProjectCard } from "../components/ProjectCard";
import { useWorkspaceProjects } from "../hooks";
import Link from "next/link";

export interface ProjectsPageProps {
  workspaceId: string;
}

export function ProjectsPage({ workspaceId }: ProjectsPageProps) {
  const [search, setSearch] = React.useState("");
  const { data: projects, isLoading, isError } = useWorkspaceProjects(workspaceId);

  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];
    if (!search) return projects;
    const lower = search.toLowerCase();
    return projects.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.description?.toLowerCase().includes(lower),
    );
  }, [projects, search]);

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-1">
            Manage your workspace projects, tasks, and agents.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link href={`/workspaces/${workspaceId}/projects/new`}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-destructive/10 text-destructive p-3 rounded-full mb-4">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold">Failed to load projects</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            There was an error loading the projects for this workspace. Please try again.
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed rounded-xl bg-muted/5">
          <div className="bg-muted p-3 rounded-full mb-4">
            <FolderOpen className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No projects found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {search
              ? "We couldn't find any projects matching your search."
              : "Get started by creating your first project in this workspace."}
          </p>
          {!search && (
            <Link href={`/workspaces/${workspaceId}/projects/new`} className="mt-6">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              href={`/workspaces/${workspaceId}/projects/${project.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
