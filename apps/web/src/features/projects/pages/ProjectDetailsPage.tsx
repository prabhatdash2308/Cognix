"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Users, LayoutDashboard, Loader2 } from "lucide-react";
import { Button, Badge } from "@cognix/ui";
import { useProject } from "../hooks";

export interface ProjectDetailsPageProps {
  workspaceId: string;
  projectId: string;
}

export function ProjectDetailsPage({ workspaceId, projectId }: ProjectDetailsPageProps) {
  const { data: project, isLoading, isError } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-xl font-bold text-destructive">Project Not Found</h3>
        <p className="text-muted-foreground mt-2">
          The project you are looking for does not exist or you do not have access.
        </p>
        <Link href={`/workspaces/${workspaceId}/projects`} className="mt-6">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href={`/workspaces/${workspaceId}/projects`}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-3">
            {project.emoji && (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                style={{ backgroundColor: project.color ? `${project.color}20` : "var(--muted)" }}
              >
                {project.emoji}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
                <Badge
                  variant={project.status === "archived" ? "outline" : "default"}
                  className="capitalize text-xs"
                >
                  {project.status.replace("_", " ")}
                </Badge>
                <Badge variant="outline" className="capitalize text-xs font-normal">
                  {project.visibility}
                </Badge>
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground mt-0.5 max-w-2xl truncate">
                  {project.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Members
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </header>

      {/* Project Navigation */}
      <div className="border-b px-6 flex items-center gap-6 text-sm font-medium">
        <Link
          href={`/workspaces/${workspaceId}/projects/${projectId}`}
          className="border-b-2 border-primary py-3 text-foreground"
        >
          Dashboard
        </Link>
        <Link
          href={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}
          className="border-b-2 border-transparent py-3 text-muted-foreground hover:text-foreground hover:border-muted"
        >
          Tasks
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Dashboard Welcome */}
          <div className="bg-muted/30 rounded-2xl p-8 border border-muted flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Welcome to {project.name}!</h2>
              <p className="text-muted-foreground mt-2 max-w-xl">
                This project is ready for tasks, documents, and AI agents. Start building out your
                workflow.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <Link href={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}>
                  <Button>View Tasks</Button>
                </Link>
                <Button variant="outline">Add Agent</Button>
              </div>
            </div>
            <div className="hidden lg:flex p-6 bg-background rounded-xl border shadow-sm">
              <LayoutDashboard className="w-16 h-16 text-muted-foreground/30" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder sections for future features */}
            {["Tasks Overview", "Recent Documents", "Active Agents"].map((section) => (
              <div
                key={section}
                className="border rounded-xl p-5 bg-card shadow-sm h-64 flex flex-col"
              >
                <h3 className="font-semibold">{section}</h3>
                <div className="flex-1 flex items-center justify-center text-muted-foreground/50 text-sm italic">
                  Coming soon
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
