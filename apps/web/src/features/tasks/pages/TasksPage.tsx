import { useState } from "react";
import { TaskBoard } from "../components/TaskBoard";
import { useTasks } from "../hooks";
import { Button, Badge } from "@cognix/ui";
import { PlusIcon, LayoutGridIcon, ListIcon, ArrowLeft, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useProject } from "@/features/projects/hooks";

interface TasksPageProps {
  projectId: string;
}

export function TasksPage({ projectId }: TasksPageProps) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { data: project } = useProject(projectId);

  const { data: tasks, isLoading, error } = useTasks(projectId);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
          <h3 className="mb-2 font-semibold">Failed to load tasks</h3>
          <p className="text-sm">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      {project && (
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
                </div>
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
      )}

      {/* Project Navigation */}
      <div className="border-b px-6 flex items-center gap-6 text-sm font-medium">
        <Link
          href={`/workspaces/${workspaceId}/projects/${projectId}`}
          className="border-b-2 border-transparent py-3 text-muted-foreground hover:text-foreground hover:border-muted"
        >
          Dashboard
        </Link>
        <Link
          href={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}
          className="border-b-2 border-primary py-3 text-foreground"
        >
          Tasks
        </Link>
      </div>

      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Manage your project tasks and track progress.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-md border p-1 bg-muted/20">
            <Button
              variant={viewMode === "board" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode("board")}
            >
              <LayoutGridIcon className="mr-2 h-4 w-4" />
              Board
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="mr-2 h-4 w-4" />
              List
            </Button>
          </div>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        {viewMode === "board" ? (
          <TaskBoard projectId={projectId} tasks={tasks || []} />
        ) : (
          <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
            List view is coming soon. Switch to Board view for now.
          </div>
        )}
      </div>
    </div>
  );
}
