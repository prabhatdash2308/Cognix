import { Card, CardHeader, CardTitle, CardContent, Stack } from "@cognix/ui";
import type { Activity } from "@cognix/types";

export interface RecentActivityCardProps {
  activities: Activity[] | undefined;
  isLoading?: boolean;
}

export function RecentActivityCard({ activities, isLoading }: RecentActivityCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Stack gap={0} className="divide-y divide-[var(--color-border)]">
          {isLoading ? (
            <div className="p-4 flex justify-center text-[var(--color-text-secondary)]">
              Loading...
            </div>
          ) : !activities || activities.length === 0 ? (
            <div className="p-4 text-center text-[var(--text-sm)] text-[var(--color-text-secondary)]">
              No recent activity found.
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 flex gap-4 hover:bg-[var(--color-surface-hover)] transition-colors group"
              >
                <div className="mt-1 relative flex items-center justify-center h-4 w-4 rounded-full bg-[var(--color-primary)] opacity-80" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-medium text-[var(--text-sm)] text-[var(--color-text-primary)] leading-tight">
                    {activity.title}
                  </span>
                  <span className="text-[var(--text-xs)] text-[var(--color-text-secondary)] mt-1">
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
