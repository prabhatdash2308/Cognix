import { Card, CardHeader, CardTitle, CardContent, Badge, Stack } from "@cognix/ui";
import type { Task } from "@cognix/types";

export interface RecentTasksCardProps {
  tasks: Task[] | undefined;
  isLoading?: boolean;
}

export function RecentTasksCard({ tasks, isLoading }: RecentTasksCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Stack gap={0} className="divide-y divide-[var(--color-border)]">
          {isLoading ? (
            <div className="p-4 flex justify-center text-[var(--color-text-secondary)]">
              Loading...
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <div className="p-4 text-center text-[var(--text-sm)] text-[var(--color-text-secondary)]">
              No recent tasks found.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 hover:bg-[var(--color-surface-hover)] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="font-medium text-[var(--text-sm)] text-[var(--color-text-primary)] truncate">
                    {task.title}
                  </span>
                  <span className="text-[var(--text-xs)] text-[var(--color-text-secondary)]">
                    {task.assigneeId ? "Assigned" : "Unassigned"}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={task.priority === "high" ? "error" : "default"} size="sm">
                    {task.priority}
                  </Badge>
                  <Badge variant="outline" size="sm">
                    {task.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
