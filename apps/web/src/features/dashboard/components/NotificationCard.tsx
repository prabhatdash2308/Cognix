import { Card, CardHeader, CardTitle, CardContent, Stack } from "@cognix/ui";
import type { Notification } from "@cognix/types";

export interface NotificationCardProps {
  notifications: Notification[] | undefined;
  isLoading?: boolean;
}

export function NotificationCard({ notifications, isLoading }: NotificationCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Latest Notifications</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Stack gap={0} className="divide-y divide-[var(--color-border)]">
          {isLoading ? (
            <div className="p-4 flex justify-center text-[var(--color-text-secondary)]">
              Loading...
            </div>
          ) : !notifications || notifications.length === 0 ? (
            <div className="p-4 text-center text-[var(--text-sm)] text-[var(--color-text-secondary)]">
              You&apos;re all caught up!
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-[var(--color-surface-hover)] transition-colors flex gap-3 ${!notif.isRead ? "bg-[var(--color-surface-raised)]" : ""}`}
              >
                {!notif.isRead && (
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                )}
                <div className={`flex flex-col min-w-0 ${notif.isRead ? "pl-5" : ""}`}>
                  <span className="font-medium text-[var(--text-sm)] text-[var(--color-text-primary)]">
                    {notif.title}
                  </span>
                  <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                    {notif.message}
                  </span>
                  <span className="text-[var(--text-xs)] text-[var(--color-text-secondary)] mt-1.5 opacity-70">
                    {new Date(notif.createdAt).toLocaleDateString()}
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
