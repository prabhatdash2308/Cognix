import { Card, CardHeader, CardTitle, CardContent, Badge, Stack, Inline } from "@cognix/ui";
import type { Project } from "@cognix/types";

export interface RecentProjectsCardProps {
  projects: Project[] | undefined;
  isLoading?: boolean;
}

export function RecentProjectsCard({ projects, isLoading }: RecentProjectsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Stack gap={0} className="divide-y divide-[var(--color-border)]">
          {isLoading ? (
            <div className="p-4 flex justify-center text-[var(--color-text-secondary)]">
              Loading...
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className="p-4 text-center text-[var(--text-sm)] text-[var(--color-text-secondary)]">
              No recent projects found.
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="p-4 hover:bg-[var(--color-surface-hover)] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex flex-col min-w-0 pr-4">
                  <span className="font-medium text-[var(--text-sm)] text-[var(--color-text-primary)] truncate">
                    {project.name}
                  </span>
                  <span className="text-[var(--text-xs)] text-[var(--color-text-secondary)] truncate">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <Inline gap={2}>
                  <Badge variant={project.status === "active" ? "primary" : "default"} size="sm">
                    {project.status}
                  </Badge>
                </Inline>
              </div>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
