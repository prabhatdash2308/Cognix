import { Card, CardHeader, CardTitle, CardContent } from "@cognix/ui";
import type { Workspace } from "@cognix/types";

export interface WorkspaceStatsCardProps {
  workspace: Workspace | undefined;
  isLoading?: boolean;
}

export function WorkspaceStatsCard({ workspace, isLoading }: WorkspaceStatsCardProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 w-1/3 bg-[var(--color-surface-raised)] rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-10 w-full bg-[var(--color-surface-raised)] rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!workspace) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">Name</span>
            <span className="font-semibold text-[var(--text-base)]">{workspace.name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">
              Organization
            </span>
            <span className="font-semibold text-[var(--text-base)]">Cognix HQ</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">
              Members
            </span>
            <span className="font-semibold text-[var(--text-base)]">12</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">Role</span>
            <span className="font-semibold text-[var(--text-base)]">Owner</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
